<?php
require 'cors_header.php';
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$account_type = $json_obj['account_type'];
$name = $json_obj['product_name'];
$description = $json_obj['product_description'];
$price = (float) $json_obj['product_price'];
$id = $json_obj['product_id'];

require 'database.php';

$users = $client->selectCollection('shopping_site', 'users');
$cnt = $users->countDocuments(['username' => $username]);

if ($account_type != 'seller' || $cnt == 0 || $users->findOne(['username' => $username])['account_type'] != 'seller') {
    //user doesn't exist or is not a seller
    echo json_encode(array(
        "success" => false,
        "message" => "You have no access to post or edit a product!"
    ));
    exit;
}

if (!preg_match('/^[\w_\-]+$/', $name) || $name == null) {
    // product name can't be null or contain special characters
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid product name!"
    ));
    exit;
}

if ($price < 0) {
    echo json_encode(array(
        "success" => false,
        "message" => "Price can't be negative!"
    ));
    exit;
}

$products = $client->selectCollection('shopping_site', 'products');

if ($id == null || $id == '') {
    //Post a new product
    $datetime = new DateTime();
    $products->insertOne(
        ['name' => $name, 'description' => $description, 'price' => $price, 'posted_by' => $username, 'post_time' => date_format($datetime, 'Y-m-d H:i:s')]
    );
    echo json_encode(array(
        "success" => true
    ));
    exit;
}else{
    //edit a produt posted by the current user
    // convert the $id string to MongoDB ObjectId first
    $update = $products->updateOne(['_id' => new MongoDB\BSON\ObjectId($id), 'posted_by' => $username],
        ['$set' => ['name' => $name, 'description' => $description, 'price' => $price, 'posted_by' => $username]]
    );
    //var_dump($update);
    if($update->getModifiedCount() == 1){
        echo json_encode(array(
            "success" => true
        ));
        exit;
    }else{
        echo json_encode(array(
            "success" => false,
            "message" => "Edition failed."
        ));
        exit;
    }
    
}

?>
