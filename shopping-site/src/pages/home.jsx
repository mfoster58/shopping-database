import React, { Component } from "react";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    Navigate
} from "react-router-dom"



class PostOrEditProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            account_type: this.props.account_type,
            product_name: null,
            product_description: null,
            product_price: null,
        }
    }

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        });
    }
    onPostOrEditProduct = (e) => {
        if(this.state.product_name === null || this.state.product_name ===''){
            alert("The product name can't be empty!");
            return;
        }
        if (this.state.product_price < 0) {
            alert("The price can't be negative!");
            return;
        }
        const data = {
            'username': this.state.username, 'account_type': this.state.account_type,
            'product_name': this.state.product_name, 'product_description': this.state.product_description,
            'product_price': this.state.product_price, 'product_id' : this.props.product_id
        };

        const url = "http://localhost:8080/backend/postOrEditProduct.php"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.Message(data))
            .catch(err => console.error(err));
    }

    Message = (data) => {
        if (data.success) {
            alert("Success!");
            this.props.updateProductList();
            this.props.setProductId(null);
        } else {
            alert(data.message);
        }
    }

    render() {
        if (this.state.account_type === 'buyer') {
            return null;
        }

        let header = null;
        if(this.props.product_id){
            header = (<div>Edit the product:</div>);
        }else{
            header = (<div>Post a new product:</div>);
        }

        return (
            <div>
                <header>{header}</header>
                <p>
                    <label for="product_name">Name:</label>
                    <input
                        type="text"
                        name="product_name"
                        id="product_name"
                        // value={username}
                        onChange={this.handleChange} />
                </p>
                <p>
                    <label for="product_description">Description:</label>
                    <input
                        type="text"
                        name="product_description"
                        id="product_description"
                        // value={username}
                        onChange={this.handleChange} />
                </p>
                <p>
                    <label for="product_price">Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        name="product_price"
                        id="product_price"
                        // value={username}
                        onChange={this.handleChange} />
                </p>
                <button type="button" onClick={this.onPostOrEditProduct}>
                    Submit
                </button>
            </div>
        );
    }
}

class Home extends Component {
    constructor(props) {
        super(props);
        const userInfo = this.props.userInfo;
        this.state = {
            username: userInfo['username'],
            account_type: userInfo['account_type'],
            loggedOut: false,
            redirect_transactions: false,
            redirect_product: false,
            changeBalance: 0,
            product_list: [],
            product_id: null,
            redirect_wish_list: null
        };
    }

    componentDidMount() {
        if (this.props.userInfo) {
            this.updateProductList();
        }
    }

    updateProductList = () => {
        const url = "http://localhost:8080/backend/getProductList.php"
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.setProductList(data['list']))
            .catch(err => console.error(err));
    }

    setProductList = (new_list) => {
        this.setState({ product_list: new_list });
    }

    Logout = (e) => {
        const url = "http://localhost:8080/backend/logout.php"
        fetch(url, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
        this.props.setUser(null, null);
        this.setState({ loggedOut: true });
    }


    showTransactions = (e) => {
        this.setState({ redirect_transactions: true });
    }

    showWishList = (e) => {
        this.setState({redirect_wish_list: true});
    }

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        });
    }

    onChangeBalanceSubmit = (e) => {
        if (this.state.changeBalance <= 0) {
            alert("Only accept positive numbers!");
            return;
        }

        const data = { 'username': this.state.username, 'account_type': this.state.account_type, 'amount': this.state.changeBalance };

        const url = "http://localhost:8080/backend/manageBalance.php"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.Message(data))
            .catch(err => console.error(err));
    }

    Message = (data) => {
        if (data.success) {
            alert("Success!");
            this.updateProductList();
        } else {
            alert(data.message);
        }
    }

    setProductId = (id) =>{
        this.setState({
            product_id: id
        });
        //console.log(this.state.product_id);
    }

    viewProduct = (event) =>{
        const {id} = event.target;
        this.props.setProduct(id);
        this.state.redirect_product = true;
    }

    editProduct = (event) =>{
        const {id} = event.target;
        this.setProductId(id);
    }

    deleteProduct = (event) =>{
        const {id} = event.target;
        const data = {
            'username': this.state.username, 'account_type': this.state.account_type, 'product_id' : id
        };

        const url = "http://localhost:8080/backend/deleteProduct.php"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.Message(data))
            .catch(err => console.error(err));
    }

    render() {
        if (this.state.loggedOut) {
            //go to login page if logged out
            return <Navigate to={{
                pathname: "/",
            }} />;
        }

        if (this.state.redirect_transactions) {
            return <Navigate to={{
                pathname: "/transactions",
            }} />;
        }

        if(this.state.redirect_wish_list){
            return <Navigate to={{
                pathname: "/wish_list",
            }} />;
        }

        if (this.state.redirect_product) {
            return <Navigate to={{
                pathname: "/product",
            }} />;
        }

        let balanceLabel = null;
        let balanceId = null;
        let view_wish_list = null;
        if (this.state.account_type === 'buyer') {
            balanceLabel = "Make a deposit: ";
            balanceId = "deposit";
            view_wish_list = (<div>
                <header>Check your wish list here</header>
                <div>
                    <button type="button" onClick={this.showWishList}>
                        Show My Wish List
                    </button>
                </div>
            </div>);
        }
        if (this.state.account_type === 'seller') {
            balanceLabel = "Make a withdrawal: ";
            balanceId = "withdraw";
        }

        //itemlist = []
        //for loop through this.state.items
        // itemlist.push(return(<div>{items[i]}<button onClick{this.function}>click this</button></div>))

        let productListElement = [];
        this.state.product_list.forEach(product => {
            if (product['posted_by'] === this.state.username) {
                productListElement.push(<li>{product['name']}{',  Price: '}{product['price']}{',  Posted by: '}{product['posted_by']}
                {'   '}
                    <button type="button" id={product['product_id']} onClick={this.viewProduct}>
                        View
                    </button>
                    {' '}
                    <button type="button" id={product['product_id']} onClick={this.editProduct}>
                        Edit
                    </button>
                    {' '}
                    <button type="button" id={product['product_id']} onClick={this.deleteProduct}>
                        Delete
                    </button>
                </li>);
            }else{
                productListElement.push(<li>{product['name']}{',  Price: '}{product['price']}{',  Posted by: '}{product['posted_by']}
                {'   '}
                    <button type="button" id={product['product_id']} onClick={this.viewProduct}>
                        View
                    </button>
                </li>);
            }
        });


        return (
            <div className="Home">
                <header>Hi, {this.state.username}!</header>
                <div>
                    <button type="button" onClick={this.Logout}>
                        Logout
                    </button>
                </div>
                <br />
                <div>
                    <label for="manageBalance">{balanceLabel}</label>
                    <input
                        type="number"
                        step="0.01"
                        name="changeBalance"
                        id={balanceId}
                        // value={username}
                        onChange={this.handleChange} />
                    <button type="button" onClick={this.onChangeBalanceSubmit}>
                        Submit
                    </button>
                </div>
                <br />
                <header>See your transaction history here</header>
                <div>
                    <button type="button" onClick={this.showTransactions}>
                        View Transactions
                    </button>
                </div>
                <br />
                {view_wish_list}
                <br />
                <PostOrEditProduct username={this.state.username} account_type={this.state.account_type} product_id={this.state.product_id} 
                updateProductList={this.updateProductList} setProductId={this.setProductId}/>
                <br />
                <header>All products: </header>
                <ul>
                    {productListElement}
                </ul>
            </div>
        );
    }
}


export default Home;