import Appointment from "../../models/appointment/appointment";
import { DELETE_AGENDA_ITEM } from "./agendas";

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
                    entry.customer,
                    entry.pet,
                    entry.price,
                    entry.services,
                    entry.status
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

export const createAppointment = (startTime, customer, pet,price, services,status) => {
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
                        price,
                        services,
                        user: { id: 29 },
                        customer,
                        pet,
                        status
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
                price,
                services,
                userId: 29,
                customer,
                pet 
            }
        });
    }
};

export const updateAppointment = (id, startTime, customer,pet, price, services) => {
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
                    price,
                    user: { id: 29 },
                    customer,
                    services,
                    pet
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
                services,
                userId: 29,
                customer,
                pet
            }
        });
    };
};

export const nextAppointmentStatus = (id) => {
    return async (dispatch) => {
        const response = await fetch(
            `http://10.0.2.2:8080/appointments/${id}/nextState`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        const resData = await response.json();
        dispatch({
            type: UPDATE_APPOINTMENT,
            appointmentId: id,
            appointmentData: {                
                status: resData.status
            }
        });
    };
};


export const pay = (id) => {
    return async (dispatch) => {
        const response = await fetch(
            `http://10.0.2.2:8080/appointments/${id}/pay`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        const resData = await response.json();
        dispatch({
            type: UPDATE_APPOINTMENT,
            appointmentId: id,
            appointmentData: {                
                status: resData.status
            }
        });
    };
};

export const cancel = (agendaItem) => {
    return async (dispatch) => {
        const response = await fetch(
            `http://10.0.2.2:8080/appointments/${agendaItem.appointmentId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        dispatch({
            type: DELETE_APPOINTMENT,
            appointmentId: id
        });
        dispatch({
            type: DELETE_AGENDA_ITEM,
            appointmentId: agendaItem.id,
            agendaData: {                
                day: agendaItem.day
            }
        });
    };
};

