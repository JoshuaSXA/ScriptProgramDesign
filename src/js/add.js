var taskDate = "0000-00-00";
/*
 * 0 task is to be done
 * 1 task is doing
 * 2 task is completed
 */
var taskStatus = 0;
var iconIndex = 0;


// Parse the parameters from the URL
var getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

var getCookie = function(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};

var prefixZero = function(num, n) {
    return (Array(n).join(0) + num).slice(-n);
};


var getNowFormatDate = function () {
    let date = new Date();
    let seperator1 = "-";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    month = prefixZero(month, 2);
    strDate = prefixZero(strDate, 2);
    let currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
};


var compareDate = function(date1, date2) {
    dateFormat1 = new Date(date1);
    dateFormat2 = new Date(date2);
    if (dateFormat1.getTime() >= dateFormat2.getTime()) {
        return true;
    } else {
        return false;
    }
};

$(document).ready(function () {
    let srcPage = getUrlParam("page");

    let userID = getCookie('user_id');

    if(srcPage == "today") {

        let date = new Date();
        $(".date-container").text(date.getFullYear().toString() + "年" + (date.getMonth() + 1).toString() + "月" + date.getDate().toString() + "日");
        taskDate = date.getFullYear().toString() + "-" + prefixZero((date.getMonth() + 1), 2) + "-" + prefixZero(date.getDate(), 2);
        taskStatus = 1;

    }

    $(".confirm-img").click(function () {

        let title  = $("#title").val();

        if(!title.length) {
            alert("You should have a title!");
            return;
        }
        $.ajax({
            url:"https://www.we-campus.cn/Script/api/create_task_item.php",
            data: {
                user_id: userID,
                task_title: title,
                task_icon: iconIndex,
                task_date: taskDate,
                task_status: taskStatus
            },
            type: "POST",
            dataType: "json",
            success: function (data) {
                if(data.success) {
                    console.log("Task creation succeeded!");
                    $(".mode-container").fadeIn(500, function () {
                        setTimeout(function () {
                            if(srcPage == "today") {
                                $(window).attr('location','today.html');
                            } else {
                                $(window).attr('location','list.html');
                            }
                        }, 1000);
                    });
                } else {
                    console.log("Task creation failed!");
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr, status, error);
                alert("Remote Server Error!");
            }
        });
    });

    // bind the calender revoker
    $('.date-container').datePicker({
        okFunc: function (date) {
            let year = date.startDate.year;
            let month = date.startDate.month;
            let day = date.startDate.date;
            $(".date-container").text(year.toString() + "年" + month.toString() + "月" + day.toString() + "日");
            let formatDate = year.toString() + "-" + prefixZero(month, 2) + "-" + prefixZero(day, 2);
            if (compareDate(formatDate, getNowFormatDate())) {
                taskStatus = taskDate == formatDate ? 1 : 0;
                console.log(taskStatus);
                taskDate = formatDate;
            } else {
                alert("The set time should not precede current date!");
            }
        }
    });

    $('.icon').click(function () {
        $(".activate-icon").attr("class", "deactivate-icon icon");
        $(this).attr("class", "activate-icon icon");
        iconIndex = parseInt($(this).attr("id"));
    });

    $(".return-text").click(function () {
        if(srcPage == "today") {
            $(window).attr('location','today.html');
        } else {
            $(window).attr('location','list.html');
        }
    });
});