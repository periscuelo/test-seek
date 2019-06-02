import { CHANGE_PRODUCT_DATA, CHANGE_DISCOUNT_DATA } from '../mutations-types';
import ProductService from '@/services/products';

const getters = {
  optsProduct: state => state.products.map(product => ({
    value: product.id,
    text: product.name,
  })),
  products: state => state.products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
  })),
};

const mutations = {
  [CHANGE_PRODUCT_DATA](state, value) {
    state.products = value;
  },
  [CHANGE_DISCOUNT_DATA](state, value) {
    state.discounts = value;
  },
};

const actions = {
  async getProducts({ commit }) {
    try {
      const response = await ProductService.getProducts();
      commit(CHANGE_PRODUCT_DATA, response.data.body);
    } catch (error) {
      console.log('Não foi possível carregar os dados da API!', error);
    }
  },
  async getProductsDiscounts({ commit }, product) {
    try {
      const response = await ProductService.getDiscounts(product);
      commit(CHANGE_DISCOUNT_DATA, response.data.body);
    } catch (error) {
      console.log('Não foi possível carregar os dados da API!', error);
    }
  },
};

const state = {
  products: [],
  discounts: [],
};

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};
