export const SET_CUSTOMERS = 'SET_CUSTOMERS';
export const CREATE_CUSTOMER_PET = 'CREATE_CUSTOMER_PET';
export const SET_CUSTOMER_PETS = 'SET_CUSTOMER_PETS';

export const fetchCustomers = userId => {

    return async (dispatch) => {
        
        try {
            const response = await fetch(`http://10.0.2.2:8080/users/${userId}/customers`);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            dispatch({
                type: SET_CUSTOMERS,
                customers: resData
            });            
        } catch (err) {
            // send to custom analytics server
            throw err;
        }
    };
};

export const fetchCustomerPets = customerId => {
    return async (dispatch) => {        
        try {
            const response = await fetch(`http://10.0.2.2:8080/customers/${customerId}/pets`);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            dispatch({                
                type: SET_CUSTOMER_PETS,
                customerId: customerId,
                pets: resData
            });
        } catch (err) {
            // send to custom analytics server
            throw err;
        }
    };
};