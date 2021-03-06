import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CustomersOverviewScreen from '../screens/customers/CustomersOverviewScreen';
import CustomerDetailScreen from '../screens/customers/CustomerDetailScreen';
import EditCustomerScreen from '../screens/customers/EditCustomerScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AppointmentsOverviewScreen from '../screens/appointment/AppointmentsOverviewScreen';
import AppointmentsAgendaScreen from '../screens/appointment/AppointmentsAgendaScreen';
import AppointmentDetailScreen from '../screens/appointment/AppointmentDetailScreen';
import EditAppointmentScreen from '../screens/appointment/EditAppointmentScreen';



import Colors from '../constants/Colors';
import ServicesOverviewScreen from '../screens/services/ServicesOverviewScreen';
import EditServiceScreen from '../screens/services/EditServiceScreen';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans',
    },
    headerTinColor: Platform.OS === 'android' ? 'white' : Colors.primary

}

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const CustomersNavigator = createStackNavigator({
    CustomersOverview: CustomersOverviewScreen,
    CustomerDetail: CustomerDetailScreen,
    EditCustomer: EditCustomerScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-contact' : 'ios-contact'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const ServicesNavigator = createStackNavigator({
    ServicesOverview: ServicesOverviewScreen,
    EditService: EditServiceScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-construct' : 'ios-construct'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const AppointmentsNavigator = createStackNavigator({
    AppointmentsAgenda: AppointmentsAgendaScreen,
    AppointmentsOverview: AppointmentsOverviewScreen,
    AppointmentDetail: AppointmentDetailScreen,
    EditAppointment: EditAppointmentScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});


const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const AdminNavigator = createStackNavigator({
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const ShopNavigator = createDrawerNavigator({
    Agendamentos: AppointmentsNavigator,
    Clientes: CustomersNavigator,
    Serviços: ServicesNavigator,
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    }
});

export default createAppContainer(ShopNavigator);