import React, { useState, useEffect } from "react";
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
import Ripple from "react-native-material-ripple";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUserInfo } from "../store/itemAction";

const Login = ({ navigation, notifyToken }) => {
  const dispatch = useDispatch();

  const [phone_number, setPhone] = useState("0968641001");
  const [password, setPassword] = useState("ductest123");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
  });

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });
  }, []);

  const userLogin = () => {
    setErrorMessage("");
    let phone_regex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phone_regex.test(phone_number)) {
      setErrorMessage("Số điện thoại không hợp lệ");
      return;
    }
    let password_regex = /^([a-zA-Z0-9@*#]{8,15})$/;
    if (!password_regex.test(password)) {
      setErrorMessage("Mật khẩu không hợp lệ");
      return;
    }
    setLoading(true);
    instance
      .post("/users/loginUser", {
        phone_number,
        password,
        notifyToken,
      })
      .then(function (response) {
        setLoading(false);
        dispatch(addUserInfo(response.data));
      })
      .catch(function (error) {
        setLoading(false);
        Alert.alert("Thông báo", "Đăng nhập không thành công!");
        console.log(error);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.brand}>fasions.</Text>
      <Text style={styles.title}>Đăng nhập với số điện thoại của bạn</Text>

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
            onChangeText={(password) => setPassword(password)}
            value={password}
            editable={!loading}
            secureTextEntry
            placeholder="Mật khẩu"
            placeholderTextColor="#636366"
          />
        </View>
        <TouchableOpacity
          style={{ alignSelf: "flex-end" }}
          disabled={loading}
          onPress={() => {
            navigation.navigate("ChangePassword");
          }}
        >
          <Text style={styles.text_change_pass}>Quên mật khẩu</Text>
        </TouchableOpacity>
        {errorMessage ? (
          <Text
            style={{
              color: "red",
              fontSize: 12,
              opacity: 0.7,
              paddingLeft: 4,
              marginTop: 8,
            }}
          >
            {errorMessage}
          </Text>
        ) : null}
      </View>

      <Ripple
        style={styles.button_login}
        disabled={loading}
        onPress={() => {
          userLogin();
        }}
        rippleColor={"#ffffff"}
        rippleOpacity={0.4}
        rippleDuration={600}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.text_login_text}>Đăng nhập</Text>
        )}
      </Ripple>

      <View style={styles.text_question}>
        <Text>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          <Text style={styles.text_register_text}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          dispatch(addUserInfo({ token: "1" }));
        }}
      >
        <Text style={styles.text_bypass}>Bỏ qua đăng nhập</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
  text_question: {
    marginTop: 30,
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  text_change_pass: {
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 10,
    textAlign: "right",
    marginRight: 14,
    marginTop: 10,
    color: "#636366",
  },
  text_login_text: {
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  text_register_text: {
    fontFamily: "Open_Sans_Bold",
    fontStyle: "normal",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
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
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 36,
  },
  text_bypass: {
    marginTop: 20,
    fontWeight: "bold",
    color: "#b0aeae",
  },
});

export default Login;
