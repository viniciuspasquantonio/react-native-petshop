import React, { Component, useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useSelector, useDispatch } from 'react-redux';
import * as customersActions from '../../store/actions/customers';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

const KEYS_TO_FILTERS = ['firstName', 'lastName', 'phone'];




const CustomerInputFiler = props => {
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const setCustomerHandler = customer => {
        setAppointmentCustomer(customer)
        setSearchInputText(customer.firstName + ' '+ customer.lastName + ' - '+ customer.phone);        
    }

    const [isRefreshing, setIsRefreshing] = useState(false);
    const dispatch = useDispatch();
    const userId = 29;
    const loadCustomers = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await dispatch(customersActions.fetchCustomers(userId));
        } catch (err) {
        }
        setIsRefreshing(false);
    }, [dispatch, setIsRefreshing]);

    const customerSelectHandler = customer => {
        setSearchInputText(customer.firstName + ' '+ customer.lastName + ' - '+ customer.phone)
        setSearchTerm('');        
    }

   

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);
    const [searchTerm, setSearchTerm] = useState('');
    const [appointmentCustomer, setAppointmentCustomer] = useState(props.customer);
    const [searchInputText, setSearchInputText] = useState('');
    const customers = useSelector(state => state.customers.userCustomers);


    const filteredList = customers.filter(createFilter(searchTerm, KEYS_TO_FILTERS))
    return (
        <View>
            <SearchInput
                id="customerInput"
                onChangeText={(term) => { setSearchTerm(term) }}
                style={styles.searchInput}
                placeholder={props.placeHolder}
                defaultValue={searchInputText}
            />
            {searchTerm.length < 2 ? null : (
                <ScrollView>
                    {filteredList.map(customer => {
                        return (
                            <TouchableCmp onPress={() => {customerSelectHandler(customer)}} key={customer.id}>
                                <View >
                                    <Text >{customer.firstName} {customer.lastName} - {customer.phone}</Text>
                                </View>
                            </TouchableCmp>
                        )
                    })}
                </ScrollView>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start'
    },
    searchInput: {
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1
    }
});

export default CustomerInputFiler;