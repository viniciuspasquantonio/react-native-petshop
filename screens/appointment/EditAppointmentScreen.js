import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import * as appointmentsActions from '../../store/actions/appointments'
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import CustomerSelectorButton from '../../components/customer/CustomerSelectorButton';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updateFormIsValid = true;
        for (const key in updatedValidities) {
            updateFormIsValid = updateFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updateFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        };
    }
    return state;
};
const EditAppointmentScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const appointmentId = props.navigation.getParam('appointmentId');
    const editedAppointment = useSelector(state =>
        state.appointments.userAppointments.find(appointment => appointment.id === appointmentId)
    );

    const [selectedCustomer, setSelectedCustomer] = useState(editedAppointment ? editedAppointment.customer : null);

    const dispatch = useDispatch();
    const [formState, dispatchFormState] = useReducer(formReducer, {

        inputValues: {
            startTime: editedAppointment ? new Date(editedAppointment.startTime) : '',
            endTime: editedAppointment ? new Date(editedAppointment.endTime) : '',
            customer: editedAppointment ? editedAppointment.customer : ''

        },
        inputValidities: {
            startTime: editedAppointment ? true : false,
            endTime: editedAppointment ? true : false,
            customer: editedAppointment ? true : false
        },
        formIsValid: editedAppointment ? true : false
    });

    const customerChangeHandler = selectedCustomer => {
        inputChangeHandler('customer', selectedCustomer, true);
        setSelectedCustomer(selectedCustomer);
    }

    const submitHandler = useCallback(async () => {
        console.log("formState", formState);
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            if (editedAppointment) {
                await dispatch(
                    appointmentsActions.updateAppointment(
                        appointmentId,
                        formState.inputValues.startTime,
                        formState.inputValues.endTime,
                        formState.inputValues.customer,
                        150,
                        []
                    )
                );
            } else {
                await dispatch(
                    appointmentsActions.createAppointment(
                        formState.inputValues.startTime,
                        formState.inputValues.endTime,
                        formState.inputValues.customer,
                        150,
                        []
                    )
                );
            }
            props.navigation.goBack();
        } catch (error) {
            setError(error.message);
        }

        setIsLoading(false);

    }, [dispatch, appointmentId, formState, setIsLoading, setError]);


    const inputChangeHandler = useCallback(
        (inputId, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputId
            });
        },
        [dispatchFormState]
    );


    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Ok' }]);
        }
        props.navigation.setParams({ submit: submitHandler });
    }, [error, submitHandler]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingViewContainer}
            behavior='padding'
            keyboardVerticalOffset={100}
        >
            <View style={styles.form}>

                <CustomerSelectorButton
                    customerSelectHandler={customerChangeHandler}
                    title={selectedCustomer ? selectedCustomer.displayName : 'Select a customer'}
                />
                

                <Input
                    id="startTime"
                    label="Start Time"
                    errorText="Please enter a valid start time!"
                    keyboardType="default"
                    autoCapitalize="sentences"
                    autoCorrect
                    returnKeyType="next"
                    onInputChange={inputChangeHandler}
                    initialValue={editedAppointment ? editedAppointment.startTime : ''}
                    initiallyValid={!!editedAppointment}
                    required
                />

                <Input
                    id="endTime"
                    label="End Time"
                    errorText="Please enter a valid end time!"
                    keyboardType="default"
                    autoCapitalize="sentences"
                    autoCorrect
                    returnKeyType="next"
                    onInputChange={inputChangeHandler}
                    initialValue={editedAppointment ? editedAppointment.endTime : ''}
                    initiallyValid={!!editedAppointment}
                    required
                />
            </View>
        </KeyboardAvoidingView>
    )
};

EditAppointmentScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('appointmentId') ? 'Edit Appointment' : 'Add Appointment',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title='Save'
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFn}
                />
            </HeaderButtons>
        )

    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default EditAppointmentScreen;