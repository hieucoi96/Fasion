import {
  ADD_USER_INFO,
  CHANGE_FAV,
  DELETE_ITEM,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
} from "./itemTypes";
import { showMessage } from "react-native-flash-message";

const initialState = {
  full_name: null,
  city: null,
  district: null,
  sub_district: null,
  address_detail: null,
  phone_number: null,
  email: null,
  token: null,
  cart: [],
  favorite: [],
  bill_list: [],
  delivery: [],
  notify_list: [],
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER_INFO:
      return {
        ...state,
        ...action.payload,
      };
    case CHANGE_FAV:
      return {
        ...state,
        favorite: addOrRemoveFav(state, action.id),
      };
    case DELETE_ITEM:
      return {
        ...state,
        cart: state.cart.filter((item) => item.variant_id !== action.payload),
      };
    case INCREASE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map((item) => {
          if (item.variant_id !== action.payload.variant_id) {
            return item;
          }
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }),
      };
    case DECREASE_QUANTITY:
      return {
        ...state,
        cart: decrease_quantity(state, action),
      };
    default:
      return state;
  }
};

function addOrRemoveFav(state, id) {
  let productExist = state.favorite.indexOf(id);
  if (productExist > -1) {
    showMessage({
      message: "Đã xóa sản phẩm khỏi danh sách yêu thích!",
      position: "bottom",
      titleStyle: {
        textAlignVertical: "center",
        textAlign: "center",
        paddingVertical: 10,
        fontSize: 16,
      },
      backgroundColor: "#454545D9",
    });
    return state.favorite.filter((product_id) => product_id !== id);
  } else {
    showMessage({
      message: "Đã thêm sản phẩm vào danh sách yêu thích!",
      position: "bottom",
      titleStyle: {
        textAlignVertical: "center",
        textAlign: "center",
        paddingVertical: 8,
        fontSize: 16,
      },
      backgroundColor: "#454545D9",
    });
    return [...state.favorite, id];
  }
}

function decrease_quantity(state, action) {
  for (let i = 0; i < state.cart.length; i++) {
    if (
      state.cart[i].variant_id === action.payload.variant_id &&
      state.cart[i].quantity === 1
    ) {
      return state.cart.filter(
        (item) => item.variant_id !== action.payload.variant_id
      );
    }
  }
  return state.cart.map((item) => {
    if (item.variant_id === action.payload.variant_id) {
      return {
        ...item,
        quantity: item.quantity - 1,
      };
    }
    return item;
  });
}

export default userReducer;
