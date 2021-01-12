export const SET_AGENDA = 'SET_AGENDA';
export const SET_AGENDA_ITEM = 'SET_AGENDA_ITEM';

export const fetchAgenda = userId => {

    return async (dispatch) => {
        try {
            const response = await fetch(`http://10.0.2.2:8080/users/${userId}/agenda`);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();

            dispatch({
                type: SET_AGENDA,
                agenda: resData
            });
        } catch (err) {
            // send to custom analytics server
            throw err;
        }
    };
};
export const fetchAgendaItem = appointmentId => {

    return async (dispatch) => {
        try {
            const response = await fetch(`http://10.0.2.2:8080/appointments/${appointmentId}/agendaItem`);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();


            dispatch({
                type: SET_AGENDA_ITEM,
                agendaItem: resData
            });
        } catch (err) {
            // send to custom analytics server
            throw err;
        }
    };
};

