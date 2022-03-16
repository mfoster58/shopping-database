import React, { Component } from "react";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    Navigate
} from "react-router-dom"

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.userInfo['username'],
            account_type: this.props.userInfo['account_type'],
            product_id: this.props.product_id,
            product_name: null,
            product_description: null,
            product_price: null,
            product_poster: null,
            product_post_time: null,
            review_list: [],
            bought_by_user: false,
            review_id: null,
            review_content: null
        }
    }

    componentDidMount() {
        if (this.props.userInfo && this.props.product_id) {
            this.getProductInfo();
            this.updateReviewList();
        }
    }

    getProductInfo = () => {
        const data = {
            'product_id': this.props.product_id
        };

        const url = "http://localhost:8080/backend/getProductInfo.php";
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.setProductInfo(data))
            .catch(err => console.error(err));
    }

    setProductInfo = (data) => {
        this.setState({
            product_name: data.name,
            product_description: data.description,
            product_price: data.price,
            product_poster: data.poster,
            product_post_time: data.post_time,
        });
    }

    updateReviewList = () => {
        const data = {
            'username': this.state.username, 'product_id': this.props.product_id
        }

        const url = "http://localhost:8080/backend/checkIfBoughtAndGetReviews.php";

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.setBoughtAndReviewList(data))
            .catch(err => console.error(err));
    }

    setBoughtAndReviewList = (data) => {
        if (data.bought) {
            this.setState({
                bought_by_user: true
            });
        }
        this.setState({
            review_list: data.list
        });
    }


    purchaseProduct = (event) => {
        const data = {
            buyer: this.state.username, product_id: this.state.product_id,
            product_name: this.state.product_name, product_price: this.state.product_price,
            product_poster: this.state.product_poster
        };

        const url = "http://localhost:8080/backend/purchaseProduct.php";

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

    addProductToWishlist = (event) =>{
        const data = {
            username: this.state.username, product_id: this.state.product_id,
        };

        const url = "http://localhost:8080/backend/addProductToWishlist.php";

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

    message = (data) => {
        if (data.success) {
            alert("Success!");
            this.updateReviewList();
            this.setState({
                review_id: null
            });
        } else {
            alert(data.message);
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        });
    }

    onPostOrEditReview = (event) => {
        const data = {
            review_id: this.state.review_id, product_id: this.state.product_id,
            username: this.state.username, content: this.state.review_content
        };
        const url = "http://localhost:8080/backend/postOrEditReview.php";

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

    editReview = (event) => {
        const { id } = event.target;
        this.setState({
            review_id: id
        });
    }

    deleteReview = (event) => {
        const { id } = event.target;
        const data = { review_id: id, username: this.state.username };

        const url = "http://localhost:8080/backend/deleteReview.php";

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

    render() {
        let purchaseElement = null;
        let wishlistElement = null;
        if (this.state.account_type === "buyer") {
            purchaseElement = (<div>
                <button type="button" id={this.product_id} onClick={this.purchaseProduct}>
                    Purchase
                </button>
            </div>);

            wishlistElement = (<div>
                <button type="button" id={this.product_id} onClick={this.addProductToWishlist}>
                    Add to Wish List
                </button>
            </div>);
        }

        let PostOrEditReviewElement = null;
        if (this.state.bought_by_user) {
            if (this.state.review_id) {
                //For editing a review
                PostOrEditReviewElement = (<div>
                    <header>Edit the review:</header>
                    <p>
                        <label for="review_content">Content: </label>
                        <input
                            type="text"
                            name="review_content"
                            id="review_content"
                            // value={username}
                            onChange={this.handleChange} />
                    </p>
                    <button type="button" onClick={this.onPostOrEditReview}>
                        Submit
                    </button>
                </div>);

            } else {
                //For posting a new review
                PostOrEditReviewElement = (<div>
                    <header>Post a new review:</header>
                    <p>
                        <label for="review_content">Content: </label>
                        <input
                            type="text"
                            name="review_content"
                            id="review_content"
                            // value={username}
                            onChange={this.handleChange} />
                    </p>
                    <button type="button" onClick={this.onPostOrEditReview}>
                        Submit
                    </button>
                </div>);
            }
        }

        let reviewListElement = [];
        this.state.review_list.forEach(review => {
            if (review['poster'] === this.state.username) {
                reviewListElement.push(<li>{review['content']}{',  Posted by: '}{review['poster']}{',  Time: '}{review['time']}
                    {'   '}
                    <button type="button" id={review['review_id']} onClick={this.editReview}>
                        Edit
                    </button>
                    {' '}
                    <button type="button" id={review['review_id']} onClick={this.deleteReview}>
                        Delete
                    </button>
                </li>);
            } else {
                reviewListElement.push(<li>{review['content']}{',  Posted by: '}{review['poster']}{',  Time: '}{review['time']}</li>);
            }
        });

        return (
            <div>
                <h2>Product Name: {this.state.product_name}</h2>
                <div>Posted by: {this.state.product_poster}, Time: {this.state.product_post_time}</div>
                <div>{this.state.product_description}</div>
                <div>Price: {this.state.product_price}{'   '}{purchaseElement}{'   '}{wishlistElement}</div>
                {PostOrEditReviewElement}
                <h3>Reviews on this product:</h3>
                <ul>
                    {reviewListElement}
                </ul>
            </div>
        );
    }
}

export default Product;