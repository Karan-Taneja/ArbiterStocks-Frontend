import axios from 'axios';
const iexReqs = {};
const baseUrl = 'https://cloud.iexapis.com/stable';

iexReqs.getStockPrice = (symbol) => {
  let s = encodeURI(symbol);
  return axios.get(`${baseUrl}/stock/${s}/price?token=pk_8424075e41044f13b2d1a6aa9e50471e`)
};

export default iexReqs;