<?php
// ref:https://exerror.com/response-to-preflight-request-doesnt-pass-access-control-check-no-access-control-allow-origin-header-is-present-on-the-requested-resource/#Solution_1_Turn_off_CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
//end of citation
?>