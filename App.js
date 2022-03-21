import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View, SafeAreaView,  Image, StatusBar, Animated } from 'react-native';
import {NavigationContainer, getFocusedRouteNameFromRoute} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FlashMessage from "react-native-flash-message";

import {LogBox } from 'react-native';
LogBox.ignoreLogs(['Reanimated 2']);

import Home from './Screen/Home';
import Search from './Screen/Search';
import Favorite from './Screen/Favorite';
import Personal from './Screen/Personal';
import ListProduct from "./Screen/ListProduct";
import FilterMenu from './Screen/FilterMenu';
import Cart from "./Screen/Cart";
import Male from './Screen/Male';
import Female from './Screen/Female';
import ProductDetails from './Screen/ProductDetails';


import { Provider } from 'react-redux'
import store from './store/store'
import ShoppingCartIcon from "./Component/ShoppingCartIcon";
import BackButton from "./Component/BackButton";

const Stack = createStackNavigator();
const TabHome = createBottomTabNavigator();
const TabGender = createMaterialTopTabNavigator();

function getHeaderTitle(route) {

    const routeName = getFocusedRouteNameFromRoute(route) ?? 'fasions.';

    switch (routeName) {
        case 'Home':
            return 'fasions.';
        case 'Search':
            return null;
        case 'Favorite':
            return 'Favorite';
        case 'Personal':
            return null;
    }
}

function enableHeader(route) {

    const routeName = getFocusedRouteNameFromRoute(route) ?? 'fasions.';

    return !(routeName === 'Search' || routeName === 'Personal');

}

function GenderStack() {

    const [searchText, setSearchText] = useState("");

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
            <View style = {styles.search_container}>
                <AntDesign style = {styles.search_icon} name="search1" size={24} color="#AEAEB2" />
                <TextInput style = {styles.input}
                           onChangeText = {text => setSearchText(text)}
                           value = {searchText}
                           placeholder = "Tìm kiếm sản phẩm"
                           placeholderTextColor = "#AEAEB2"/>
            </View>
            <TabGender.Navigator>
                <TabGender.Screen name="Female" component={Female} />
                <TabGender.Screen name="Male" component={Male} />
            </TabGender.Navigator>
        </SafeAreaView>
    );
}

function SearchStack(){
    return (
        <Stack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                headerBackImage: () => <BackButton />,
            }}>
            <Stack.Screen name={"GenderStack"}
                          component={GenderStack}
                          options={{
                              headerShown: false,
                          }}
            />
            <Stack.Screen name={"ListProduct"}
                          component={ListProduct}
                          options={({route, navigation }) => ({
                              headerTitleAlign: 'center',
                              title: route.params.name,
                              headerStyle: {
                                  shadowColor: 'transparent',
                                  elevation: 0
                              },
                              headerRight: () => (
                                  <ShoppingCartIcon/>
                              ),
                              headerLeft: () => (
                                  <TouchableOpacity
                                      style = {{padding: 15}}
                                      onPress={() => navigation.goBack()}
                                      activeOpacity={1}>
                                      <Image source={require('./assets/icon_chevron.png')} style={styles.icon_back}/>
                                  </TouchableOpacity>
                              ),
                          })}
            />
            <Stack.Screen name={"FilterMenu"}
                          component={FilterMenu}
                          options={({route, navigation }) => ({
                              title: 'Bộ lọc',
                              headerTitleAlign: 'center',
                              headerRight: () => (
                                  <ShoppingCartIcon/>
                              ),
                              headerLeft: () => (
                                  <TouchableOpacity
                                      style = {{padding: 15}}
                                      onPress={() => navigation.goBack()}
                                      activeOpacity={1}>
                                      <Image source={require('./assets/icon_chevron.png')} style={styles.icon_back}/>
                                  </TouchableOpacity>
                              ),
                          })}
            />
        </Stack.Navigator>
    );
}

function MainStack(){
    return (
            <TabHome.Navigator
                tabBarOptions={{
                    activeTintColor: '#000000',
                    showLabel: false,
                    style:{height:75}
                }}>

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
                />
                <TabHome.Screen
                    name="Favorite"
                    component={Favorite}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="heart"
                                color={color}
                                size={size}
                            />
                        ),
                    }}
                />
                <TabHome.Screen
                    name="Personal"
                    component={Personal}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="account"
                                color={color}
                                size={size}
                            />
                        ),
                    }}
                />
            </TabHome.Navigator>
    );
}

export default function App() {
    const scrollY = new Animated.Value(0);
  return (
      <Provider store={store}>
      <View style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerBackTitleVisible: false,
                    headerBackImage: () => <BackButton />,
                }}
            >

              <Stack.Screen name={"MainStack"}
                            component={MainStack}

                            options={({ route, navigation }) => ({
                                title: "fasions.",
                                headerTitleAlign: 'center',
                                headerTitle: getHeaderTitle(route),
                                headerLeft: () => null,
                                headerRight: () => (
                                    <ShoppingCartIcon/>
                                ),
                                headerShown: enableHeader(route),
                            })}
              />
              <Stack.Screen name={"ProductDetails"}
                            // component={ProductDetails}
                            options={({ route, navigation }) => ({
                                headerTransparent: true,
                                title: '',
                                headerLeft: () => (
                                    <TouchableOpacity
                                        style = {{padding: 15}}
                                        onPress={() => navigation.goBack()}
                                        activeOpacity={1}>
                                        <Image source={require('./assets/icon_chevron.png')} style={styles.icon_back}/>
                                    </TouchableOpacity>
                                ),
                            })}
              >
                  {props => <ProductDetails {...props} scrollY={scrollY} />}
              </Stack.Screen>
                <Stack.Screen name={"Cart"}
                              component={Cart}
                              options={({ route, navigation }) => ({
                                  headerTitleAlign: 'center',
                                  title: 'Cart',
                                  headerLeft: () => (
                                      <TouchableOpacity
                                          style = {{padding: 15}}
                                          onPress={() => navigation.goBack()}
                                          activeOpacity={1}>
                                          <Image source={require('./assets/icon_chevron.png')} style={styles.icon_back}/>
                                      </TouchableOpacity>
                                  ),
                              })}
                />
            </Stack.Navigator>
              <FlashMessage position={ Platform.OS === 'ios' ? "top" : {top:StatusBar.currentHeight, left:0, right:0} }
                            floating={Platform.OS !== 'ios'} />
          </NavigationContainer>
      </View>
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
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 40,
        marginHorizontal: 10,
        marginVertical: 2,
    },
    search_icon: {
        height: '100%',
        padding: 8,
        backgroundColor: '#EFEFF0',
    },
    input:{
        flex: 1,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 16,
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 0,
        height: '100%',
        color: '#000000',
        backgroundColor: '#EFEFF0',
    },
    icon_cart: {
        width: 30,
        height: 30,
    },
    icon_back: {
        width: 7,
        height: 14,
    }
});


