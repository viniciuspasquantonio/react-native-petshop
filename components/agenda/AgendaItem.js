import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';


const AgendaItem = props => {
    return (
        <TouchableOpacity
            style={[styles.item, { height: 80 }]}
            onPress={() => Alert.alert(props.title)}
        >
            <Text>{props.startTimeHHmm} - {props.endTimeHHmm}</Text>
            <Text>{props.title}</Text>            
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    }
});

export default AgendaItem;