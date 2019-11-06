import { combineReducers } from 'redux';

import Reducer_ui from './Reducer_ui';
import Reducer_cam from './Reducer_cam';
import Reducer_acc from './Reducer_acc';
import Reducer_album from './Reducer_album';

const rootReducers = combineReducers({
    ui: Reducer_ui,
    cam: Reducer_cam,
    acc: Reducer_acc,
    album: Reducer_album,
})

export default rootReducers;