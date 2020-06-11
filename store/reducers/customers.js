import { SET_CUSTOMERS } from '../actions/customers';

const initialState = {
    userCustomers: [],
    userId: 29    
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CUSTOMERS:
            return {
                userCustomers: action.customers
            };

    }
    return state;
};