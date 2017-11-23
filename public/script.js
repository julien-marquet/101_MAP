jQuery(document).ready(function ($) {

    var mainObj = {
        z1: [],
        z2: [],
        z3: [],
        z4: []
    };

    $('#refresh').on('click', function () {
        getConnectedUsers();
    });
    socket.on('connectedUsers', function (data) {
        data = JSON.parse(data).array;
        mapData(data);
        console.log(mainObj);
        printDataToInterface();
      });
    function getConnectedUsers() {
        $.get("http://localhost:8080/getConnectedUsers", function (data, status) {
            data = JSON.parse(data).array;
            mapData(data);
            console.log(mainObj);
            printDataToInterface();
        });
    }
    function printDataToInterface() {
        for (var key in mainObj)
        {
            $("#block-" + key + " .list-connected").html('');
            for (var i = 0; i < mainObj[key].length; i++)
            {
                $("#block-" + key + " .list-connected").append("<li>"+ mainObj[key][i].host +":" + mainObj[key][i].user.login + "</li>");
            }
        }
    }
    function mapData(array)
    {

        var i = 0;
        var char = '0';
        while (i < array.length)
        {
            if (array[i].host[1] !== char) {
                char = nextChar(char);
                mainObj["z" + char] = [];
            }
            mainObj["z" + char].push(array[i]);
            i++;
        }
    }

    function nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }
});