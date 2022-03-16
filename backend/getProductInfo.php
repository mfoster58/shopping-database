<?php
require 'cors_header.php';
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$id = $json_obj['product_id'];

require 'database.php';

$products = $client->selectCollection('shopping_site', 'products');

$product = $products->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);

echo json_encode(array(
    "name" => $product['name'],
    "description" => $product['description'],
    "price" => $product['price'],
    "poster" => $product['posted_by'],
    "post_time" => $product['post_time']
));