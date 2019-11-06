const ui = {
    nav: 0
    // home             0
    // camera           1
    // album            2
    // account          3
}

const Reducer_ui = (state = ui, action) => {
    switch (action.type) {
        case 'UI_NAV':
            return Object.assign({}, state, {
                nav: action.payload
            });
        default:
            return state;
    }
}

export default Reducer_ui;