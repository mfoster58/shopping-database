<?php

require_once __DIR__ . '/vendor/autoload.php';

$client = new MongoDB\Client(
      'mongodb+srv://qinshu1013:J9s9eSSAmqm0c249@cse330final.mxgnf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

   $customers = $client->selectCollection('sample_analytics', 'customers');
   $document = $customers->findOne(['username' => 'wesley20']);

   var_dump($document);

?>