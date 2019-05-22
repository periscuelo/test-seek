import Axios from '@/services/axios';

export default {
  getDiscounts(data) {
    return Axios().post('/discounts', data);
  },
};
