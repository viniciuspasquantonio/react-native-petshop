import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Alert, ActivityIndicator, Text, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import * as petActions from '../../store/actions/pets'
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';


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
const AddPet = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();


    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: '',
            petType: 39,
            customer: props.customer,
            gender: 'MALE'
        },
        inputValidities: {
            name: false,
            petType: true,
            customer: true,
            gender: true
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Ok' }]);
        }
    }, [error]);


    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            let newPet = await dispatch(petActions.createPet(
                formState.inputValues.customer,
                formState.inputValues.name,
                formState.inputValues.petType,
                formState.inputValues.gender)
            )
            props.onAdded(newPet);
        } catch (error) {
            setError(error.message);
        }

        setIsLoading(false);

    }, [dispatch, formState]);

    useEffect(() => {
        submitHandler;
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
                    <Input
                        id="name"
                        label="Name"
                        errorText="Please enter a valid name!"
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={''}
                        initiallyValid={false}
                        required
                    />
                    <Input
                        id="petType"
                        label="Type"
                        errorText="Please enter a valid type!"
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={'51'}
                        initiallyValid={false}
                        required
                    />
                    <Input
                        id="gender"
                        label="Gender"
                        errorText="Please enter a valid gender!"
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        onInputChange={inputChangeHandler}
                        initialValue={'MALE'}
                        initiallyValid={false}
                        required
                    />

                    <Button
                        color={Colors.primary}
                        title="Save"
                        onPress={() => {
                            submitHandler();
                        }}
                    />
                    <Button
                        color={Colors.primary}
                        title="Cancel"
                        onPress={props.onCancel}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    form: {

    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default AddPet;