import APPOINTMENTS from '../../data/dummy-appointments';
import { SET_APPOINTMENTS } from '../actions/appointments';

const initialState = {
    availableAppointments: APPOINTMENTS,
    userAppointments: APPOINTMENTS
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_APPOINTMENTS:
            return {
                availableAppointments: action.appointments,
                userAppointments: action.appointments
            };

    }
    return state;
};