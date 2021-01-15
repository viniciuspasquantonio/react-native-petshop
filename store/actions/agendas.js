export const SET_AGENDA = "SET_AGENDA";
export const SET_AGENDA_ITEM = "SET_AGENDA_ITEM";
export const DELETE_AGENDA_ITEM = "DELETE_AGENDA_ITEM";
export const SET_AVAILABLE_WINDOWS = "SET_AVAILABLE_WINDOWS";

export const fetchAgenda = (userId, day) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/users/${userId}/agenda?day=${day}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();

      dispatch({
        type: SET_AGENDA,
        agenda: resData,
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const loadAvailableWindowsByDay = (userId, day) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/users/${userId}/availableWindows?day=${day}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      dispatch({
        type: SET_AVAILABLE_WINDOWS,
        day: day,
        availableWindows: resData,
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
export const fetchAgendaItem = (appointmentId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/appointments/${appointmentId}/agendaItem`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();

      dispatch({
        type: SET_AGENDA_ITEM,
        agendaItem: resData,
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
