import { combineReducers } from "redux";
import itemReducer from "./itemReducer";
import favReducer from "./favReducer";

export default combineReducers({
  itemReducer,
  favReducer,
  userReducer,
});
