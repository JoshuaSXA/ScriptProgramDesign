var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
var count = 60;
var InterValObj1;
var curCount1;
function sendMessage1() {
    curCount1 = count;
    var phone = $.trim($('#phone1').val());
    if (!phoneReg.test(phone)) {
        alert(" 请输入有效的手机号码");
        return false;
    }

    $("#btnSendCode1").attr("disabled", "true");
    $("#btnSendCode1").val( + curCount1 + "秒再获取");

    $.ajax({
        url:"https://www.we-campus.cn/Script/api/send_login_message.php",
        data: {
            phone:$('#phone1').val()
        },
        type: "POST",
        dataType: "json",
        success: function (data) {
            if(data.success) {
                console.log("Message sending succeeded!");
            } else {
                console.log("Message sending failed!");
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
            alert("Remote Server Error!");
        }
    });

    InterValObj1 = window.setInterval(SetRemainTime1, 1000);
}

function SetRemainTime1() {
    if (curCount1 == 0) {
        window.clearInterval(InterValObj1);
        $("#btnSendCode1").removeAttr("disabled");
        $("#btnSendCode1").val("重新发送");
    }
    else {
        curCount1--;
        $("#btnSendCode1").val( + curCount1 + "秒再获取");
    }
}

function binding(){
    let verCode = $('#code1').val();

    $.ajax({
        url:"https://www.we-campus.cn/Script/api/verify_login_message.php",
        data: {
            phone:$('#phone1').val(),
            ver_code: verCode
        },
        type: "POST",
        dataType: "json",
        success: function (data) {
            if(data.success) {
                let exp = new Date();
                exp.setTime(exp.getTime() + data.expires * 1000);
                document.cookie = "user_id=" + data.cookie + ";expires=" + exp.toGMTString();
                $(window).attr('location','my.html');
            } else {
                alert("Wrong verification code!");
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
            alert("Remote Server Error!");
        }
    });
}


