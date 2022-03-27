import React, { useState } from "react";
import {StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator,} from "react-native";
import axios from "axios";

const Register = ({ navigation }) => {
  const [phone_number, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    timeout: 1000,
  });

  const userResgister = () => {
    setLoading(true);
    instance
      .post("/users/registerUser", {
        phone_number,
        email,
        password,
      })
      .then(function (response) {
        console.log("Status:", response.status);
        setLoading(false);
        Alert.alert("Thông báo", "Đăng ký tài khoản thành công!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("MainStack", {
                params: { phone_number },
                screen: "Home",
              }),
          },
        ]);
      })
      .catch(function (error) {
        setLoading(false);
        Alert.alert("Thông báo", "Đăng ký không thành công!");
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>fasions.</Text>
      <Text style={styles.title}>Đăng ký ngay nào</Text>

      <View style={styles.input_container}>
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            onChangeText={(phone) => setPhone(phone)}
            value={phone_number}
            editable={!loading}
            placeholder="Số điện thoại"
            placeholderTextColor="#636366"
          />
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            onChangeText={(email) => setEmail(email)}
            value={email}
            editable={!loading}
            placeholder="Email"
            placeholderTextColor="#636366"
          />
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            onChangeText={(password) => setPassword(password)}
            value={password}
            editable={!loading}
            secureTextEntry
            placeholder="Mật khẩu"
            placeholderTextColor="#636366"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button_login}
        onPress={() => {
          userResgister();
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.text_login_text}>Đăng ký</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "4%",
  },
  brand: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 40,
    lineHeight: 47,
  },
  title: {
    marginTop: 43,
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 19,
  },
  input_container: {},
  input: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 16,
    width: "100%",
    color: "#000000",
  },
  inputSection: {
    marginTop: 41,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#000000",
  },
  button_login: {
    width: "100%",
    height: 42,
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 41,
  },
  text_login_text: {
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
});

export default Register;