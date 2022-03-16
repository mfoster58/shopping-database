<?php
require 'cors_header.php';
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$buyer = $json_obj['buyer'];
$product_id = $json_obj['product_id'];
$product_name = $json_obj['product_name'];
$product_price = (float) $json_obj['product_price'];
$poster = $json_obj['product_poster'];

require 'database.php';

$users = $client->selectCollection('shopping_site', 'users');

$buyer_profile = $users->findOne(['username' => $buyer]);

if($buyer_profile['balance'] < $product_price){
    echo json_encode(array(
        "success" => false,
        "message" => "You don't have enough balance!"
    ));
    exit;
}

$buyer_new_balance = $buyer_profile['balance'] - $product_price;

$poster_profile = $users->findOne(['username' => $poster]);
$poster_new_balance = $poster_profile['balance'] + $product_price;
//the buyer get balance reduced by price
$users->updateOne(['username' => $buyer], ['$set' => ['balance' => $buyer_new_balance]]);

//the poster get paid
$users->updateOne(['username' => $poster], ['$set' =>['balance' => $poster_new_balance]]);

//insert transactions for both buyer and poster
$transactions = $client->selectCollection('shopping_site', 'transactions');
$datetime = new DateTime();

$transactions->insertOne([
    'time' => date_format($datetime, 'Y-m-d H:i:s'),
    'type' => 'purchase',
    'username' => $buyer,
    'amount' => $product_price,
    'remaining_balance' => $buyer_new_balance,
    'product_id' => $product_id,
    'product_name' => $product_name,
    'buyer' => $buyer
]);

$transactions->insertOne([
    'time' => date_format($datetime, 'Y-m-d H:i:s'),
    'type' => 'get paid',
    'username' => $poster,
    'amount' => $product_price,
    'remaining_balance' => $poster_new_balance,
    'product_id' => $product_id,
    'product_name' => $product_name,
    'buyer' => $buyer
]);

$transactions->deleteMany(['username' => null]);

echo json_encode(array(
    "success" => true
));
exit;
?>