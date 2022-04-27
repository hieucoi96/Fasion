import {
  ADD_USER_INFO,
  CHANGE_FAV,
  DELETE_ITEM,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  CHANGE_INFO,
  UPDATE_DELIVERY,
  CLEAR_CART,
  LOGOUT,
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
  showSplash: true,
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
    case CHANGE_INFO:
      return {
        ...state,
        cart: change_info(state, action),
      };
    case UPDATE_DELIVERY:
      return {
        ...state,
        delivery: action.payload,
      };
    case CLEAR_CART:
      return {
        ...state,
        cart: [],
      };
    case LOGOUT:
      return { ...state, token: null };
    default:
      return state;
  }
};

function change_info(state, action) {
  let duplicate = false;
  const x = state.cart.map((item) => {
    if (item.key !== action.key && item.variant_id === action.variant_id) {
      duplicate = true;
      return {
        ...item,
        quantity: item.quantity + action.quantity,
      };
    }
    if (item.key !== action.key) {
      return item;
    }
    return {
      ...item,
      variant_id: action.variant_id,
      color: action.color,
      src: action.src,
      price: action.price,
      size: action.size,
    };
  });
  if (duplicate) {
    return x.filter((item) => item.key !== action.key);
  }
  return x;
}

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
