import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import * as appointmentsActions from '../../store/actions/appointments'
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import SearchInput, { createFilter } from 'react-native-search-filter';
import InputFiler from '../../components/customer/CustomerInputFilter';
import CustomerInputFiler from '../../components/customer/CustomerInputFilter';




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
    const [customer, setCustomer] = useState(props.customer);
    
    const [startTime, setStartTime] = useState(props.startTime);
    const [endTime, setEndTime] = useState(props.endTime);
    const [mode, setMode] = useState('date');
    const [error, setError] = useState();

    const appointmentId = props.navigation.getParam('appointmentId');
    const editedAppointment = useSelector(state =>
        state.appointments.userAppointments.find(appointment => appointment.id === appointmentId)
    );

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedAppointment ? editedAppointment.title : '',
            startTime: editedAppointment ? new Date(editedAppointment.startTime) : '',
            endTime: editedAppointment ? new Date(editedAppointment.endTime) : '',
            
        },
        inputValidities: {
            title: editedAppointment ? true : false,
            startTime: editedAppointment ? true : false,
            endTime: editedAppointment ? true : false
        },
        formIsValid: editedAppointment ? true : false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Ok' }]);
        }
    }, [error]);

    const customerChangeHandler = customer => {
        console.log("dooou ")
        setCustomer(customer);
        let name = customer.firstName + ' ' + customer.lastName + ' - ' + customer.phone;
        console.log("name ",name);
    }

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            if (editedAppointment) {
                await dispatch(appointmentsActions.updateAppointment(appointmentId, formState.inputValues.title, formState.inputValues.startTime, formState.inputValues.endTime));
            } else {
                await dispatch(appointmentsActions.createAppointment(formState.inputValues.title, formState.inputValues.startTime, formState.inputValues.endTime))
            }
            props.navigation.goBack();
        } catch (error) {
            setError(error.message);
        }

        setIsLoading(false);

    }, [dispatch, appointmentId, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);

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
            <ScrollView>
                <View style={styles.form}>

                    <CustomerInputFiler
                        id="customerInput"
                        customer={editedAppointment ? editedAppointment.customer : ''}
                        onSelect={customerChangeHandler}
                        
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
            </ScrollView>
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