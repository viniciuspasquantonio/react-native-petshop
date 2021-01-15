import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import Colors from "../../constants/Colors";
import Card from "../UI/Card";
import { Ionicons } from "@expo/vector-icons";

const CustomerPreview = (props) => {
  const { customer } = props;
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <Card style={styles.customer}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.details}>
              <Text color={Colors.primary} style={styles.title}>
                {customer.firstName} {customer.lastName} - {customer.phone}
              </Text>
            </View>
            <View style={styles.deleteButton}>
              <TouchableOpacity onPress={props.onDelete}>
                <Ionicons
                  name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
                  color={Colors.cancel}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  customer: {
    height: 40,
    margin: 4,
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

export default CustomerPreview;
