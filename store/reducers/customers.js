import {
  SET_CUSTOMERS,
  CREATE_CUSTOMER_PET,
  SET_CUSTOMER_PETS,
  DELETE_CUSTOMER,
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
} from "../actions/customers";
import Customer from "../../models/customer";

const initialState = {
  customers: [],
  userId: 29,
};

export default (state = initialState, action) => {
  let pets = [];
  switch (action.type) {
    case SET_CUSTOMERS:
      return {
        customers: action.customers
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer.id != action.customerId
        ),
      };
    case CREATE_CUSTOMER:
      const newCustomer = new Customer(
        action.customerData.id,
        action.customerData.firstName,
        action.customerData.lastName,
        action.customerData.email,
        action.customerData.phone,
        action.customerData.address
      );
      return {
        ...state,
        customers: state.customers.concat(newCustomer),
      };
    case UPDATE_CUSTOMER:
      const customerIndex = state.customers.findIndex(
        (customer) => customer.id === action.customerId
      );
      const updatedCustomer = new Customer(
        action.customerData.id,
        action.customerData.firstName,
        action.customerData.lastName,
        action.customerData.email,
        action.customerData.phone,
        action.customerData.address
      );
      const updatedUserCustomers = [...state.userCustomers];
      updatedUserCustomers[customerIndex] = updatedCustomer;
      return {
        ...state,
        customers: updatedUserCustomers,
      };
    case SET_CUSTOMER_PETS:
      pets = action.pets;
      customerIndex = state.userCustomers.findIndex(
        (customer) => customer.id === customerId
      );
      updatedUserCustomers = [...state.userCustomers];
      updatedUserCustomers[customerIndex].pets = pets;
      return {
        ...state,
        customers: action.customers,
      };

    case CREATE_CUSTOMER_PET:
      const pet = action.petData.pet;
      const customer = pet.customer;
      if (customer.pets) {
        customer.pets.concat(pet);
      } else {
        customer.pets = [pet];
      }

      pets = customer.pets;

      customerIndex = state.userCustomers.findIndex(
        (c) => c.id === customer.id
      );
      updatedUserCustomers = [...state.userCustomers];
      updatedUserCustomers[customerIndex].pets = pets;
      return {
        ...state,
        customers: updatedUserCustomers,
      };
  }
  return state;
};
