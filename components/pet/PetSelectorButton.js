import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import Modal, { ModalContent, ModalTitle } from 'react-native-modals';
import InputFiler from '../InputFilter';
import AddPet from './AddPet';
import { Provider } from 'react-redux';
import store from '../../store/store';

const PetSelectorButton = props => {
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const KEYS_TO_FILTERS = ['name', 'petType'];
    const pets = props.customer ? props.customer.pets ? props.customer.pets : [] : [];
        

    const petSelectHandler = pet => {
        setSearchModalVisible(false);
        props.petSelectHandler(pet);
    }

    const petAddHandler = () => {
        setSearchModalVisible(false);
        setAddModalVisible(true);
    }


    const onAddedHandler = pet => {
        closeModals();
        props.petSelectHandler(pet);        
    }

    const onCancelHandler = () => {
        closeModals();
    }

    const closeModals = () => {
        setSearchModalVisible(false);
        setAddModalVisible(false);
    }


    return (
        <View>
            <Button
                title={props.title}
                onPress={() => setSearchModalVisible(true)}
                disabled={!props.customer}
                color={props.color}

            />
            <Modal
                width={0.7}
                height={0.5}
                visible={searchModalVisible}
                onTouchOutside={() => setSearchModalVisible(false)}
                modalTitle={<ModalTitle title="Select a pet" />}
            >
                <ModalContent>
                    <InputFiler
                        itemSelectHandler={petSelectHandler}
                        keysToFilter={KEYS_TO_FILTERS}
                        listToFiler={pets}
                        minSearchTermLenth={0}
                        emptyListComponent={
                            <View style={styles.centered}>
                                <View style={{ marginBottom: 5 }}>
                                    <Text>Customer does not have pets yet, try adding some</Text>
                                </View>
                                <View>
                                    <Button
                                        title={'Add'}
                                        onPress={petAddHandler}
                                        color={props.color}
                                    />
                                </View>
                            </View>
                        }
                    />
                </ModalContent>
            </Modal>
            <Modal
                width={0.7}
                height={0.5}
                visible={addModalVisible}
                onTouchOutside={() => setAddModalVisible(false)}
                modalTitle={<ModalTitle title="Add a pet" />}
            >
                <ModalContent>
                    <Provider store={store}>
                        <AddPet
                            customer={props.customer}
                            onCancel={onCancelHandler}
                            onAdded={onAddedHandler}
                        />
                    </Provider>
                </ModalContent>
            </Modal>

        </View>
    );
};
const styles = StyleSheet.create({

});

export default PetSelectorButton;