<?php
require 'cors_header.php';
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$review_id = $json_obj['review_id'];

require 'database.php';


$reviews = $client->selectCollection('shopping_site', 'reviews');
$result = $reviews->deleteOne([
    '_id' => new MongoDB\BSON\ObjectId($review_id),
    'username' => $username
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