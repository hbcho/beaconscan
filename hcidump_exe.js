const {spawn}  = require('child_process');
const execSync =require('child_process').execSync;


execSync('sudo hcitool lescan & sudo hcidump --raw > rawdata.txt');
