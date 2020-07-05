export const SET_SERVICES = 'SET_SERVICES';

export const fetchServices = userId => {

    return async (dispatch) => {
        
        try {
            const response = await fetch(`http://10.0.2.2:8080/users/${userId}/services`);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();            
            dispatch({
                type: SET_SERVICES,
                services: resData
            });            
        } catch (err) {
            // send to custom analytics server
            throw err;
        }
    };
};