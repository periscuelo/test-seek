<template>
  <div class="vue-container">
    <b-container>
      <b-row>
        <b-col>
          <MySelect
            :selected="customer"
            :options="optsCustomer"
            data="customer"
            title="customer"
            @change="setDataVals"
          />
        </b-col>
      </b-row>
      <b-row v-if="customer">
        <b-col cols="8">
          <MySelect
            :selected="product"
            :options="optsProduct"
            data="product"
            title="product"
            @change="setDataVals"
          />
        </b-col>
        <b-col cols="2">
          <b-form-input
            v-model="quantity"
            type="number"
            min="0"
            size="sm"
            class="mt-3"
          />
        </b-col>
        <b-col cols="2">
          <b-button
            :disabled="addDisabled"
            variant="outline-success"
            size="sm"
            class="mt-3"
            @click="addToCart"
          >
            Add to Cart
          </b-button>
        </b-col>
      </b-row>
      <b-row
        v-if="items.length > 0"
        class="mt-5"
      >
        <b-col>
          <b-table
            :fields="fields"
            :items="items"
          >
            <template
              slot="id"
              slot-scope="data"
            >
              <b-button
                variant="outline-danger"
                size="sm"
                @click="removeOfCart(data.index)"
              >
                X
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row v-if="discounts > 0">
        <b-col
          cols="10"
          class="text-right"
        >
          Discounts:
        </b-col>
        <b-col cols="2">
          $ {{ discounts.toFixed(2).toString().replace('.', ',') }}
        </b-col>
      </b-row>
      <b-row v-if="items.length > 0">
        <b-col
          cols="10"
          class="text-right"
        >
          Total:
        </b-col>
        <b-col cols="2">
          $ {{ total.toFixed(2).toString().replace('.', ',') }}
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

import MySelect from '@/components/MySelect.vue';
import CalcsService from '@/services/calcs';

export default {
  name: 'Home',
  components: {
    MySelect,
  },
  data: () => ({
    customer: null,
    product: null,
    quantity: 0,
    newQuantity: 0,
    total: 0,
    discounts: 0,
    discountsPrice: 0,
    addDisabled: true,
    fields: [
      {
        key: 'name',
        label: 'Product',
      },
      {
        key: 'price',
        formatter: value => `$ ${value.toFixed(2).toString().replace('.', ',')}`,
      },
      'qty',
      {
        key: 'subtotal',
        formatter: value => `$ ${value.toFixed(2).toString().replace('.', ',')}`,
      },
      {
        key: 'id',
        label: '',
      },
    ],
    items: [],
  }),
  computed: {
    ...mapState('Customers', { discCustomers: 'discounts' }),
    ...mapState('Products', { discProducts: 'discounts' }),
    ...mapGetters('Customers', ['optsCustomer']),
    ...mapGetters('Products', ['optsProduct', 'products']),
    discFounds() {
      return this.discProducts.filter(
        disc => this.discCustomers.find(value => (value === disc.id)),
      );
    },
    item() {
      const mProducts = Array.from(this.products); // create a new memory value with products
      return mProducts.filter(value => (this.product === value.id));
    },
    itemIndex() {
      return this.items.findIndex(value => (this.product === value.id));
    },
  },
  watch: {
    customer(value) {
      if (value !== null) {
        this.getCustomersDiscounts(this.customer);
      } else {
        this.setCustomerDiscount([]);
      }
      this.product = null;
      this.quantity = 0;
      this.newQuantity = 0;
      this.total = 0;
      this.discounts = 0;
      this.items = [];
    },
    product(value) {
      if (value !== null) {
        this.getProductsDiscounts(this.product);
        if (this.quantity > 0) this.addDisabled = false;
      } else {
        this.addDisabled = true;
        this.setProductDiscount([]);
      }
    },
    quantity(value) {
      this.addDisabled = (this.product === null || value < 1);
    },
  },
  created() {
    this.getCustomers();
    this.getProducts();
  },
  methods: {
    ...mapMutations('Customers', { setCustomerDiscount: 'CHANGE_DISCOUNT_DATA' }),
    ...mapMutations('Products', { setProductDiscount: 'CHANGE_DISCOUNT_DATA' }),
    ...mapActions('Customers', ['getCustomers', 'getCustomersDiscounts']),
    ...mapActions('Products', ['getProducts', 'getProductsDiscounts']),
    addToCart() {
      this.quantity = parseInt(this.quantity, 10);
      this.newQuantity = this.quantity;

      // Check the discounts
      this.getDiscounts().then(data => {
        this.items = data.items;
        this.newQuantity = data.newQuantity;
        this.discountsPrice = data.discountsPrice;
        this.total = data.total;
        this.discounts = data.discounts;

        this.product = null;
        this.quantity = 0;
        this.newQuantity = 0;
      });
    },
    removeOfCart(index) {
      this.removeDiscounts(index).then(data => {
        this.total = data.total;
        this.discountsPrice = data.discountsPrice;
        this.items = data.items;
        this.discounts = data.discounts;
      });
    },
    async getDiscounts() {
      try {
        const response = await CalcsService.getDiscounts({
          discFounds: this.discFounds,
          item: this.item,
          itemIndex: this.itemIndex,
          items: this.items,
          newQuantity: this.newQuantity,
          quantity: this.quantity,
          discountsPrice: this.discountsPrice,
        });
        return response.data.body;
      } catch (error) {
        console.log('Não foi possível carregar os dados da API!', error);
        return false;
      }
    },
    async removeDiscounts(index) {
      try {
        const response = await CalcsService.removeDiscounts({
          total: this.total,
          index,
          items: this.items,
          discountsPrice: this.discountsPrice,
        });
        return response.data.body;
      } catch (error) {
        console.log('Não foi possível carregar os dados da API!', error);
        return false;
      }
    },
    setDataVals(id, item) {
      this[item] = id;
    },
  },
};
</script>
