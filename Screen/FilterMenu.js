import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Slider from "rn-range-slider";
import Thumb from "../Component/Thumb";
import Rail from "../Component/Rail";
import RailSelected from "../Component/RailSelected";
import NumberFormat from "react-number-format";

const FilterMenu = ({ navigation, route }) => {
  const SECTIONS = [
    {
      title: "Size",
      content: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      title: "Giá",
      content: "Lorem ipsum...",
    },
  ];

  const [activeSections, setActiveSections] = useState(["Size", "Giá"]);
  const [size, setSize] = useState(route.params.size ? route.params.size : "");
  const [low, setLow] = useState(route.params.low ? route.params.low : "");
  const [high, setHigh] = useState(route.params.high ? route.params.high : "");

  const handleValueChange = useCallback((low, high) => {
    setLow(low);
    setHigh(high);
  }, []);

  //render component cho phần chọn giá
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);

  function chooseSize(selectedSize) {
    if (selectedSize === size) {
      setSize("");
    } else {
      setSize(selectedSize);
    }
  }

  const renderHeader = (section) => {
    return (
      <View
        style={[
          styles.header,
          { borderColor: section.title === "Size" ? "transparent" : "#AEAEB2" },
        ]}
      >
        <Text style={styles.headerText}>{section.title}</Text>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color="grey"
          style={styles.icon_down}
        />
      </View>
    );
  };

  const renderContent = (section) => {
    if (section.title === "Size") {
      return (
        <ScrollView>
          <FlatList
            style={{ flex: 1, marginBottom: 40 }}
            data={section.content}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  margin: 5,
                  marginRight: 20,
                  borderBottomWidth: 0.5,
                  borderColor: "#DADADA",
                }}
                onPress={() => chooseSize(item)}
                activeOpacity={1}
              >
                <View style={styles.item}>
                  <View
                    style={{ flexDirection: "row", marginRight: 20, flex: 1 }}
                  >
                    <Text style={styles.text_name}>{item}</Text>
                  </View>
                  {size === item && (
                    <AntDesign name="check" size={20} color="black" />
                  )}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            numColumns={3}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      );
    }
    if (section.title === "Giá") {
      return (
        <View style={styles.content}>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <NumberFormat
              value={low}
              displayType={"text"}
              thousandSeparator={true}
              suffix={" đ"}
              renderText={(value, props) => <Text {...props}>{value}</Text>}
            />
            <Text> - </Text>
            <NumberFormat
              value={high}
              displayType={"text"}
              thousandSeparator={true}
              suffix={" đ"}
              renderText={(value, props) => <Text {...props}>{value}</Text>}
            />
          </View>

          <Slider
            style={styles.slider}
            min={200000}
            max={10000000}
            low={low ? low : 200000}
            high={high ? high : 10000000}
            step={100000}
            floatingLabel
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            onValueChanged={handleValueChange}
          />
        </View>
      );
    }
  };

  const updateSection = (section) => {
    setActiveSections(section);
  };

  return (
    <View style={styles.container}>
      <Accordion
        sections={SECTIONS}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSection}
        underlayColor={"transparent"}
        expandMultiple={true}
        renderAsFlatList={true}
        keyExtractor={(item) => item.title}
      />
      <TouchableOpacity
        style={[styles.btnApply, { marginBottom: 12 }]}
        onPress={() => {
          if (low === 200000 && high === 10000000) {
            navigation.navigate("ListProduct", {
              low: null,
              high: null,
              size,
            });
          } else {
            navigation.navigate("ListProduct", {
              low,
              high,
              size,
            });
          }
        }}
      >
        <Text style={styles.textBtn}>Áp dụng</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnReset}
        onPress={() => {
          setLow(200000);
          setHigh(10000000);
          setSize("");
        }}
      >
        <Text style={[styles.textBtn, { color: "#000000" }]}>Làm mới</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 15,
  },
  header: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
  },
  headerText: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontFamily: "Open_Sans_Bold",
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  content: {
    padding: 20,
    backgroundColor: "#fff",
  },
  icon_down: {},
  item: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
  },
  square: {
    width: 22,
    height: 22,
  },
  text_name: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: 30,
  },
  btnApply: {
    width: "100%",
    alignItems: "center",
    color: "#ffffff",
    backgroundColor: "#000000",
  },
  btnReset: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#1C1C1E",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  textBtn: {
    color: "#ffffff",
    lineHeight: 50,
    fontSize: 16,
  },
});

export default FilterMenu;
