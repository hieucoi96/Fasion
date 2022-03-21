import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList, ImageBackground, Image, TouchableOpacity, SafeAreaView,} from 'react-native';
import NumberFormat from 'react-number-format';
import {useDispatch, useSelector} from "react-redux";
import {changeFav} from "../store/itemAction";
import {DATA_PRODUCT} from "../api/constants";

const heartOutline = require('../assets/icon_heart_outline.png');
const heartFull = require('../assets/icon_heart_full.png');

const ListProduct = ({route, navigation}) => {

    const {name} = route.params;

    let data = DATA_PRODUCT

    const [selectedView, setSelectedView] = useState('grid');

    function selectView() {
        if(selectedView === 'grid'){
            setSelectedView('list')
        }else{
            setSelectedView('grid')
        }
    }

    const Item = ({ item, addOrRemoveFav, favorite, textColor }) => {
        const fav_product_list = useSelector(state => state.favReducer.data)
        let ids = fav_product_list.map( (item) => item.id);
        const dispatch = useDispatch()

        return(
            <TouchableOpacity style={selectedView === 'grid' ? styles.grid : styles.single}
                              onPress={() => navigation.navigate('ProductDetails', {item: item})}
                              activeOpacity={1}>
                <View style={styles.item}>

                    <ImageBackground
                        style={selectedView === 'grid' ? styles.image_grid : styles.image_single}
                        source={item.src}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => dispatch(changeFav(item, item.id))}>
                            <Image
                                source={ids.indexOf(item.id) > -1 ? heartFull : heartOutline}
                                style={styles.iconFav}
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                    {selectedView === 'grid' ?
                        <View>
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
                        :
                        <View style = {{flexDirection: 'row'}}>
                            <View>
                                <Text style={styles.text_status}>{item.status}</Text>
                                <Text style={styles.text_name}>{item.name}</Text>
                            </View>
                            <View style={{justifyContent: 'flex-end', flex: 1}}>
                                <NumberFormat  value={item.old_price}
                                               className="foo"
                                               displayType={'text'}
                                               thousandSeparator={true}
                                               suffix={' đ'}
                                               renderText={(value, props) =>
                                                   <Text style={[styles.text_old_price, {alignSelf: 'flex-end',}]}{...props}>{value}</Text>
                                               }/>

                                <NumberFormat  value={item.price}
                                               className="foo"
                                               displayType={'text'}
                                               thousandSeparator={true}
                                               suffix={' đ'}
                                               renderText={(value, props) =>
                                                   <Text style={[styles.text_price, {alignSelf: 'flex-end',}]}{...props}>{value}</Text>
                                               }/>
                            </View>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        );
    }

    const [favorite, setFavorite] = useState([]);

    const renderItem = ({ item }) => {
        return (
            <Item
                item={item}
                addOrRemoveFav={() => addOrRemoveFav(item.id)}
                favorite={favorite}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style = {styles.custom_bar}>
                <View style = {{flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
                    <TouchableOpacity onPress = {() => navigation.navigate("FilterMenu")} activeOpacity={1}>
                        <Text style = {styles.btn_filter}>Bộ lọc</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
                    <TouchableOpacity onPress = {() => selectView()}>
                        <Image style = {[styles.icon_grid, {tintColor: selectedView === 'grid' ? '#000000' : '#AEAEB2'}]} source={require('../assets/icon_grid.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => selectView()}>
                        <Image style = {[styles.icon_square, {tintColor: selectedView === 'list' ? '#000000' : '#AEAEB2'}]} source={require('../assets/icon_square.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.container, {paddingHorizontal: '4%'}]}>
            {selectedView === 'grid' ?
                <FlatList style={{flex: 1, marginTop: 0}}
                          data={data}
                          renderItem ={renderItem}
                          keyExtractor={item => item.id}
                          numColumns={2}
                          key={1}
                          showsVerticalScrollIndicator={false}
                          columnWrapperStyle={{justifyContent: 'space-between'}}
                />
            :
                <FlatList style={{flex: 1, marginTop: 0}}
                          data={data}
                          renderItem ={renderItem}
                          keyExtractor={item => item.id}
                          numColumns={1}
                          key={0}
                          showsVerticalScrollIndicator={false}
                />
            }
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    grid: {
        width: '48%',
        marginTop: 15,
    },
    single: {
        width: '100%',
        marginVertical: 15,
    },
    image_grid: {
        width: '100%',
        height: 273,
    },
    image_single: {
        width: '100%',
        height: 482,
    },
    text_status: {
        marginTop: 7,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 10,
        lineHeight: 15,
        textTransform: 'uppercase',
    },
    text_name: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 21,
    },
    text_old_price: {
        marginTop: 1,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        lineHeight: 15,
        textDecorationLine: 'line-through',
    },
    text_price: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 21,
    },
    btn: {

    },
    iconFav: {
        width: 20,
        height: 18,
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 10,
    },
    custom_bar: {
        height: '8%',
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent:'space-between',
        overflow: 'hidden',
        elevation: 4,
        backgroundColor: '#ffffff',
        paddingHorizontal: '4%',
    },
    btn_filter: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        lineHeight: 15,
    },
    icon_grid: {
        alignSelf: 'flex-end',
        width: 17,
        height: 17,
        marginRight: 10,
    },
    icon_square: {
        alignSelf: 'flex-end',
        width: 17,
        height: 17,
    },
});
export default ListProduct;



