import Axios from './axios';

export default {
  getDiscounts: data => Axios().post('/discounts', data),
  removeDiscounts: data => Axios().post('/remove-discount', data),
};
