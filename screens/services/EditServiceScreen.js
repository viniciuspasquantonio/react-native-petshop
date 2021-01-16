import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import * as servicesActions from "../../store/actions/services";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updateFormIsValid = true;
    for (const key in updatedValidities) {
      updateFormIsValid = updateFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updateFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};
const EditServiceScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const serviceId = props.navigation.getParam("serviceId");
  const editedService = useSelector((state) =>
    state.services.userServices.find((service) => service.id === serviceId)
  );

  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedService ? editedService.name : "",
      description: editedService ? editedService.description : "",
      price: editedService ? editedService.price : "",
    },
    inputValidities: {
      name: editedService ? true : false,
      description: editedService ? true : false,
      price: editedService ? true : false,
    },
    formIsValid: editedService ? true : false,
  });

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        "Campo incorreto!",
        "Por favor preencha os campos corretamente.",
        [{ text: "Ok" }]
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (editedService) {
        await dispatch(
          servicesActions.updateService(
            serviceId,
            formState.inputValues.name,
            formState.inputValues.description,
            formState.inputValues.price
          )
        );
      } else {
        await dispatch(
          servicesActions.createService(
            formState.inputValues.name,
            formState.inputValues.description,
            formState.inputValues.price
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, [dispatch, serviceId, formState, setIsLoading, setError]);

  const inputChangeHandler = useCallback(
    (inputId, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputId,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Ok" }]);
    }
    props.navigation.setParams({ submit: submitHandler });
  }, [error, submitHandler]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingViewContainer}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="name"
            label="Nome"
            errorText="Please enter a valid name!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedService ? editedService.name : ""}
            initiallyValid={!!editedService}
            required
          />

          <Input
            id="price"
            label="Preço"
            errorText="Please enter a valid price!"
            keyboardType="decimal-pad"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            required
            initialValue={editedService ? editedService.price.toString() : ""}
            editable={!!editedService}
            min={0.1}
          />

          <Input
            id="description"
            label="Descriçao"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedService ? editedService.description : ""}
            initiallyValid={!!editedService}
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditServiceScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("serviceId")
      ? "Edit Service"
      : "Add Service",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorButton: {
    marginBottom: 10,
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
    fontSize: 25,
  },
});

export default EditServiceScreen;
