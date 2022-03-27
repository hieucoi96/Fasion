import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';

const ChangePassword = ({navigation}) => {

    const [phone_number, setPhone] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [confirm_code, setConfirmCode] = useState('');

    return (
        <View style={styles.container}>
            <Text style = {styles.brand}>fasions.</Text>
            <Text style = {styles.title}>Đăng ký ngay nào</Text>

            <View style = {styles.input_container}>
                <View style = {styles.inputSection}>
                    <TextInput style = {styles.input}
                               onChangeText = {phone => setPhone(phone)}
                               value = {phone_number}
                               placeholder = "Số điện thoại"
                               placeholderTextColor = "#636366"/>
                </View>

                <View style = {styles.inputSection}>
                    <TextInput style = {styles.input}
                               onChangeText = {new_password => setNewPassword(new_password)}
                               value = {new_password}
                               placeholder = "Mật khẩu mới"
                               placeholderTextColor = "#636366"/>
                </View>

                <View style = {styles.inputSection}>
                    <TextInput style = {styles.input}
                               onChangeText = {code => setConfirmCode(code)}
                               value = {confirm_code}
                               placeholder = "Mã xác nhận"
                               placeholderTextColor = "#636366"/>
                </View>
            </View>

            <TouchableOpacity style = {styles.button_login}><Text style = {styles.text_login_text}>Thay đổi</Text></TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '4%',
    },
    brand: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 40,
        lineHeight: 47,
    },
    title: {
        marginTop: 43,
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 19,
    },
    input_container: {

    },
    input:{
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 16,
        width: '100%',
        color: '#000000',
    },
    inputSection: {
        marginTop: 41,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#000000',
    },
    button_login: {
        width: '100%',
        height: 42,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent:'center',
        marginTop: 41,
    },
    text_login_text: {
        color: "#FFFFFF",
        textTransform: 'uppercase',
    },
});

export default ChangePassword;
