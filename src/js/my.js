// Parse the parameters from the URL
let getUrlParam = function(name) {
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

var delCookie = function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
};


const userID = parseInt(getCookie('user_id'));

$(document).ready(function () {

    console.log(userID);
    getUserInfo(userID);

    $(".exit").click(function () {
        delCookie('user_id');
        $(window).attr('location','login.html');
    });

    $("#today-page").click(function () {
        $(window).attr('location','today.html');
    });

    $("#diary-page").click(function () {
        $(window).attr('location','diary.html');
    });

    $("#list-page").click(function () {
        $(window).attr('location','list.html');

    });
});


let getUserInfo = function (userID) {
    $.ajax({
        url:"https://www.we-campus.cn/Script/api/get_user_info.php",
        data: {
            user_id: userID
        },
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.success) {
                console.log(data.data);
                updateUserInfo(data.data);
            } else {
                console.log("Message sending failed!");
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
            alert("Remote Server Error!");
        }
    });
};

let updateUserInfo = function (userInfo) {
    let nickname = userInfo.nickname;
    let avatar = userInfo.avatar;
    $("#avatar").attr("src", avatar);
    $(".username-text").text(nickname);
    $(".at-username").text("@"+nickname);
};