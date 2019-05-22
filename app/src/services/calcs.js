import Axios from './axios';

export default {
  getDiscounts(data) {
    return Axios().post('/discounts', data);
  },
};
