import {
  SET_SERVICES,
  CREATE_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE
} from "../actions/services";
import Service from "../../models/service";

const initialState = {
  userServices: [],
  userId: 29,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVICES:
      return {
        userServices: action.services,
      };
    case DELETE_SERVICE:
      return {
        ...state,
        userServices: state.userServices.filter(
          (service) => service.id != action.serviceId
        ),
      };
    case CREATE_SERVICE:
      const newService = new Service(
        action.serviceData.id,
        action.serviceData.name,
        action.serviceData.description,
        action.serviceData.price
      );
      return {
        ...state,
        userServices: state.userServices.concat(newService),
      };
    case UPDATE_SERVICE:
      const serviceIndex = state.userServices.findIndex(
        (service) => service.id === action.serviceId
      );
      const updatedService = new Service(
        action.serviceId,
        action.serviceData.name,
        action.serviceData.description,
        action.serviceData.price
      );
      const updatedServices = [...state.userServices];
      updatedServices[serviceIndex] = updatedService;
      return {
        ...state,
        userServices: updatedServices,
      };
  }
  return state;
};
