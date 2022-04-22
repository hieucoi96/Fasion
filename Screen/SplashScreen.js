import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";

const SplashScreen = ({ navigation }) => {
  const token = useSelector((state) => state.userReducer.token);
  return (
    <View style={styles.container}>
      <LottieView
        style={{ opacity: 0.92, marginBottom: "15%" }}
        source={require("../assets/lotties/fashion-ver4.json")}
        loop={false}
        speed={1.5}
        autoPlay
        onAnimationFinish={() => {
          console.log("hhh");
          if (!token) {
            console.log("log");
            navigation.navigate("Login");
          } else {
            console.log("main");
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
