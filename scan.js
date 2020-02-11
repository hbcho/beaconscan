var fs = require('fs');
var io =require("socket.io-client");
const {spawn}  = require('child_process');
const execSync =require('child_process').execSync;
const socketClient = io("http://your ip:3000");

//execSync('sudo hcitool lescan & sudo hcidump --raw > rawdata.txt');

var macset = ["71 81 52 3F 23 AC","70 81 52 3F 23 AC", ]

var chk = new Array();
var batto = new Array();

function idcheck(array, value){
	return array.some(function(arrayValue){
		return value === arrayValue;
	});
}

socketClient.on("connect", () => {
	console.log("connection server");
});


fs.readFile('rawdata.txt', 'utf8',function(err, data){
	if(err) throw err;
	data = data.split(">").slice(4)
	//Hexadecimal
	parseInt(data, 16); 
	
	for (var i in data){
		//console.log(data[i].slice(22,39));
		
		var mac = data[i].slice(22,39);
		
		if(idcheck(macset,mac)){
			var battery = data[i].slice(85, 88);
			
			//decimal
			battery = parseInt(battery, 16)
			
			// length 122 raw data has battery infomation
			if (data[i].length<=143){
				if(data[i].length==122){
					//too simple to deal with all casess
					macchk = mac;
					batterychk = battery;
				} 
				else if(data[i].length==143){
					
					if(mac==macchk) batteryinfo = batterychk;
					else batteryinfo = 999;
					
					rssi = data[i].slice(-4,-1); //need to convert to deciaml and two's complement
					txpower = data[i].slice(-8,-4);
					minor = data[i].slice(-10,-8);
					major = data[i].slice(-18,-14);
				
					rssi = -(256-parseInt(rssi, 16));
					txpower = -(256-parseInt(txpower, 16)); 
					major = parseInt(major, 16);
					minor = parseInt(minor, 16);
				
					console.log(" major: "+major+" minor:"+minor+ " rssi: "+ rssi +" tx: "+txpower);
				
					socketClient.emit('deviceData', {
						mac: mac,
						rssi: rssi,
						txpower: txpower,
						major : major,
						minor : minor,
						battery : batteryinfo 
					});
				}
			}		
		}
	}	
});
