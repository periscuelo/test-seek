import Axios from './axios';

export default {
  getProducts: () => Axios().get('/products'),
  getDiscounts: id => Axios().get(`/products/discounts/${id}`),
};
