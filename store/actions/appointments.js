import Appointment from "../../models/appointment/appointment";

export const SET_APPOINTMENTS = 'SET_APPOINTMENTS';
export const DELETE_APPOINTMENT = 'DELETE_APPOINTMENT';
export const CREATE_APPOINTMENT = 'CREATE_APPOINTMENT';
export const UPDATE_APPOINTMENT = 'UPDATE_APPOINTMENT';

export const fetchAppointments = () => {

    return async (dispatch) => {
        try {
            const response = await fetch('http://10.0.2.2:8080/appointments');

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();

            const loadedAppointments = [];

            for (let entry of resData) {
                loadedAppointments.push(new Appointment(
                    entry.id,
                    entry.startTime,
                    entry.endTime,
                    entry.customer.id,
                    entry.price,
                    entry.appointmentServices
                ));
            }

            dispatch({
                type: SET_APPOINTMENTS,
                appointments: loadedAppointments
            });
        } catch (err) {
            // send to custom analytics server
            throw err;
        }
    };
};

export const deleteAppointment = appointmentId => {
    return async (dispatch) => {
        const response = await fetch(
            `http://10.0.2.2:8080/appointments/${appointmentId}`,
            {
                method: 'DELETE',
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({ type: DELETE_APPOINTMENT, appointmentId: appointmentId });
    };
};

export const createAppointment = (startTime, endTime, customerId, price, appointmentServices) => {
    return async dispatch => {

        const response = await fetch(
            'http://10.0.2.2:8080/appointments',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        startTime,
                        endTime,
                        price,
                        appointmentServices,
                        user: { id: 29 },
                        customer: { id: customerId }
                    }
                )
            }
        );
        const resData = await response.json();


        dispatch({
            type: CREATE_APPOINTMENT,
            appointmentData: {
                id: resData.id,
                startTime,
                endTime,
                price,
                appointmentServices,
                userId: 29,
                customerId 
            }
        });
    }
};

export const updateAppointment = (id, startTime, endTime, customerId, price, appointmentServices) => {
    return async (dispatch) => {
        const response = await fetch(
            `http://10.0.2.2:8080/appointments/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startTime,
                    endTime,
                    price,
                    user: { id: 29 },
                    customer: { id: customerId },
                    appointmentServices
                })
            });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        dispatch({
            type: UPDATE_APPOINTMENT,
            appointmentId: id,
            appointmentData: {                
                startTime,
                endTime,
                price,
                appointmentServices,
                userId: 29,
                customerId
            }
        });
    };
};
