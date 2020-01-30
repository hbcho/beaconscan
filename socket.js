var http = require("http");
var express = require("express");
var io = require("socket.io");
var fs = require('fs');
var kalmanFilter = require('kalmanjs');
var app = express();
//트래킹할 주소
//var addressToTrack = ['ac233f528171','ac233f528170'];
/*
var kalmanFilter = new KalmanFilter ({R: 0.01, Q: 3});

var dataConstantKalman = noisyDataConstan.map(function(v){
    return kalmanFilter.filter(v);
});
*/

//JSON file 저장용
var obj = {
    table: []
};

//아이디 확인
function idchek(array, value){
    return array.some(function(arrayValue){
       return value == arrayValue
       });
}


//http 서버에 연결 및 확인
var httpServer = http.createServer(app).listen(3000, () =>{
    console.log("connected to port 3000")
});

//client와 연결 확인 및 전송받은 데이터 저장
var socketServer = io(httpServer);
socketServer.on("connection", socket=> {
    console.log("connect client by socket.io");

    socket.on('deviceData', function(dataa){
        console.log('mac: ' + dataa.mac);
        console.log('rssi: ' + dataa.rssi);
        console.log('txPower: ' + dataa.txpower);
        console.log('major: ' + dataa.major);
        console.log('minor: ' + dataa.minor);
	    console.log('battery: ' + dataa.battery +'% \n');
        console.log(JSON.stringify(dataa, null, ' '));



        obj.table.push({
            "uuid": dataa.mac,
            "rssi": dataa.rssi,
            "txpower": dataa.txpower,
            "major": dataa.major,
            "minor": dataa.minor,
	        "battery" : dataa.battery,
        });

        //JSON으로 저장
        var json = JSON.stringify(obj);
        fs.writeFile('beaconing.json', json, 'utf8',function(err){
            if(err) throw err
        });
    });
});





//html로 web에 표현
/*
app.get('/', function(req,res){
i
    res.sendFile(__dirname + '/index.html');
});
*/
