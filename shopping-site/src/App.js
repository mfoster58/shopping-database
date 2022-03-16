import React, {Component} from "react";
import logo from './logo.svg';
import './App.css';

// ref: https://medium.com/@ipenywis/intro-to-react-router-for-beginners-multiple-page-apps-461f4729bd3f
import{
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate
} from "react-router-dom"

//pages
import LoginPage from "./pages/login";
import Home from "./pages/home";
import Product from "./pages/product";
import Transactions from "./pages/transactions";
import WishList from "./pages/wish_list";

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      userInfo : {'username': null, 'account_type': null},
      product_id : null
    };

    //this.state = 
    //create a state variable here called userInfo: {}
    //bind function here
  }

  //Create a function called setUser(userInfo)
  //this.setState({userInfo: userInfo})

  setUser = (username, account_type) =>{
    this.setState({
      userInfo: {'username': username, 'account_type': account_type}
    });
  }

  setProduct = (product_id) =>{
    this.setState({
      product_id: product_id
    });
  }

  render(){
    return (
    <Router>
      {/* ref:https://stackoverflow.com/questions/63124161/attempted-import-error-switch-is-not-exported-from-react-router-dom */}
      <Routes>
        <Route path="/" element = {<LoginPage setUser={this.setUser}/>} />
        <Route path="/home" element={<Home userInfo={this.state.userInfo} setUser={this.setUser} setProduct={this.setProduct}/>} />
        <Route path="/product" element={<Product userInfo={this.state.userInfo} product_id={this.state.product_id}/>} />
        <Route path="/transactions" element={<Transactions userInfo={this.state.userInfo} />} />
        <Route path="/wish_list" element={<WishList userInfo={this.state.userInfo}/>} />
      </Routes>
      {/* end of citation */}
    </Router>
    );
  }
}
//end of citation

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
