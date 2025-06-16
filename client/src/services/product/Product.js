import API from '../api';

export const add_Product = ( values ) => API.post(`/e_commerce/add/product`, values);
export const get_Products = () => API.get(`/e_commerce/get/products`);