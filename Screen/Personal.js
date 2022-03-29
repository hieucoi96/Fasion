import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";

const Personal = ({ navigation }) => {
  const name = useSelector((state) =>
    state.userReducer.full_name
      ? state.userReducer.full_name
      : state.userReducer.phone_number
  );
  //   const phone = useSelector((state) => state.userReducer.fullname);

  const data = [
    { src: require("../assets/icon_cube.png"), title: "Đơn hàng của tôi" },
    { src: require("../assets/icon_plane_paper.png"), title: "Thông báo" },
    { src: require("../assets/icon_faq.png"), title: "FAQS" },
    { src: require("../assets/icon_share.png"), title: "Chia sẻ" },
    { src: require("../assets/icon_logout.png"), title: "Đăng xuất" },
  ];

  function handleItemClick(title) {
    if (title === "Đơn hàng của tôi") {
      navigation.navigate("MyOrder");
    }
    if (title === "Thông báo") {
      navigation.navigate("Notification");
    }
    if (title === "FAQS") {
      navigation.navigate("FAQS");
    }
    if (title === "Chia sẻ") {
      navigation.navigate("FAQS");
    }
    if (title === "Đăng xuất") {
      navigation.navigate("Login");
    }
  }

  const listItems = data.map((item, index) => (
    <TouchableOpacity
      style={[
        styles.item,
        {
          flexDirection: "row",
          borderTopWidth: item.title === "Đơn hàng của tôi" ? 0.5 : 0,
        },
      ]}
      key={index}
      onPress={() => handleItemClick(item.title)}
      activeOpacity={1}
    >
      <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
        <Image
          style={{
            width: 24,
            height: 24,
            marginRight: 15,
            resizeMode: "contain",
          }}
          source={item.src}
        />
        <Text style={[styles.text_normal, { paddingVertical: 20 }]}>
          {item.title}
        </Text>
      </View>
      <EvilIcons name="chevron-right" size={24} color="black" />
    </TouchableOpacity>
  ));

  return (
    <View style={styles.container}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.text_normal}>Xin chào</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <TouchableOpacity
          style={styles.icon_setting}
          onPress={() => navigation.navigate("ChangeInfo")}
        >
          <AntDesign name="setting" size={18} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "column" }}>{listItems}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 15,
  },
  text_normal: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
  },
  name: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 24,
  },
  icon_setting: {
    backgroundColor: "#EFEFF0",
    borderRadius: 50,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    alignItems: "center",
    borderColor: "#AEAEB2",
    borderBottomWidth: 0.5,
  },
});

export default Personal;