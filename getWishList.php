<?php
require 'cors_header.php';
header("Content-Type: application/json"); 

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
require 'database.php';


$wishes = $client->selectCollection('shopping_site', 'wishes');

$wish_list = $wishes->find(['username' => $username],['sort' => ['time_added' => -1]]);

//Add product info to $list
$list = [];
$products = $client->selectCollection('shopping_site', 'products');
foreach($wish_list as $wish){
    $product = $products->findOne(['_id' => new MongoDB\BSON\ObjectId($wish['product_id'])]);
    
    array_push($list,['product_id' => (string) $product['_id'], 
    'product_name' => $product['name'], 
    'price' => $product['price'], 
    'product_poster' => $product['posted_by'],
    'time_added' => $wish['time_added'],
    'wish_id' => (string) $wish['_id']
]);
}

echo json_encode(array(
    "list" => $list
));

exit;
?>