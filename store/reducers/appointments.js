import { SET_APPOINTMENTS, SET_APPOINTMENT,DELETE_APPOINTMENT, CREATE_APPOINTMENT, UPDATE_APPOINTMENT } from '../actions/appointments';
import Appointment from '../../models/appointment/appointment';


const initialState = {
    userAppointments: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_APPOINTMENTS:
            return {
                userAppointments: action.appointments
            };
        case DELETE_APPOINTMENT:
            return {
                ...state,
                userAppointments: state.userAppointments.filter(appointment => appointment.id != action.appointmentId),
            };
        case CREATE_APPOINTMENT:            
            const newAppointment = new Appointment(
                action.appointmentData.id,
                action.appointmentData.startTime,
                action.appointmentData.endTime,
                action.appointmentData.customer,
                action.appointmentData.pet,
                action.appointmentData.price,
                action.appointmentData.services
            );
            return {
                ...state,
                userAppointments: state.userAppointments.concat(newAppointment)
            };
        case UPDATE_APPOINTMENT:            
            const appointmentIndex = state.userAppointments.findIndex(appointment => appointment.id === action.appointmentId);
            const updatedAppointment = new Appointment(
                action.appointmentId,
                action.appointmentData.startTime,
                action.appointmentData.endTime,
                action.appointmentData.customer,
                action.appointmentData.pet,
                action.appointmentData.price,
                action.appointmentData.services
            );
            const updatedUserAppointments = [...state.userAppointments];
            updatedUserAppointments[appointmentIndex] = updatedAppointment;
            return {
                ...state,
                userAppointments: updatedUserAppointments
            };

    }
    return state;
};