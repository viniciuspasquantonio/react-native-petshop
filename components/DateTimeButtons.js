import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native';
import Colors from '../constants/Colors';



const DateTimeButtons = props => {
  const [date, setDate] = useState(props.date);  
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [dateTitle, setDateTitle] = useState(props.date? new Date(props.date).toLocaleDateString(navigator.language) :'Select Date');
  const [timeTitle, setTimeTitle] = useState(props.date? new Date(props.date).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}).replace(/(:\d{2}| [AP]M)$/, "") :'Select Time');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    if(mode == 'date'){
      setDateTitle(new Date(currentDate).toLocaleDateString(navigator.language));
    }else{      
      
      setTimeTitle(new Date(currentDate).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}).replace(/(:\d{2}| [AP]M)$/, ""));
    }
    props.onChange(currentDate)
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={styles.buttonsView} >
      <View style={styles.button}>
        <Button
          onPress={showDatepicker}
          title={dateTitle}
          color={Colors.primary}
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={showTimepicker}
          title={timeTitle}
          color={Colors.primary}
        />
      </View>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    marginEnd: 5
  }
});

export default DateTimeButtons;