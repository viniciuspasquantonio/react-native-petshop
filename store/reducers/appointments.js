import { SET_APPOINTMENTS, SET_APPOINTMENT } from '../actions/appointments';

const initialState = {
    userAppointments: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_APPOINTMENTS:
            return {
                userAppointments: action.appointments
            };

    }
    return state;
};