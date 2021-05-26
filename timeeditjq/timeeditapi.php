<?php
$todaysdate = $_GET["todaysdate"];
//Hämta bokningar från TimeEdit i json-format
$api = file_get_contents('https://cloud.timeedit.net/kth/web/public01/ri.json?h=f&sid=9&p=' . $todaysdate . '-' . $todaysdate . '&objects=420804.4%2C421314.4%2C417157.4%2C420802.4%2C417154.4%2C353552.4%2C420801.4%2C392851.4%2C417156.4&ox=0&types=0&fe=0&g=f&pl=f&sec=t&h2=2)');
//Hämta lokalbokningar i json-format
$api2 = file_get_contents('https://apps.lib.kth.se/webservices/lokalbokning/api/v1/noauth/events?fromDate=' . $todaysdate . '&toDate=' . $todaysdate . '&limit=5000');      
//Gör om bokningar till arrayer
$timeditarray = json_decode($api,true);
$lokalbokningarray = json_decode($api2,true);

//gå igenom lokalbokningarna och addera de till timeeditbokningarna
foreach ($lokalbokningarray as $bokning){
    array_push($timeditarray['reservations'], array('id' => $bokning['Event_ID'],"startdate" => $bokning['Start_Date'],"starttime" => $bokning['Start_Time'],"enddate"=>$bokning['End_Date'],"endtime"=>$bokning['End_Time'],"columns"=>array($bokning['Event_Title'],$bokning['Event_Object'],"","","")));
}

//Sortera efter starttid
uasort($timeditarray['reservations'], function ($a, $b) {
   return strtotime($a['starttime']) > strtotime($b['starttime']);
});

//bygg om array så att index hamnar i rätt ordning
$timeditarray['reservations'] = array_values($timeditarray['reservations']);

echo (json_encode($timeditarray));
?>