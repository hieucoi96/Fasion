import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";

const Review = ({ navigation }) => {
  const [rating, setRating] = useState();
  const [review, setReview] = useState("");

  function ratingCompleted(rating) {
    console.log("Rating is: " + rating);
    setRating(rating);
  }

  return (
    <View style={styles.container}>
      <Rating
        style={{ marginTop: 20 }}
        imageSize={35}
        startingValue={0}
        onFinishRating={ratingCompleted}
      />

      <TextInput
        style={styles.input_review}
        placeholder={"Viết đánh giá của bạn về sản phẩm này"}
        onChangeText={(text) => setReview(text)}
        value={review}
        multiline
      />
      <TouchableOpacity
        style={styles.button_order}
        onPress={() => {
          navigation.goBack();
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.text_order}>Đánh giá</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: "4%",
  },
  input_review: {
    marginTop: 20,
    borderColor: "#000000",
    borderWidth: 0.5,
    padding: 10,
    height: 180,
    fontFamily: "Open_Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 21,
    textAlignVertical: "top",
  },
  button_order: {
    width: "100%",
    height: 42,
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  text_order: {
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
});

export default Review;
