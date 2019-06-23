


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

var loadDiaryItem = function (diaryList) {
    for (let i = 0; i < diaryList.length; ++i) {
        diaryItem = diaryList[i];

        let parent = document.getElementById("diary-list");

        // create elements
        let itemContainer = document.createElement("div");
        let senderContainer = document.createElement("div");
        let contentContainer = document.createElement("div");
        let avatarImg = document.createElement("img");
        let nameContainer = document.createElement("div");
        let nameSpan = document.createElement("span");
        let officeSpan = document.createElement("span");
        let timeSpan = document.createElement("span");
        let titleSpan = document.createElement("span");
        let msgContainer = document.createElement("div");

        // set attributes
        itemContainer.setAttribute("class", "msg-item-container");
        itemContainer.setAttribute("id", "diary-"+diaryItem.diary_id.toString());
        senderContainer.setAttribute("class", "msg-sender-container");
        contentContainer.setAttribute("class", "msg-content-container");
        avatarImg.setAttribute("src", diaryItem.avatar);
        nameContainer.setAttribute("class", "sender-name-container");
        nameSpan.setAttribute("class", "sender-name");
        nameSpan.innerText = diaryItem.nickname;
        officeSpan.setAttribute("class", "sender-office");
        officeSpan.innerText = "@iTime";
        timeSpan.setAttribute("class", "send-time");
        timeSpan.innerText = parseDate(diaryItem.diary_date);
        titleSpan.innerText = diaryItem.diary_title;
        msgContainer.setAttribute("class", "msg-text");
        msgContainer.innerText = diaryItem.diary_content;

        // set hierarchy
        nameContainer.appendChild(nameSpan);
        nameContainer.appendChild(officeSpan);
        senderContainer.appendChild(avatarImg);
        senderContainer.appendChild(nameContainer)
        senderContainer.appendChild(timeSpan);
        contentContainer.appendChild(titleSpan);
        contentContainer.appendChild(msgContainer);
        itemContainer.appendChild(senderContainer);
        itemContainer.appendChild(contentContainer);
        parent.appendChild(itemContainer);
    }
};


var getAllDiary = function(userID){
    $.ajax({
        url:"https://www.we-campus.cn/Script/api/get_all_diary.php",
        data: {
            user_id: userID
        },
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.success) {
                console.log(data.data);
                loadDiaryItem(data.data);
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

    getAllDiary(userID);

    $("#today-page").click(function () {
        $(window).attr('location','today.html');
    });

    $("#list-page").click(function () {
        $(window).attr('location','list.html');
    });

    $("#my-page").click(function () {
        $(window).attr('location','my.html');
    });

    $("#add-btn").click(function () {
        $(window).attr('location','write.html');
    });

});