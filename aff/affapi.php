<?php
date_default_timezone_set("Europe/Stockholm");
header("Content-type:application/json");
$siteid = $_GET["siteid"];
$url = 'https://data.affluences.com/v1/data/realtime/' . $siteid;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: key 2bdf229d82e07f3abdbf1a65ba1f34ff21e8ccd625325a8728b46f7b85624f29'));
//return the transfer as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($ch);
if ($result === false)
{
    // throw new Exception('Curl error: ' . curl_error($crl));
    print_r('Curl error: ' . curl_error($ch));
}
echo $result;
curl_close($ch);
?>