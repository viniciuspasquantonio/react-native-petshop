import PRODUCTS from '../../data/dummy-data';
const initialState = {
    availableProducts: PRODUCTS,
    customerProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1')
};

export default (state= initialState, action) => {
    return state;
};