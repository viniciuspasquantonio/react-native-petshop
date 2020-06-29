import {createStore, combineReducers, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import productsReducer from './reducers/products';
import cartReducer from './reducers/cart';
import ordersReducer from './reducers/orders';
import appointmentsReducer from './reducers/appointments';
import customersReducer from './reducers/customers';
import agendasReducer from './reducers/agendas';

const rootReducer = combineReducers({
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    appointments: appointmentsReducer,
    agendas: agendasReducer,
    customers: customersReducer
  });

const store = createStore(rootReducer,applyMiddleware(ReduxThunk));


export default store;