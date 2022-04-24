import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import NumberFormat from "react-number-format";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

const MyOrder = ({ navigation }) => {
  const token = useSelector((state) => state.userReducer.token);
  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    headers: { "x-access-token": token },
  });
  const isFocused = useIsFocused();
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    instance
      .get("/bills/getBillsByUser")
      .then(function (response) {
        setBillData(response.data);
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
      })
      .then(function () {
        setLoading(false);
      });
  }, [isFocused]);

  const getColor = (status) => {
    let color;
    if (status === "Đang xử lý") {
      color = "#AEAEB2";
    } else if (status === "Đã hủy") {
      color = "#F44336";
    } else if (status === "Đang vận chuyển") {
      color = "#0075FF";
    } else if (status === "Đã hoàn thành") {
      color = "#4CAF50";
    }
    return color;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={"#000000"} />
      ) : (
        <FlatList
          style={{ flex: 1, width: "100%" }}
          data={billData}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                borderBottomWidth: 0.5,
                borderColor: "#DADADA",
                paddingVertical: 20,
                paddingHorizontal: 15,
              }}
              onPress={() => {
                navigation.navigate("OrderDetails", { bill: item });
              }}
              activeOpacity={1}
            >
              <View style={styles.item}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text style={styles.text_normal}>Mã đơn hàng: </Text>
                    <Text style={styles.text_bold}>
                      {item.bill_id.substring(0, 8).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.text_normal}>
                    {moment(item.date_created).format("HH:mm DD-MM-YYYY")}
                  </Text>
                </View>
                <Text style={[styles.text_normal, { marginBottom: 5 }]}>
                  {item.address_detail}
                  {", "}
                  {item.sub_district}
                  {", "}
                  {item.district}
                  {", "}
                  {item.city}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.text_normal}>Số tiền: </Text>
                  <NumberFormat
                    value={
                      item.product.reduce(
                        (n, { price, quantity }) => n + price * quantity,
                        0
                      ) -
                      item.discount_value +
                      40000
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={" đ"}
                    renderText={(value, props) => (
                      <Text style={styles.text_bold} {...props}>
                        {value}
                      </Text>
                    )}
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text style={styles.text_normal}>Trạng Thái: </Text>
                    <Text
                      style={[
                        styles.text_normal,
                        { color: getColor(item.status) },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <AntDesign name="arrowright" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.bill_id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text_normal: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
  },
  text_bold: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 21,
  },
});

export default MyOrder;