var getCookie = function(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};


$(document).ready(function () {

    let userID = getCookie('user_id');

    userID = "18117167391";

    let iconIndex = 0;

    $(".icon").click(function () {
        $(".activate-icon").attr("class", "icon deactivate-icon");
        $(this).attr("class", "icon activate-icon");
        iconIndex = parseInt($(this).attr("id").split("-")[1]);
        console.log(iconIndex);
    });

    let submitDiary = function() {

        let title = $("#title-input").val();

        let content = $("#content-input").val();

        if(!title.length || !content.length) {
            alert("Some content should not be omitted!");
            return;
        }

        $.ajax({
            url:"https://www.we-campus.cn/Script/api/create_diary.php",
            data: {
                user_id: userID,
                weather_icon: iconIndex,
                diary_title: title,
                diary_content: content
            },
            type: "POST",
            dataType: "json",
            success: function (data) {
                if(data.success) {
                    console.log(data);
                    $(".mode-container").fadeIn(500, function () {
                        setTimeout(function () {
                            $(window).attr('location','diary.html');
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
    };

    $("#submit").click(function () {
        submitDiary();
    });

    $(".return-text").click(function () {
        $(window).attr('location','diary.html');
    });

});