<?php
require 'cors_header.php';
header("Content-Type: application/json"); 

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$account_type = $json_obj['account_type'];
$amount = (float) $json_obj['amount'];

require 'database.php';

// ini_set("session.cookie_httponly", 1);
// session_start();
// if($username != $_SESSION['username']){
//     die("Request forgery detected");
// }
   

$users = $client->selectCollection('shopping_site', 'users');
$cur_balance = $users->findOne(['username' => $username])['balance'];

$remaining = $cur_balance;
if($account_type == 'seller'){
    $remaining = $cur_balance - $amount;
    if($remaining < 0){
        echo json_encode(array(
            "success" => false,
            "message" => "No enough money to withdraw!"
        ));
        exit;
    }
    $users->updateOne(['username' => $username],['$set' => ['balance' => $remaining]]);
    $transactions = $client->selectCollection('shopping_site', 'transactions');

    $datetime = new DateTime();
    $transactions->insertOne(
        ['time' => date_format($datetime, 'Y-m-d H:i:s') , 'type' => 'withdraw', 'username' => $username,
         'amount' => $amount, 'remaining_balance' => $remaining, 'product_id' => null,
         'product_name' => null, 'buyer' => null]
    );
    echo json_encode(array(
        "success" => true
    ));
    exit;
}else if($account_type == 'buyer'){
    $remaining = $cur_balance + $amount;
    
    $users->updateOne(['username' => $username],['$set' => ['balance' => $remaining]]);
    $transactions = $client->selectCollection('shopping_site', 'transactions');

    $datetime = new DateTime();

    $transactions->insertOne(
        ['time' => date_format($datetime, 'Y-m-d H:i:s') , 'type' => 'deposit', 'username' => $username,
         'amount' => $amount, 'remaining_balance' => $remaining, 'product_id' => null,
         'product_name' => null, 'buyer' => null]
    );
    echo json_encode(array(
        "success" => true
    ));
    exit;
}

?>