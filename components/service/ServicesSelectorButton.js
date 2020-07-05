import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { useDispatch, useSelector } from 'react-redux';
import * as servicesActions from '../../store/actions/services';


const ServicesSelectorButton = props => {
    const userId = 29;    
    [selectedItems, setSelectedItems] = useState(props.selectedServices ? props.selectedServices.map(service => service.uniqueKey) : []);
    
    const dispatch = useDispatch();

    const fetchServices = useCallback(async () => {
        try {
            await dispatch(servicesActions.fetchServices(userId));
        } catch (err) {
        }
    }, [dispatch]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const services = useSelector(state => state.services.userServices);

    onSelectedItemsChange = selecteds => {          
        setSelectedItems(selecteds);        
        props.servicesSelectHandler(selecteds);
    };

    return (
        <View >
            <MultiSelect
                hideTags
                items={services ? services : []}
                uniqueKey="uniqueKey"
                ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={selectedItems}
                selectText="Add Services"
                searchInputPlaceholderText="Search Services..."                
                tagRemoveIconColor={props.color}
                tagBorderColor={props.color}
                tagTextColor={props.color}
                selectedItemTextColor={props.color}
                selectedItemIconColor={props.color}
                itemTextColor="#000"
                displayKey="displayName"
                searchInputStyle={{ color: props.color }}
                submitButtonColor={props.color}
                submitButtonText="Submit"
            />
            <View>
                {this.multiSelect ? this.multiSelect.getSelectedItemsExt(selectedItems) : null}
            </View>
        </View>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    }
});

export default ServicesSelectorButton;