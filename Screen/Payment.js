import React, {useState, useRef} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    ImageBackground, Modal
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import NumberFormat from "react-number-format";
import LottieView from "lottie-react-native";

const Payment = ({route, navigation}) => {
    const {data, item, total_value, total_product} = route.params
    const [value, setValue] = useState('cash')
    const [delivery_value, setDelivery] = useState(20000)
    const [sale_value, setSale] = useState(0)

    const [modalVisible, setModalVisible] = useState(false)

    const imageList = data.map((item, index) =>
        index < 3 && ( <Image source={item.src} style={{width: '30%', height: 139, marginRight: 5}}/> )
    );
    const length = data.length - 3
    const timerRef = useRef();

    function openOrder () {
        clearTimeout(timerRef.current)
        navigation.navigate('OrderDetails', {bill:{
                bill_code: 'FASN8888',
                datetime: '12:48  01-06-2021',
                name: item.name,
                phone_number: item.phone_number,
                address: item.address,
                sale_value: sale_value,
                delivery_value: delivery_value,
                total_value: total_value,
                final_value: total_value + delivery_value - sale_value,
                total_product: total_product,
                item: data
        }})
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <TouchableOpacity style={styles.centeredView}
                                  onPress={() => {
                                      setModalVisible(!modalVisible)
                                      if(value === 'cash'){
                                          openOrder()
                                      }
                                  }}
                                  activeOpacity={1}>
                    <TouchableOpacity style={styles.modalView}
                                      onPress={() => {}}
                                      activeOpacity={1}>
                        <LottieView
                            style={{width: 100, height: 100, marginTop: '5%'}}
                            source={value === 'cash' ?
                                require('../assets/lotties/check-mark.json')
                                :
                                require('../assets/lotties/icon_fail.json') }
                            loop={false}
                            autoPlay
                        />
                        <View style={{alignItems: 'center'}}>
                            <Text style={[styles.text_normal, {fontWeight: 'bold', marginTop: 10}]}>
                                {value === 'cash' ? 'Đặt hàng thành công' : 'Đặt hàng không thành công'}
                            </Text>
                            <Text style={{paddingHorizontal: '10%', textAlign: 'center', marginBottom: '15%', marginTop: 15}}>
                                {value === 'cash' ? 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Chúng tôi sẽ xử lý ' +
                                    'đơn hàng của bạn trong thời gian ngắn nhất.'
                                    : 'Vui lòng sử dụng phương thức thanh toán khác hoặc thử lại'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
            <View style={{flex: 1, paddingHorizontal: '4%',}}>
                <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                    <Text style={[styles.text_small, {alignSelf: 'flex-end', paddingVertical: 10}]}>Xem tất cả</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                    {imageList}
                    {length > 0 &&
                    (<Text style={[styles.text_normal,{textAlignVertical: 'center', fontWeight: 'bold'}]}> +{length}</Text>)}
                </View>
                <View style={{paddingBottom: 15, borderColor: '#AEAEB2', borderBottomWidth: 0.5}}>
                    <Text style={[styles.text_normal, {marginTop: 25, fontWeight: 'bold'}]} >Địa chỉ nhận hàng</Text>
                    <Text style={[styles.text_normal, {marginTop: 10}]}>{item.name} - {item.phone_number}</Text>
                    <Text style={[styles.text_normal, {marginTop: 1}]}>{item.address}</Text>
                    {item.default && (<Text style={[styles.text_small, {color: '#0075FF', marginTop: 3}]}>[Mặc định]</Text>)}
                </View>
                <View>
                    <Text style={[styles.text_normal, {marginTop: 15, fontWeight: 'bold'}]} >Hình thức thanh toán</Text>

                    <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <RadioButton value="cash" color={'#000000'} uncheckedColor={'#000000'}/>
                            <Text style={styles.text_normal}>Thanh toán bằng tiền mặt</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <RadioButton value="momo" color={'#000000'} uncheckedColor={'#000000'}/>
                            <Text style={styles.text_normal}>Thanh toán qua ví momo</Text>
                            <Image style={{width: 26, height: 26, marginLeft: 5}} source={require('../assets/logo_momo.png')}/>
                        </View>
                    </RadioButton.Group>
                    <View style={styles.sale_container}>
                        <TextInput placeholder="Nhập mã giảm giá" style={{flex: 1}}/>
                        <TouchableOpacity style={{backgroundColor: '#000000'}} activeOpacity={0.8}
                                          onPress={() => setSale(20000)}>
                            <Text style={styles.btn_sale}>ÁP DỤNG</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.bottom_container}>
                <View style={{marginTop: 20, flexDirection: 'row'}}>
                    <Text style={[styles.text_normal, {flex: 1}]}>Tạm tính</Text>
                    <NumberFormat  value={total_value}
                                   displayType={'text'}
                                   thousandSeparator={true}
                                   suffix={' đ'}
                                   renderText={(value, props) =>
                                       <Text style={styles.text_normal}{...props}>{value}</Text>
                                   }
                    />
                </View>
                <View style={{marginTop: 5, flexDirection: 'row'}}>
                    <Text style={[styles.text_normal, {flex: 1}]}>Phí giao hàng</Text>
                    <NumberFormat  value={delivery_value}
                                   displayType={'text'}
                                   thousandSeparator={true}
                                   suffix={' đ'}
                                   renderText={(value, props) =>
                                       <Text style={styles.text_normal}{...props}>{value}</Text>
                                   }
                    />
                </View>
                {sale_value > 0 && (<View style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.text_normal, {flex: 1}]}>Khuyến mãi</Text>
                    <NumberFormat  value={sale_value}
                                   displayType={'text'}
                                   thousandSeparator={true}
                                   suffix={' đ'}
                                   renderText={(value, props) =>
                                       <Text style={[styles.text_small, {color: '#0075FF'}]}{...props}>-{value}</Text>
                                   }
                    />
                </View>)}
                <View style={{marginTop: 5, flexDirection: 'row'}}>
                    <Text style={[styles.text_normal, {flex: 1, fontWeight: 'bold'}]}>Thành tiền</Text>
                    <NumberFormat  value={total_value + delivery_value - sale_value}
                                   displayType={'text'}
                                   thousandSeparator={true}
                                   suffix={' đ'}
                                   renderText={(value, props) =>
                                       <Text style={[styles.text_normal, {fontWeight: 'bold'}]}{...props}>{value}</Text>
                                   }
                    />
                </View>
                <TouchableOpacity style = {styles.button_order}
                                  onPress = {() => {
                                        setModalVisible(true);
                                      timerRef.current = setTimeout(function() {
                                            setModalVisible(false);
                                            if(value === 'cash'){
                                                openOrder()
                                            }
                                        }, 3500);
                                  }}
                                  activeOpacity={0.8}>
                    <Text style = {styles.text_order}>Đặt hàng</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    text_small: {
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        lineHeight: 15,
    },
    text_normal: {
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 21,
    },
    sale_container: {
        borderColor: '#000000',
        borderWidth: 0.5,
        paddingLeft: 15,
        flexDirection: 'row',
        marginTop: 20,
    },
    btn_sale: {
        color: '#ffffff',
        paddingHorizontal: 18,
        lineHeight: 50,
    },
    bottom_container: {
        width: '100%',
        paddingHorizontal: '4%',
        marginBottom: 25,
        borderColor: '#AEAEB2',
        borderTopWidth: 0.5,
    },
    button_order: {
        width: '100%',
        height: 42,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent:'center',
        marginTop: 12,
    },
    text_order: {
        color: "#FFFFFF",
        textTransform: 'uppercase',
    },
    centeredView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "#fff",
        width: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
});

export default Payment;
