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
import * as customerActions from "../../store/actions/customers";
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
const EditCustomerScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const customerId = props.navigation.getParam("customerId");
  const editedCustomer = useSelector((state) =>
    state.customers.customers.find((customer) => customer.id === customerId)
  );

  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstName: editedCustomer ? editedCustomer.firstName : "",
      lastName: editedCustomer ? editedCustomer.lastName : "",
      phone: editedCustomer ? editedCustomer.phone : "",
      email: editedCustomer ? editedCustomer.email : "",
      address: editedCustomer ? editedCustomer.address : ""
    },
    inputValidities: {
      firstName: editedCustomer ? true : false,
      lastName: editedCustomer ? true : false,
      phone: editedCustomer ? true : false,
      email: editedCustomer ? true : false,
      address: editedCustomer ? true : false
    },
    formIsValid: editedCustomer ? true : false,
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
      if (editedCustomer) {
        await dispatch(
          customerActions.updateCustomer(
            customerId,
            formState.inputValues.firstName,
            formState.inputValues.lastName,
            formState.inputValues.email,
            formState.inputValues.phone,
            formState.inputValues.address
          )
        );
      } else {
        await dispatch(
          customerActions.createCustomer(
            formState.inputValues.firstName,
            formState.inputValues.lastName,
            formState.inputValues.email,
            formState.inputValues.phone,
            formState.inputValues.address
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, [dispatch, customerId, formState, setIsLoading, setError]);

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
            id="firstName"
            label="Nome"
            errorText="Please enter a valid firstName!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedCustomer ? editedCustomer.firstName : ""}
            initiallyValid={!!editedCustomer}
            required
          />
          <Input
            id="lastName"
            label="Sobrenome"
            errorText="Please enter a valid lastName!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedCustomer ? editedCustomer.lastName : ""}
            initiallyValid={!!editedCustomer}
            required
          />
          <Input
            id="phone"
            label="Celular"
            errorText="Please enter a valid phone!"
            keyboardType="numeric"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedCustomer ? editedCustomer.phone : ""}
            initiallyValid={!!editedCustomer}
            required
          />
          <Input
            id="email"
            label="Email"
            errorText="Please enter a valid email!"
            keyboardType="email-address"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedCustomer ? editedCustomer.email : ""}
            initiallyValid={!!editedCustomer}
            required
          />
          <Input
            id="address"
            label="Endereço"
            errorText="Please enter a valid address!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedCustomer ? editedCustomer.address : ""}
            initiallyValid={!!editedCustomer}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditCustomerScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("customerId")
      ? "Edit Customer"
      : "Add Customer",
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

export default EditCustomerScreen;
