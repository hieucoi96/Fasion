import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import NumberFormat from "react-number-format";
import { AntDesign } from '@expo/vector-icons';
import {DATA_BILL} from "../api/constants";

// const bill_data=[
//     {
//         bill_code: 'FASN1234',
//         datetime: '13:08  27-09-2020',
//         name: 'Hieu Hoang',
//         phone_number: '0987654321',
//         address: '96 ngõ 204 Trần Duy Hưng, Cầu Giấy, Hà Nội',
//         sale_value: 90000,
//         delivery_value: 40000,
//         final_value: 3550000,
//         total_value: 3600000,
//         item:[
//             {
//                 id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//                 name: "Áo khoác A",
//                 src:require('../assets/img_coat_3.jpg'),
//                 status: "New Arrival",
//                 old_price: 1200000,
//                 price: 990000,
//                 color: 'Xám trắng',
//                 size: 'XL',
//                 quantity: 1,
//             },
//             {
//                 id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
//                 name: "Áo khoác B",
//                 src:require('../assets/img_coat_4.jpg'),
//                 status: "Super Sale",
//                 old_price: 2400000,
//                 price: 1499000,
//                 color: 'Đen',
//                 size: 'XL',
//                 quantity: 1,
//             },
//         ],
//         total_product: 2,
//         status: 'Đang xử lý',
//     },
//     {
//         bill_code: 'FASN3345',
//         datetime: '13:08  27-09-2021',
//         name: 'Hieu Hoang',
//         phone_number: '0987654321',
//         address: '96 ngõ 204 Trần Duy Hưng, Cầu Giấy, Hà Nội',
//         sale_value: 140000,
//         delivery_value: 40000,
//         final_value: 5370000,
//         total_value: 5470000,
//         item:[
//             {
//                 id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//                 name: "Áo khoác A",
//                 src:require('../assets/img_coat_3.jpg'),
//                 status: "New Arrival",
//                 old_price: 1200000,
//                 price: 990000,
//                 color: 'Xám trắng',
//                 size: 'XL',
//                 quantity: 1,
//             },
//             {
//                 id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
//                 name: "Áo khoác B",
//                 src:require('../assets/img_coat_4.jpg'),
//                 status: "Super Sale",
//                 old_price: 2400000,
//                 price: 1499000,
//                 color: 'Đen',
//                 size: 'XL',
//                 quantity: 1,
//             },
//             {
//                 id: "45345a0f-3da1-471f-bd96-145571e29d72",
//                 name: "Áo khoác D",
//                 src:require('../assets/img_fav_1.png'),
//                 status: "New Arrival",
//                 old_price: 3400000,
//                 price: 2990000,
//                 color: 'Xanh dương',
//                 size: 'M',
//                 quantity: 1,
//             },
//         ],
//         total_product: 3,
//         status: 'Đang vận chuyển',
//     },
//     {
//         bill_code: 'FASN8986',
//         datetime: '13:08  30-09-2020',
//         name: 'Hieu Hoang',
//         phone_number: '0987654321',
//         address: '96 ngõ 204 Trần Duy Hưng, Cầu Giấy, Hà Nội',
//         sale_value: 45000,
//         delivery_value: 40000,
//         final_value: 985000,
//         total_value: 990000,
//         item:[
//             {
//                 id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//                 name: "Áo khoác A",
//                 src:require('../assets/img_coat_3.jpg'),
//                 status: "New Arrival",
//                 old_price: 1200000,
//                 price: 990000,
//                 color: 'Xám trắng',
//                 size: 'XL',
//                 quantity: 1,
//             },
//         ],
//         total_product: 1,
//         status: 'Đã hủy',
//     },
//     {
//         bill_code: 'FASN3555',
//         datetime: '13:08  27-11-2020',
//         name: 'Hieu Hoang',
//         phone_number: '0987654321',
//         address: '96 ngõ 204 Trần Duy Hưng, Cầu Giấy, Hà Nội',
//         sale_value: 0,
//         delivery_value: 40000,
//         total_value: 990000,
//         final_value: 1030000,
//         item:[
//             {
//                 id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//                 name: "Áo khoác A",
//                 src:require('../assets/img_coat_3.jpg'),
//                 status: "New Arrival",
//                 old_price: 1200000,
//                 price: 990000,
//                 color: 'Xám trắng',
//                 size: 'XL',
//                 quantity: 1,
//             },
//         ],
//         total_product: 1,
//         status: 'Đã hoàn thành',
//     },
// ]
const bill_data = DATA_BILL
const MyOrder = ({navigation}) => {

    const getColor = (status) => {
        let color;
        if (status === 'Đang xử lý') {
            color = '#AEAEB2';
        } else if (status === 'Đã hủy') {
            color = '#F44336';
        } else if (status === 'Đang vận chuyển') {
            color = '#0075FF';
        } else if (status === 'Đã hoàn thành') {
            color = '#4CAF50';
        }
        return color;
    };


    return (
        <View style={styles.container}>
            <FlatList style={{flex: 1}}
                      data={bill_data}
                      renderItem =
                          {
                              ({item, index}) =>
                                  <TouchableOpacity style={{borderBottomWidth: 0.5, borderColor: '#DADADA',
                                      paddingVertical: 20, paddingHorizontal: 15}}
                                                    onPress={() => {navigation.navigate('OrderDetails', {bill: item})}}
                                                    activeOpacity={1}
                                  >
                                      <View style={styles.item}>
                                          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                                              <View style={{flex: 1, flexDirection: 'row'}}>
                                                  <Text style={styles.text_normal}>Mã đơn hàng: </Text>
                                                  <Text style={styles.text_bold}>{item.bill_code}</Text>
                                              </View>
                                              <Text style={styles.text_normal}>{item.datetime}</Text>
                                          </View>
                                          <Text style={[styles.text_normal, {marginBottom: 5}]}>{item.address}</Text>
                                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                              <Text style={styles.text_normal}>Số tiền: </Text>
                                              <NumberFormat  value={item.final_value}
                                                             displayType={'text'}
                                                             thousandSeparator={true}
                                                             suffix={' đ'}
                                                             renderText={(value, props) =>
                                                                 <Text style={styles.text_bold}{...props}>{value}</Text>
                                                             }/>
                                          </View>
                                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                              <View style={{flex: 1, flexDirection: 'row'}}>
                                                  <Text style={styles.text_normal}>Trạng Thái: </Text>
                                                  <Text style={[styles.text_normal, {color: getColor(item.status)}]}>
                                                      {item.status}
                                                  </Text>
                                              </View>
                                              <AntDesign name="arrowright" size={24} color="black" />
                                          </View>
                                      </View>
                                  </TouchableOpacity>
                          }
                      keyExtractor={item => item.bill_code}
                      showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    text_normal: {
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 21,
    },
    text_bold: {
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 21,
    },
});

export default MyOrder;
