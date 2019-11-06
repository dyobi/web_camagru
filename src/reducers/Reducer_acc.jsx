const acc = {
    signin: 0,
    signup: 0,
    change_info: 0,
    user: "",
    mail: ""
}

const Reducer_acc = (state = acc, action) => {
    switch (action.type) {
        case 'ACC_SIGNIN':
            return Object.assign({}, state, {
                signin: action.payload
            });
        case 'ACC_SIGNUP':
            return Object.assign({}, state, {
                signup: action.payload
            });
        case 'ACC_CHANGE':
            return Object.assign({}, state, {
                change_info: action.payload
            });
        case 'ACC_USER':
            return Object.assign({}, state, {
                user: action.payload
        });
        case 'ACC_MAIL':
            return Object.assign({}, state, {
                mail: action.payload
        });
        default:
            return state;
    }
}

export default Reducer_acc;