import {
  SET_AGENDA,
  SET_AGENDA_ITEM,
  DELETE_AGENDA_ITEM,
  SET_AVAILABLE_WINDOWS,
} from "../actions/agendas";

const initialState = {
  userAgenda: {},
  userId: 29,
};

export default (state = initialState, action) => {
  const updatedUserAgenda = state.userAgenda;
  switch (action.type) {
    case SET_AVAILABLE_WINDOWS:
      if (updatedUserAgenda.days[action.day]) {
        updatedUserAgenda.days[action.day].push.apply(
          updatedUserAgenda.days[action.day],
          action.availableWindows.days[action.day]
        );
      } else {
          updatedUserAgenda.days[action.day] =
            action.availableWindows.days[action.day];
      }
      return {
        ...state,
        userAgenda: updatedUserAgenda,
      };
    case SET_AGENDA:
      return {
        ...state,
        userAgenda: action.agenda,
      };
    case SET_AGENDA_ITEM:
      const agendaItemIndex = state.userAgenda.days[
        action.agendaItem.day
      ].findIndex(
        (agendaItem) =>
          agendaItem.appointmentId === action.agendaItem.appointmentId
      );
      updatedUserAgenda.days[action.agendaItem.day][agendaItemIndex] =
        action.agendaItem;
      return {
        ...state,
        userAgenda: updatedUserAgenda,
      };
    case DELETE_AGENDA_ITEM:
      return {
        ...state,
        userAgenda: state.userAgenda.days[action.agendaData.day].filter(
          (appointment) => appointment.id != action.appointmentId
        ),
      };
  }
  return state;
};
