import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import * as appointmentsActions from '../../store/actions/appointments'
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import CustomerSelectorButton from '../../components/customer/CustomerSelectorButton';
import PetSelectorButton from '../../components/pet/PetSelectorButton';
import DateTimeButtons from '../../components/DateTimeButtons';
import ServicesSelectorButton from '../../components/service/ServicesSelectorButton';
import { Text } from 'react-native';




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
    const services = useSelector(state => state.services.userServices);
    const [startTime, setStartTime] = useState(editedAppointment ? editedAppointment.startTime : null);
    const [selectedCustomer, setSelectedCustomer] = useState(editedAppointment ? editedAppointment.customer : null);
    const [selectedPet, setSelectedPet] = useState(editedAppointment ? editedAppointment.pet : null);    
    const [selectedServices, setSelectedServices] = useState(editedAppointment ? editedAppointment.services : null);
    const [price, setPrice] = useState(editedAppointment ? editedAppointment.price : null);

    const dispatch = useDispatch();
    const [formState, dispatchFormState] = useReducer(formReducer, {

        inputValues: {
            startTime: editedAppointment ? editedAppointment.startTime : '',
            customer: editedAppointment ? editedAppointment.customer : '',
            pet: editedAppointment ? editedAppointment.pet : '',
            services: editedAppointment ? editedAppointment.services : ''      
        },
        inputValidities: {
            startTime: editedAppointment ? true : false,
            customer: editedAppointment ? true : false,
            pet: editedAppointment ? true : false,
            services: editedAppointment ? true : false
        },
        formIsValid: editedAppointment ? true : false
    });

    const customerChangeHandler = customer => {
        if (customer === selectedCustomer) {
            return;
        }
        inputChangeHandler('customer', customer, true);
        setSelectedCustomer(customer);
        petChangeHandler(null);
    }

    const petChangeHandler = pet => {
        if (pet === selectedPet) {
            return;
        }
        inputChangeHandler('pet', pet, true);
        setSelectedPet(pet);
    }

    const servicesChangeHandler = selectedServicesIdList => {
        let totalAmount = 0;
        const selectedServices = services.filter(service => {
            if (selectedServicesIdList.includes(service.uniqueKey)) {
                totalAmount = totalAmount + service.price;
                return true;
            }
        });
        inputChangeHandler('services', selectedServices, true);
        setSelectedServices(selectedServices);
        setPrice(totalAmount);
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
                await dispatch(
                    appointmentsActions.updateAppointment(
                        appointmentId,
                        formState.inputValues.startTime,
                        formState.inputValues.customer,
                        formState.inputValues.pet,
                        price,
                        formState.inputValues.services
                    )
                );
            } else {
                await dispatch(
                    appointmentsActions.createAppointment(
                        formState.inputValues.startTime,
                        formState.inputValues.customer,
                        formState.inputValues.pet,
                        price,
                        formState.inputValues.services,
                        'BOOKED'
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

    const startTimeChangeHandler = time => {
        inputChangeHandler('startTime', time, true);
        console.log("time ",time);
        setStartTime(time);
    }


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

                <View style={styles.selectorButton}>
                    <CustomerSelectorButton
                        customerSelectHandler={customerChangeHandler}
                        title={selectedCustomer ? selectedCustomer.displayName : 'Select a customer'}
                        color={Colors.primary}
                    />
                </View>
                <View style={styles.selectorButton}>
                    <PetSelectorButton
                        petSelectHandler={petChangeHandler}
                        title={selectedPet ? selectedPet.name : 'Select a pet'}
                        customer={selectedCustomer}
                        color={Colors.primary}
                    />
                </View>
                <View style={styles.selectorButton}>
                    <DateTimeButtons
                        date={startTime}
                        onChange={startTimeChangeHandler}
                    />
                </View>

                <View style={styles.selectorButton}>
                    <ServicesSelectorButton
                        servicesSelectHandler={servicesChangeHandler}
                        color={Colors.primary}
                        title={'Add services'}
                        selectedServices={selectedServices}
                    />
                </View>
                {price ?
                    <View>
                        <Text style={styles.totalAmount}>Total: ${price.toFixed(2)}</Text>
                    </View> : null
                }
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
    },
    selectorButton: {
        marginBottom: 10
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 25
    },

});

export default EditAppointmentScreen;