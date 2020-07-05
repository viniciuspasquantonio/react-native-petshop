import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';



const InputFiler = props => {
    const [searchTerm, setSearchTerm] = useState('');
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const itemSelectHandler = item => {        
        props.itemSelectHandler(item);
    }
    const filteredList = props.listToFiler.filter(createFilter(searchTerm, props.keysToFilter));

    return (
        <View style={styles.container}>
            {props.listToFiler.length > 0 ?
                (
                    <SearchInput
                        onChangeText={(term) => { setSearchTerm(term) }}
                        style={styles.searchInput}
                        placeholder={props.placeHolder}
                        inputFocus={true}
                    />
                ) : (
                    props.emptyListComponent
                )
            }
            {searchTerm.length < props.minSearchTermLenth ? null : (
                <ScrollView style={styles.scrollView}>
                    {filteredList.map(item => {
                        return (
                            <TouchableOpacity
                                onPress={() => { itemSelectHandler(item) }}
                                style={styles.touchableCmp}
                                key={item.id}
                            >
                                <View style={styles.details}>
                                    <Text style={styles.title}>{item.displayName}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>

            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {

        backgroundColor: '#fff',
        justifyContent: 'flex-start'

    },
    searchInput: {
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5
    },
    scrollView: {
        padding: 10
    },
    touchableCmp: {
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10
    },
    title: {
        fontFamily: 'open-sans-bold',
        marginVertical: 2
    },
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
});

export default InputFiler;