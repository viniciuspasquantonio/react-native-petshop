import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Platform, Button, ActivityIndicator, View, Text, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import * as customersActions from '../../store/actions/customers';

import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import CustomerPreview from '../../components/shop/CustomerPreview';


const CustomersOverviewScreen = props => {
    const userId = 29;
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(undefined);
    const customers = useSelector(state => state.customers.customers);
    
    const dispatch = useDispatch();

    const loadCustomers = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(customersActions.fetchCustomers(userId));
        } catch (err) {
            console.log("error", error);
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    const deleteCustomerHandler = customerId => {
        Alert.alert("Excluir", "Deseja mesmo excluir o contato?", [
          { text: "Não", style: "default" },
          {
            text: "Sim",
            style: "destructive",
            onPress: () => {
                deleteCustomer(customerId);
            },
          },
        ]);
      };

    const deleteCustomer = useCallback(async customerId => {
        setError(null);
        setIsLoading(true);
        try {
          await dispatch(customersActions.deleteCustomer(customerId));
        } catch (err) {
          console.log("error", error);
          setError(err.message);
        }
        setIsLoading(false);
      }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    const selectCustomerHandler = (id) => {
        props.navigation.navigate('CustomerDetail', {
            customerId: id
        });
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button
                    title='Try again!'
                    onPress={loadCustomers}
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

    if (!isLoading && customers.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>Nenhum cliente cadastrado!</Text>
            </View>
        );
    }
    return (
        <FlatList
            onRefresh={loadCustomers}
            refreshing={isRefreshing}
            data={customers}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <CustomerPreview
                    customer={itemData.item}
                    onSelect={() => {
                        selectCustomerHandler(itemData.item.id);
                    }}
                    onDelete={() => {
                        deleteCustomerHandler(itemData.item.id);
                    }}
                />
            )}
        />
    );
};

CustomersOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Clientes',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title='Cadastrar'
                    iconName={Platform.OS === 'android' ? 'md-add' : 'ios-create'}
                    onPress={() => {
                        navData.navigation.navigate('EditCustomer');
                    }}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
export default CustomersOverviewScreen;