<?php
require 'cors_header.php';
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$account_type = $json_obj['account_type'];
$id = $json_obj['product_id'];

require 'database.php';

$users = $client->selectCollection('shopping_site', 'users');
$cnt = $users->countDocuments(['username' => $username]);

if ($account_type != 'seller' || $cnt == 0 || $users->findOne(['username' => $username])['account_type'] != 'seller') {
    //user doesn't exist or is not a seller
    echo json_encode(array(
        "success" => false,
        "message" => "You have no access to delete a product!"
    ));
    exit;
}


$products = $client->selectCollection('shopping_site', 'products');
$result = $products->deleteOne([
    '_id' => new MongoDB\BSON\ObjectId($id),
    'posted_by' => $username
]);

//updated with wish list
$wishes = $client->selectCollection('shopping_site', 'wishes');
$wishes->deleteMany([
    'product_id' => $id
]);

if ($result->getDeletedCount() == 1) {
    
    echo json_encode(array(
        "success" => true
    ));
    exit;
}else{
    
    echo json_encode(array(
        "success" => false,
        "message" => "Deletion failed."
    ));
    exit;
}

?>
