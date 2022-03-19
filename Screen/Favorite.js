import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, ImageBackground, Image, TouchableOpacity, SafeAreaView,} from 'react-native';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux'
import {changeFav} from "../store/itemAction";

const heartOutline = require('../assets/icon_heart_outline.png');
const heartFull = require('../assets/icon_heart_full.png');

const Item = ({ item, addOrRemoveFav, favorite, onPress }) => {

    return(
        <TouchableOpacity style={{marginTop: 15, width: '48%',}}
                          onPress={onPress}
                          activeOpacity={1}>
            <View style={styles.item}>

                <ImageBackground
                    style={styles.image_fav}
                    source={item.src}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={addOrRemoveFav}
                    >
                        <Image
                            source={favorite.indexOf(item) > -1 ? heartFull : heartOutline}
                            style={styles.iconFav}
                        />
                    </TouchableOpacity>
                </ImageBackground>

                <Text style={styles.text_status}>{item.status}</Text>
                <Text style={styles.text_name}>{item.name}</Text>

                <NumberFormat  value={item.old_price}
                               className="foo"
                               displayType={'text'}
                               thousandSeparator={true}
                               suffix={' đ'}
                               renderText={(value, props) =>
                                   <Text style={styles.text_old_price}{...props}>{value}</Text>
                               }/>

                <NumberFormat  value={item.price}
                               className="foo"
                               displayType={'text'}
                               thousandSeparator={true}
                               suffix={' đ'}
                               renderText={(value, props) =>
                                   <Text style={styles.text_price}{...props}>{value}</Text>
                               }/>
            </View>
        </TouchableOpacity>
    );
}

const Favorite = ({navigation}) => {

    const dispatch = useDispatch()
    const data = useSelector(state => state.favReducer.data)
    const temp = [...data]
    const fav_product_list = useSelector(state => state.favReducer.data)
    const renderItem = ({ item }) => {
        return (
            <Item
                item={item}
                addOrRemoveFav={() => dispatch(changeFav(item, item.id))}
                favorite={fav_product_list}
                onPress={() => navigation.navigate('ProductDetails', {item: item})}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList style={{flex: 1}}
                      data={temp}
                      renderItem ={renderItem}
                      keyExtractor={item => item.id}
                      numColumns={2}
                      showsVerticalScrollIndicator={false}
                      columnWrapperStyle={{justifyContent:'space-between'}}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: '4%'
    },
    item: {

    },
    image_fav: {
        width: '100%',
        height: 273,
        resizeMode: "center",
    },
    text_status: {
        marginTop: 7,
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 10,
        lineHeight: 15,
    },
    text_name: {
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
    text_price: {
        fontFamily: 'Open_Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 21,
    },
    iconFav: {
        width: 20,
        height: 18,
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 10,
    },
});

export default Favorite;
