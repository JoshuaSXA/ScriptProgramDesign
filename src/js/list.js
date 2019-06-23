var getCookie = function(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};

var parseDate = function (dateStr) {
    let dateArray = dateStr.split("-");
    let year = dateArray[0];
    let month = dateArray[1];
    let day = dateArray[2];
    month.replace(/\b(0+)/gi,"");
    day.replace(/\b(0+)/gi,"");
    let res = year + "年" + month + "月" + day + "日";
    return res;
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
        periodText.innerText = parseDate(taskItem.task_date);
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
};

var getTodayTaskItem = function(userID) {

    $.ajax({
        url:"https://www.we-campus.cn/Script/api/get_all_task_item.php",
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

var getFilteredRes = function(filterStatus, userID){
    if(filterStatus == 3) {
        getTodayTaskItem(userID);
    }

    $.ajax({
        url:"https://www.we-campus.cn/Script/api/get_task_by_status.php",
        data: {
            user_id: userID,
            task_status: filterStatus
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

$(document).ready(function () {
    let userID = getCookie('user_id');

    let filterStatus = 3;

    let filterColorList = ["#F29B41", "#71ACE6", "#8dba56", "#81c1c7"];

    getTodayTaskItem(userID);

    $(".filter-btn").click(function () {
        $("#item-list").empty();
        $(".filter-choice-container").fadeIn(600);
    });

    $(".filter").click(function () {
        let index = parseInt($(this).attr("id").split("_")[1]);
        for (let i = 0; i < 4; ++i) {
            let selector = $("#f_" + i.toString());
            selector.css("color", "#959595");
            selector.css("background-color", "rgb(242, 242, 242)");
        }
        $(this).css("color", "#FFFFFF");
        $(this).css("background-color", filterColorList[index]);
        filterStatus = index;
        setTimeout(function () {
            $(".filter-choice-container").css("display", "none");
            getFilteredRes(filterStatus, userID);
        }, 600);
    });

    $("#add-btn").click(function () {
        $(window).attr('location','add.html');
    });

    $(".search-btn").click(function () {
        let keyword = $(".search-input").val();
        if(!keyword.length) {
            alert("Empty search keyword!");
            return;
        }
        $.ajax({
            url:"https://www.we-campus.cn/Script/api/search_task_by_keywords.php",
            data: {
                user_id: userID,
                keyword: keyword
            },
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.success) {
                    console.log(data.data);
                    $("#item-list").empty();
                    $(".loading-container").css("display", "block");
                    setTimeout(function () {
                        $(".loading-container").css("display", "none");
                        loadTaskItem(data.data);
                    }, 600);
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

    $("#today-page").click(function () {
        $(window).attr('location','today.html');
    });

    $("#diary-page").click(function () {
        $(window).attr('location','diary.html');
    });

    $("#my-page").click(function () {
        $(window).attr('location','my.html');
    });

});