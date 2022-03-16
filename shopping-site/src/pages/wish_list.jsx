import React, { Component } from "react";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    Navigate
} from "react-router-dom"

class WishList extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: this.props.userInfo['username'],
            account_type: this.props.userInfo['account_type'],
            wish_list:[]
        }
    }

    componentDidMount(){
        if(this.props.userInfo === null || this.state.account_type === "seller"){
            return;
        }
        this.updateWishlist();
    }
    
    updateWishlist=()=>{
        const data = {
            'username': this.state.username
        }

        const url = "http://localhost:8080/backend/getWishList.php";

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.setWishList(data))
            .catch(err => console.error(err));
    }

    setWishList=(data)=>{
        this.setState({
            wish_list: data['list']
        });
    }

    purchaseProduct=(event)=>{
        const { id } = event.target;
        const data = { product_id: id, username: this.state.username };

        const url = "http://localhost:8080/backend/purchaseFromWishList.php";

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.message(data))
            .catch(err => console.error(err));
    }

    deleteWish=(event)=>{
        const { id } = event.target;
        const data = { wish_id: id, username: this.state.username };

        const url = "http://localhost:8080/backend/deleteWish.php";

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.message(data))
            .catch(err => console.error(err));
    }

    message=(data)=>{
        if(data.success){
            alert("Success!");
            this.updateWishlist();
        }else{
            alert(data.message);
        }
    }

    render() {
        let header_message = null;
        if(this.state.account_type === "buyer"){
            header_message = (<h3>Your wish list:</h3>);
        }else{
            header_message = (<h3>You don't have access to a wish list.</h3>);
        }

        let wish_list_element = [];
        this.state.wish_list.forEach(wish => {
                wish_list_element.push(<li>{wish['product_name']}{',  Price: '}{wish['price']}{',  Posted by: '}{wish['product_poster']}
                {',  Time added: '}{wish['time_added']}
                {'   '}
                    <button type="button" id={wish['product_id']} onClick={this.purchaseProduct}>
                        Purchase
                    </button>
                    {' '}
                    <button type="button" id={wish['wish_id']} onClick={this.deleteWish}>
                        Delete
                    </button>
                </li>);
        });

        return (<div>
            {header_message}
            <ul>
                {wish_list_element}
            </ul>
        </div>);

    }

}

export default WishList;