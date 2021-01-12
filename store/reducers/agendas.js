import { SET_AGENDA, SET_AGENDA_ITEM } from "../actions/agendas";

const initialState = {
  userAgenda: {},
  userId: 29,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_AGENDA:
      return {
        ...state,
        userAgenda: action.agenda,
      };
    case SET_AGENDA_ITEM:
      const agendaItemIndex = state.userAgenda.days[action.agendaItem.day].findIndex(
        (agendaItem) =>
          agendaItem.appointmentId === action.agendaItem.appointmentId
      );
      const updatedUserAgenda = state.userAgenda;

      updatedUserAgenda.days[action.agendaItem.day][agendaItemIndex] = action.agendaItem;
      return {
        ...state,
        userAgenda: updatedUserAgenda,
      };
  }
  return state;
};
