import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Alert, ActivityIndicator, Text, Button, Picker } from 'react-native';
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
    const [petSize, setPetSize] = useState(0);
    const [gender, setGender] = useState(0);



    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: '',
            petType: '',
            customer: props.customer,
            gender: gender,
            size: petSize
        },
        inputValidities: {
            name: false,
            petType: false,
            customer: true,
            gender: true,
            size: true
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
                formState.inputValues.gender,
                formState.inputValues.size
            ))
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

    const petSizeChangeHandler = size => {
        setPetSize(size);
        inputChangeHandler('size', size, true);
    }

    const genderChangeHandler = gender => {
        setGender(gender);
        inputChangeHandler('gender', gender, true);
    }

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
                        initialValue={''}
                        initiallyValid={false}
                        required
                    />

                    <Picker
                        selectedValue={gender}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => genderChangeHandler(itemValue)}
                    >
                        <Picker.Item label="Male" value={0} />
                        <Picker.Item label="Female" value={1} />
                    </Picker>

                    <Picker
                        selectedValue={petSize}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => petSizeChangeHandler(itemValue)}
                    >
                        <Picker.Item label="Toy" value={0} />
                        <Picker.Item label="Small" value={1} />
                        <Picker.Item label="Medium" value={2} />
                        <Picker.Item label="Large" value={3} />
                        <Picker.Item label="Extra Large" value={4} />
                    </Picker>
                   

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