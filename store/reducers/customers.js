import { SET_CUSTOMERS, CREATE_CUSTOMER_PET, SET_CUSTOMER_PETS } from '../actions/customers';

const initialState = {
    userCustomers: [],
    userId: 29
};


export default (state = initialState, action) => {
    let pets = [];
    let customerIndex = 0;
    let updatedUserCustomers = {};
    switch (action.type) {
        case SET_CUSTOMERS:
            return {
                userCustomers: action.customers
            };
        case SET_CUSTOMER_PETS:
            pets = action.pets;
            customerIndex = state.userCustomers.findIndex(customer => customer.id === customerId);
            updatedUserCustomers = [...state.userCustomers];
            updatedUserCustomers[customerIndex].pets = pets;
            return {
                ...state,
                userCustomers: action.customers
            };

        case CREATE_CUSTOMER_PET:
            const pet = action.petData.pet;
            const customer = pet.customer;
            if (customer.pets) {
                customer.pets.concat(pet)
            } else {
                customer.pets = [pet];
            }

            pets = customer.pets;

            customerIndex = state.userCustomers.findIndex(c => c.id === customer.id);
            updatedUserCustomers = [...state.userCustomers];
            updatedUserCustomers[customerIndex].pets = pets;
            return {
                ...state,
                userCustomers: updatedUserCustomers
            };
    }
    return state;
};