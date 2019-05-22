import Axios from './axios';

export default {
  getCustomers() {
    return Axios().get('/customers');
  },
  getDiscounts(id) {
    return Axios().get(`/customers/discounts/${id}`);
  },
};
