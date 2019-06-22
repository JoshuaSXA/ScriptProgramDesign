var prefixZero = function(num, n) {
    return (Array(n).join(0) + num).slice(-n);
};

var showCurDate = function() {
    let date = new Date();
    let enWekDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    let chWekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    $(".day-text").text(prefixZero(date.getDate(), 2));
    $(".wed-text").text(enWekDay[date.getDay()]);
    $(".ch-wed-text").text(chWekDay[date.getDay()]);
    $(".ch-date-text").text(date.getFullYear().toString() + "年" + (date.getMonth() + 1).toString() + "月");
};

var getCookie = function(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};

var loadTaskItem = function (taskList) {

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    $("#refresh-time").text(year.toString() + "年" + month.toString() + "月" + day.toString() + "日 " + hours.toString() + ":" + minutes.toString());

    for (let i = 0; i < taskList.length; ++i) {
        taskItem = taskList[i];

        let parent = document.getElementById("item-list");

        // create elements
        let itemContainer = document.createElement("div");
        let periodText = document.createElement("div");
        let contentContainer = document.createElement("div");
        let taskIcon = document.createElement("img");
        let taskName = document.createElement("span");
        let statusContainer = document.createElement("div");
        let statusImg = document.createElement("img");

        // set attributes
        itemContainer.setAttribute("class", "item-container");
        itemContainer.setAttribute("id", "task-"+taskItem.task_id.toString());
        periodText.setAttribute("class", "period-text");
        periodText.innerText = "今天";
        contentContainer.setAttribute("class", "content-container");
        taskIcon.setAttribute("class", "task-icon");
        taskIcon.setAttribute("src", "src/icon/" + taskItem.task_icon.toString() + ".png");
        taskName.setAttribute("class", "task-name");
        taskName.innerText = taskItem.task_title;
        statusContainer.setAttribute("class", "status state_" + taskItem.task_status.toString());
        statusImg.setAttribute("class", "status-img");
        statusImg.setAttribute("src", "src/icon/status_" + taskItem.task_status.toString() + ".png");

        // set hierarchy
        statusContainer.appendChild(statusImg);
        contentContainer.appendChild(taskIcon);
        contentContainer.appendChild(taskName);
        contentContainer.appendChild(statusContainer);
        itemContainer.appendChild(periodText);
        itemContainer.appendChild(contentContainer);
        parent.appendChild(itemContainer);
    }

    if(!taskList.length){
        $(".add-item-container").css("display", "block");
    }

};

var getTodayTaskItem = function(userID) {

    $.ajax({
        url:"https://www.we-campus.cn/Script/api/get_today_task_item.php",
        data: {
            user_id: userID
        },
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.success) {
                console.log(data.data);
                loadTaskItem(data.data);
            } else {
                console.log("Task creation failed!");
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
            alert("Remote Server Error!");
        }
    });

};

var getAllTaskCompleted = function(userID) {
    $.ajax({
        url:"https://www.we-campus.cn/Script/api/get_all_task_completed.php",
        data: {
            user_id: userID
        },
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.success) {
                console.log(data.data);
                getTodayTaskItem(userID);
            } else {
                console.log("Task creation failed!");
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
            alert("Remote Server Error!");
        }
    });
};

var getAllTaskCanceled = function(userID) {
    $.ajax({
        url:"https://www.we-campus.cn/Script/api/get_all_task_canceled.php",
        data: {
            user_id: userID
        },
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.success) {
                console.log(data.data);
                getTodayTaskItem(userID);
            } else {
                console.log("Task creation failed!");
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
            alert("Remote Server Error!");
        }
    });
};

$(document).ready(function () {

    let userID = getCookie('user_id');

    showCurDate();

    getTodayTaskItem(userID);

    setInterval(function () {
        let date = new Date();
        $(".time-text").text(date.getHours().toString() + ":" + prefixZero(date.getMinutes(), 2));
    }, 1000);

    $("#add-btn").click(function () {
        $(window).attr('location','add.html?page=today');
    });


    // set status as completed
    $("#item-list").on("click", ".state_1", function () {

        let selector = $(this);

        let taskID = selector.parent().parent().attr("id");

        taskID = parseInt(taskID.split("-")[1]);

        $.ajax({
            url:"https://www.we-campus.cn/Script/api/get_task_completed.php",
            data: {
                task_id: taskID
            },
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.success) {
                    console.log(data);
                    selector.attr("class", "status state_2");
                    selector.children(".status-img").attr("src", "src/icon/status_2.png");
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

    // long-press to cancel
    let time = null;

    $("#item-list").on('touchstart', '.status', function(e){

        let selector = $(this).parent().parent();
        let taskID = selector.attr("id");
        taskID = parseInt(taskID.split("-")[1]);

        e.stopPropagation();
        time = setTimeout(function(){
            $.ajax({
                url:"https://www.we-campus.cn/Script/api/get_task_canceled.php",
                data: {
                    task_id: taskID
                },
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if(data.success) {
                        console.log(data);
                        selector.animate({
                            marginLeft:'-360px',
                            marginRight: '+360px'
                        },function () {
                            selector.animate({
                                height:'0px'
                            }, function () {
                                selector.remove();
                            });
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
        }, 800);//这里设置长按响应时间
    });

    $("#item-list").on('touchend', '.status', function(e){
        e.stopPropagation();
        clearTimeout(time);
    });

    // refresh page
    $(".alert-msg-container").click(function () {
        $("#item-list").empty();
        $(".loading-container").css("display", "block");
        setTimeout(function () {
            $(".loading-container").css("display", "none");
            getTodayTaskItem(userID);
        }, 800);
    });

    $("#batch-btn").click(function () {
        $("#item-list").empty();
        $(".filter-choice-container").fadeIn(600);
    });

    $(".filter").click(function () {
        for (let i = 0; i < 3; i++) {
            let selector = $("#f_" + i.toString());
            selector.css("color", "#959595");
            selector.css("background-color", "rgb(242, 242, 242)");
        }
        $(this).css("color", "#FFFFFF");
        $(this).css("background-color", "#71ACE6");
        let index = parseInt($(this).attr("id").split("_")[1]);
        setTimeout(function () {
            $(".filter-choice-container").css("display", "none");
            if(index == 0) {
                getAllTaskCompleted(userID);
            } else if (index == 1) {
                getAllTaskCanceled(userID);
            } else if (index == 2) {
                getTodayTaskItem(userID);
            }
        }, 500);

    });

});