import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import NumberFormat from "react-number-format";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addUserInfo } from "../store/itemAction";
import axios from "axios";

const Delivery = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userReducer.token);
  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    headers: { "x-access-token": token },
  });
  const delivery = useSelector((state) => state.userReducer.delivery);

  const [loading, setLoading] = useState(false);
  const { total_product, total_value } = route.params;
  const { data } = route.params ?? {};

  function openPayment(item) {
    if (delivery.length === 0) {
      Alert.alert("Thông báo", "Vui lòng thêm địa chỉ giao hàng!");
      return;
    }
    if (item === undefined) {
      item = delivery.find((item) => item.default_address === true);
    }
    navigation.navigate("Payment", {
      item: item,
      data: data,
      total_value: total_value,
      total_product: total_product,
    });
  }

  const handleDeleteAddress = (delivery_id) => {
    setLoading(true);
    instance
      .get("/users/deleteDeliveryAddress/" + delivery_id)
      .then(function (response) {
        setLoading(false);
        dispatch(addUserInfo(response.data));
      })
      .catch(function (error) {
        setLoading(false);
        Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={loading}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ flex: 1, width: "100%" }}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color={"#E7F3F1"} />
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.add_address_contain}
          onPress={() => navigation.navigate("AddAddress")}
        >
          <Text style={[styles.text_normal, { flex: 1 }]}>
            Thêm địa chỉ mới
          </Text>
          <AntDesign name="plus" size={16} color="black" />
        </TouchableOpacity>
        <FlatList
          style={{ paddingHorizontal: "4%" }}
          data={delivery}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                openPayment(item);
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    styles.text_normal,
                    {
                      fontWeight: "bold",
                      fontFamily: "Open_Sans_Bold",
                      flex: 1,
                    },
                  ]}
                >
                  {item.name_receiver} - {item.phone_receiver}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    handleDeleteAddress(item.delivery_id);
                  }}
                >
                  <Text style={styles.text_small}>Xóa</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.text_normal, { marginTop: 3 }]}>
                {item.address_detail}
                {", "}
                {item.sub_district}
                {", "}
                {item.district}
                {", "}
                {item.city}
              </Text>
              {item.default_address && (
                <Text style={[styles.text_small, { marginTop: 3 }]}>
                  [Mặc định]
                </Text>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.delivery_id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.bottom_container}>
        <View style={{ marginTop: 10, flexDirection: "row" }}>
          <Text style={[styles.text_normal, { flex: 1 }]}>Số lượng</Text>
          <Text>{total_product}</Text>
        </View>
        <View style={{ marginTop: 5, flexDirection: "row" }}>
          <Text style={[styles.text_normal, { flex: 1 }]}>Thành tiền</Text>
          <NumberFormat
            value={total_value}
            displayType={"text"}
            thousandSeparator={true}
            suffix={" đ"}
            renderText={(value, props) => (
              <Text style={styles.text_normal} {...props}>
                {value}
              </Text>
            )}
          />
        </View>
        <TouchableOpacity
          style={styles.button_order}
          onPress={() => {
            openPayment();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.text_order}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  bottom_container: {
    width: "100%",
    paddingHorizontal: "4%",
    marginBottom: 25,
    borderColor: "#AEAEB2",
    borderTopWidth: 0.5,
  },
  text_normal: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
  },
  text_small: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 10,
    lineHeight: 15,
    color: "#0075FF",
  },
  button_order: {
    width: "100%",
    height: 42,
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  text_order: {
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  add_address_contain: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderColor: "#AEAEB2",
    borderBottomWidth: 0.5,
  },
  item: {
    paddingTop: 15,
  },
});

export default Delivery;
