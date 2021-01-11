import {createStore,combineReducers,applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension"
import { productListReducer, productUpdateReducer, productDetailsReducer, productDeleteReducer, productCreateReducer, productReviewReducer, productTopReducer } from "./reducers/productReducers"
import { cartReducer } from "./reducers/cartReducer"
import { myorderListReducer, orderDeliverReducer, orderListReducer, orderCreateReducer, orderDetailsReducer, orderPaidReducer } from "./reducers/orderReducer"
import { userReducers, registerReducer, detailReducer, updateReducer, userListReducer, userDeleteReducer, userUpdateReducer } from "./reducers/userReducers"

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    createProduct: productCreateReducer,
    productUpdate: productUpdateReducer,
    reviewProduct:productReviewReducer,
    topProduct: productTopReducer,
    cart: cartReducer,
    userLogin: userReducers,
    register: registerReducer,
    userDetails: detailReducer,
    update: updateReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPaid: orderPaidReducer,
    orderDelivered: orderDeliverReducer,
    myorderList: myorderListReducer,
    listOrder: orderListReducer,
    usersList: userListReducer,
    userDelete: userDeleteReducer,
    UpdateUser: userUpdateReducer
})
const cartItemsFromStorage = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : []
const userInfoFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
const shippingAddressFromStorage = localStorage.getItem("shippingAdress") ? JSON.parse(localStorage.getItem("shippingAdress")) : {}

const initialState = {
    cart: { 
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage
    },
    userLogin:{userInfo: userInfoFromStorage },
}
const middleware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store