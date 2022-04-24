import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
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
import { changeFav, addUserInfo } from "../store/itemAction";
import axios from "axios";

const heartOutline = require("../assets/icon_heart_outline.png");
const heartFull = require("../assets/icon_heart_full.png");

//Giao diện item
const Item = ({ item, addOrRemoveFav, favorite, onPress }) => {
  return (
    <TouchableOpacity
      style={{ marginTop: 15, width: "48%" }}
      onPress={onPress}
      activeOpacity={1}
    >
      <View style={styles.item}>
        <ImageBackground style={styles.image_fav} source={{ uri: item.src }}>
          <TouchableOpacity style={styles.btn} onPress={addOrRemoveFav}>
            <Image
              source={
                favorite.indexOf(item.product_id) > -1
                  ? heartFull
                  : heartOutline
              }
              style={styles.iconFav}
            />
          </TouchableOpacity>
        </ImageBackground>

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
    </TouchableOpacity>
  );
};

const Favorite = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const fav_product_list = useSelector((state) => state.userReducer.favorite);
  const token = useSelector((state) => state.userReducer.token);
  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    headers: { "x-access-token": token },
  });

  //Call api danh sách sp yêu thích
  useEffect(() => {
    const controller = new AbortController();
    if (token !== "1" && token !== null) {
      setLoading(true);
      instance
        .post(
          "products/getFavoriteProducts",
          { product_ids: fav_product_list },
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
  }, [isFocused]);

  //Giao diện item
  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        addOrRemoveFav={() => {
          instance
            .get("/users/addFavorite/" + item.product_id)
            .then(function (response) {})
            .catch(function (error) {
              console.log(error);
              Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
            });

          dispatch(changeFav(item.product_id));
        }}
        favorite={fav_product_list}
        onPress={() => navigation.navigate("ProductDetails", { item: item })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {token === "1" || !token ? (
        <>
          <Text style={{ textAlign: "center" }}>
            Vui lòng{" "}
            <Text
              style={{
                fontFamily: "Open_Sans_Bold",
                fontWeight: "bold",
                textDecorationLine: "underline",
                fontSize: 16,
              }}
              onPress={() => {
                dispatch(addUserInfo({ token: null }));
              }}
            >
              Đăng nhập
            </Text>{" "}
            để hiển thị danh sách sản phẩm
          </Text>
        </>
      ) : (
        <>
          {loading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
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
                <FlatList
                  style={{ flex: 1, paddingHorizontal: "4%" }}
                  data={listProduct}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.product_id}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                />
              )}
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  item: {},
  image_fav: {
    width: "100%",
    height: 273,
    resizeMode: "center",
  },
  text_status: {
    marginTop: 7,
    fontFamily: "Open_Sans_Bold",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 10,
    lineHeight: 15,
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
  iconFav: {
    width: 20,
    height: 18,
    alignSelf: "flex-end",
    marginTop: 10,
    marginRight: 10,
  },
});

export default Favorite;
