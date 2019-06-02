import Axios from './axios';

export default {
  getCustomers: () => Axios().get('/customers'),
  getDiscounts: id => Axios().get(`/customers/discounts/${id}`),
};
