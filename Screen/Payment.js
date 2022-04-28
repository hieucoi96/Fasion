import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import NumberFormat from "react-number-format";
import LottieView from "lottie-react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearCart } from "../store/itemAction";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Payment = ({ route, navigation }) => {
  const { data, item, total_value, total_product } = route.params;
  const [value, setValue] = useState("cash");
  const [delivery_value, setDelivery] = useState(40000);
  const [sale_value, setSale] = useState({ discount_id: null, value: null });
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.userReducer.token);
  const cart = useSelector((state) => state.userReducer.cart);

  const product = cart.map((product) => {
    return {
      item_bought_id: Math.random().toString(36).substr(2, 9),
      product_id: product.product_id,
      variant_id: product.variant_id,
      name: product.name,
      status: product.status,
      color: product.color,
      size: product.size,
      price: product.price,
      src: product.src,
      quantity: product.quantity,
      evaluate: false,
    };
  });

  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    headers: { "x-access-token": token },
  });

  const imageList = data.map(
    (item, index) =>
      index < 3 && (
        <Image
          key={item.variant_id}
          source={{ uri: item.src }}
          style={{ width: "30%", height: 139, marginRight: 5 }}
        />
      )
  );
  const length = data.length - 3;
  const timerRef = useRef();

  function openOrder() {
    clearTimeout(timerRef.current);
  }

  const checkDiscountCode = () => {
    if (!sale_value.value) {
      setLoading(true);
      instance
        .get("/discounts/checkDiscounts/" + discountCode)
        .then(function (response) {
          setSale(response.data);
          Alert.alert("Thông báo", "Mã khuyến mại đã được áp dụng!");
        })
        .catch(function (error) {
          console.log(error.response.data);
          if (error.response.status === 409) {
            if (
              error.response.data.message ===
              "Discount Code Has Exceed The Usage Limit."
            ) {
              Alert.alert(
                "Thông báo",
                "Rất tiếc mã giảm giá bạn dùng đã hết số lượt sử dụng."
              );
            } else if (
              error.response.data.message ===
              "User Has Used Up This Discount Code."
            ) {
              Alert.alert(
                "Thông báo",
                "Bạn đã sử dụng hết lượt khuyến mại của mã giảm giá này."
              );
            } else {
              Alert.alert(
                "Thông báo",
                "Mã khuyến mại không tồn tại hoặc đã hết hạn sử dụng!"
              );
            }
          }
        })
        .then(function () {
          setLoading(false);
        });
    } else {
      setSale({ discount_id: null, value: null });
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      extraHeight={100}
    >
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
          activeOpacity={1}
        >
          <TouchableOpacity
            style={styles.modalView}
            onPress={() => {}}
            activeOpacity={1}
          >
            <LottieView
              style={{ width: 100, height: 100, marginTop: "5%" }}
              source={
                value === "cash"
                  ? require("../assets/lotties/check-mark.json")
                  : require("../assets/lotties/icon_fail.json")
              }
              loop={false}
              autoPlay
            />
            <View style={{ alignItems: "center" }}>
              <Text
                style={[
                  styles.text_normal,
                  {
                    fontWeight: "bold",
                    marginTop: 10,
                    fontFamily: "Open_Sans_Bold",
                  },
                ]}
              >
                {value === "cash"
                  ? "Đặt hàng thành công"
                  : "Đặt hàng không thành công"}
              </Text>
              <Text
                style={{
                  paddingHorizontal: "10%",
                  textAlign: "center",
                  marginBottom: "15%",
                  marginTop: 15,
                }}
              >
                {value === "cash"
                  ? "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Chúng tôi sẽ xử lý " +
                    "đơn hàng của bạn trong thời gian ngắn nhất."
                  : "Vui lòng sử dụng phương thức thanh toán khác"}
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <View style={{ flex: 1, paddingHorizontal: "4%" }}>
        <TouchableOpacity
          style={{ alignSelf: "flex-end" }}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text
            style={[
              styles.text_small,
              { alignSelf: "flex-end", paddingVertical: 10 },
            ]}
          >
            Xem tất cả
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          {imageList}
          {length > 0 && (
            <Text
              style={[
                styles.text_normal,
                {
                  textAlignVertical: "center",
                  fontWeight: "bold",
                  fontFamily: "Open_Sans_Bold",
                },
              ]}
            >
              {" "}
              +{length}
            </Text>
          )}
        </View>
        <View
          style={{
            paddingBottom: 15,
            borderColor: "#AEAEB2",
            borderBottomWidth: 0.5,
          }}
        >
          <Text
            style={[
              styles.text_normal,
              {
                marginTop: 25,
                fontWeight: "bold",
                fontFamily: "Open_Sans_Bold",
              },
            ]}
          >
            Địa chỉ nhận hàng
          </Text>
          <Text style={[styles.text_normal, { marginTop: 10 }]}>
            {item.name_receiver} - {item.phone_receiver}
          </Text>
          <Text style={[styles.text_normal, { marginTop: 1 }]}>
            {item.address_detail}
            {", "}
            {item.sub_district}
            {", "}
            {item.district}
            {", "}
            {item.city}
          </Text>
          {item.default_address && (
            <Text
              style={[styles.text_small, { color: "#0075FF", marginTop: 3 }]}
            >
              [Mặc định]
            </Text>
          )}
        </View>
        <View>
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
            Hình thức thanh toán
          </Text>

          <RadioButton.Group
            onValueChange={(newValue) => setValue(newValue)}
            value={value}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton.Android
                style={{ width: 20, height: 20 }}
                value="cash"
                color={"#000000"}
                uncheckedColor={"#000000"}
              />
              <Text style={styles.text_normal}>Thanh toán bằng tiền mặt</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton.Android
                value="momo"
                color={"#000000"}
                uncheckedColor={"#000000"}
              />
              <Text style={styles.text_normal}>Thanh toán qua ví momo</Text>
              <Image
                style={{ width: 26, height: 26, marginLeft: 5 }}
                source={require("../assets/logo_momo.png")}
              />
            </View>
          </RadioButton.Group>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={styles.sale_container}>
              <TextInput
                onChangeText={(code) => setDiscountCode(code)}
                value={discountCode}
                editable={!loading && !sale_value.value}
                placeholder="Nhập mã giảm giá"
                style={{ flex: 1 }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: "#000000",
                  justifyContent: "center",
                  width: 100,
                  paddingHorizontal: 18,
                  height: 40,
                }}
                activeOpacity={0.8}
                disabled={loading || orderLoading}
                onPress={() => checkDiscountCode()}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={"#E7F3F1"} />
                ) : (
                  <>
                    <Text style={styles.btn_sale}>
                      {sale_value.value ? "HỦY" : "ÁP DỤNG"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>

      <View style={styles.bottom_container}>
        <View style={{ marginTop: 20, flexDirection: "row" }}>
          <Text style={[styles.text_normal, { flex: 1 }]}>Tạm tính</Text>
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
        <View style={{ marginTop: 5, flexDirection: "row" }}>
          <Text style={[styles.text_normal, { flex: 1 }]}>Phí giao hàng</Text>
          <NumberFormat
            value={delivery_value}
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
        {sale_value.value > 0 && (
          <View
            style={{
              marginTop: 5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text_normal, { flex: 1 }]}>Khuyến mãi</Text>
            <NumberFormat
              value={sale_value.value}
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
          <Text
            style={[
              styles.text_normal,
              { flex: 1, fontWeight: "bold", fontFamily: "Open_Sans_Bold" },
            ]}
          >
            Thành tiền
          </Text>
          <NumberFormat
            value={total_value + delivery_value - sale_value.value}
            displayType={"text"}
            thousandSeparator={true}
            suffix={" đ"}
            renderText={(value, props) => (
              <Text
                style={[
                  styles.text_normal,
                  { fontWeight: "bold", fontFamily: "Open_Sans_Bold" },
                ]}
                {...props}
              >
                {value}
              </Text>
            )}
          />
        </View>
        <TouchableOpacity
          style={styles.button_order}
          onPress={() => {
            if (value === "cash") {
              setOrderLoading(true);
              instance
                .post("/bills/addBill", {
                  delivery_id: item.delivery_id,
                  payment_type: "Tiền mặt",
                  discount_id: sale_value.discount_id,
                  product,
                })
                .then(function (response) {
                  setModalVisible(true);
                  dispatch(clearCart());
                  timerRef.current = setTimeout(function () {
                    setModalVisible(false);
                    if (value === "cash") {
                      navigation.navigate("OrderDetails", {
                        bill: {
                          bill_id: response.data.bill_id,
                          date_created: response.data.date_created,
                          name_receiver: item.name_receiver,
                          phone_receiver: item.phone_receiver,
                          city: item.city,
                          district: item.district,
                          sub_district: item.sub_district,
                          address_detail: item.address_detail,
                          address: item.address,
                          discount_value: sale_value.value,
                          delivery_value: delivery_value,
                          total_value: total_value,
                          final_value:
                            total_value + delivery_value - sale_value.value,
                          product: response.data.product,
                          status: response.data.status,
                        },
                      });
                      openOrder();
                    }
                  }, 3500);
                })
                .catch(function (error) {
                  console.log(
                    error.response.status + " - " + error.response.message
                  );
                  if (
                    error.response.status === 400 &&
                    error.response.data.message ===
                      "Product is currently out of stock"
                  ) {
                    Alert.alert(
                      "Đặt hàng không thành công",
                      "Rất tiếc trong giỏ hàng của bạn có sản phẩm đã hết hoặc không đủ số lượng."
                    );
                  } else if (
                    error.response.status === 409 &&
                    error.response.data.message ===
                      "Discount Code Has Exceed The Usage Limit."
                  ) {
                    Alert.alert(
                      "Đặt hàng không thành công",
                      "Rất tiếc mã giảm giá bạn dùng đã hết số lượt sử dụng."
                    );
                  } else {
                    Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
                  }
                })
                .then(function () {
                  setOrderLoading(false);
                });
            } else {
              setModalVisible(true);
              timerRef.current = setTimeout(function () {
                setModalVisible(false);
              }, 3500);
            }
          }}
          activeOpacity={0.8}
          disabled={loading || orderLoading}
        >
          {orderLoading ? (
            <ActivityIndicator size="small" color={"#E7F3F1"} />
          ) : (
            <Text style={styles.text_order}>Đặt hàng</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  text_small: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 10,
    lineHeight: 15,
  },
  text_normal: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
  },
  sale_container: {
    borderColor: "#000000",
    borderWidth: 0.5,
    paddingLeft: 15,
    flexDirection: "row",
    marginTop: 20,
  },
  btn_sale: {
    color: "#ffffff",
    textAlign: "center",
  },
  bottom_container: {
    width: "100%",
    paddingHorizontal: "4%",
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
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
});

export default Payment;
