import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUserInfo } from "../store/itemAction";

const Register = ({ navigation }) => {
  const [phone_number, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
  });

  const userResgister = () => {
    setErrorMessage("");
    let phone_regex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phone_regex.test(phone_number)) {
      setErrorMessage("Số điện thoại không hợp lệ");
      return;
    }
    let email_regex =
      /^((([!#$%&'*+\-/=?^_`{|}~\w])|([!#$%&'*+\-/=?^_`{|}~\w][!#$%&'*+\-/=?^_`{|}~\.\w]{0,}[!#$%&'*+\-/=?^_`{|}~\w]))[@]\w+([-.]\w+)*\.\w+([-.]\w+)*)$/;
    if (!email_regex.test(email)) {
      setErrorMessage("Email không hợp lệ");
      return;
    }
    let password_regex = /^([a-zA-Z0-9@*#]{8,15})$/;
    if (!password_regex.test(password)) {
      setErrorMessage(
        "Mật khẩu phải từ 8 đến 15 ký tự và chỉ bao gồm chữ, số hoặc @, #, *"
      );
      return;
    }

    setLoading(true);
    instance
      .post("/users/registerUser", {
        phone_number,
        email,
        password,
      })
      .then(function (response) {
        setLoading(false);
        Alert.alert("Thông báo", "Đăng ký tài khoản thành công!", [
          {
            text: "OK",
            onPress: () => {
              dispatch(addUserInfo(response.data));
              navigation.navigate("MainStack", {
                params: { phone_number },
                screen: "Home",
              });
            },
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.brand}>fasions.</Text>
      <Text style={styles.title}>Đăng ký ngay nào</Text>

      <View style={styles.input_container}>
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            onChangeText={(phone) => setPhone(phone)}
            value={phone_number}
            keyboardType={"phone-pad"}
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
        {errorMessage ? (
          <Text
            style={{
              color: "red",
              fontSize: 12,
              opacity: 0.7,
              paddingLeft: 4,
              marginTop: 16,
            }}
          >
            {errorMessage}
          </Text>
        ) : null}
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
    </KeyboardAvoidingView>
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
    fontFamily: "Open_Sans_Bold",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 40,
    lineHeight: 47,
  },
  title: {
    marginTop: 43,
    fontFamily: "Open_Sans_Bold",
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
    marginTop: 36,
  },
  text_login_text: {
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
});

export default Register;
