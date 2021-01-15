export const SET_CUSTOMERS = "SET_CUSTOMERS";
export const CREATE_CUSTOMER_PET = "CREATE_CUSTOMER_PET";
export const SET_CUSTOMER_PETS = "SET_CUSTOMER_PETS";
export const CREATE_CUSTOMER = "CREATE_CUSTOMER";
export const UPDATE_CUSTOMER = "UPDATE_CUSTOMER";
export const DELETE_CUSTOMER = "DELETE_CUSTOMER";

export const fetchCustomers = (userId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/users/${userId}/customers`
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      dispatch({
        type: SET_CUSTOMERS,
        customers: resData,
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const fetchCustomerPets = (customerId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/customers/${customerId}/pets`
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      dispatch({
        type: SET_CUSTOMER_PETS,
        customerId: customerId,
        pets: resData,
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteCustomer = (customerId) => {
  return async (dispatch) => {
    const response = await fetch(
      `http://10.0.2.2:8080/customers/${customerId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_CUSTOMER, customerId: customerId });
  };
};

export const createCustomer = (firstName, lastName, phone, email, address) => {
  return async (dispatch) => {
    const response = await fetch("http://10.0.2.2:8080/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        user: { id: 29 },
        email,
        address,
      }),
    });
    const resData = await response.json();

    dispatch({
      type: CREATE_CUSTOMER,
      customerData: {
        id: resData.id,
        firstName,
        lastName,
        phone,
        userId: 29,
        email,
        address,
      },
    });
  };
};

export const updateCustomer = (
  id,
  firstName,
  lastName,
  phone,
  email,
  address
) => {
  return async (dispatch) => {
    const response = await fetch(`http://10.0.2.2:8080/customers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        user: { id: 29 },
        email,
        address,
      }),
    });

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({
      type: UPDATE_CUSTOMER,
      customerId: id,
      customerData: {
        firstName,
        lastName,
        phone,
        userId: 29,
        email,
        address,
      },
    });
  };
};
