import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import {EvilIcons} from "@expo/vector-icons";
import {showMessage} from "react-native-flash-message";


const AddAddress = ({route, navigation}) => {

    const {name, type} = route.params ?? {}
    const [fullName, setFullName] = useState('')
    const [phone_number, setPhone] = useState('')
    const [addressDetail, setAddress] = useState('')

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const [city, setCity] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')

    const listInputAddress = [
        {placeholder: 'Tỉnh/Thành Phố', value: city},
        {placeholder: 'Quận/Huyện', value: district},
        {placeholder: 'Phường/Xã', value: ward}
    ]

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
            navigation.navigate('SelectAddress', { name: 'Tỉnh/Thành Phố', lastScreen: 'AddAddress'})
        }
        if(placeholder === "Quận/Huyện"){
            if(checkCitySelected()){
                navigation.navigate('SelectAddress', { name: "Quận/Huyện", city: city, lastScreen: 'AddAddress' })
            }
        }
        if(placeholder === "Phường/Xã"){
            if(checkCitySelected() && checkDistrictSelected()){
                navigation.navigate('SelectAddress', { name: "Phường/Xã", district: district, city: city, lastScreen: 'AddAddress' })
            }
        }
    }

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

    return (
        <KeyboardAvoidingView style={styles.container} behavior={'height'}>
            <View style={{flex: 1, width: "100%"}}>
                <TextInput style = {[styles.input, {marginTop: 30}]}
                           onChangeText = {name => setFullName(name)}
                           value = {fullName}
                           placeholder = "Họ tên"
                           placeholderTextColor = "#636366"/>
                <TextInput style = {styles.input}
                           onChangeText = {phone => setPhone(phone)}
                           value = {phone_number}
                           placeholder = "Số điện thoại"
                           placeholderTextColor = "#636366"/>
                {inputAddress}
                <TextInput style = {styles.input}
                           onChangeText = {address => setAddress(address)}
                           value = {addressDetail}
                           placeholder = "Địa chỉ chi tiết"
                           placeholderTextColor = "#636366"
                />
                <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginTop: 25}}>
                    <Text style={[styles.text_normal, {flex: 1, alignSelf: 'center'}]}>Đặt làm địa chỉ mặc định</Text>
                    <Switch
                        trackColor={{ false: "#AEAEB2", true: "#28f000" }}
                        thumbColor={isEnabled ? "#fdfffa" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View>
            <TouchableOpacity style = {styles.button_confirm}
                              onPress = {() => {
                                    navigation.navigate('Delivery', {address: {
                                        name: fullName,
                                        phone_number: phone_number,
                                        address: addressDetail + ', ' + ward + ', ' + district + ', ' + city,
                                        default: isEnabled}})
                              }}
                              activeOpacity={0.8}>
                <Text style = {styles.text_confirm}>Xác nhận</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        paddingHorizontal: '4%',
    },
    input:{
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 16,
        width: '100%',
        borderBottomWidth: 0.5,
        borderColor: '#000000',
        marginTop: 40,
    },
    text_normal: {
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 21,
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
        width: '100%',
        borderBottomWidth: 0.5,
        borderColor: '#000000',
        alignItems: 'center',
        flexDirection: 'row',
    },
    button_confirm: {
        width: '100%',
        height: 42,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent:'center',
        marginBottom: 15,
    },
    text_confirm: {
        color: "#FFFFFF",
        textTransform: 'uppercase',
    },
});

export default AddAddress;
