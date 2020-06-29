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
        <View>
            {props.listToFiler.length > 0 ?
                (
                    <SearchInput
                        onChangeText={(term) => { setSearchTerm(term) }}
                        style={styles.searchInput}
                        placeholder={props.placeHolder}
                    />
                ) : (
                    props.emptyListComponent                    
                )
            }
            {searchTerm.length < props.minSearchTermLenth ? null : (
                <ScrollView>
                    {filteredList.map(item => {
                        return (
                            <TouchableCmp onPress={() => { itemSelectHandler(item) }} key={item.id}>
                                <View>
                                    <Text>{item.displayName}</Text>
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

export default InputFiler;