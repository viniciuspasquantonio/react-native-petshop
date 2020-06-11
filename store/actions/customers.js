export const SET_CUSTOMERS = 'SET_CUSTOMERS';

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

