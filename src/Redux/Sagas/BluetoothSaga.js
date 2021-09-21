import { put, take, takeLatest, call, takeEvery } from 'redux-saga/effects'
import * as sagaTypes from './types'
import * as ReduxTypes from '../types'
import _ from 'lodash'

const getUniqueVals = (val) => {
    const promise = new Promise((resolve, reject) => {
        let arr = [...val.oldList, ...val.newList]
        resolve(_.uniqBy(arr, 'id'))
    })

    return promise
}

function* saveBleData(action) {
    const uniqueValsList = yield call(getUniqueVals, action.payload)
    yield put({ type: ReduxTypes.check_if_ble_device_exists, payload: uniqueValsList })
}

export function* watchSaveBleData() {
    yield takeLatest(sagaTypes.saveBleDataSaga, saveBleData);
}

const findDeviceAndChangeName = (device) => {
    const promise = new Promise((resolve, reject) => {
        const list = device.list
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == device.id) {
                list[i].name = device.name
                break;
            }
        }
        resolve(list)
    })

    return promise
}

function* changeBleDeviceName(action) {
    const changedResult = yield call(findDeviceAndChangeName, action.payload)
    yield put({ type: ReduxTypes.check_if_ble_device_exists, payload: changedResult })
}

export function* watchChangeBleName() {
    yield takeLatest(sagaTypes.changeBleName, changeBleDeviceName);
}