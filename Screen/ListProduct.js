import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { changeFav } from "../store/itemAction";
import axios from "axios";
import { addUserInfo } from "../store/itemAction";

const heartOutline = require("../assets/icon_heart_outline.png");
const heartFull = require("../assets/icon_heart_full.png");

const ListProduct = ({ route, navigation }) => {
  const { collection_id, type, gender, low, high, size } = route.params ?? {};
  const [loading, setLoading] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const token = useSelector((state) => state.userReducer.token);

  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    headers: { "x-access-token": token },
  });

  //Call api lấy ds sản phẩm (dựa vào collection_id || type, gender + low, high, size từ bộ lọc (nếu có))
  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    if (collection_id) {
      instance
        .get(
          `products/getProducts/${collection_id}${low ? "&" + low : "&0"}${
            high ? "&" + high : "&100000000"
          }${size ? "&" + size : "&null"}`,
          { signal: controller.signal }
        )
        .then(function (response) {
          setListProduct(response.data);
        })
        .catch(function (error) {
          if (!axios.isCancel(error)) {
            Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
            console.log(error);
          }
        })
        .then(function () {
          setLoading(false);
        });
    } else {
      instance
        .get(
          `products/getProducts/${gender}&${type}&${low ? low : "0"}&${
            high ? high : "100000000"
          }&${size ? size : "null"}`,
          { signal: controller.signal }
        )
        .then(function (response) {
          setListProduct(response.data);
        })
        .catch(function (error) {
          if (!axios.isCancel(error)) {
            Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
            console.log(error);
          }
        })
        .then(function () {
          setLoading(false);
        });
    }
    return () => {
      controller.abort();
    };
  }, [collection_id, gender, type, low, high, size]);

  const [selectedView, setSelectedView] = useState("grid");

  // Xử lý khi bấm button đổi kiểu hiển thị
  function selectView() {
    if (selectedView === "grid") {
      setSelectedView("list");
    } else {
      setSelectedView("grid");
    }
  }

  //Giao diện item
  const Item = ({ item }) => {
    const fav_product_list = useSelector((state) => state.userReducer.favorite);
    const dispatch = useDispatch();

    return (
      <TouchableOpacity
        style={selectedView === "grid" ? styles.grid : styles.single}
        onPress={() => navigation.navigate("ProductDetails", { item: item })}
        activeOpacity={1}
      >
        <View style={styles.item}>
          <ImageBackground
            style={
              selectedView === "grid" ? styles.image_grid : styles.image_single
            }
            source={{ uri: item.src }}
          >
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                if (token === "1") {
                  dispatch(addUserInfo({ token: null }));
                  return;
                }
                //Call api favorite và đổi fav local app (chạy song song)
                instance
                  .get("/users/addFavorite/" + item.product_id)
                  .then(function (response) {})
                  .catch(function (error) {
                    Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
                    console.log(error);
                  });

                dispatch(changeFav(item.product_id));
              }}
            >
              <Image
                source={
                  fav_product_list.indexOf(item.product_id) > -1
                    ? heartFull
                    : heartOutline
                }
                style={styles.iconFav}
              />
            </TouchableOpacity>
          </ImageBackground>
          {selectedView === "grid" ? (
            <View>
              <Text style={styles.text_status}>{item.status}</Text>
              <Text style={styles.text_name}>{item.name}</Text>

              <NumberFormat
                value={item.old_price}
                className="foo"
                displayType={"text"}
                thousandSeparator={true}
                suffix={" đ"}
                renderText={(value, props) => (
                  <Text style={styles.text_old_price} {...props}>
                    {value}
                  </Text>
                )}
              />

              <NumberFormat
                value={item.price}
                className="foo"
                displayType={"text"}
                thousandSeparator={true}
                suffix={" đ"}
                renderText={(value, props) => (
                  <Text style={styles.text_price} {...props}>
                    {value}
                  </Text>
                )}
              />
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text style={styles.text_status}>{item.status}</Text>
                <Text style={styles.text_name}>{item.name}</Text>
              </View>
              <View style={{ justifyContent: "flex-end", flex: 1 }}>
                <NumberFormat
                  value={item.old_price}
                  className="foo"
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={" đ"}
                  renderText={(value, props) => (
                    <Text
                      style={[styles.text_old_price, { alignSelf: "flex-end" }]}
                      {...props}
                    >
                      {value}
                    </Text>
                  )}
                />

                <NumberFormat
                  value={item.price}
                  className="foo"
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={" đ"}
                  renderText={(value, props) => (
                    <Text
                      style={[styles.text_price, { alignSelf: "flex-end" }]}
                      {...props}
                    >
                      {value}
                    </Text>
                  )}
                />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  //Viết dài
  const renderItem = ({ item }) => {
    return <Item item={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.custom_bar}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            hitSlop={{ top: 15, left: 15, right: 15, bottom: 15 }}
            onPress={() =>
              navigation.navigate("FilterMenu", { size, low, high })
            }
            activeOpacity={1}
          >
            <Text style={styles.btn_filter}>
              Bộ lọc
              {size ? ` ( size ${size} )` : ""}
            </Text>
            {low && (
              <NumberFormat
                value={low}
                displayType={"text"}
                thousandSeparator={true}
                prefix={" ( từ "}
                suffix={"đ đến "}
                renderText={(value, props) => (
                  <Text style={styles.btn_filter} {...props}>
                    {value}
                  </Text>
                )}
              />
            )}
            {high && (
              <NumberFormat
                value={high}
                displayType={"text"}
                thousandSeparator={true}
                suffix={"đ )"}
                renderText={(value, props) => (
                  <Text style={styles.btn_filter} {...props}>
                    {value}
                  </Text>
                )}
              />
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            flex: 0.5,
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity onPress={() => selectView()}>
            <Image
              style={[
                styles.icon_grid,
                { tintColor: selectedView === "grid" ? "#000000" : "#AEAEB2" },
              ]}
              source={require("../assets/icon_grid.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectView()}>
            <Image
              style={[
                styles.icon_square,
                { tintColor: selectedView === "list" ? "#000000" : "#AEAEB2" },
              ]}
              source={require("../assets/icon_square.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.container, { paddingHorizontal: "4%" }]}>
        {loading ? (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : (
          <>
            {listProduct.length === 0 ? (
              <Text
                style={{
                  fontSize: 18,
                  color: "#a3a3a0",
                  textAlign: "center",
                }}
              >
                Không tìm thấy sản phẩm nào
              </Text>
            ) : (
              <>
                {selectedView === "grid" ? (
                  <FlatList
                    style={{ flex: 1, marginTop: 0 }}
                    data={listProduct}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.product_id}
                    numColumns={2}
                    key={1}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                  />
                ) : (
                  <FlatList
                    style={{ flex: 1, marginTop: 0 }}
                    data={listProduct}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.product_id}
                    numColumns={1}
                    key={0}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  grid: {
    width: "48%",
    marginTop: 15,
  },
  single: {
    width: "100%",
    marginVertical: 15,
  },
  image_grid: {
    width: "100%",
    height: 273,
  },
  image_single: {
    width: "100%",
    height: 482,
  },
  text_status: {
    marginTop: 7,
    fontFamily: "Open_Sans_Bold",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 10,
    lineHeight: 15,
    textTransform: "uppercase",
  },
  text_name: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
  },
  text_old_price: {
    marginTop: 1,
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 10,
    lineHeight: 15,
    textDecorationLine: "line-through",
  },
  text_price: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
  },
  btn: {},
  iconFav: {
    width: 20,
    height: 18,
    alignSelf: "flex-end",
    marginTop: 10,
    marginRight: 10,
  },
  custom_bar: {
    height: "8%",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#ffffff",
    paddingHorizontal: "4%",
  },
  btn_filter: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 10,
    lineHeight: 15,
  },
  icon_grid: {
    alignSelf: "flex-end",
    width: 17,
    height: 17,
    marginRight: 10,
  },
  icon_square: {
    alignSelf: "flex-end",
    width: 17,
    height: 17,
  },
});
export default ListProduct;
