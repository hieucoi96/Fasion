import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { useSelector, useDispatch } from "react-redux";
import { addUserInfo } from "../store/itemAction";

const SplashScreen = ({ navigation }) => {
  const token = useSelector((state) => state.userReducer.token);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <LottieView
        style={{ opacity: 0.92, marginBottom: "15%" }}
        source={require("../assets/lotties/fashion-ver4.json")}
        loop={false}
        speed={1.5}
        autoPlay
        onAnimationFinish={() => {
          dispatch(addUserInfo({ showSplash: false }));
          if (!token) {
            navigation.navigate("Login");
          } else {
            navigation.navigate("MainStack");
          }
        }}
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
  },
});

export default SplashScreen;
