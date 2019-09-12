var eventBus = new Vue

Vue.component('cart', {
  props: {
    cart: {
      type: Array,
      required: true
    },
    variants: {
      type: Array,
      required: true
    },
    selectedVariant: {
      type: Number,
      required: true
    }
  },
  template: `
    <div class="cart">
      <p>Cart({{ cart.length }})</p>
    </div>`,
  methods: {
    addToCart: function () {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    removeFromCart: function () {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
    }
  },
  mounted() {
    eventBus.$on('add-to-cart', () => {
      this.addToCart();
    }),
    eventBus.$on('remove-from-cart', () => {
      this.removeFromCart();
    })
  }
})

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    },
    variants: {
      type: Array,
      required: true
    },
    selectedVariant: {
      type: Number,
      required: true
    }
  },
  template: `
    <div class="product">
      <product-image :image="image" />
        <product-info :product="product" :inStock="inStock" :variants="variants" :selectedVariant="selectedVariant"></product-info>
      <product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>
    </div>
  `,
  data() {
    return {
      product: 'Socks',
      brand: 'Vue Mastery',
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      reviews: []
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return "Free"
      }
      return 2.99
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    }),
    eventBus.$on('variant-selected', variant => {
      this.$emit('variant-selected', variant);
    })
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    },
    shipping: {
      type: String,
      required: true
    },
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <div>
      <span
        class="tab"
        :class="{ activeTab: selectedTab === tab }"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectedTab = tab">
          {{ tab }}
        </span>
        <product-reviews :reviews="reviews" v-show="selectedTab === 'Reviews'"></product-reviews>
        <div v-show="selectedTab === 'Shipping'">
          <h2>Shipping</h2>
          <p>Shipping: {{ shipping }}</p>
        </div>
        <div v-show="selectedTab === 'Details'">
          <h2>Details</h2>
          <product-details :details="details"></product-details>
        </div>
        <product-review-form
          v-show="selectedTab === 'Make a Review'"></product-review-form>
    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
      selectedTab: 'Reviews'
    }
  }
})

Vue.component('product-info', {
  props: {
    product: {
      type: String,
      required: true
    },
    inStock: {
      type: Number,
      required: true
    },
    variants: {
      type: Array,
      required: true
    },
    selectedVariant: {
      type: Number,
      required: true
    }
  },
  template: `
    <div class="product-info">
      <h1>{{ product }}</h1>
      <p v-if="inStock">In Stock</p>
      <p v-else>Out of Stock</p>
      <product-variants :variants="variants"></product-variants>
      <product-cart-actions :inStock="inStock"></product-cart-actions>
    </div>
  `
})

Vue.component('product-image', {
  props: {
    image: {
      type: String,
      required: true
    }
  },
  template: `
    <div class="product-image">
      <img :src="image" />
    </div>
  `
})

Vue.component('product-variants', {
  props: {
    variants: {
      type: Array,
      required: true
    }
  },
  template: `
  <span>
  <div class="color-box"
    v-for="(variant, index) in variants"
    :key="variant.variantId"
    :style="{ backgroundColor: variant.variantColor }"
    @mouseover="onChangeVariant(index)">
  </div>
  </span>
  `,
  methods: {
    onChangeVariant(index) {
      eventBus.$emit('variant-selected', index);
    }
  }
})

Vue.component('product-cart-actions', {
  props: {
    inStock: {
      type: Number,
      required: true
    }
  },
  template: `
    <div>
      <button @click="onAddToCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }">
        Add to cart
      </button>

      <button @click="onRemoveFromCart"
              :class="{ disabledButton: !inStock }">
        Remove from cart
      </button>
    </div>
    `,
  methods: {
    onAddToCart() {
      eventBus.$emit('add-to-cart');
    },
    onRemoveFromCart() {
      eventBus.$emit('remove-from-cart');
    }
  }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `<ul>
             <li v-for="detail in details">{{ detail }}</li>
            </ul>`,
  data() {
    return {}
  }
})

Vue.component('product-reviews', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
    <div style="width: 100%;">
    <h2>Reviews</h2>
    <p v-if="!reviews.length">There are no reviews yet.</p>
    <ul>
      <li v-for="review in reviews">
        <div>{{ review.name }}</div>
        <div>{{ review.rating }}/ 5</div>
        <div>{{ review.review }}</div>
        <div><b>Would recommend:</b> {{ review.recommend }}</div>
      </li>
    </ul>
  </div>
  `
})

Vue.component('product-review-form-validator', {
  props: {
    errors: {
      type: Array,
      required: true
    }
  },
  template: `
    <p v-if="errors.length > 0">
      <b> Please correct the following error(s): </b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>`
})

Vue.component('product-review-form', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>

    <p>
      <label for="review">Review:</label>
      <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

      <div>
        <p>Would you recommend this product?</p>
        <div>
          <label class="radio-button-option"><input type="radio" value="Yes" name="recommend" v-model="recommend">Yes</label>
          <label class="radio-button-option"><input type="radio" value="No" name="recommend" v-model="recommend">No</label>
        </div>
      </div>

    <p>
      <input type="submit" value="Submit">
    </p>
    <product-review-form-validator :errors="errors"></product-review-form-validator>
    </form>
 `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
      eventBus.$emit('review-submitted', productReview);
      this.name = null;
      this.review = null;
      this.rating = null;
      this.recommend = null;
      }
      else {
        if (!this.name) this.errors.push("Name required");
        if (!this.review) this.errors.push("Review required");
        if (!this.rating) this.errors.push("Rating required");
        if (!this.recommend) this.errors.push("Recommendation opt in or out required");
      }
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
    variants: [
      {
        variantId: 2234,
        variantColor: 'green',
        variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
        variantQuantity: 10
      },
      {
        variantId: 2235,
        variantColor: 'blue',
        variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
        variantQuantity: 10
      }
    ],
    selectedVariant: 0,
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeFromCart(id) {
      const foundId = this.cart.indexOf(id);
      if (foundId > -1) {
        this.cart.splice(foundId, 1);
      }
    },
    onSelectedVariant(id) {
      this.selectedVariant = id;
    }
  }
})