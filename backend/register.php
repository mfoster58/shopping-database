<?php
require 'cors_header.php';

header("Content-Type: application/json"); 

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$password = $json_obj['password'];
$account_type = $json_obj['account_type'];

require 'database.php';


if (!preg_match('/^[\w_\-]+$/', $username) || $username == null) {
    // Register failed, username invalid
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid Username"
    ));
    exit;
}

$users = $client->selectCollection('shopping_site', 'users');
$cnt = $users->countDocuments(['username' => $username]);

if($cnt != 0){
// Register failed, the user already exists
echo json_encode(array(
    "success" => false,
    "message" => "The username exists"
));
exit;
}else {
    // valid new user
    // create the new user's profile
    
    $hashed_pwd = password_hash($password, PASSWORD_BCRYPT);

    $users->insertOne(
        ['username' => $username, 'hashed_pwd' => $hashed_pwd, 'account_type' => $account_type, 'balance' => 0]
    );

    ini_set("session.cookie_httponly", 1);
    session_start();
    $_SESSION['username'] = $username;
    //$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));

    echo json_encode(array(
        "success" => true,
        // "token" => $_SESSION['token'],
        "username" => $username,
        "account_type" => $account_type,
        // "balance" => 0
    ));
    exit;
}

?>
