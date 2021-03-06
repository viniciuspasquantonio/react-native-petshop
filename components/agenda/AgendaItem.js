import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Platform,
  Alert,
  View,
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
    state.agendas.userAgenda.days[props.item.day].find(
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
      await dispatch(appointmentsActions.cancel(item));
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

  const nextAppointmentStatusHandler = () => {
    Alert.alert(
      item.nextStatusButtonText,
      `Deseja mesmo ${item.nextStatusButtonText} ?`,
      [
        { text: "Não", style: "default" },
        {
          text: "Sim",
          style: "destructive",
          onPress: () => {
            nextAppointmentStatus();
          },
        },
      ]
    );
  };

  const payHandler = () => {
    Alert.alert("Pagar", "Marcar o agendamento como pago?", [
      { text: "Não", style: "default" },
      {
        text: "Sim",
        style: "destructive",
        onPress: () => {
          pay();
        },
      },
    ]);
  };
  const cancelHandler = () => {
    Alert.alert("Cancelar", "Deseja mesmo cancelar o agendamento?", [
      { text: "Não", style: "default" },
      {
        text: "Sim",
        style: "destructive",
        onPress: () => {
          cancel();
        },
      },
    ]);
  };

  const steps = [
    "Agendado",
    "Confirmado",
    "Serviço Iniciado",
    "Serviço Finalizado",
    "Retirado",
  ];

  const availableItem = props.item;

  return (
    <View>
      {item.available === true && (
        <TouchableOpacity style={[styles.item, { height: 60 }]}>
          <Text style={styles.bold}>
            {availableItem.day} - {availableItem.startTimeHHmm}
          </Text>
          <Text style={styles.info}>{availableItem.services}</Text>
        </TouchableOpacity>
      )}
      {item.available === false && (
        <TouchableOpacity
          disabled={item.step == -1 || item.step == 4}
          style={[styles.item, { height: 220 }]}
          onPress={props.onPress}
        >
          {item.step == 0 && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelHandler}
            >
              <Ionicons
                name={
                  Platform.OS === "android"
                    ? "md-close-circle"
                    : "ios-close-circle"
                }
                size={23}
                color={Colors.cancel}
              />
            </TouchableOpacity>
          )}

          <Text style={styles.bold}>{item.startTimeHHmm}</Text>
          <Text style={styles.bold}>{item.title}</Text>
          <Text style={styles.info}>
            {item.pet.displayName} - {item.services}
          </Text>
          <View style={styles.container}>
            <Text style={styles.price}>Valor: {item.price}</Text>
            {item.paid ? (
              <Text style={styles.paid}>PAGO!</Text>
            ) : (
              <Button
                title="Pagar"
                onPress={payHandler}
                color={Colors.success}
              />
            )}
          </View>

          {item.step != -1 && (
            <StepIndicator
              customStyles={customStyles}
              currentPosition={item.step}
              labels={steps}
            />
          )}
          {item.step != -1 && item.step != 4 && (
            <Button
              title={"" + item.nextStatusButtonText}
              onPress={nextAppointmentStatusHandler}
              color={Colors.success}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  price: {
    fontFamily: "open-sans-bold",
    paddingRight: 10,
  },
  bold: {
    fontFamily: "open-sans-bold",
  },
  info: {
    fontFamily: "open-sans",
  },
  paid: {
    fontFamily: "open-sans",
    color: Colors.success,
  },
  container: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
});

export default AgendaItem;
