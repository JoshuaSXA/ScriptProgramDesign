<?php

include_once "DBController.php";
include_once "GlobalVar.php";


class GameInfoController {

    private $DBController;

    public function __construct()
    {

        $this->DBController = new DBController();

        $this->DBController->connDatabase();

    }

    public function __destruct()
    {

        // TODO: Implement __destruct() method.
        $this->DBController->disConnDatabase();

    }

    private function mbStrSplit($string) {

        return preg_split('/(?<!^)(?!$)/u' , $string);

    }

    // 搜索游戏
    public function searchGameItem() {

        $keyword = $_GET['keyword'];

        $keyword = str_replace(' ', '', $keyword);

        $strArray = $this->mbStrSplit($keyword);

        $queryString = '';

        for($i=0; $i < count($strArray); $i++){
            $queryString = $queryString.'%'.$strArray[$i];
        }

        $queryString = $queryString.'%';

        $sql = "SELECT s.game_id, s.title, s.badge, (SELECT GROUP_CONCAT(a.url) FROM swiper_img a WHERE a.game_id = s.game_id) AS swiper_img FROM game s WHERE s.title LIKE (?)";

        // 创建预处理语句
        $stmt = mysqli_stmt_init($this->DBController->getConnObject());
        if(mysqli_stmt_prepare($stmt, $sql)){
            // 绑定参数
            mysqli_stmt_bind_param($stmt, "s", $queryString);
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


    // 获取所有评论
    public function getGameComment() {

        $gameID = $_GET['game_id'];

        $sql = "SELECT open_id, comment_id, title, content, comment_time, rate, nickname, avatar FROM comment NATURAL JOIN user WHERE game_id = (?)";

        // 创建预处理语句
        $stmt = mysqli_stmt_init($this->DBController->getConnObject());
        if(mysqli_stmt_prepare($stmt, $sql)){
            // 绑定参数
            mysqli_stmt_bind_param($stmt, "i", $gameID);
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
            echo $this->DBController->getErrorCode();
            echo json_encode(array("success" => FALSE, "data" => array()));
        }

    }


    public function getGameTopList() {

        $sql = "SELECT s.game_id, s.title, s.appid, s.intro, s.badge, 
                (SELECT COUNT(*) FROM comment c WHERE c.game_id = s.game_id) AS comment_total, 
                (SELECT GROUP_CONCAT(a.url) FROM swiper_img a WHERE a.game_id = s.game_id) AS swiper_img,  
                (SELECT AVG(b.rate) FROM comment b WHERE b.game_id = s.game_id) AS average 
                FROM game s";

        $retval = mysqli_query($this->DBController->getConnObject(), $sql);

        if($retval){

            $posts =  mysqli_fetch_all($retval, MYSQLI_ASSOC);

            echo json_encode(array("success" => TRUE, "data" => $posts));

        }else{

            echo $this->DBController->getErrorCode();

            echo json_encode(array("success" => FALSE, "data" => array()));

        }

    }


    public function getGameDetail() {

        $gameID = $_GET['game_id'];

        $openID = $_GET['open_id'];

        $sql = "SELECT s.game_id, s.title, s.appid, s.intro, s.badge, 
                (SELECT GROUP_CONCAT(a.url) FROM swiper_img a WHERE a.game_id = s.game_id) AS swiper_img, 
                (SELECT COUNT(*) FROM comment b WHERE b.game_id = s.game_id) AS comment_total,
                (SELECT AVG(c.rate) FROM comment c WHERE c.game_id = s.game_id) AS average,
                (SELECT GROUP_CONCAT(q.stars) FROM (SELECT COUNT(*) AS stars FROM comment d WHERE d.game_id = (?) GROUP BY d.rate) q) AS stars,
                (SELECT COUNT(*) FROM favor t WHERE t.open_id = (?) AND t.game_id = (?)) AS favor_num
                FROM game s WHERE s.game_id = (?)";

        // 创建预处理语句
        $stmt = mysqli_stmt_init($this->DBController->getConnObject());
        if(mysqli_stmt_prepare($stmt, $sql)){
            // 绑定参数
            mysqli_stmt_bind_param($stmt, "isii", $gameID, $openID, $gameID, $gameID);
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
            echo $this->DBController->getErrorCode();
            echo json_encode(array("success" => FALSE, "data" => array()));
        }

    }


    public function getIndexPageInfo() {

        $openID = $_GET['open_id'];

        $sql = "SELECT nickname, avatar, points FROM user WHERE open_id = (?)";

        // 创建预处理语句
        $stmt = mysqli_stmt_init($this->DBController->getConnObject());
        if(mysqli_stmt_prepare($stmt, $sql)){
            // 绑定参数
            mysqli_stmt_bind_param($stmt, "s", $openID);
            // 执行查询
            if(!mysqli_stmt_execute($stmt)) {
                echo json_encode(array("success" => FALSE, "data" => array()));
                return;
            }
            // 获取查询结果
            $result = mysqli_stmt_get_result($stmt);
            // 获取值
            $retValue =  mysqli_fetch_all($result, MYSQLI_ASSOC);

            Global $indexImg, $index;

            $retValue = $retValue[0];
            $retValue['index_img'] = $indexImg;
            $retValue['index'] = $index;

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

}