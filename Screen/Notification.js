import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  // FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";

import Item from "../Component/SwipeItem";

const data_notification = [
  {
    id: "34534643560",
    type: "promotion",
    title: "Chương trình khuyến mại",
    content:
      "Đơn hàng Fb1802 của bạn đã được giao thành công, chúc bạn có một trải nghiệp tuyệt vời với fasion.",
    date: "20-10-2020",
  },
  {
    id: "34523452345",
    type: "purchase_status",
    title: "Mua hàng thành công",
    content:
      "Đơn hàng Fb1811 của bạn đã được giao thành công, chúc bạn có một trải nghiệp tuyệt vời với fasion.",
    date: "26-11-2020",
  },
  {
    id: "34527854332",
    type: "purchase_status",
    title: "Mua hàng thành công",
    content:
      "Đơn hàng Fb1812 của bạn đã được giao thành công, chúc bạn có một trải nghiệp tuyệt vời với fasion.",
    date: "10-01-2021",
  },
  {
    id: "686866666247",
    type: "purchase_status",
    title: "Đơn hàng đã hủy",
    content:
      "Đơn hàng Fb1967 của bạn đã được hủy. Nhấn vào đây để biết thêm thông tin",
    date: "11-4-2021",
  },
  {
    id: "965444433247",
    type: "purchase_status",
    title: "Đơn hàng đang được vận chuyển",
    content:
      "Đơn hàng Fb1988 đang được vận chuyển. Nhân viên giao hàng sẽ sớm liên hệ với bạn",
    date: "30-5-2021",
  },
];

const Notification = ({ navigation }) => {
  const token = useSelector((state) => state.userReducer.token);
  const instance = axios.create({
    baseURL: "https://hieuhmph12287-lab5.herokuapp.com/",
    headers: { "x-access-token": token },
  });
  const isFocused = useIsFocused();
  const [notiData, setNotiData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Call api lấy ds hóa đơn
  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    instance
      .get("/notify/getNotifyByUser", { signal: controller.signal })
      .then(function (response) {
        setNotiData(response.data);
      })
      .catch(function (error) {
        if (!axios.isCancel(error)) {
          Alert.alert("Thông báo", "Có lỗi xảy ra: " + error.message);
          console.log(error);
        }
      })
      .then(function () {
        setLoading(false);
      });
    return () => {
      controller.abort();
    };
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={"#000000"} />
      ) : (
        <>
          {notiData.length === 0 ? (
            <Text
              style={{
                fontSize: 18,
                color: "#a3a3a0",
              }}
            >
              Bạn không có thông báo nào
            </Text>
          ) : (
            <FlatList
              style={{ flex: 1, width: "100%" }}
              data={notiData}
              renderItem={({ item, index }) => (
                <Item
                  onSwipe={() => {
                    const newItems = [...notiData];
                    newItems.splice(newItems.indexOf(item), 1);
                    setNotiData(newItems);
                    instance
                      .post("/notify/deleteNotiByUser", {
                        notify_id: item.notify_id,
                      })
                      .then(function (response) {
                        console.log(response.data);
                      })
                      .catch(function (error) {
                        Alert.alert(
                          "Thông báo",
                          "Có lỗi xảy ra: " + error.message
                        );
                        console.log(error);
                      });
                  }}
                  {...{ item }}
                />
              )}
              keyExtractor={(item) => item.notify_id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
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

export default Notification;
