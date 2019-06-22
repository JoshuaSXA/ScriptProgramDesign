<?php
include_once 'GlobalVar.php';
include_once 'DBController.php';


/**
 * 
 */
class ToDoMVCController{

	private $userID;

	private $DBController;
	
	function __construct() {
		# code...
		// 设置时区为上海时间
		date_default_timezone_set('Asia/Shanghai'); 

		// 创建数据库连接控制类
		$this->DBController = new DBController();
		// 连接数据库
		$this->DBController->connDatabase();

	}

	public function __destruct(){

		$this->DBController->disConnDatabase();

	}

	public function getUserInfo() {
		$userID = $_GET['user_id'];

		$sql = "SELECT nickname, avatar FROM user WHERE phone = (?)";

		// 创建预处理语句
        $stmt = mysqli_stmt_init($this->DBController->getConnObject());
        if(mysqli_stmt_prepare($stmt, $sql)){
            // 绑定参数
            mysqli_stmt_bind_param($stmt, "s", $userID);
            // 执行查询
            if(!mysqli_stmt_execute($stmt)) {
                echo json_encode(array("success" => FALSE, "data" => array()));
                return;
            }
            // 获取查询结果
            $result = mysqli_stmt_get_result($stmt);
            // 获取值
            $retValue =  mysqli_fetch_all($result, MYSQLI_ASSOC);
            // 返回结果
            echo json_encode(array("success" => TRUE, "data" => $retValue[0]), JSON_UNESCAPED_UNICODE);
            // 释放结果
            mysqli_stmt_free_result($stmt);
            // 关闭mysqli_stmt类
            mysqli_stmt_close($stmt);
        } else {
            //echo $this->DBController->getErrorCode();
            echo json_encode(array("success" => FALSE, "data" => array()));
        }
	}

	public function createTaskItem() {
		$userID = $_REQUEST['user_id'];
		$taskTitle = $_REQUEST['task_title'];
		$taskIcon = $_REQUEST['task_icon'];
		$taskDate = $_REQUEST['task_date'];
		$taskStatus = $_REQUEST['task_status'];

		$sql = "INSERT INTO task (phone, task_title, task_icon, task_date, task_status) VALUES ((?), (?), (?), (?), (?))";

		// 创建预处理语句
		$stmt = mysqli_stmt_init($this->DBController->getConnObject());

		if(mysqli_stmt_prepare($stmt, $sql)){

			// 绑定参数
			mysqli_stmt_bind_param($stmt, "ssisi", $userID, $taskTitle, $taskIcon, $taskDate, $taskStatus);

			// 执行查询
			if(!mysqli_stmt_execute($stmt)) {

				echo json_encode(array('success' => FALSE));
		
			}

			// 释放结果
			mysqli_stmt_free_result($stmt);

			// 关闭mysqli_stmt类
			mysqli_stmt_close($stmt);

			echo json_encode(array('success' => TRUE));

		} else {

        	echo json_encode(array('success' => FALSE));

        }
	}

	public function getTodayTaskItem() {

		$userID = $_GET['user_id'];

		$curDate = date("Y-m-d");

		$sql = "SELECT task_id, task_title, task_icon, task_date, task_status FROM task WHERE phone=(?) AND task_date=(?) AND NOT task_status=3 ORDER BY task_status ASC";

		// 创建预处理语句
        $stmt = mysqli_stmt_init($this->DBController->getConnObject());
        if(mysqli_stmt_prepare($stmt, $sql)){
            // 绑定参数
            mysqli_stmt_bind_param($stmt, "ss", $userID, $curDate);
            // 执行查询
            if(!mysqli_stmt_execute($stmt)) {
                echo json_encode(array("success" => FALSE, "data" => array()));
                return;
            }
            // 获取查询结果
            $result = mysqli_stmt_get_result($stmt);
            // 获取值
            $retValue =  mysqli_fetch_all($result, MYSQLI_ASSOC);
            // 返回结果
            echo json_encode(array("success" => TRUE, "data" => $retValue), JSON_UNESCAPED_UNICODE);
            // 释放结果
            mysqli_stmt_free_result($stmt);
            // 关闭mysqli_stmt类
            mysqli_stmt_close($stmt);
        } else {
            //echo $this->DBController->getErrorCode();
            echo json_encode(array("success" => FALSE, "data" => array()));
        }

	}



  	public function getAllTaskItem() {
  		$userID = $_GET['user_id'];
  		$curDate = date("Y-m-d");
  		$sql = "SELECT task_id, task_title, task_icon, task_date, task_status FROM task WHERE phone=(?) AND task_date>=(?) AND NOT task_status=3 ORDER BY task_date ASC";
        $stmt = mysqli_stmt_init($this->DBController->getConnObject());
        if(mysqli_stmt_prepare($stmt, $sql)){
            mysqli_stmt_bind_param($stmt, "ss", $userID, $curDate);
            if(!mysqli_stmt_execute($stmt)) {
                echo json_encode(array("success" => FALSE, "data" => array()));
                return;
            }
            $result = mysqli_stmt_get_result($stmt);
            $retValue =  mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(array("success" => TRUE, "data" => $retValue), JSON_UNESCAPED_UNICODE);
            mysqli_stmt_free_result($stmt);
            mysqli_stmt_close($stmt);
        } else {
            //echo $this->DBController->getErrorCode();
            echo json_encode(array("success" => FALSE, "data" => array()));
        }
  	}


	public function getTaskCompleted() {
		$taskID = $_GET['task_id'];
		$sql = "UPDATE task SET task_status = 2 WHERE task_id = (?)";
		$stmt = mysqli_stmt_init($this->DBController->getConnObject());
		if(mysqli_stmt_prepare($stmt, $sql)){
			mysqli_stmt_bind_param($stmt, "i", $taskID);
			if(!mysqli_stmt_execute($stmt)) {
				echo json_encode(array('success' => FALSE));
			}
			mysqli_stmt_free_result($stmt);
			mysqli_stmt_close($stmt);
			echo json_encode(array('success' => TRUE));
		} else {
        	echo json_encode(array('success' => FALSE));
        }
	}

	public function getAllTaskCompleted() {
		$userID = $_GET['user_id'];
		$curDate = date("Y-m-d");
		$sql = "UPDATE task SET task_status = 2 WHERE phone = (?) AND task_date=(?) AND task_status = 1";
		$stmt = mysqli_stmt_init($this->DBController->getConnObject());
		if(mysqli_stmt_prepare($stmt, $sql)){
			mysqli_stmt_bind_param($stmt, "ss", $userID, $curDate);
			if(!mysqli_stmt_execute($stmt)) {
				echo json_encode(array('success' => FALSE));
			}
			mysqli_stmt_free_result($stmt);
			mysqli_stmt_close($stmt);
			echo json_encode(array('success' => TRUE));
		} else {
        	echo json_encode(array('success' => FALSE));
        }
	}

	public function getTaskCanceled() {
		$taskID = $_GET['task_id'];
		$sql = "UPDATE task SET task_status = 3 WHERE task_id = (?)";
		$stmt = mysqli_stmt_init($this->DBController->getConnObject());
		if(mysqli_stmt_prepare($stmt, $sql)){
			mysqli_stmt_bind_param($stmt, "i", $taskID);
			if(!mysqli_stmt_execute($stmt)) {
				echo json_encode(array('success' => FALSE));
			}
			mysqli_stmt_free_result($stmt);
			mysqli_stmt_close($stmt);
			echo json_encode(array('success' => TRUE));
		} else {
        	echo json_encode(array('success' => FALSE));
        }
	}

	public function getAllTaskCanceled() {
		$userID = $_GET['user_id'];
		$curDate = date("Y-m-d");
		$sql = "UPDATE task SET task_status = 3 WHERE phone = (?) AND task_date=(?)";
		$stmt = mysqli_stmt_init($this->DBController->getConnObject());
		if(mysqli_stmt_prepare($stmt, $sql)){
			mysqli_stmt_bind_param($stmt, "ss", $userID, $curDate);
			if(!mysqli_stmt_execute($stmt)) {
				echo json_encode(array('success' => FALSE));
			}
			mysqli_stmt_free_result($stmt);
			mysqli_stmt_close($stmt);
			echo json_encode(array('success' => TRUE));
		} else {
        	echo json_encode(array('success' => FALSE));
        }
	}

	public function getTaskByStatus() {
		$taskStatus = $_GET['task_status'];
		$userID = $_GET['user_id'];
		$curDate = date("Y-m-d");
  		$sql = "SELECT task_id, task_title, task_icon, task_date, task_status FROM task WHERE phone=(?) AND task_date>=(?) AND task_status=(?) ORDER BY task_date ASC";
        $stmt = mysqli_stmt_init($this->DBController->getConnObject());
        if(mysqli_stmt_prepare($stmt, $sql)){
            mysqli_stmt_bind_param($stmt, "ssi", $userID, $curDate, $taskStatus);
            if(!mysqli_stmt_execute($stmt)) {
                echo json_encode(array("success" => FALSE, "data" => array()));
                return;
            }
            $result = mysqli_stmt_get_result($stmt);
            $retValue =  mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(array("success" => TRUE, "data" => $retValue), JSON_UNESCAPED_UNICODE);
            mysqli_stmt_free_result($stmt);
            mysqli_stmt_close($stmt);
        } else {
            //echo $this->DBController->getErrorCode();
            echo json_encode(array("success" => FALSE, "data" => array()));
        }
	}

	private function mbStrSplit($string) {

        return preg_split('/(?<!^)(?!$)/u' , $string);

    }

	public function searchTaskByKeywords() {

		$userID = $_GET['user_id'];

		$keyword = $_GET['keyword'];

		$curDate = date("Y-m-d");

        $keyword = str_replace(' ', '', $keyword);

        $strArray = $this->mbStrSplit($keyword);

        $queryString = '';

        for($i=0; $i < count($strArray); $i++){
            $queryString = $queryString.'%'.$strArray[$i];
        }

        $queryString = $queryString.'%';

        $sql = "SELECT task_id, task_title, task_icon, task_date, task_status FROM task WHERE phone=(?) AND task_date>=(?) AND task_title LIKE (?) AND NOT task_status=3 ORDER BY task_date ASC";

        $stmt = mysqli_stmt_init($this->DBController->getConnObject());
        if(mysqli_stmt_prepare($stmt, $sql)){
            mysqli_stmt_bind_param($stmt, "sss", $userID, $curDate, $queryString);
            if(!mysqli_stmt_execute($stmt)) {
                echo json_encode(array("success" => FALSE, "data" => array()));
                return;
            }
            $result = mysqli_stmt_get_result($stmt);
            $retValue =  mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(array("success" => TRUE, "data" => $retValue), JSON_UNESCAPED_UNICODE);
            mysqli_stmt_free_result($stmt);
            mysqli_stmt_close($stmt);
        } else {
            //echo $this->DBController->getErrorCode();
            echo json_encode(array("success" => FALSE, "data" => array()));
        }

	}

	public function createDiary(){
		$userID = $_REQUEST['user_id'];
		$weatherIcon = $_REQUEST['weather_icon'];
		$diaryTitle = $_REQUEST['diary_title'];
		$diaryContent = $_REQUEST['diary_content'];


		$sql = "INSERT INTO diary (phone, weather_icon, diary_title, diary_content, diary_date) VALUES ((?), (?), (?), (?), NOW())";

		// 创建预处理语句
		$stmt = mysqli_stmt_init($this->DBController->getConnObject());

		if(mysqli_stmt_prepare($stmt, $sql)){

			// 绑定参数
			mysqli_stmt_bind_param($stmt, "siss", $userID, $weatherIcon, $diaryTitle, $diaryContent);

			// 执行查询
			if(!mysqli_stmt_execute($stmt)) {

				echo json_encode(array('success' => FALSE));
		
			}

			// 释放结果
			mysqli_stmt_free_result($stmt);

			// 关闭mysqli_stmt类
			mysqli_stmt_close($stmt);

			echo json_encode(array('success' => TRUE));

		} else {

        	echo json_encode(array('success' => FALSE));

        }

	}

	public function getAllMyDiary() {
		$userID = $_GET['user_id'];

		$sql = "SELECT diary_id, weather_icon, diary_title, diary_content, diary_date, nickname, avatar FROM diary NATURAL JOIN user WHERE phone = (?)";

		$stmt = mysqli_stmt_init($this->DBController->getConnObject());
        if(mysqli_stmt_prepare($stmt, $sql)){
            mysqli_stmt_bind_param($stmt, "s", $userID);
            if(!mysqli_stmt_execute($stmt)) {
                echo json_encode(array("success" => FALSE, "data" => array()));
                return;
            }
            $result = mysqli_stmt_get_result($stmt);
            $retValue =  mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(array("success" => TRUE, "data" => $retValue), JSON_UNESCAPED_UNICODE);
            mysqli_stmt_free_result($stmt);
            mysqli_stmt_close($stmt);
        } else {
            //echo $this->DBController->getErrorCode();
            echo json_encode(array("success" => FALSE, "data" => array()));
        }

	}

}