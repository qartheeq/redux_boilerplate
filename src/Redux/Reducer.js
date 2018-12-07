import * as CONSTANTS from "./Constants";

/*
 * If multiple components need access to some data, in that case we store such data in redux.
 */
const initialState = {
    cartItems: [],
    showCartDialog: false,
    showMenu: true,
    checkedOutItems: [],
    loggedInUser: null,

};

const rootReducer = (state = initialState, action) => {

    switch (action.type) {
       
        case CONSTANTS.ADD_ITEM_IN_CART: {

            /* User wants to add item in cart, let's first find if such item is already in cart. */
            let index = state.cartItems.findIndex(x => x.id === action.payload.id);

            if (index !== -1) {

                /* Item is there, let's just increase its quantity */
                let cloneCartItems = [...state.cartItems];
                cloneCartItems[index] = {
                    ...cloneCartItems[index],
                    quantity: state.cartItems[index].quantity + 1
                };

                return { ...state, cartItems: cloneCartItems }
            }

            /* Item is not there, add a new item. */
            return { ...state, cartItems: state.cartItems.concat(action.payload) }

        }
        case CONSTANTS.SHOW_CART_DLG:
            return { ...state, showCartDialog: action.payload };
        case CONSTANTS.DELETE_CART_ITEM:
            return { ...state, cartItems: state.cartItems.filter(x => x.id !== action.payload) };
        case CONSTANTS.TOGGLE_MENU:
            return { ...state, showMenu: !state.showMenu };
        case CONSTANTS.SET_LOGGED_IN_USER:
            return { ...state, loggedInUser: action.payload };
        case CONSTANTS.SET_CHECKEDOUT_ITEMS:
            return { ...state, checkedOutItems: action.payload }
        case CONSTANTS.UPDATE_CART_ITEM_QUANTITY: {
            let index = state.cartItems.findIndex(x => x.id === action.payload.id);

            /* Update quantity of certain item in cart */
            if (index !== -1) {
                let cloneCartItems = [...state.cartItems];
                cloneCartItems[index] = {
                    ...cloneCartItems[index],
                    quantity: action.payload.quantity
                };

                return { ...state, cartItems: cloneCartItems }
            }

            return state;
        }
        default:
            return state;
    }
};

export default rootReducer;
