
import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Slider from "rn-range-slider";
import Thumb from "../Component/Thumb";
import Rail from "../Component/Rail";
import RailSelected from "../Component/RailSelected";
import NumberFormat from "react-number-format";


const FilterMenu = ({navigation}) => {
    const SECTIONS = [
        {
            title: 'Size',
            content: ["XS", "S", "M", "L", "XL", "XXL"],
        },
        {
            title: 'Chất liệu',
            content: ["Da", "Lông", "Cotton", "Len", "Sợi tổng hợp"]
        },
        {
            title: 'Màu sắc',
            content: [
                {color: '#ffffff', name: 'Màu trắng'},
                {color: '#636366', name: 'Màu ghi'},
                {color: '#1C1C1E', name: 'Màu đen'},
                {color: '#0075FF', name: 'Màu xanh'},
                {color: '#FFC107', name: 'Màu vàng'},
                {color: '#4CAF50', name: 'Màu xanh lá'},
                {color: '#F44336', name: 'Màu đỏ'},
                {color: '#D301A5', name: 'Màu tím'},
            ]
        },
        {
            title: 'Giá',
            content: 'Lorem ipsum...',
        },
    ];

    const [activeSections, setActiveSections] = useState([])
    const [size, setSize] = useState('')
    const [material, setMaterial] = useState('')
    const [color, setColor] = useState('')
    const [low, setLow] = useState()
    const [high, setHigh] = useState()

    const handleValueChange = useCallback((low, high) => {
        setLow(low);
        setHigh(high);
    }, []);

    const renderThumb = useCallback(() => <Thumb/>, []);
    const renderRail = useCallback(() => <Rail/>, []);
    const renderRailSelected = useCallback(() => <RailSelected/>, []);

    function chooseSize(size){
        setSize(size)
    }

    function chooseMaterial(material){
        setMaterial(material)
    }

    function chooseColor(color){
        setColor(color)
    }

    const renderHeader = (section) => {
        return (
            <View style={[styles.header,{borderColor: section.title === 'Size' ? 'transparent': '#AEAEB2'}]}>
                <Text style={styles.headerText}>
                    {section.title}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="grey" style={styles.icon_down}/>
            </View>
        );
    };

    const renderContent = (section) => {
        if(section.title === 'Size'){
            return (
                <ScrollView>
                    <FlatList style={{flex: 1, marginBottom: 40}}
                              data={section.content}
                              renderItem =
                                  {
                                      ({item, index}) =>
                                          <TouchableOpacity style={{flex:0.5, margin: 5, marginRight: 20, borderBottomWidth: 0.5, borderColor: '#DADADA'}}
                                                            onPress={() => chooseSize(item)}
                                                            activeOpacity={1}>
                                              <View style={styles.item}>
                                                  <View style={{flexDirection: 'row', marginRight: 20, flex: 1}}>
                                                      <Text style={styles.text_name}>{item}</Text>
                                                  </View>
                                                  {size === item &&
                                                    <AntDesign name="check" size={20} color="black" />
                                                  }

                                              </View>
                                          </TouchableOpacity>
                                  }
                              keyExtractor={item => item}
                              numColumns={3}
                              showsVerticalScrollIndicator={false}
                    />
                </ScrollView>
            );
        }
        if(section.title === 'Chất liệu'){
            return (
                <ScrollView>
                    <FlatList style={{flex: 1, marginBottom: 30}}
                              data={section.content}
                              renderItem =
                                  {
                                      ({item, index}) =>
                                          <TouchableOpacity style={{flex:0.5, margin: 5, marginRight: 20, borderBottomWidth: 0.5, borderColor: '#DADADA'}}
                                                            onPress = {() => chooseMaterial(item)}
                                                            activeOpacity={1}>
                                              <View style={styles.item}>
                                                  <View style={{flexDirection: 'row', marginRight: 20, flex: 1}}>
                                                      <Text style={styles.text_name}>{item}</Text>
                                                  </View>
                                                  {material === item &&
                                                    <AntDesign name="check" size={20} color="black" />
                                                  }
                                              </View>
                                          </TouchableOpacity>
                                  }
                              keyExtractor={item => item}
                              showsVerticalScrollIndicator={false}
                    />
                </ScrollView>
            );
        }
        if(section.title === 'Màu sắc'){
            return (
                <ScrollView>
                    <FlatList style={{flex: 1, marginBottom: 30}}
                              data={section.content}
                              renderItem =
                                  {
                                      ({item, index}) =>
                                          <TouchableOpacity style={{flex:0.5, margin: 5, marginRight: 20, borderBottomWidth: 0.5, borderColor: '#DADADA'}}
                                                            onPress={() => chooseColor(item.name)}
                                                            activeOpacity={1}>
                                              <View style={styles.item}>
                                                  <View style={{flexDirection: 'row', marginRight: 20, flex: 1, alignItems: 'center'}}>
                                                      <View style={[styles.square, {backgroundColor: item.color, marginRight: 15}]}/>
                                                      <Text style={styles.text_name}>{item.name}</Text>
                                                  </View>
                                                  {color === item.name &&
                                                    <AntDesign name="check" size={20} color="black" />
                                                  }
                                              </View>
                                          </TouchableOpacity>
                                  }
                              keyExtractor={item => item.name}
                              numColumns={2}
                              showsVerticalScrollIndicator={false}
                    />
                </ScrollView>
            );
        }
        if(section.title === 'Giá'){
            return (
                <View style={styles.content}>
                    <View style={{flexDirection: 'row', marginBottom: 20}}>
                        <NumberFormat  value={low}
                                       displayType={'text'}
                                       thousandSeparator={true}
                                       suffix={' đ'}
                                       renderText={(value, props) =>
                                           <Text {...props}>{value}</Text>
                                       }
                        />
                        <Text> - </Text>
                        <NumberFormat  value={high}
                                       displayType={'text'}
                                       thousandSeparator={true}
                                       suffix={' đ'}
                                       renderText={(value, props) =>
                                           <Text {...props}>{value}</Text>
                                       }
                        />
                    </View>

                    <Slider
                        style={styles.slider}
                        min={200000}
                        max={10000000}
                        step={10000}
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
        setActiveSections(section)
    };

    return (
        <View style={styles.container}>
            <Accordion
                sections={SECTIONS}
                activeSections={activeSections}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={updateSection}
                underlayColor={'transparent'}
                expandMultiple={true}
                renderAsFlatList={true}
                keyExtractor={(item) => item.title}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15,
    },
    header: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 0.5,
    },
    headerText: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 21,
        flex: 1,
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
    },
    icon_down: {

    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        height:30,
    },
    square: {
        width: 22,
        height: 22,

    },
    text_name: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 30,
    }
});

export default FilterMenu;
