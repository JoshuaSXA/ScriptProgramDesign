<?php

include_once "../lib/PhoneNumberVerification.php";

$phoneNumberVerificationControllerObj = new PhoneNumberVerificationController();


$phoneNumberVerificationControllerObj->checkVerificationCode();

$phoneNumberVerificationControllerObj->closeService();

?>