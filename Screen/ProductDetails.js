import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
  Animated,
  ActivityIndicator,
  LogBox,
  Alert,
} from "react-native";

import Carousel, {
  Pagination,
  ParallaxImage,
} from "react-native-snap-carousel";
import NumberFormat from "react-number-format";
import DropDownPicker from "react-native-dropdown-picker";
import Accordion from "react-native-collapsible/Accordion";
import { MaterialIcons } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";
import Parabolic from "react-native-parabolic";
import { useDispatch, useSelector } from "react-redux";
import { changeFav } from "../store/itemAction";
import ShoppingCartIcon from "../Component/ShoppingCartIcon";
import { showMessage } from "react-native-flash-message";
import Ripple from "react-native-material-ripple";
import LottieView from "lottie-react-native";
import moment from "moment";
import axios from "axios";
import { addUserInfo } from "../store/itemAction";

const heartOutline = require("../assets/icon_heart_outline.png");
const heartFull = require("../assets/icon_heart_full.png");
const windowWidth = Dimensions.get("screen").width;
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ProductDetails = ({ route, navigation }) => {
  const { item } = route.params;

  const dispatch = useDispatch();
  const fav_product_list = useSelector((state) => state.userReducer.favorite);
  const token = useSelector((state) => state.userReducer.token);
  const scrollViewRef = useRef();
  const parabolic = useRef();
  const add_to_cart = useRef();
  const carouselRef = useRef(null);
  const yOffset = useRef(new Animated.Value(0)).current;
  const headerOpacity = yOffset.interpolate({
    inputRange: [0, 500],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [outOfStock, setStock] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState([]);

  const [currentInfo, setCurrentInfo] = useState({
    price: item.variant[0].price,
    src: item.variant[0].src,
    color: item.variant[0].color,
  });
  const [activeSections, setActiveSections] = useState([]);
  const [sections, setSections] = useState([
    {
      title: "Chi tiết sản phẩm",
      content: item.product_detail
        ? item.product_detail
        : "Chưa có chi tiết sản phẩm",
    },
    { title: "Đánh giá", content: item.evaluate },
  ]);

  const [loading, setLoading] = useState(false);

  const [parabolicY, setParabolicY] = useState(-9999);
  const [activeSlide, setActiveSlide] = useState(0);

  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    headers: { "x-access-token": token },
  });

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Animated.View
          style={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: "white",
            ...StyleSheet.absoluteFillObject,
            opacity: headerOpacity,
            overflow: "hidden",
            elevation: 4,
          }}
        />
      ),
      headerTransparent: true,
    });
  }, [headerOpacity, navigation]);

  useEffect(() => {
    const sources = item.variant.reduce(function (result, item) {
      if (item.color === currentInfo.color) {
        result.push({
          label: item.size,
          value: item.variant_id + "." + item.size,
        });
      }
      return result;
    }, []);
    setItems(sources);
  }, [currentInfo]);

  useEffect(() => {
    setStock(false);
    if (value) {
      let index = value.indexOf(".");
      let v_id = value.substring(0, index);
      let currentItem = item.variant.find((item) => item.variant_id === v_id);
      if (currentItem) {
        if (currentItem.stock === 0) {
          setStock(true);
        }
      }
    }
  }, [value]);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    instance
      .post(
        "/products/getRelatedProducts",
        {
          collection_id: item.collection_id,
          type: item.type,
          product_id: item.product_id,
        },
        { signal: controller.signal }
      )
      .then(function (response) {
        setRelatedProduct(response.data);
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
    return () => {
      controller.abort();
    };
  }, [item]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <ShoppingCartIcon />
        </View>
      ),
    });
  }, [navigation]);

  const result = item.variant.reduce((unique, o) => {
    if (!unique.some((obj) => obj.color === o.color)) {
      unique.push(o);
    }
    return unique;
  }, []);

  const listColors = result.map((items, index) => (
    <View
      style={[
        styles.option_container,
        { borderColor: currentInfo.color === items.color ? "black" : "white" },
      ]}
      key={index}
    >
      <TouchableOpacity
        style={[styles.color, { backgroundColor: items.rgb }]}
        onPress={() => {
          setValue("");
          setCurrentInfo({
            price: items.price,
            src: items.src,
            color: items.color,
          });
          goToSlide(index);
        }}
        activeOpacity={0.75}
      />
    </View>
  ));

  const averageRate =
    item.evaluate.reduce((total, next) => total + next.rate, 0) /
    item.evaluate.length;

  const goToSlide = (index) => {
    carouselRef.current.snapToItem(index, true, true);
  };

  const renderItemC = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{ uri: item.src }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        addOrRemoveFav={() => {
          instance
            .get("/users/addFavorite/" + item.product_id)
            .then(function (response) {})
            .catch(function (error) {
              Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
              console.log(error);
            });
          dispatch(changeFav(item.product_id));
        }}
        favorite={fav_product_list}
        onPress={() => navigation.push("ProductDetails", { item: item })}
      />
    );
  };

  const renderHeader = (section) => {
    return (
      <View style={styles.header}>
        <Text style={styles.text_name}>{section.title}</Text>
        {activeSections.includes(section.title) ? (
          <MaterialIcons name="keyboard-arrow-up" size={24} color="#2C2C2E" />
        ) : (
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color="#2C2C2E"
            style={styles.icon_down}
          />
        )}
      </View>
    );
  };

  const renderContent = (section) => {
    if (section.title === "Chi tiết sản phẩm") {
      return (
        <View style={styles.content}>
          <Text>{section.content}</Text>
        </View>
      );
    } else {
      return (
        <View>
          {section.content.length > 0 ? (
            <FlatList
              style={{ marginBottom: 10 }}
              data={section.content}
              renderItem={({ item, index }) => (
                <View style={{ marginVertical: 10 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.text_username}>{item.name}</Text>
                    <Text style={styles.text_date}>
                      {moment(item.date_created).format("DD/MM/YYYY")}
                    </Text>
                  </View>
                  <Rating
                    style={{ marginTop: 3, alignSelf: "flex-start" }}
                    imageSize={10}
                    startingValue={item.rate}
                    readonly={true}
                  />
                  <Text style={{ marginTop: 5 }}>{item.note}</Text>
                </View>
              )}
              keyExtractor={(item) => item.evaluate_id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={{ paddingBottom: 20 }}>
              Sản phẩm chưa có đánh giá nào
            </Text>
          )}
        </View>
      );
    }
  };

  const updateSection = (section) => {
    setActiveSections(section);
  };

  function addProductToCart(gotoCart) {
    if (token === "1") {
      dispatch(addUserInfo({ token: null }));
      return;
    }
    if (currentInfo.color === "") {
      showMessage({
        message: "Bạn chưa chọn màu!",
        description: "Vui lòng chọn màu sắc sản phẩm!",
        type: "warning",
        icon: { icon: "auto", position: "left" },
        backgroundColor: "#454545D9",
      });
      return;
    }
    if (value === "") {
      showMessage({
        message: "Bạn chưa chọn size!",
        description: "Vui lòng chọn size sản phẩm!",
        type: "warning",
        icon: { icon: "auto", position: "left" },
        backgroundColor: "#454545D9",
      });
      return;
    }
    add_to_cart.current.measure((a, b, width, height, px, py) => {
      setParabolicY(713);
      parabolic.current.run([140, 713, windowWidth - 52, 52 + 713 - py]);
    });

    let index = value.indexOf(".");
    let v_id = value.substring(0, index);

    instance
      .post("/users/addItemToCart", { variant_id: v_id, quantity: 1 })
      .then(function (response) {
        dispatch(addUserInfo(response.data));
      })
      .catch(function (error) {
        Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
        console.log(error);
      });

    if (gotoCart) {
      navigation.navigate("Cart");
    }
  }

  const changeFavorite = () => {
    if (token === "1") {
      dispatch(addUserInfo({ token: null }));
      return;
    }
    instance
      .get("/users/addFavorite/" + item.product_id)
      .then(function (response) {})
      .catch(function (error) {
        Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
        console.log(error);
      });
    dispatch(changeFav(item.product_id));
  };

  const Item = ({ item, addOrRemoveFav, favorite, onPress }) => {
    const fav = favorite.includes(item.product_id);
    const animationProgress = useRef(new Animated.Value(fav ? 1 : 0)).current;

    const changeFavorite = () => {
      if (token === "1") {
        dispatch(addUserInfo({ token: null }));
        return;
      }
      animationProgress.setValue(0.15);
      if (!fav) {
        Animated.timing(animationProgress, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            addOrRemoveFav();
          }
        });
      } else {
        animationProgress.setValue(0);
        addOrRemoveFav();
      }
    };

    return (
      <TouchableOpacity
        style={{ marginRight: 5, marginBottom: 15, width: 170 }}
        onPress={onPress}
      >
        <View>
          <ImageBackground style={styles.image_fav} source={{ uri: item.src }}>
            <TouchableOpacity onPress={changeFavorite}>
              <LottieView
                style={styles.iconFav_sub}
                source={require("../assets/lotties/heart_animation_4.json")}
                autoPlay={false}
                loop={false}
                progress={animationProgress}
              />
            </TouchableOpacity>
          </ImageBackground>

          <Text style={styles.text_sub_status}>{item.status}</Text>
          <Text style={styles.text_sub_name} numberOfLines={1}>
            {item.name}
          </Text>

          <NumberFormat
            value={item.old_price}
            displayType={"text"}
            thousandSeparator={true}
            suffix={" đ"}
            renderText={(value, props) => (
              <Text style={styles.text_sub_old_price} {...props}>
                {value}
              </Text>
            )}
          />

          <NumberFormat
            value={item.price}
            displayType={"text"}
            thousandSeparator={true}
            suffix={" đ"}
            renderText={(value, props) => (
              <Text style={styles.text_sub_price} {...props}>
                {value}
              </Text>
            )}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      automaticallyAdjustContentInsets
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: yOffset } } }],
        { useNativeDriver: true }
      )}
      vertical
    >
      <View style={styles.container}>
        <View>
          <Carousel
            ref={carouselRef}
            sliderWidth={screenWidth}
            sliderHeight={(screenHeight * 75) / 100}
            itemWidth={screenWidth}
            data={result}
            renderItem={renderItemC}
            hasParallaxImages={true}
            inactiveSlideScale={1}
            onSnapToItem={(index) => setActiveSlide(index)}
            enableMomentum={true}
            decelerationRate={"fast"}
            disableIntervalMomentum={true}
          />
          <Pagination
            dotsLength={result.length}
            activeDotIndex={activeSlide}
            containerStyle={{
              backgroundColor: "transparent",
              position: "absolute",
              bottom: 0,
              left: "30%",
              alignSelf: "center",
              width: "40%",
              paddingVertical: 15,
            }}
            dotStyle={{
              width: 16,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#AEAEB2",
            }}
            inactiveDotStyle={{
              width: 8,
              backgroundColor: "#ffffff",
            }}
            inactiveDotOpacity={1}
            inactiveDotScale={0.8}
          />
          <TouchableOpacity
            style={{ position: "absolute", right: "4%", bottom: 15 }}
            onPress={() => changeFavorite()}
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
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
          <View style={{ width: "70%" }}>
            <Text style={styles.text_status}>{item.status}</Text>
            <Text style={styles.text_name}>{item.name}</Text>
          </View>
          <View style={{ justifyContent: "flex-end", flex: 1 }}>
            <NumberFormat
              value={item.old_price}
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
              value={currentInfo.price}
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
        <View
          style={{
            paddingHorizontal: "4%",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          {averageRate ? (
            <>
              <Rating
                imageSize={12}
                startingValue={averageRate}
                readonly={true}
              />
              <Text style={{ marginLeft: 3, fontSize: 10, color: "gray" }}>
                {"(" + averageRate.toFixed(1) + "/5)"}
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 11, color: "gray" }}>
              Chưa có đánh giá
            </Text>
          )}
        </View>
        <View
          style={[
            {
              flexDirection: "row",
              marginTop: 10,
              marginHorizontal: 15,
            },
            Platform.OS !== "android" && { zIndex: 3000 },
          ]}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>{listColors}</View>
          <View style={{ width: "25%" }}>
            <DropDownPicker
              style={{ width: "100%", height: 35 }}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Size"
              listMode="SCROLLVIEW"
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
        </View>
        {!outOfStock && (
          <TouchableOpacity
            style={styles.add_to_cart}
            ref={add_to_cart}
            onPress={() => {
              addProductToCart(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.text_add_to_cart}>THÊM VÀO GIỎ HÀNG</Text>
          </TouchableOpacity>
        )}
        <Ripple
          style={styles.button_buy}
          disabled={outOfStock}
          onPress={() => {
            addProductToCart(true);
          }}
          rippleColor={"#ffffff"}
          rippleOpacity={0.4}
          rippleDuration={600}
        >
          <Text style={styles.text_buy}>
            {outOfStock ? "HẾT HÀNG" : "Mua Ngay"}
          </Text>
        </Ripple>
        <View
          style={{
            marginHorizontal: "4%",
            marginVertical: 25,
            borderBottomWidth: 0.5,
          }}
        >
          <Accordion
            sections={sections}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={updateSection}
            underlayColor={"transparent"}
            expandMultiple={true}
            renderAsFlatList={false}
            keyExtractor={(item) => item.title}
          />
        </View>
        <View style={{ marginLeft: "4%" }}>
          <Text style={[styles.headerText, { fontSize: 16, marginBottom: 15 }]}>
            Có thể bạn muốn mua
          </Text>
          {loading ? (
            <View
              style={{
                height: 280,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#000000" />
            </View>
          ) : (
            <>
              {relatedProduct.length === 0 ? (
                <View
                  style={{
                    height: 180,
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <Text style={{ textAlign: "center", color: "gray" }}>
                    Không tìm thấy sản phẩm nào tương tự
                  </Text>
                </View>
              ) : (
                <FlatList
                  horizontal
                  data={relatedProduct}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.product_id}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </>
          )}
        </View>
        <Parabolic
          ref={parabolic}
          style={[styles.tmpBtn, { top: parabolicY }]}
          renderChildren={() => {
            return (
              <View style={{ position: "absolute", zIndex: 10, elevation: 10 }}>
                <Image
                  source={{ uri: currentInfo.src }}
                  style={{ width: 35, height: 60, opacity: 0.8 }}
                />
              </View>
            );
          }}
          duration={1000}
          curvature={0.0}
          animateEnd={() => {
            setParabolicY(-9999);
          }}
        />
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  customImage: {
    flex: 1,
    resizeMode: "contain",
  },
  button: {
    width: 15,
    height: 15,
    opacity: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSelected: {
    borderRadius: 5,
    width: 10,
    height: 5,
    backgroundColor: "#AEAEB2",
  },
  buttonUnselected: {
    borderRadius: 5,
    width: 5,
    height: 5,
    backgroundColor: "#ffffff",
  },
  iconFav: {
    width: 20,
    height: 18,
  },
  text_status: {
    marginTop: 7,
    fontStyle: "normal",
    fontWeight: "bold",
    fontFamily: "Open_Sans_Bold",
    fontSize: 10,
    lineHeight: 15,
  },
  text_name: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
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
  color: {
    width: 30,
    height: 30,
  },
  button_buy: {
    width: "92%",
    height: 42,
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "4%",
    marginTop: 15,
  },
  text_buy: {
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  add_to_cart: {
    width: "92%",
    height: 42,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "4%",
    marginTop: 15,
    borderWidth: 0.5,
    borderColor: "#1C1C1E",
  },
  text_add_to_cart: {
    color: "#1C1C1E",
    textTransform: "uppercase",
  },
  header: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
  },
  headerText: {
    fontFamily: "Open_Sans_Bold",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  image_fav: {
    width: 170,
    height: 273,
    resizeMode: "contain",
  },
  text_sub_status: {
    marginTop: 7,
    fontFamily: "Open_Sans_Bold",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 10,
    lineHeight: 15,
  },
  text_sub_name: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
    width: "100%",
  },
  text_sub_old_price: {
    marginTop: 1,
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 10,
    lineHeight: 15,
    textDecorationLine: "line-through",
  },
  text_sub_price: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
  },
  iconFav_sub: {
    alignSelf: "flex-end",
    width: 45,
    height: 45,
  },
  text_date: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 10,
    lineHeight: 15,
    alignSelf: "flex-end",
  },
  text_username: {
    fontFamily: "Open_Sans_Bold",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  option_container: {
    padding: 2,
    borderWidth: 0.25,
    marginRight: 5,
  },
  tmpBtn: {
    backgroundColor: "transparent",
    position: "absolute",
    left: 140,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  icon_cart: {
    width: 30,
    height: 30,
  },
  item: {
    width: screenWidth,
    height: (screenHeight * 75) / 100,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
});

export default ProductDetails;
