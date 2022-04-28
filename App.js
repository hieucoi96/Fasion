import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  FlatList,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FlashMessage from "react-native-flash-message";
import { useSelector } from "react-redux";
import axios from "axios";
import * as Device from "expo-device";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Reanimated 2"]);

import Login from "./Screen/Login";
import Register from "./Screen/Register";
import ChangePassword from "./Screen/ChangePassword";

import Home from "./Screen/Home";
import Favorite from "./Screen/Favorite";
import Personal from "./Screen/Personal";

import Male from "./Screen/Male";
import Female from "./Screen/Female";

import ListProduct from "./Screen/ListProduct";
import FilterMenu from "./Screen/FilterMenu";

import MyOrder from "./Screen/MyOrder";
import FAQS from "./Screen/FAQS";
import Notification from "./Screen/Notification";
import ChangeInfo from "./Screen/ChangeInfo";
import SelectAddress from "./Screen/SelectAddress";
import ProductDetails from "./Screen/ProductDetails";
import Cart from "./Screen/Cart";
import Delivery from "./Screen/Delivery";
import AddAddress from "./Screen/AddAddress";
import Payment from "./Screen/Payment";
import OrderDetails from "./Screen/OrderDetails";
import Review from "./Screen/Review";
import SplashScreen from "./Screen/SplashScreen";

import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import ShoppingCartIcon from "./Component/ShoppingCartIcon";
import BackButton from "./Component/BackButton";
import { useNavigation } from "@react-navigation/native";
import { PersistGate } from "redux-persist/integration/react";
import { useFonts } from "expo-font";

import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();
const TabHome = createBottomTabNavigator();
const TabGender = createMaterialTopTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "fasions.";

  switch (routeName) {
    case "Home":
      return "fasions.";
    case "Search":
      return null;
    case "Favorite":
      return "Yêu Thích";
    case "Personal":
      return null;
  }
}

function enableHeader(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "fasions.";

  return !(routeName === "Search" || routeName === "Personal");
}

function PersonalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackImage: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name={"Personal"}
        component={Personal}
        options={({ route, navigation }) => ({
          title: "Cá Nhân",
          headerTitleAlign: "center",
          headerLeft: () => null,
          headerRight: () => <ShoppingCartIcon />,
        })}
      />
      <Stack.Screen
        name={"Notification"}
        component={Notification}
        options={({ route, navigation }) => ({
          title: "Thông Báo",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={() => navigation.goBack()}
              activeOpacity={1}
            >
              <Image
                source={require("./assets/icon_chevron.png")}
                style={styles.icon_back}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name={"MyOrder"}
        component={MyOrder}
        options={({ route, navigation }) => ({
          title: "Đơn hàng của bạn",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={() => navigation.navigate("Personal")}
              activeOpacity={1}
            >
              <Image
                source={require("./assets/icon_chevron.png")}
                style={styles.icon_back}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name={"FAQS"}
        component={FAQS}
        options={({ route, navigation }) => ({
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={() => navigation.goBack()}
              activeOpacity={1}
            >
              <Image
                source={require("./assets/icon_chevron.png")}
                style={styles.icon_back}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name={"ChangeInfo"}
        component={ChangeInfo}
        options={({ route, navigation }) => ({
          title: "Thay đổi thông tin",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={() => navigation.goBack()}
              activeOpacity={1}
            >
              <Image
                source={require("./assets/icon_chevron.png")}
                style={styles.icon_back}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function GenderStack() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const timerRef = useRef();
  const token = useSelector((state) => state.userReducer.token);
  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    headers: { "x-access-token": token },
  });

  useEffect(() => {
    setLoading(true);
    timerRef.current = setTimeout(() => {
      if (searchText) {
        instance
          .post("/products/searchProducts/" + searchText)
          .then(function (response) {
            setData(response.data);
          })
          .catch(function (error) {
            Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
          })
          .then(function () {
            setLoading(false);
          });
      }
    }, 1000);
  }, [searchText]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={styles.search_container}>
        <AntDesign
          style={styles.search_icon}
          name="search1"
          size={24}
          color="#AEAEB2"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            clearTimeout(timerRef.current);
            setSearchText(text);
          }}
          value={searchText}
          placeholder="Tìm kiếm sản phẩm"
          placeholderTextColor="#AEAEB2"
        />
      </View>
      {searchText ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#8F9190",
            borderTopWidth: 0,
            marginHorizontal: 8,
          }}
        >
          {loading ? (
            <View style={{ height: 55, justifyContent: "center" }}>
              <ActivityIndicator size="small" color={"#000000"} />
            </View>
          ) : (
            <>
              {data.length > 0 ? (
                <FlatList
                  style={{}}
                  data={data}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={{
                        marginHorizontal: 4,
                        borderBottomWidth: 0.5,
                        borderColor: "#DADADA",
                        paddingHorizontal: 6,
                      }}
                      onPress={() =>
                        navigation.navigate("ProductDetails", { item: item })
                      }
                      activeOpacity={0.8}
                    >
                      <Text style={{ lineHeight: 55 }} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.product_id}
                  numColumns={1}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View
                  style={{
                    height: 55,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#8F9190" }}>
                    Không tìm thấy sản phẩm nào
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      ) : (
        <TabGender.Navigator
          tabBarOptions={{
            indicatorStyle: {
              // borderBottomColor: 'red',
              borderBottomWidth: 2,
              borderColor: "#000000",
            },
            labelStyle: {
              fontSize: 14,
              fontWeight: "bold",
            },
            // activeTintColor: "red",
            // inactiveTintColor: "lightgray",
          }}
        >
          <TabGender.Screen name="Nữ" component={Female} />
          <TabGender.Screen name="Nam" component={Male} />
        </TabGender.Navigator>
      )}
    </SafeAreaView>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackImage: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name={"GenderStack"}
        component={GenderStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={"ListProduct"}
        component={ListProduct}
        options={({ route, navigation }) => ({
          headerTitleAlign: "center",
          title: route.params.name,
          headerStyle: {
            shadowColor: "transparent",
            elevation: 0,
          },
          headerRight: () => <ShoppingCartIcon />,
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={() =>
                route.params.prevScreen === "Home"
                  ? navigation.navigate("Home")
                  : navigation.navigate("GenderStack")
              }
              activeOpacity={1}
            >
              <Image
                source={require("./assets/icon_chevron.png")}
                style={styles.icon_back}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name={"FilterMenu"}
        component={FilterMenu}
        options={({ route, navigation }) => ({
          title: "Bộ lọc",
          headerTitleAlign: "center",
          headerRight: () => <ShoppingCartIcon />,
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={() => navigation.goBack()}
              activeOpacity={1}
            >
              <Image
                source={require("./assets/icon_chevron.png")}
                style={styles.icon_back}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <TabHome.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: true,
        activeTintColor: "#000000",
        showLabel: false,
        style: { height: 75 },
      }}
    >
      <TabHome.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <TabHome.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="text-box-search"
              color={color}
              size={size}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Search", {
              screen: "GenderStack",
            });
          },
        })}
      />
      <TabHome.Screen
        name="Favorite"
        component={Favorite}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={size} />
          ),
        }}
      />
      <TabHome.Screen
        name="Personal"
        component={PersonalStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </TabHome.Navigator>
  );
}

function Route() {
  const token = useSelector((state) => state.userReducer.token);
  console.log("Token: ", token);
  const showSplash = useSelector((state) => state.userReducer.showSplash);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        console.log("Noti: ", notification);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackImage: () => <BackButton />,
      }}
    >
      {showSplash && (
        <Stack.Screen
          name={"SplashScreen"}
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
      )}
      {!token ? (
        <>
          <Stack.Screen
            name={"Login"}
            options={{
              headerShown: false,
            }}
          >
            {(props) => <Login {...props} notifyToken={expoPushToken} />}
          </Stack.Screen>
          <Stack.Screen
            name={"Register"}
            component={Register}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={"ChangePassword"}
            component={ChangePassword}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name={"MainStack"}
            component={MainStack}
            options={({ route, navigation }) => ({
              title: "fasions.",
              headerTitleAlign: "center",
              headerTitle: getHeaderTitle(route),
              headerLeft: () => null,
              headerRight: () => <ShoppingCartIcon />,
              headerShown: enableHeader(route),
            })}
          />
          <Stack.Screen
            name={"SelectAddress"}
            component={SelectAddress}
            options={({ route, navigation }) => ({
              headerTitleAlign: "center",
              title: route.params.name,
              headerLeft: () => (
                <TouchableOpacity
                  style={{ padding: 15 }}
                  onPress={() => navigation.goBack()}
                  activeOpacity={1}
                >
                  <Image
                    source={require("./assets/icon_chevron.png")}
                    style={styles.icon_back}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name={"ProductDetails"}
            options={({ route, navigation }) => ({
              headerTransparent: true,
              title: "",
              headerLeft: () => (
                <TouchableOpacity
                  style={{ padding: 15 }}
                  onPress={() => navigation.goBack()}
                  activeOpacity={1}
                >
                  <Image
                    source={require("./assets/icon_chevron.png")}
                    style={styles.icon_back}
                  />
                </TouchableOpacity>
              ),
            })}
          >
            {(props) => <ProductDetails {...props} />}
          </Stack.Screen>
          <Stack.Screen
            name={"Cart"}
            component={Cart}
            options={({ route, navigation }) => ({
              headerTitleAlign: "center",
              title: "Giỏ Hàng",
              headerLeft: () => (
                <TouchableOpacity
                  style={{ padding: 15 }}
                  onPress={() => navigation.goBack()}
                  activeOpacity={1}
                >
                  <Image
                    source={require("./assets/icon_chevron.png")}
                    style={styles.icon_back}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name={"Delivery"}
            component={Delivery}
            options={({ route, navigation }) => ({
              headerTitleAlign: "center",
              title: "Địa chỉ giao hàng",
              headerLeft: () => (
                <TouchableOpacity
                  style={{ padding: 15 }}
                  onPress={() => navigation.goBack()}
                  activeOpacity={1}
                >
                  <Image
                    source={require("./assets/icon_chevron.png")}
                    style={styles.icon_back}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name={"AddAddress"}
            component={AddAddress}
            options={({ route, navigation }) => ({
              headerTitleAlign: "center",
              title: "Thêm địa chỉ giao hàng",
              headerLeft: () => (
                <TouchableOpacity
                  style={{ padding: 15 }}
                  onPress={() => navigation.goBack()}
                  activeOpacity={1}
                >
                  <Image
                    source={require("./assets/icon_chevron.png")}
                    style={styles.icon_back}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name={"Payment"}
            component={Payment}
            options={({ route, navigation }) => ({
              headerTitleAlign: "center",
              title: "Thanh Toán",
              headerLeft: () => (
                <TouchableOpacity
                  style={{ padding: 15 }}
                  onPress={() => navigation.goBack()}
                  activeOpacity={1}
                >
                  <Image
                    source={require("./assets/icon_chevron.png")}
                    style={styles.icon_back}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name={"OrderDetails"}
            component={OrderDetails}
            options={({ route, navigation }) => ({
              headerTitleAlign: "center",
              title: "Chi tiết đơn hàng",
              headerLeft: () => (
                <TouchableOpacity
                  style={{ padding: 15 }}
                  onPress={() =>
                    navigation.replace("MainStack", {
                      screen: "Personal",
                      params: {
                        screen: "MyOrder",
                      },
                    })
                  }
                  activeOpacity={1}
                >
                  <Image
                    source={require("./assets/icon_chevron.png")}
                    style={styles.icon_back}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name={"Review"}
            component={Review}
            options={({ route, navigation }) => ({
              headerTitleAlign: "center",
              title: "Đánh Giá",
              headerLeft: () => (
                <TouchableOpacity
                  style={{ padding: 15 }}
                  onPress={() => navigation.goBack()}
                  activeOpacity={1}
                >
                  <Image
                    source={require("./assets/icon_chevron.png")}
                    style={styles.icon_back}
                  />
                </TouchableOpacity>
              ),
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [loaded] = useFonts({
    Open_Sans: require("./assets/fonts/OpenSans-Regular.ttf"),
    Roboto: require("./assets/fonts/Roboto-Regular.ttf"),
    Open_Sans_Bold: require("./assets/fonts/OpenSans-Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <NavigationContainer>
            <Route />
            <FlashMessage
              position={
                Platform.OS === "ios"
                  ? "top"
                  : { top: StatusBar.currentHeight, left: 0, right: 0 }
              }
              floating={Platform.OS !== "ios"}
            />
          </NavigationContainer>
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  search_container: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 40,
    marginHorizontal: 10,
    marginVertical: 2,
  },
  search_icon: {
    height: "100%",
    padding: 8,
    backgroundColor: "#EFEFF0",
  },
  input: {
    flex: 1,
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 16,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 0,
    height: "100%",
    color: "#000000",
    backgroundColor: "#EFEFF0",
  },
  icon_cart: {
    width: 30,
    height: 30,
  },
  icon_back: {
    width: 7,
    height: 14,
  },
});
