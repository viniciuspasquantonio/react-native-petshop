import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Platform,
} from "react-native";
import Colors from "../../constants/Colors";
import * as appointmentsActions from "../../store/actions/appointments";
import * as agendasActions from "../../store/actions/agendas";
import { Ionicons } from "@expo/vector-icons";
import StepIndicator from "react-native-step-indicator";

const AgendaItem = (props) => {
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: "#fe7013",
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: "#fe7013",
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: "#fe7013",
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: "#fe7013",
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 10,
    currentStepIndicatorLabelFontSize: 10,
    stepIndicatorLabelCurrentColor: "#fe7013",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: 10,
    currentStepLabelColor: "#fe7013",
  };

  const item = useSelector((state) =>
    state.agendas.userAgenda.days[props.item.day]
      .find(
        (agendaItem) => agendaItem.appointmentId === props.item.appointmentId
      )
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const dispatch = useDispatch();

  const nextAppointmentStatus = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        appointmentsActions.nextAppointmentStatus(item.appointmentId)
      );
      await dispatch(agendasActions.fetchAgendaItem(item.appointmentId));
    } catch (err) {
      console.log("error", error);
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  const cancel = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(appointmentsActions.cancel(item.appointmentId));
    } catch (err) {
      console.log("error", error);
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  const pay = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(appointmentsActions.pay(item.appointmentId));
    } catch (err) {
      console.log("error", error);
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  const steps = [
    "Agendado",
    "Confirmado",
    "Serviço Iniciado",
    "Serviço Finalizado",
    "Retirado",
  ];

  return (
    <TouchableOpacity
      style={[styles.item, { height: 180 }]}
      onPress={props.onPress}
    >
      <Text style={styles.time}>{item.startTimeHHmm}</Text>
      <Text style={styles.info}>{item.title}</Text>
      <Text style={styles.info}>
        {item.pet.displayName} - {item.services}
      </Text>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={item.step}
        labels={steps}
      />
      <Button
        title={"" + item.nextStatus}
        onPress={nextAppointmentStatus}
        color={Colors.success}
      />
      <TouchableOpacity onPress={cancel}>
        <Ionicons
          name={
            Platform.OS === "android" ? "md-close-circle" : "ios-close-circle"
          }
          size={23}
          color={Colors.cancel}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={pay}>
        <Ionicons
          name={Platform.OS === "android" ? "md-cash" : "ios-cash"}
          size={23}
          color={Colors.success}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  time: {
    fontFamily: "open-sans-bold",
  },
  info: {
    fontFamily: "open-sans",
  },
});

export default AgendaItem;
