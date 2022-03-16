<?php
require 'cors_header.php';
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$product_id = $json_obj['product_id'];

require 'database.php';

$bought = false;

$transactions = $client->selectCollection('shopping_site', 'transactions');
$cnt = $transactions->countDocuments(['product_id' => $product_id, 'buyer' => $username]);

if($cnt > 0){
    $bought = true;
}

$reviews = $client->selectCollection('shopping_site', 'reviews');

$review_list = $reviews->find(['product_id' => $product_id], ['sort' => ['time' => -1]]);

$list = [];
// convert the MongoDB ObjectId _id to string and pass it to frontend
foreach($review_list as $review){
    array_push($list,['review_id' => (string) $review['_id'], 'poster' => $review['username'], 'content' => $review['content'], 'time' => $review['time']]);
}

echo json_encode(array(
    "bought" => $bought,
    "list" => $list
));

exit;
