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
import { addItem, changeFav } from "../store/itemAction";
import ShoppingCartIcon from "../Component/ShoppingCartIcon";
import { showMessage } from "react-native-flash-message";
import { DATA_PRODUCT } from "../api/constants";
import Ripple from "react-native-material-ripple";
import LottieView from "lottie-react-native";

const heartOutline = require("../assets/icon_heart_outline.png");
const heartFull = require("../assets/icon_heart_full.png");
const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Item = ({ item, addOrRemoveFav, favorite, onPress }) => {
  const heartAnimation = useRef(null);
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      if (favorite.indexOf(item) > -1) {
        heartAnimation.current.play(12, 12);
      } else {
        heartAnimation.current.play(1, 1);
      }
      isFirstRun.current = false;
    } else if (favorite.indexOf(item) > -1) {
      heartAnimation.current.play(2, 12);
    } else {
      heartAnimation.current.play(1, 1);
    }
  }, [favorite]);
  return (
    <TouchableOpacity
      style={{ marginRight: 5, marginBottom: 15, width: 170 }}
      onPress={onPress}
    >
      <View>
        <ImageBackground style={styles.image_fav} source={item.src}>
          <TouchableOpacity onPress={addOrRemoveFav}>
            <LottieView
              ref={heartAnimation}
              style={styles.iconFav_sub}
              source={require("../assets/lotties/heart_animation_4.json")}
              autoPlay={false}
              loop={false}
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

const ProductDetails = ({ route, navigation }) => {
  const { item } = route.params;

  const dispatch = useDispatch();
  const fav_product_list = useSelector((state) => state.favReducer.data);

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
  const [items, setItems] = useState([
    { label: "S", value: "S" },
    { label: "M", value: "M" },
    { label: "L", value: "L" },
    { label: "XL", value: "XL" },
    { label: "XXL", value: "XXL" },
  ]);

  const [currentInfo, setCurrentInfo] = useState({
    price: item.variant[0].price,
    src: item.variant[0].src,
    color: item.variant[0].color,
  });
  const [activeSections, setActiveSections] = useState([]);

  const [parabolicY, setParabolicY] = useState(-9999);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      // headerStyle: {
      //     // opacity: headerOpacity,
      //     backgroundColor: "green",
      // },
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
        result.push({ label: item.size, value: item.v_id + "." + item.size });
      }
      return result;
    }, []);
    setItems(sources);
  }, [currentInfo]);

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

  const goToSlide = (index) => {
    carouselRef.current.snapToItem(index, true, true);
  };

  const renderItemC = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={item.src}
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
        addOrRemoveFav={() => dispatch(changeFav(item, item.id))}
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
          <FlatList
            style={{ marginBottom: 10 }}
            data={section.content}
            renderItem={({ item, index }) => (
              <View style={{ marginVertical: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.text_username}>{item.username}</Text>
                  <Text style={styles.text_date}>{item.date}</Text>
                </View>
                <Rating
                  style={{ marginTop: 3, alignSelf: "flex-start" }}
                  imageSize={10}
                  startingValue={5}
                  readonly={true}
                />
                <Text style={{ marginTop: 5 }}>{item.comment}</Text>
              </View>
            )}
            keyExtractor={(item) => item.username}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    }
  };

  const updateSection = (section) => {
    setActiveSections(section);
  };

  function addProductToCart(gotoCart) {
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
    let size = value.substring(index + 1);

    dispatch(
      addItem({
        key: Math.random().toString(36).substr(2, 9),
        v_id: v_id,
        id: item.id,
        name: item.name,
        src: currentInfo.src,
        status: item.status,
        old_price: item.old_price,
        price: currentInfo.price,
        variant: item.variant,
        color: currentInfo.color,
        size: size,
        quantity: 1,
      })
    );
    if (gotoCart) {
      navigation.navigate("Cart");
    }
  }

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      // onMomentumScrollEnd={(event) => setCurrentY(event.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
      automaticallyAdjustContentInsets
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: yOffset } } }],
        { useNativeDriver: true }
      )}
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
            onPress={() => dispatch(changeFav(item, item.id))}
          >
            <Image
              source={
                fav_product_list.indexOf(item) > -1 ? heartFull : heartOutline
              }
              style={styles.iconFav}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
          <View>
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
        <View style={{ paddingHorizontal: "4%" }}>
          <Rating
            style={{ marginTop: 5, alignSelf: "flex-start" }}
            imageSize={12}
            startingValue={4}
            readonly={true}
          />
        </View>
        <View
          style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 15 }}
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
            />
          </View>
        </View>
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
        <Ripple
          style={styles.button_buy}
          onPress={() => {
            addProductToCart(true);
          }}
          rippleColor={"#ffffff"}
          rippleOpacity={0.4}
          rippleDuration={600}
        >
          <Text style={styles.text_buy}>Mua Ngay</Text>
        </Ripple>
        <View
          // onLayout={(event) => {
          //     const {x, y, width, height} = event.nativeEvent.layout;
          //     setDimensions({x: width, y: height})
          // }}
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
            renderAsFlatList={true}
            keyExtractor={(item) => item.title}
          />
        </View>
        <View style={{ marginLeft: "4%" }}>
          <Text style={[styles.headerText, { fontSize: 16, marginBottom: 15 }]}>
            Có thể bạn muốn mua
          </Text>
          <FlatList
            horizontal
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <Parabolic
          ref={parabolic}
          style={[styles.tmpBtn, { top: parabolicY }]}
          renderChildren={() => {
            return (
              <View style={{ position: "absolute", zIndex: 10, elevation: 10 }}>
                <Image
                  source={currentInfo.src}
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
  customSlide: {},
  customImage: {
    flex: 1,
    resizeMode: "contain",
  },
  buttons: {
    zIndex: 1,
    height: 15,
    marginTop: "-5%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    zIndex: 1,
    height: 15,
    marginTop: "-5%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "flex-end",
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
    fontFamily: "Open_Sans",
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
    fontFamily: "Open_Sans",
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
    fontFamily: "Open_Sans",
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

const data = DATA_PRODUCT;

const sections = [
  {
    title: "Chi tiết sản phẩm",
    content:
      "- Áo sơ mi dài tay kiểu dáng Slim Fit ôm gọn gàng cơ thể và tôn dáng người mặc.\n" +
      "\n" +
      "- Thiết kế cơ bản với cổ đứng gọn gàng. Kết hợp tà lượn thời trang giúp áo dễ dàng kết hợp với " +
      "nhiều loại trang phục khác nhau." +
      "- Kết hợp sợi Polyspun giúp áo giữ phom dáng tốt, hạn chế nhăn co, dễ chăm sóc và bền màu sau " +
      "thời gian dài sử dụng kết hợp chất liệu cotton hút ẩm, thấm mồ hôi dễ giặt ủi.",
  },
  {
    title: "Đánh giá",
    content: [
      {
        username: "HieuofHell",
        date: "22/1/2020",
        comment:
          "Sản phẩm rất tọet vời. Tôi sẽ ủng hộ shop nhiều hơn" +
          " nữa trong thời gian tới",
      },
      {
        username: "Na Phan",
        date: "30/5/2021",
        comment: "Shop đóng gói cẩn thận, giao hàng nhanh, hàng y hình nha",
      },
      {
        username: "kimminh7797",
        date: "12/1/2021",
        comment: "Giao hàng chất lượng shop đóng gói khá kĩ ",
      },
      {
        username: "habeee96",
        date: "09/4/2021",
        comment: "Mới nhận, chưa biết dùng thế nào.",
      },
      {
        username: "manhmyh",
        date: "31/12/2020",
        comment: "Chất lượng sản phẩm tuyệt vời, đóng gói sản phẩm tốt",
      },
    ],
  },
];

export default ProductDetails;
