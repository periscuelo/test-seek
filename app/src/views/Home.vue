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
import { mapActions, mapGetters } from 'vuex';

import MySelect from '@/components/MySelect.vue';
import CustomerService from '@/services/customers';
import ProductService from '@/services/products';
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
    ...mapGetters('Customers', ['discCustomers', 'optsCustomer']),
    ...mapGetters('Products', ['discProducts', 'optsProduct', 'products']),
  },
  watch: {
    customer(value) {
      if (value !== null) {
        this.getCustomersDiscounts();
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
        this.getProductsDiscounts();
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
    ...mapActions('Customers', ['setCustomerData', 'setCustomerDiscount']),
    ...mapActions('Products', ['setProductData', 'setProductDiscount']),
    addToCart() {
      this.quantity = parseInt(this.quantity, 10);
      this.newQuantity = this.quantity;
      const mProducts = Array.from(this.products); // create a new memory value with products
      let [item] = mProducts.filter(value => (this.product === value.id));
      const itemIndex = this.items.findIndex(value => (this.product === value.id));

      // Check the discounts
      this.getDiscounts(item, itemIndex).then(data => {
        if (data.item) item = { data };
        if (data.items) this.items = data.items;
        if (data.newQuantity) this.newQuantity = data.newQuantity;
        if (data.discountsPrice) this.discountsPrice = data.discountsPrice;
        if (data.total) this.total = data.total;
        if (data.discounts) this.discounts = data.discounts;

        this.product = null;
        this.quantity = 0;
        this.newQuantity = 0;
      });
    },
    async getCustomers() {
      try {
        const response = await CustomerService.getCustomers();
        this.setCustomerData(response.data.body);
      } catch (error) {
        console.log('Não foi possível carregar os dados da API!', error);
      }
    },
    async getCustomersDiscounts() {
      try {
        const response = await CustomerService.getDiscounts(this.customer);
        this.setCustomerDiscount(response.data.body);
      } catch (error) {
        console.log('Não foi possível carregar os dados da API!', error);
      }
    },
    async getDiscounts(item, itemIndex) {
      try {
        const response = await CalcsService.getDiscounts({
          discProducts: this.discProducts,
          discCustomers: this.discCustomers,
          item,
          itemIndex,
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
    async getProducts() {
      try {
        const response = await ProductService.getProducts();
        this.setProductData(response.data.body);
      } catch (error) {
        console.log('Não foi possível carregar os dados da API!', error);
      }
    },
    async getProductsDiscounts() {
      try {
        const response = await ProductService.getDiscounts(this.product);
        this.setProductDiscount(response.data.body);
      } catch (error) {
        console.log('Não foi possível carregar os dados da API!', error);
      }
    },
    removeOfCart(index) {
      this.total -= this.items[index].subtotal;
      this.discountsPrice = (this.items[index].discount === 0) ? 0 : this.discountsPrice;
      this.items.splice(index, 1);
      this.discounts = (
        this.items.reduce((prev, curr) => (prev + curr.discount), 0) + this.discountsPrice
      );
    },
    setDataVals(id, item) {
      this[item] = id;
    },
  },
};
</script>
