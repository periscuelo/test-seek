import { CHANGE_CUSTOMER_DATA, CHANGE_DISCOUNT_DATA } from '../mutations-types';
import CustomerService from '@/services/customers';

const getters = {
  optsCustomer: state => state.customers.map(customer => ({
    value: customer.id,
    text: customer.name,
  })),
};

const mutations = {
  [CHANGE_CUSTOMER_DATA](state, value) {
    state.customers = value;
  },
  [CHANGE_DISCOUNT_DATA](state, value) {
    state.discounts = value;
  },
};

const actions = {
  async getCustomers({ commit }) {
    try {
      const response = await CustomerService.getCustomers();
      commit(CHANGE_CUSTOMER_DATA, response.data.body);
    } catch (error) {
      console.log('Não foi possível carregar os dados da API!', error);
    }
  },
  async getCustomersDiscounts({ commit }, customer) {
    try {
      const response = await CustomerService.getDiscounts(customer);
      commit(CHANGE_DISCOUNT_DATA, response.data.body);
    } catch (error) {
      console.log('Não foi possível carregar os dados da API!', error);
    }
  },
};

const state = {
  customers: [],
  discounts: [],
};

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};
