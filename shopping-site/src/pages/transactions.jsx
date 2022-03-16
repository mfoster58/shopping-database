import React, { Component } from "react";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    Navigate
} from "react-router-dom"

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.userInfo['username'],
            current_balance: null,
            transaction_history: []
        }
    }

    componentDidMount() {
        if (this.props.userInfo) {
            const data = { 'username': this.state.username };
            const url = "http://localhost:8080/backend/getTransactions.php"
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
                .then(response => response.json())
                //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
                .then(data => this.setBalanceAndHistory(data))
                .catch(err => console.error(err));
        }
    }

    setBalanceAndHistory = (data) => {
        this.setState({
            current_balance: data['balance'],
            transaction_history: data['history']
        });
    }

    render() {
        let transaction_history_element = [];

        this.state.transaction_history.forEach(transaction => {
            if (transaction['type'] === 'deposit' || transaction['type'] === 'withdraw') {
                transaction_history_element.push(
                    <li>
                        Time: {transaction['time']}{',  '}
                        Type: {transaction['type']}{',  '}
                        Amount: {transaction['amount']}{',  '}
                        Remaining balance: {transaction['remaining_balance']}
                    </li>
                )
            }else{
                //for "get_paid" and "purchase" transactions
                transaction_history_element.push(
                    <li>
                        Time: {transaction['time']}{',  '}
                        Type: {transaction['type']}{',  '}
                        Amount: {transaction['amount']}{',  '}
                        Remaining balance: {transaction['remaining_balance']}{',  '}
                        Product_id: {transaction['product_id']}{',  '}
                        Product_name: {transaction['product_name']}{',  '}
                        Buyer: {transaction['buyer']}
                    </li>
                )
            }

        });

        return (<div>
            <p>{this.state.username}, your current balance is {this.state.current_balance}.</p>
            <header>Your transaction history is shown below.</header>
            <ul>
                {transaction_history_element}
            </ul>
        </div>
        );
    }
}

export default Transactions;