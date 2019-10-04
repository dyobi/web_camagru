const cam = {
    arr: [],
    curr: -1,
    filter: -1
}

const Reducer_cam = (state = cam, action) => {
    switch (action.type) {
        case 'CAM_ARR':
            return Object.assign({}, state, {
                arr: action.payload
            });
        case 'CAM_CURR':
            return Object.assign({}, state, {
                curr: action.payload
            });
        case 'CAM_FILTER':
            return Object.assign({}, state, {
                filter: action.payload
            });
        default:
            return state;
    }
}

export default Reducer_cam;