import React from "react"
import { AppRegistry, Text } from 'react-native';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store/index'
import App from './App';
import { name as appName } from './app.json';

const RNRedux = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>)
}

AppRegistry.registerComponent(appName, () => RNRedux);
