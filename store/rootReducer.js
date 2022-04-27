import { combineReducers } from "redux";
import userReducer from "./userReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

const userPersistConfig = {
  key: "userReducer",
  storage: AsyncStorage,
  blacklist: ["showSplash"],
};

export default combineReducers({
  userReducer: persistReducer(userPersistConfig, userReducer),
});
