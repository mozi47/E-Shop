import './App.css';
import {Container} from "react-bootstrap"
import Header from "./component/Header"
import Footer from "./component/Footer"
import Product from "./component/screens/HomeScreen"
import {Route,Switch} from "react-router-dom"
import HomeScreen from './component/screens/HomeScreen';
import ProductScreen from './component/screens/ProductScreen';
import CartScreen from './component/screens/CartScreen'
import LoginScreen from './component/screens/LoginScreen';
import RegisterScreen from './component/screens/RegisterScreen';
import ProfileScreen from './component/screens/ProfileScreen';
import ShippingScreen from './component/screens/ShippingScreen';
import PaymentScreen from './component/screens/PaymentScreen';
import PlaceOrderScreen from './component/screens/PlaceOrderScreen';
import OrderScreen from './component/screens/OrderScreen';
import UsersScreen from './component/screens/UsersScreen';
import ProductListScreen from './component/screens/ProductListScreen';
import EditUserScreen from './component/screens/EditUserScreen';
import ProductEditScreen from './component/screens/ProductEditScreen';
import OrderListScreen from './component/screens/OrderListScreen';

const App=()=>{
  return (
    <>
     <Header/>
     <main className="py-3">
     <Container>
       <Route exact path="/" component={HomeScreen} />
       <Route exact path="/search/:keyword" component={HomeScreen} />
       <Route path="/search/:keyword/page/:pageNumber" component={HomeScreen} />
       <Route path="/page/:pageNumber" component={HomeScreen} />
       <Route path="/order/:id" component={OrderScreen}/>
       <Route path="/product/:id" component={ProductScreen} />
       <Route path="/login" component={LoginScreen} />
       <Route path="/register" component={RegisterScreen} />
       <Route path="/profile" component={ProfileScreen} />
       <Route path="/shipping" component={ShippingScreen} />
       <Route path="/payment" component={PaymentScreen} />
       <Route path="/placeorder" component={PlaceOrderScreen} />
       <Route exact path="/admin/productlist" component={ProductListScreen} />
       <Route exact path="/admin/productlist/:pageNumber" component={ProductListScreen} />
       <Route path="/admin/userlist" component={UsersScreen} />
       <Route path="/admin/orderlist" component={OrderListScreen} />
       <Route path="/admin/user/:id/edit" component={EditUserScreen} />
       <Route path="/admin/product/:id/edit" component={ProductEditScreen} />
       <Route path="/cart/:id?" component={CartScreen} />
     </Container>
     </main>  
     <Footer/>
    </>
  );
}

export default App;
