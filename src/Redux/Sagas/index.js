import { all, fork } from 'redux-saga/effects';
import { watchSaveBleData, watchChangeBleName } from './BluetoothSaga';

export default function* rootSaga() {
    yield all([
        watchSaveBleData(),
        watchChangeBleName()
    ])
}