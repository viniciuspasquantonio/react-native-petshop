import Appointment from "../../models/appointment/appointment";

export const SET_APPOINTMENTS = 'SET_APPOINTMENTS';

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
                    'teste',
                    entry.startTime,
                    entry.endTime                    
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

