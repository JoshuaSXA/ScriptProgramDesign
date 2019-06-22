<?php
include_once 'GlobalVar.php';
include_once 'DBController.php';
include_once 'qcloudsms_php/src/index.php';

use Qcloud\Sms\SmsSingleSender;

/**
 * 短信验证控制类，负责验证用户的手机号
 */

class PhoneNumberVerificationController {

	private $redis;
	
	function __construct() {
		// 设置时区为上海时间
		date_default_timezone_set('Asia/Shanghai'); 

		// 创建数据库连接控制类
		$this->DBController = new DBController();
		// 连接数据库
		$this->DBController->connDatabase();

		// 实例化一个redis类
		$this->redis = new Redis();
		// 连接到redis_server，端口号为6379， timeout为10s
		$this->redis->connect('127.0.0.1', 6379, 10);

	}


	public function sendVerificationMessage() {

		$phoneNumber = $_REQUEST['phone'];

		$phoneHash = $phoneNumber . '_ver';

		global $smsAppID, $smsAppKey, $smsTemplateId, $smsSign, $smsValidTime;

		// 随机生成四位验证码
		$verCode = (string)rand(999, 9999);

		try {
    		$ssender = new SmsSingleSender($smsAppID, $smsAppKey);
    		$params = [$verCode, $smsValidTime];
    		$result = $ssender->sendWithParam("86", $phoneNumber, $smsTemplateId, $params, $smsSign, "", "");
    		$rsp = json_decode($result, TRUE);

    		if($rsp["result"] != 0) {
    			echo json_encode(array("success"=>FALSE, "time_exceeded"=>FALSE, "err_code"=>$rsp["result"]));
    			return;
    		}
    		
		} catch(\Exception $e) {
    		//echo var_dump($e);
    		echo json_encode(array("success"=>FALSE, "time_exceeded"=>FALSE, "err_code"=>-1));
    		return;
		}

		$storedHash = json_encode(array("ver_code"=>$verCode, "phone_number"=>$phoneNumber));

		// 存入redis缓存
		$this->redis->setex($phoneHash, (int)$smsValidTime * 60, $storedHash);

		echo json_encode(array("success"=>TRUE, "time_exceeded"=>FALSE, "err_code"=>0));

	}


	private function createUserIfNotExists($phone) {

		$sql = "INSERT IGNORE INTO user (phone) VALUES ((?))";

		// 创建预处理语句
		$stmt = mysqli_stmt_init($this->DBController->getConnObject());

		if(mysqli_stmt_prepare($stmt, $sql)){

			// 绑定参数
			mysqli_stmt_bind_param($stmt, "s", $phone);

			// 执行查询
			if(!mysqli_stmt_execute($stmt)) {

				return FALSE;
		
			}

			// 释放结果
			mysqli_stmt_free_result($stmt);

			// 关闭mysqli_stmt类
			mysqli_stmt_close($stmt);

			return TRUE;

		} else {

        	return FALSE;

        }

	}


	public function checkVerificationCode() {

		$phone = $_REQUEST['phone'];

		$phoneHash = $phone . '_ver';

		$verCode = $_REQUEST['ver_code'];

		$retVal = $this->redis->get($phoneHash);

		if($retVal) {

			$retVal = json_decode($retVal, TRUE);

		} else {

			echo json_encode(array("success" => FALSE));
			return;

		}

		if($retVal['ver_code'] != $verCode) {

			echo json_encode(array("success" => FALSE));
			return;

		}

		if (!$this->createUserIfNotExists($phone)) {
			echo json_encode(array("success" => FALSE));
			return;
		}

		echo json_encode(array("success" => TRUE, "cookie" => $phone, "expires" => 7200));

		return;
	}


	public function closeService() {

		// 断开与数据库的连接
		$this->DBController->disConnDatabase();	

		// 断开与redis_server的连接
		$this->redis->close();

	}

}


?>