const album = {
    arr: [],
    comment: [],
    view_id: -1,
}

const Reducer_album = (state = album, action) => {
    switch (action.type) {
        case 'ALBUM_ARR':
            return Object.assign({}, state, {
                arr: action.payload
            });
        case 'ALBUM_COMMENT':
            return Object.assign({}, state, {
                comment: action.payload
            });
        case 'ALBUM_VIEW_ID':
            return Object.assign({}, state, {
                view_id: action.payload
            });
        default:
            return state;
    }
}

export default Reducer_album;