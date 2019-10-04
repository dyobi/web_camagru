import { combineReducers } from 'redux';

import Reducer_ui from './Reducer_ui';
import Reducer_cam from './Reducer_cam';
import Reducer_acc from './Reducer_acc';

const rootReducers = combineReducers({
    ui: Reducer_ui,
    cam: Reducer_cam,
    acc: Reducer_acc
})

export default rootReducers;