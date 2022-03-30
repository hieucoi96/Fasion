import React, { useState, useEffect } from "react";
import {StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator,} from "react-native";
import NumberFormat from "react-number-format";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const ItemHorizontal = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.itemHorizontal, backgroundColor]}
    activeOpacity={1}
  >
    <Image style={styles.imgHorizontal} source={{ uri: item.src }} />
    <Text style={[styles.nameHorizontal, textColor]}>{item.name}</Text>
    <NumberFormat
      value={item.price}
      displayType={"text"}
      thousandSeparator={true}
      suffix={" đ"}
      renderText={(value, props) => (
        <Text style={styles.text_price} {...props}>
          {value}
        </Text>
      )}
    />
  </TouchableOpacity>
);

const ItemVertical = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.itemVertical, backgroundColor]}
    activeOpacity={1}
  >
    <Image style={styles.imgVertical} source={{ uri: item.src }} />
    <Text style={[styles.nameVertical, textColor]}>{item.name}</Text>
  </TouchableOpacity>
);

const Home = ({ navigation, route }) => {
  const { phone_number, token } = route.params ?? {};
  const [horizontalList, setHorizontalList] = useState(null);
  const [verticalList, setVerticalList] = useState(null);
  const [loading, setLoading] = useState(false);
  const userInfo = useSelector((state) => state.userReducer);

  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    headers: { "x-access-token": token },
  });

  useEffect(() => {
    setLoading(true);
    const prod = () => {
      return instance.get("/products/getProducts/newArrival");
    };
    const collection = () => {
      return instance.get("/collections/getCollections");
    };
    Promise.all([prod(), collection()])
      .then(function (results) {
        setHorizontalList(results[0].data);
        setVerticalList(results[1].data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        setLoading(false);
      });
  }, []);

  function openProductDetails(item) {
    navigation.navigate("ProductDetails", { item, token });
  }

  const openCollectionDetails = (c) => {
    navigation.navigate("Search", {
      params: {
        collection_id: c.collection_id,
        name: c.name,
        token,
        prevScreen: "Home",
      },
      screen: "ListProduct",
    });
  };

  const renderItemHorizontal = ({ item }) => {
    const backgroundColor = "#ffffff";
    const color = "black";

    return (
      <ItemHorizontal
        item={item}
        onPress={() => openProductDetails(item)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  const renderItemVertical = ({ item }) => {
    const backgroundColor = "#ffffff";
    const color = "black";

    return (
      <ItemVertical
        item={item}
        onPress={() => {
          openCollectionDetails(item);
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          <FlatList
            data={verticalList}
            renderItem={renderItemVertical}
            keyExtractor={(item) => item.product_id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={{ marginLeft: "4%", marginBottom: 25 }}>
                <Text style={styles.title}>New Arrival</Text>
                <FlatList
                  horizontal
                  data={horizontalList}
                  renderItem={renderItemHorizontal}
                  keyExtractor={(item) => item.product_id}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    marginTop: 30,
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 19,
  },
  itemHorizontal: {
    marginTop: 15,
    marginRight: 15,
    height: 341,
    width: 235,
  },
  nameHorizontal: {
    marginTop: 10,
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 14,
  },
  price: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 14,
  },
  imgHorizontal: {
    width: 235,
    height: 290,
  },
  itemVertical: {
    width: "92%",
    height: 215,
    marginBottom: 20,
    alignItems: "center",
    alignSelf: "center",
  },
  nameVertical: {
    marginTop: 10,
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 19,
  },
  imgVertical: {
    width: "100%",
    height: 186,
  },
  text_price: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
  },
});

export default Home;