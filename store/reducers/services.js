import { SET_SERVICES } from '../actions/services';

const initialState = {
    userServices: [],
    userId: 29
};


export default (state = initialState, action) => {
    switch (action.type) {
        case SET_SERVICES:
            return {
                userServices: action.services
            };
    }
    return state;
};