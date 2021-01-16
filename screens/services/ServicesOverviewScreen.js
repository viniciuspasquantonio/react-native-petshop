import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Platform,
  Button,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import * as servicesActions from "../../store/actions/services";

import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const ServicesOverviewScreen = (props) => {
  const userId = 29;
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(undefined);
  const services = useSelector((state) => state.services.userServices);

  const dispatch = useDispatch();

  const loadServices = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(servicesActions.fetchServices(userId));
    } catch (err) {
      console.log("error", error);
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  const deleteServiceHandler = (serviceId) => {
    Alert.alert("Excluir", "Deseja mesmo excluir o serviço?", [
      { text: "Não", style: "default" },
      {
        text: "Sim",
        style: "destructive",
        onPress: () => {
          deleteService(serviceId);
        },
      },
    ]);
  };

  const deleteService = useCallback(
    async (serviceId) => {
      setError(null);
      setIsLoading(true);
      try {
        await dispatch(servicesActions.deleteService(serviceId));
      } catch (err) {
        console.log("error", error);
        setError(err.message);
      }
      setIsLoading(false);
    },
    [dispatch, setIsLoading, setError]
  );

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const selectServiceHandler = (id) => {
    props.navigation.navigate("EditService", {
      serviceId: id,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again!"
          onPress={loadServices}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && services.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Nenhum serviço cadastrado!</Text>
      </View>
    );
  }
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <FlatList
      onRefresh={loadServices}
      refreshing={isRefreshing}
      data={services}
      keyExtractor={(item) => item.id.toString()}
      renderItem={(itemData) => (
        <View style={styles.touchable}>
          <TouchableCmp
            onPress={() => {
              selectServiceHandler(itemData.item.id);
            }}
            useForeground
          >
            <View>
              <View style={styles.details}>
                <Text color={Colors.primary} style={styles.title}>
                  {itemData.item.name} - {itemData.item.price}
                </Text>
              </View>
              <View style={styles.deleteButton}>
                <TouchableOpacity
                  onPress={() => {
                    deleteServiceHandler(itemData.item.id);
                  }}
                >
                  <Ionicons
                    name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
                    color={Colors.cancel}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableCmp>
        </View>
      )}
    />
  );
};

ServicesOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Serviços",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Cadastrar"
          iconName={Platform.OS === "android" ? "md-add" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("EditService");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  touchable: {
    borderRadius: 2,
    overflow: "hidden",
  },
  details: {
    height: "17%",
    padding: 10,
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 10,
    marginVertical: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 20,
  },
  deleteButton: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
export default ServicesOverviewScreen;
