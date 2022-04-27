import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { StackActions } from "@react-navigation/native";
import NumberFormat from "react-number-format";
import moment from "moment";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { Image as CacheImage } from "react-native-expo-image-cache";

const OrderDetails = ({ route, navigation }) => {
  const { bill } = route.params;
  const shipFee = bill.delivery_value ? bill.delivery_value : 40000;

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

  const sumProduct = bill.product.reduce(function (prev, current) {
    return prev + current.quantity;
  }, 0);

  const sumValue = bill.product.reduce(function (prev, current) {
    return prev + current.price * current.quantity;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            borderColor: "#AEAEB2",
            borderBottomWidth: 0.5,
            paddingBottom: 25,
          }}
        >
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={styles.text_normal}>Mã đơn hàng: </Text>
              <Text
                style={[
                  styles.text_normal,
                  { fontWeight: "bold", fontFamily: "Open_Sans_Bold" },
                ]}
              >
                {bill.bill_id.substring(0, 8).toUpperCase()}
              </Text>
            </View>
            <Text
              style={[styles.text_normal, { color: getColor(bill.status) }]}
            >
              {bill.status}
            </Text>
          </View>
          <Text style={[styles.text_normal, { marginTop: 5 }]}>
            {moment(bill.date_created).format("HH:mm DD-MM-YYYY")}
          </Text>
          <Text
            style={[
              styles.text_normal,
              {
                marginTop: 15,
                fontWeight: "bold",
                fontFamily: "Open_Sans_Bold",
              },
            ]}
          >
            Địa chỉ nhận hàng
          </Text>
          <Text style={[styles.text_normal, { marginTop: 10 }]}>
            {bill.name_receiver} - {bill.phone_receiver}
          </Text>
          <Text style={[styles.text_normal, { marginTop: 1 }]}>
            {bill.address_detail}
            {", "}
            {bill.sub_district}
            {", "}
            {bill.district}
            {", "}
            {bill.city}
          </Text>
        </View>
        <FlatList
          data={bill.product}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{ flexDirection: "row", marginVertical: 10 }}
              onPress={() => {
                // navigation.navigate("ProductDetails", { item: item });
              }}
              activeOpacity={1}
            >
              <CacheImage
                style={{ width: 100, height: 139, marginRight: 10 }}
                uri={item.src}
              />

              <View style={{ flexDirection: "column", flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", height: 16 }}>
                    <Text
                      style={[
                        styles.text_small,
                        {
                          fontWeight: "bold",
                          fontFamily: "Open_Sans_Bold",
                          textTransform: "uppercase",
                          flex: 1,
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                    {bill.status === "Đã hoàn thành" &&
                      item.evaluated === false && (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("Review", {
                              bill_id: bill.bill_id,
                              item,
                            })
                          }
                        >
                          <Image
                            style={{ width: 18, height: 16 }}
                            source={require("../assets/icon_feedback.png")}
                          />
                        </TouchableOpacity>
                      )}
                  </View>
                  <Text style={styles.text_normal}>{item.name}</Text>
                  <Text style={[styles.text_small, { marginTop: 1 }]}>
                    {item.color}
                  </Text>
                  <Text style={[styles.text_small, { marginTop: 2 }]}>
                    Size: {item.size}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <NumberFormat
                    value={item.price}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={" đ"}
                    renderText={(value, props) => (
                      <Text
                        style={[styles.text_normal, { flex: 1 }]}
                        {...props}
                      >
                        {value}
                      </Text>
                    )}
                  />
                  <Text style={styles.text_normal}>x {item.quantity}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.item_bought_id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.bottom_container}>
        <View style={{ marginTop: 20, flexDirection: "row" }}>
          <Text style={[styles.text_normal, { flex: 1 }]}>
            Tạm tính ({sumProduct} sản phẩm)
          </Text>
          <NumberFormat
            value={sumValue}
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
        <View style={{ marginTop: 5, flexDirection: "row" }}>
          <Text style={[styles.text_normal, { flex: 1 }]}>Phí giao hàng</Text>
          <NumberFormat
            value={shipFee}
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
        {bill.discount_value > 0 && (
          <View
            style={{ marginTop: 5, flexDirection: "row", alignItems: "center" }}
          >
            <Text style={[styles.text_small, { flex: 1, color: "#0075FF" }]}>
              Khuyến mãi
            </Text>
            <NumberFormat
              value={bill.discount_value}
              displayType={"text"}
              thousandSeparator={true}
              suffix={" đ"}
              renderText={(value, props) => (
                <Text
                  style={[styles.text_small, { color: "#0075FF" }]}
                  {...props}
                >
                  -{value}
                </Text>
              )}
            />
          </View>
        )}
        <View style={{ marginTop: 5, flexDirection: "row" }}>
          <Text style={[styles.text_normal, { flex: 1 }]}>Thành tiền</Text>
          <NumberFormat
            value={sumValue + shipFee - bill.discount_value}
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
            navigation.replace("MainStack", {
              screen: "Personal",
              params: {
                screen: "MyOrder",
              },
            });
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.text_order}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: "4%",
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
  },
  bottom_container: {
    width: "100%",
    marginBottom: 25,
    borderColor: "#AEAEB2",
    borderTopWidth: 0.5,
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
});

export default OrderDetails;
