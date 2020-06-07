import { SET_AGENDA } from '../actions/agendas';

const initialState = {
    userAgenda: {},
    userId: 29
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_AGENDA:
            return {
                userAgenda: action.agenda
            };

    }
    return state;
};