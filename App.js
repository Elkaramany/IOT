import 'react-native-gesture-handler'
import React from "react";
import i18n from "i18n-js";
import { translations } from "./src/translations";
import * as ScreenOrientation from "expo-screen-orientation";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import reducers from './src/Redux/reducers'
import { PersistGate } from 'redux-persist/lib/integration/react'
import createSagaMiddleware from 'redux-saga';
import Navigation from "./src/Navigation";
import rootSaga from './src/Redux/Sagas';
import SplashScreen from 'react-native-splash-screen'

const sagaMiddleware = createSagaMiddleware()

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['BluetoothReducer'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(
  persistedReducer,
  {},
  compose(applyMiddleware(sagaMiddleware)),
)

sagaMiddleware.run(rootSaga)

i18n.translations = translations;
i18n.locale = "en";
i18n.fallbacks = true;

export default function App() {
  const persistor = persistStore(store)

  React.useEffect(() => {
    SplashScreen.hide();
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }, [])

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  )
}