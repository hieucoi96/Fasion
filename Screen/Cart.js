import React, {useState, useEffect, useRef} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
    Modal,
    ImageBackground,
    Animated
} from 'react-native';
import NumberFormat from "react-number-format";
import {EvilIcons, AntDesign} from '@expo/vector-icons';
import {changeInfo, decreaseQuantity, deleteItem, increaseQuantity} from "../store/itemAction";
import { useDispatch, useSelector } from 'react-redux'
import FlashMessage, {showMessage} from "react-native-flash-message";
import Ripple from "react-native-material-ripple";

const Cart = ({navigation}) => {

    const dispatch = useDispatch()
    const data = useSelector(state => state.itemReducer.data)

    const modalFlash = useRef()
    const [sizes, setSizes] = useState([])
    const [total_product, setTotalProduct] = useState(0)
    const [total_value, setTotalValue] = useState(0)
    const [selectedItem, setSelectedItem] = useState({status: '', old_price: '', name: '', variant: []})
    const [selectedTemp, setSelectedTemp] = useState({
        v_id: '',
        color: '',
        src: '',
        price: ''})
    const [selectedSize, setSelectedSize] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const fadeAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        let sumProduct = data.reduce(function(prev, current){return prev + +current.quantity}, 0)
        setTotalProduct(sumProduct)
        let sumValue = data.reduce(function(prev, current){return prev + current.price*current.quantity}, 0)
        setTotalValue(sumValue)
    },[data])

    useEffect(() =>{
        if(selectedItem !== undefined){
            const sources = selectedItem.variant.reduce(function(result, item) {
                if (item.color === selectedTemp.color) {
                    result.push(item.size);
                }
                return result;
            }, []);
            setSizes(sources)
        }
    },[selectedTemp])



    let result = []
    if(selectedItem !== undefined) {
        result = selectedItem.variant.reduce((unique, o) => {
            if (!unique.some(obj => obj.color === o.color)) {
                unique.push(o);
            }
            return unique;
        }, [])
    }

    const listColors = result.map((item, index) =>
        <View style={[styles.option_container, {borderColor: selectedTemp.color === item.color ? 'black' : 'white'}]}
              key={index}>
            <TouchableOpacity
                style={[styles.color, {backgroundColor: item.rgb}]}
                activeOpacity={1}
                onPress={() => {
                    if(selectedTemp.color !== item.color){
                        Animated.timing(fadeAnim, {
                            toValue: 0.5,
                            duration: 150,
                            useNativeDriver: true
                        }).start(() =>{
                            Animated.timing(fadeAnim, {
                                toValue: 1,
                                duration: 150,
                                useNativeDriver: true
                            }).start();
                            setSelectedSize('')
                            setSelectedTemp({v_id: '', color: item.color, src: item.src, price: item.price});
                        });
                    }
                }}/>
        </View>
    );

    const listSizes = sizes.map((item, index) =>
        <View style={[styles.option_container, {borderColor: selectedSize === item ? 'black' : 'white'}]}
              key={index*(-1)}>
            <TouchableOpacity
                style={styles.size}
                onPress={() => {
                    setSelectedSize(item);
                }}>
                <Text style={styles.text_size}>{item}</Text>
            </TouchableOpacity>
        </View>
    );

    function removeItem(key) {
        Alert.alert(
            "Xóa?",
            "Bạn có muốn xóa sản phẩm khỏi giỏ hàng?",
            [
                {
                    text: "Không",
                    onPress: () => {

                    },
                    style: "cancel"
                },
                { text: "Có", onPress: () => dispatch(deleteItem(key)) }
            ]
        );
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <TouchableOpacity style={styles.centeredView}
                                  onPress={() => setModalVisible(!modalVisible)}
                                  activeOpacity={1}>
                    <TouchableOpacity style={styles.modalView}
                                      onPress={() => {}}
                                      activeOpacity={1}>
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                            }}
                        >
                            <ImageBackground style={{width: '100%', height: 289}} source={selectedTemp.src}>
                                <TouchableOpacity style={{alignSelf:'flex-end', margin: 10}}
                                                  onPress={() => {setModalVisible(!modalVisible)}}>
                                    <EvilIcons name="close" size={24} color="black"/>
                                </TouchableOpacity>
                            </ImageBackground>
                        </Animated.View>

                        <View style={{padding: 15, alignItems:'flex-start'}}>
                            <Text style={[styles.text_small, {fontWeight: 'bold', textTransform: 'uppercase',}]}>
                                {selectedItem.status}
                            </Text>
                            <Text style={styles.text_normal}>{selectedItem.name}</Text>
                            <NumberFormat  value={selectedItem.old_price}
                                           displayType={'text'}
                                           thousandSeparator={true}
                                           suffix={' đ'}
                                           renderText={(value, props) =>
                                               <Text style={styles.text_old_price}{...props}>{value}</Text>
                                           }/>

                            <NumberFormat  value={selectedTemp.price}
                                           displayType={'text'}
                                           thousandSeparator={true}
                                           suffix={' đ'}
                                           renderText={(value, props) =>
                                               <Text style={styles.text_normal}{...props}>{value}</Text>
                                           }
                            />
                            <Text style={[styles.text_small, {fontWeight: 'bold', textTransform: 'uppercase', marginTop: 15}]}>
                                Màu sắc
                            </Text>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                {listColors}
                            </View>
                            <Text style={[styles.text_small, {fontWeight: 'bold', textTransform: 'uppercase', marginTop: 15}]}>
                                Size
                            </Text>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                {listSizes}
                            </View>
                        </View>
                        <TouchableOpacity style={styles.button_order}
                                          activeOpacity={0.8}
                                          onPress={() => {
                                              if(selectedSize === ''){
                                                  modalFlash.current.showMessage({
                                                      message: "Bạn chưa chọn size!",
                                                      description: "Vui lòng chọn size sản phẩm!",
                                                      type: "warning",
                                                      icon: { icon: "auto", position: "left" },
                                                      backgroundColor: '#454545',
                                                  });
                                                  return
                                              }
                                              let v_id
                                              for(let i = 0; i < selectedItem.variant.length; i++) {
                                                  if (selectedItem.variant[i].color === selectedTemp.color
                                                      && selectedItem.variant[i].size === selectedSize) {
                                                      console.log(selectedItem.variant[i].v_id)
                                                      v_id = selectedItem.variant[i].v_id
                                                  }
                                              }
                                              dispatch(changeInfo(
                                                  selectedItem.key,
                                                  v_id,
                                                  selectedTemp.color,
                                                  selectedTemp.src,
                                                  selectedTemp.price,
                                                  selectedSize))
                                              setModalVisible(!modalVisible);
                                          }}
                        >
                            <Text style={styles.text_order}>Thay đổi</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <FlashMessage ref={modalFlash}
                                  // position={ Platform.OS === 'ios' ? "top" : {top:StatusBar.currentHeight, left:0, right:0} }
                                  floating={Platform.OS !== 'ios'}/>
                </TouchableOpacity>
            </Modal>
            <View style={{flex: 1, padding: 15}}>
                <FlatList
                          data={data}
                          renderItem =
                              {
                                  ({item}) =>
                                      <TouchableOpacity style={{flexDirection: 'row', marginBottom: 20}}
                                                        onPress={() => {setSelectedItem(item);
                                                                        setModalVisible(true);
                                                                        setSelectedTemp({
                                                                            v_id: '',
                                                                            color: item.color,
                                                                            src: item.src,
                                                                            price: item.price});
                                                                        setSelectedSize(item.size)}}>
                                          <Image style={{width: 100, height: 139, marginRight: 10}} source={item.src}/>

                                          <View style={{flexDirection: 'column', flex: 1}}>
                                              <View style={{flex: 1}}>
                                                  <View style={{flexDirection: 'row'}}>
                                                      <Text style={[styles.text_small, {fontWeight: 'bold', textTransform: 'uppercase'}]}>
                                                          {item.status}
                                                      </Text>
                                                  </View>
                                                  <Text style={styles.text_normal}>{item.name}</Text>
                                                  <Text style={[styles.text_small, {marginTop: 1}]}>{item.color}</Text>
                                                  <Text style={[styles.text_small, {marginTop: 2}]}>Size: {item.size}</Text>
                                              </View>
                                              <View>
                                                  <NumberFormat  value={item.old_price}
                                                                 displayType={'text'}
                                                                 thousandSeparator={true}
                                                                 suffix={' đ'}
                                                                 renderText={(value, props) =>
                                                                     <Text style={styles.text_old_price}{...props}>{value}</Text>
                                                                 }/>

                                                  <NumberFormat  value={item.price}
                                                                 displayType={'text'}
                                                                 thousandSeparator={true}
                                                                 suffix={' đ'}
                                                                 renderText={(value, props) =>
                                                                     <Text style={styles.text_normal}{...props}>
                                                                         {value}
                                                                     </Text>
                                                                 }/>
                                              </View>
                                          </View>
                                          <View>
                                              <View style={{flex: 1}}>
                                                  <TouchableOpacity style={{alignSelf:'flex-end', marginRight: -4}}
                                                                    onPress={() => removeItem(item.v_id)}>
                                                      <EvilIcons name="close" size={24} color="black"/>
                                                  </TouchableOpacity>
                                              </View>

                                              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                  <TouchableOpacity
                                                      style={{padding: 5}}
                                                      onPress={() => {dispatch(decreaseQuantity(item))}}>
                                                      <AntDesign name="minus" size={16} color="black" />
                                                  </TouchableOpacity>
                                                  <Text style={[styles.text_normal, {width: 20, textAlign: 'center'}]}
                                                        numberOfLines={1}>
                                                      {item.quantity}
                                                  </Text>
                                                  <TouchableOpacity
                                                      style={{padding: 5}}
                                                      onPress={() => dispatch(increaseQuantity(item))}>
                                                      <AntDesign name="plus" size={16} color="black" />
                                                  </TouchableOpacity>
                                              </View>
                                          </View>
                                      </TouchableOpacity>
                              }
                          keyExtractor={item => item.key}
                          showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={styles.bottom_container}>
                <View style={{marginTop: 10, flexDirection: 'row'}}>
                    <Text style={[styles.text_normal, {flex: 1}]}>Số lượng</Text>
                    <Text>{total_product}</Text>
                </View>
                <View style={{marginTop: 5, flexDirection: 'row'}}>
                    <Text style={[styles.text_normal, {flex: 1}]}>Thành tiền</Text>
                    <NumberFormat  value={total_value}
                                   displayType={'text'}
                                   thousandSeparator={true}
                                   suffix={' đ'}
                                   renderText={(value, props) =>
                                       <Text style={styles.text_normal}{...props}>{value}</Text>
                                   }
                    />
                </View>
                <Ripple style = {styles.button_order}
                        onPress = {() => {
                            if(data.length === 0){
                                showMessage({
                                    message: "Bạn chưa có sản phẩm nào trong giỏ hàng!",
                                    icon: { icon: "auto", position: "left" },
                                    backgroundColor: '#454545',
                                })
                                return
                            }
                            navigation.navigate('Delivery', {
                                total_product: total_product,
                                total_value: total_value,
                                data: data,
                            })}
                        }
                        rippleColor={'#ffffff'}
                        rippleOpacity={0.4}
                        rippleDuration={600}>
                    <Text style = {styles.text_order}>Đặt hàng</Text>
                </Ripple>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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
    bottom_container: {
        width: '100%',
        paddingHorizontal: '4%',
        marginBottom: 25,
        borderColor: '#AEAEB2',
        borderTopWidth: 0.5,
    },
    text_normal: {
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 21,
    },
    text_old_price: {
        marginTop: 1,
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        lineHeight: 15,
        textDecorationLine: 'line-through',
    },
    text_small: {
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        lineHeight: 15,
    },
    centeredView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "#fff",
        width: '92%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    option_container: {
        padding: 2,
        borderWidth: 0.25,
        marginRight: 5,
    },
    color: {
        width: 22,
        height: 22,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    size: {
        width: 22,
        height: 22,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_size: {
        color: '#ffffff',
        includeFontPadding: false,
        textAlignVertical: 'center',
    }
});

export default Cart;
