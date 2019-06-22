<?php

include_once "../lib/PhoneNumberVerification.php";

$phoneNumberVerificationControllerObj = new PhoneNumberVerificationController();


$phoneNumberVerificationControllerObj->sendVerificationMessage();

$phoneNumberVerificationControllerObj->closeService();

?>