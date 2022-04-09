import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Alert, } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, PhoneAuthProvider, signInWithCredential, initializeAuth, } from "firebase/auth";
import axios from "axios";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBssvdQ9W3xe5nnW-tjL8sIiXwOnBBCRfU",
  authDomain: "fasion-c4262.firebaseapp.com",
  projectId: "fasion-c4262",
  storageBucket: "fasion-c4262.appspot.com",
  messagingSenderId: "871687442365",
  appId: "1:871687442365:web:7241f0fa716f895d538cd4",
  measurementId: "G-56P8K2YF4Y",
};

let app;
let auth;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth();
}

const ChangePassword = ({ navigation }) => {
  const recaptchaVerifier = useRef(null);
  const [currentInput, setCurrentInput] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, showMessage] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [stage, setStage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    timeout: 1000,
  });

  const confirmClicked = async () => {
    setErrorMessage("");
    if (stage === 1) {
      try {
        let phone_regex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phone_regex.test(currentInput)) {
          setErrorMessage("Số điện thoại không hợp lệ");
          return;
        }
        setLoading(true);
        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
          "+84" + currentInput,
          recaptchaVerifier.current
        );
        setPhoneNumber(currentInput);
        setVerificationId(verificationId);
        showMessage({
          text: "Mã xác nhận sẽ được gửi đến số điện thoại của bạn!",
        });
        setCurrentInput("");
        setStage(2);
      } catch (err) {
        showMessage({ text: `Error: ${err.message}`, color: "red" });
      }
      setLoading(false);
    } else if (stage === 2) {
      try {
        let otp_regex = /^[0-9]{1,6}$/;
        if (!otp_regex.test(currentInput)) {
          setErrorMessage("Mã OTP không hợp lệ");
          return;
        }
        setLoading(true);
        const credential = PhoneAuthProvider.credential(
          verificationId,
          currentInput
        );

        await signInWithCredential(auth, credential);
        showMessage({
          text: "Mã xác nhận hợp lệ, vui lòng nhập mật khẩu mới!",
        });
        setCurrentInput("");
        setStage(3);
      } catch (err) {
        showMessage({
          text: `Mã xác nhận không hợp lệ hoặc đã có lỗi xảy ra!`,
          color: "red",
        });
      }
      setLoading(false);
    } else {
      let password_regex = /^([a-zA-Z0-9@*#]{8,15})$/;
      if (!password_regex.test(currentInput)) {
        setErrorMessage(
          "Mật khẩu phải từ 8 đến 15 ký tự và chỉ bao gồm chữ, số hoặc @, #, *"
        );
        return;
      }
      setLoading(true);
      instance
        .post("/users/changePassword", {
          phone_number,
          password: currentInput,
        })
        .then(function (response) {
          setLoading(false);
          Alert.alert("Thông báo", "Đổi mật khẩu thành công!", [
            { text: "OK", onPress: () => navigation.navigate("Login") },
          ]);
        })
        .catch(function (error) {
          setLoading(false);
          Alert.alert(
            "Thông báo",
            "Đổi mật khẩu không thành công: " + error.message
          );
          console.log(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>fasions.</Text>
      <Text style={styles.title}>
        {stage === 1
          ? "Nhập số điện thoại"
          : stage === 2
          ? "Nhập mã OTP"
          : "Đổi mật khẩu"}
      </Text>
      <View style={styles.input_container}>
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setCurrentInput(text)}
            value={currentInput}
            editable={!loading}
            autoFocus
            keyboardType={
              stage === 1 ? "phone-pad" : stage === 2 ? "numeric" : "default"
            }
            placeholder={
              stage === 1
                ? "Số điện thoại"
                : stage === 2
                ? "Mã OTP"
                : "Mật khẩu mới"
            }
            placeholderTextColor="#636366"
          />
        </View>
        {message ? (
          <Text
            style={{
              color: message.color || "gray",
              fontSize: 17,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {message.text}
          </Text>
        ) : (
          <Text
            style={{
              color: message.color || "gray",
              fontSize: 17,
              textAlign: "center",
              marginTop: 20,
            }}
          ></Text>
        )}
        {errorMessage ? (
          <Text
            style={{
              color: "red",
              fontSize: 12,
              opacity: 0.7,
              paddingLeft: 4,
              marginTop: 0,
            }}
          >
            {errorMessage}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.button_login}
        onPress={() => {
          confirmClicked();
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.text_login_text}>Xác nhận</Text>
        )}
      </TouchableOpacity>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
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
    marginTop: 26,
  },
  text_login_text: {
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
});

export default ChangePassword;
