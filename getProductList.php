<?php
require 'cors_header.php';
header("Content-Type: application/json"); 

require 'database.php';

$products = $client->selectCollection('shopping_site', 'products');

$product_list = $products->find([],['sort' => ['post_time' => -1]]);

$list = [];
// convert the MongoDB ObjectId _id to string and pass it to frontend
foreach($product_list as $product){
    array_push($list,['product_id' => (string) $product['_id'], 'name' => $product['name'], 'price' => $product['price'], 'posted_by' => $product['posted_by']]);
}

echo json_encode(array(
    "list" => $list
));

exit;
?>