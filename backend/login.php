<?php
require 'cors_header.php';
header("Content-Type: application/json"); 

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$password = $json_obj['password'];

require 'database.php';

if (!preg_match('/^[\w_\-]+$/', $username) || $username == null) {
    // Login failed, username invalid
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid Username"
    ));
    exit;
}

$users = $client->selectCollection('shopping_site', 'users');

$result = $users->findOne(['username' => $username],['projection' => ['_id' => 0]]);
$cnt = $users->countDocuments(['username' => $username]);



if ($cnt != 0) { // the user already exists
    $pwd_guess = $password;
    // Compare the submitted password to the actual password hash

    $pwd_hashed = $result['hashed_pwd'];
    $account_type = $result['account_type'];
    // $balance = $result['balance'];

    if ($cnt == 1 && password_verify($pwd_guess, $pwd_hashed)) {
        // valid password, login succeeded
        ini_set("session.cookie_httponly", 1);
        session_start();
        $_SESSION['username'] = $username;
        //$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));

        echo json_encode(array(
            "success" => true,
            //"token" => $_SESSION['token']
            "username" => $username,
            "account_type" => $account_type,
            // "balance" => $balance
        ));
        exit;
    } else {
        // Login failed, incorrect password
        echo json_encode(array(
            "success" => false,
            "message" => "Incorrect Password"
        ));
        exit;
    }
} else {
    // Login failed, incorrect username (the user doesn't exist)
    echo json_encode(array(
        "success" => false,
        "message" => "Incorrect Username"
    ));
    exit;
}
?>

?>
