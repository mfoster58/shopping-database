<?php
require 'cors_header.php';
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$content = $json_obj['content'];
$review_id = $json_obj['review_id'];
$product_id = $json_obj['product_id'];

require 'database.php';

if ($content == '' || $content == null) {
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid content input!"
    ));
    exit;
}

$reviews = $client->selectCollection('shopping_site', 'reviews');

if ($review_id == null || $review_id == '') {
    //Post a new review
    $datetime = new DateTime();
    $reviews->insertOne(
        ['product_id' => $product_id, 'username' => $username, 'content' => $content, 'time' => date_format($datetime, 'Y-m-d H:i:s')]
    );

    $reviews->deleteMany(['username' => null]);
    echo json_encode(array(
        "success" => true
    ));
    exit;
}else{
    //edit a review posted by the current user
    // convert the $id string to MongoDB ObjectId first
    $update = $reviews->updateOne(['_id' => new MongoDB\BSON\ObjectId($review_id), 'username' => $username],
        ['$set' => ['content' => $content]]
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
