import React, { useEffect, useState, useCallback } from 'react';
import { Agenda } from 'react-native-calendars';
import { Platform, Button, ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as agendasActions from '../../store/actions/agendas';
import AppointmentItem from '../../components/agenda/AgendaItem';


const AppointmentsAgendaScreen = props => {
    const userId = 29;
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [items, setItems] = useState();
    const [error, setError] = useState(undefined);
    const agenda = useSelector(state => state.agendas.userAgenda);
    const dispatch = useDispatch();

    const loadAgenda = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(agendasActions.fetchAgenda(userId));
        } catch (err) {
            console.log("error", error);
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadAgenda);
        return () => {
            willFocusSub.remove();
        }
    }, [loadAgenda]);

    const loadItems = day => {
        loadAgenda(userId);
        if(agenda && agenda.days){
            setItems(agenda.days);
        }
    };

    const renderItem = item => {
        console.log("renderItem ");
        return (
            <AppointmentItem title={item.title} startTimeHHmm={item.startTimeHHmm} endTimeHHmm={item.endTimeHHmm} />
        );
    }

    const renderEmptyDate = () => {
        console.log("renderEmptyDate ");
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    };

    const rowHasChanged = (r1, r2) => {
        return r1.name !== r2.name;
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button
                    title='Try again!'
                    onPress={loadAgenda}
                    color={Colors.primary}
                />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    }

    return (
        <Agenda
            items={items}
            onDayPress={loadItems}
            selected={'2020-06-01'}
            renderItem={renderItem}
            renderEmptyDate={renderEmptyDate}
            rowHasChanged={rowHasChanged}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#43515c'},
        //    '2017-05-09': {textColor: '#43515c'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        // hideExtraDays={false}
        />
    );
};

const styles = StyleSheet.create({
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
});

export default AppointmentsAgendaScreen;
