<?php
require 'cors_header.php';
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$product_id = $json_obj['product_id'];

require 'database.php';

$wishes = $client->selectCollection('shopping_site', 'wishes');

if($wishes->countDocuments(['product_id' => $product_id, 'username' => $username]) != 0){
    echo json_encode(array(
        "success" => false,
        "message" => "It's already in your wish list!"
    ));
    exit;
}

$datetime = new DateTime();

$wishes->insertOne([
    'time_added' => date_format($datetime, 'Y-m-d H:i:s'),
    'username' => $username,
    'product_id' => $product_id
]);

$wishes->deleteMany(['username' => null]);

echo json_encode(array(
    "success" => true
));
exit;

?>