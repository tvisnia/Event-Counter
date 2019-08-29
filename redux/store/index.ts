import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { State, reducer } from '../reducers'
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2
}

const pReducer = persistReducer(persistConfig, reducer)
const store = createStore<State>(pReducer)

export default store
export const persistor = persistStore(store)