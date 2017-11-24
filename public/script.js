jQuery(document).ready(function ($) {
    
    function getQueryParams(qs) {
        if (qs)
        {
            qs = qs.split('+').join(' ');
            
            var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
            
            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }
            return params;
        }
        else 
        return (null)
        
    }
    let test = getQueryParams(document.location.search);
    let code;
    if (test)
    {
        code = test['code'];
    }
    else
    code = null;
    const socket = io({
        transportOptions: {
            polling: {
                extraHeaders: {
                    'code': code
                }
            }
        }
    });
    console.log(code);
    socket.on('connectedUsers', function (data) {
        data = JSON.parse(data).array;
        mapData(data);
        console.log(mainObj);
        printDataToInterface();
    });
    socket.on('error', function (data) {
        if (data == 'Authentication error')
        {
            setTimeout(()=>{
                window.location.replace("https://api.intra.42.fr/oauth/authorize?client_id=ec554f6910bc61665c6b05abe37b1a0a08b5589fad33614029d5453de6d3a481&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&response_type=code");
            },1000);
        }
        console.log(data);
    });
    var mainObj = {
        z1: [],
        z2: [],
        z3: [],
        z4: []
    };
    
    $('#refresh').on('click', function () {
        getConnectedUsers();
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