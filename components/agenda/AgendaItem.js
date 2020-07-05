import React from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';




const AgendaItem = props => {    
    return (
        <TouchableOpacity
            style={[styles.item, { height: 80 }]}
            onPress={props.onPress}
        >
            <Text style={styles.time}>{props.startTimeHHmm}</Text>
            <Text style={styles.info}>{props.title}</Text>
            <Text style={styles.info}>{props.pet.displayName} - {props.services}</Text>            
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
    },
    time: {
        fontFamily: 'open-sans-bold'
    },
    info: {
        fontFamily: 'open-sans'
    }
});

export default AgendaItem;