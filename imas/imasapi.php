<?php
require_once "config.php";
date_default_timezone_set("Europe/Stockholm");
header("Content-type:application/json; charset=utf-8");
$locationid = $_GET["locationid"];

echo getRealTimeData(getToken());

function getHeaders($respHeaders) {
    $headers = array();

    $headerText = substr($respHeaders, 0, strpos($respHeaders, "\r\n\r\n"));

    foreach (explode("\r\n", $headerText) as $i => $line) {
        if ($i === 0) {
            $headers['http_code'] = $line;
        } else {
            list ($key, $value) = explode(': ', $line);

            $headers[$key] = $value;
        }
    }

    return $headers;
}

function getToken() {
    global $UserName, $password;
    $url = 'https://portal-se.imas.net/XperioApi/account/login';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    $data = array(
        "UserName" => $UserName,
        "password" => $password
    );
    $data_string = json_encode($data);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type:application/json',
            'Content-Length: ' . strlen($data_string)
        )
    );
    $result = curl_exec($ch);
    if ($result === false)
    {
        print_r('Curl error: ' . curl_error($ch));
    }
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
	$header = substr($result, 0, $headerSize);
	$header = getHeaders($header);
    curl_close($ch);
    return $header['X-Auth-Token'];
}

function getRealTimeData($token) {
    $url = 'https://portal-se.imas.net/XperioApi/export/exportRealTimeValues?id=KTHBIB';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type:application/json',
            'User: alma@ece.kth.se',
            'X-Auth-Token: ' . $token
        )
    );
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    if ($result === false)
    {
        print_r('Curl error: ' . curl_error($ch));
    }
    return $result;
}

?>