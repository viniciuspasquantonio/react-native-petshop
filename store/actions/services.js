export const SET_SERVICES = "SET_SERVICES";
export const CREATE_SERVICE = "CREATE_SERVICE";
export const UPDATE_SERVICE = "UPDATE_SERVICE";
export const DELETE_SERVICE = "DELETE_SERVICE";

export const fetchServices = (userId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/users/${userId}/services`
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.json();
      dispatch({
        type: SET_SERVICES,
        services: resData,
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteService = (serviceId) => {
  return async (dispatch) => {
    const response = await fetch(`http://10.0.2.2:8080/services/${serviceId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_SERVICE, serviceId: serviceId });
  };
};

export const createService = (name, description, price) => {
  return async (dispatch) => {
    const response = await fetch("http://10.0.2.2:8080/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        user: { id: 29 },
        price,
      }),
    });
    const resData = await response.json();

    dispatch({
      type: CREATE_SERVICE,
      serviceData: {
        id: resData.id,
        name,
        description,
        price,
        userId: 29,
      },
    });
  };
};

export const updateService = (id, name, description, price) => {
  return async (dispatch) => {
    const response = await fetch(`http://10.0.2.2:8080/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        price,
        user: { id: 29 },
      }),
    });

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({
      type: UPDATE_SERVICE,
      serviceId: id,
      serviceData: {
        name,
        description,
        price,
        userId: 29
      },
    });
  };
};
