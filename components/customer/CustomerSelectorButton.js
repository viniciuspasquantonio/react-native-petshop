import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import Modal, { ModalContent, ModalTitle } from 'react-native-modals';
import InputFiler from '../InputFilter';
import { useDispatch, useSelector } from 'react-redux';
import * as customersActions from '../../store/actions/customers'

const CustomerSelectorButton = props => {
    const [customerSearchModalVisible, setCustomerSearchModalVisible] = useState(false);
    const KEYS_TO_FILTERS = ['firstName', 'lastName', 'phone'];
    const userId = 29;

    const dispatch = useDispatch();

    const fetchCustomers = useCallback(async () => {
        try {
            await dispatch(customersActions.fetchCustomers(userId));
        } catch (err) {
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const customers = useSelector(state => state.customers.userCustomers);

    const customerSelectHandler = customer => {
        setCustomerSearchModalVisible(false);
        props.customerSelectHandler(customer);
    }

    return (
        <View>
            <Button
                title={props.title}
                onPress={() => setCustomerSearchModalVisible(true)}
            />
            <Modal
                width={0.7}
                height={0.5}
                visible={customerSearchModalVisible}
                onTouchOutside={() => setCustomerSearchModalVisible(false)}
                modalTitle={<ModalTitle title="Select a customer" />}
            >
                <ModalContent>
                    <InputFiler
                        itemSelectHandler={customerSelectHandler}
                        keysToFilter={KEYS_TO_FILTERS}
                        listToFiler={customers}
                        minSearchTermLenth={0}
                        emptyListMessage="No customers found! Maybe start adding some!"                        
                    />
                </ModalContent>
            </Modal>

        </View>
    );
};
const styles = StyleSheet.create({

});

export default CustomerSelectorButton;