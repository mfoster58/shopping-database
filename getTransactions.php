<?php
require 'cors_header.php';
header("Content-Type: application/json"); 

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];

require 'database.php';

$users = $client->selectCollection('shopping_site', 'users');

$balance = $users->findOne(['username' => $username])['balance'];

$transactions = $client->selectCollection('shopping_site', 'transactions');

$transaction_history = $transactions->find(['username' => $username],['sort' => ['time' => -1]]);

$history = [];
foreach($transaction_history as $transaction){
    array_push($history,['time' => $transaction['time'], 
    'type' => $transaction['type'], 
    'amount' => $transaction['amount'],
    'remaining_balance' => $transaction['remaining_balance'],
    'product_id' => $transaction['product_id'],
    'product_name' => $transaction['product_name'],
    'buyer' => $transaction['buyer'],
]);
}

echo json_encode(array(
    "balance" => $balance,
    "history" => $history
));

exit;

?>