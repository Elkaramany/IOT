import * as ReduxTypes from '../types'

const INITIAL_STATE = {
  list: [],
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case (ReduxTypes.check_if_ble_device_exists):
      return { ...state, list: payload }
  }

  return state
}
