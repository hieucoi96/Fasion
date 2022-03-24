import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { showMessage, hideMessage } from "react-native-flash-message";
import Ripple from "react-native-material-ripple";

const ChangeInfo = ({route, navigation}) => {

    const {name, type} = route.params ?? {}
    const [fullName, setFullName] = useState('')
    const [phone_number, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [addressDetail, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')

    useEffect(() =>{
            if(type === 'Tỉnh/Thành Phố'){
                setDistrict('')
                setWard('')
                setCity(name)
            }
            if(type === 'Quận/Huyện'){
                setWard('')
                setDistrict(name)
            }
            if(type === 'Phường/Xã'){
                setWard(name)
            }
        },[name])


    const listInputAddress = [
        {placeholder: 'Tỉnh/Thành Phố', value: city},
        {placeholder: 'Quận/Huyện', value: district},
        {placeholder: 'Phường/Xã', value: ward}
    ]

    const inputAddress = listInputAddress.map((item, index) =>
        <TouchableOpacity style = {styles.address_container} activeOpacity={0.8} key={index}
                          onPress={() => openSelectAddress(item.placeholder)}>
            <TextInput style = {styles.inputAddress}
                       value = {item.value}
                       placeholder = {item.placeholder}
                       placeholderTextColor = "#636366"
                       editable={false}
            />
            <EvilIcons name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
    );

    function checkCitySelected(){
        if(city === ''){
            showMessage({
                message: "Lỗi!",
                description: "Vui lòng chọn Tỉnh / Thành Phố",
                type: "warning",
                icon: { icon: "auto", position: "left" },
                backgroundColor: '#f2ac50',
            });
            return false;
        }
        return true;
    }

    function checkDistrictSelected(){
        if(district === ''){
            showMessage({
                message: "Lỗi!",
                description: "Vui lòng chọn Quận / Huyện",
                type: "warning",
                icon: { icon: "auto", position: "left" },
                backgroundColor: '#f2ac50',
            });
            return false;
        }
        return true;
    }

    function openSelectAddress(placeholder){
        if(placeholder === 'Tỉnh/Thành Phố'){
            navigation.navigate('SelectAddress', { name: 'Tỉnh/Thành Phố', lastScreen: 'ChangeInfo' })
        }
        if(placeholder === "Quận/Huyện"){
            if(checkCitySelected()){
                navigation.navigate('SelectAddress', { name: "Quận/Huyện", city: city, lastScreen: 'ChangeInfo' })
            }
        }
        if(placeholder === "Phường/Xã"){
            if(checkCitySelected() && checkDistrictSelected()){
                navigation.navigate('SelectAddress', { name: "Phường/Xã", district: district, city: city, lastScreen: 'ChangeInfo' })
            }
        }
    }

    return (
        <ScrollView style={{backgroundColor: '#ffffff',}} contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput style = {[styles.input, {marginTop: 0}]}
                               onChangeText = {name => setFullName(name)}
                               value = {fullName}
                               placeholder = "Họ tên"
                               placeholderTextColor = "#636366"/>
                    <TextInput style = {styles.input}
                               onChangeText = {phone => setPhone(phone)}
                               value = {phone_number}
                               placeholder = "Số điện thoại"
                               placeholderTextColor = "#636366"/>
                    <TextInput style = {styles.input}
                               onChangeText = {email => setEmail(email)}
                               value = {email}
                               placeholder = "Email"
                               placeholderTextColor = "#636366"/>
                    <TextInput style = {styles.input}
                               onChangeText = {pass => setPassword(pass)}
                               value = {password}
                               placeholder = "Mật khẩu"
                               placeholderTextColor = "#636366"/>
                    {inputAddress}
                    <TextInput style = {styles.input}
                               onChangeText = {address => setAddress(address)}
                               value = {addressDetail}
                               placeholder = "Địa chỉ chi tiết "
                               placeholderTextColor = "#636366"/>
                </View>
                {/*<TouchableOpacity style = {styles.button}*/}
                {/*                  onPress = {() => {navigation.navigate("MainStack")}}*/}
                {/*                  activeOpacity={0.8}>*/}
                {/*    <Text style = {styles.text_button}>Cập nhật</Text>*/}
                {/*</TouchableOpacity>*/}
                <Ripple style = {styles.button}
                        onPress = {() => {navigation.navigate("MainStack")}}
                        rippleColor={'#ffffff'}
                        rippleOpacity={0.4}
                        rippleDuration={600}>
                    <Text style = {styles.text_button}>Cập nhật</Text>
                </Ripple>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 15,
    },
    inputContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
    },
    input:{
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 16,
        width: 345,
        borderBottomWidth: 0.5,
        borderColor: '#000000',
        marginTop: 40,
    },
    inputAddress: {
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 16,
        flex: 1,
        color: '#000000',
    },
    address_container: {
        marginTop: 40,
        width: 345,
        borderBottomWidth: 0.5,
        borderColor: '#000000',
        alignItems: 'center',
        flexDirection: 'row',
    },

    button: {
        width: 345,
        height: 42,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent:'center',
        marginBottom: 15,
    },
    text_button: {
        color: "#FFFFFF",
        textTransform: 'uppercase',
    },
});

export default ChangeInfo;
