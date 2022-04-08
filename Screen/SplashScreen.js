import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import LottieView from 'lottie-react-native';

const Search = ({navigation}) => {

    return (
        <View style={styles.container}>
            <LottieView
                style={{opacity: 0.92, marginBottom: '15%'}}
                source={require('../assets/lotties/fashion-ver4.json')}
                loop={false}
                speed={1.5}
                autoPlay
                onAnimationFinish={() => navigation.navigate('Login')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Search;
