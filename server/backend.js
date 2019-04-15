var http = require('http');
var url = require('url');
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: 'AKIA6O4K2FWP6BLUXGN2', secretAccessKey: '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'});
var s3 = new AWS.S3();
var params = { 
  Bucket: 'ethanmuz.lrc'
}

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  var self = this;
  s3.listObjects(params, function (err, data) {
    if(err)throw err;
	var songs = getSongList(data);
	res.end(arrayToString(songs));
  });
}).listen(8080);

function getSongList(json){
	var names = [];
	for (i in json.Contents){
		names.push(json.Contents[i].Key);
	}
	var songs = [];
	for (i in names){
		var songName = names[i];
		if (songName.substring(songName.length-4) === ".mp3" && arrayContains(names, songName.substring(0, songName.length-4) + ".lrc")){
			songs.push(songName.substring(0, songName.length-4));
		}
	}
	return songs;
}

function arrayContains(array, element){
	return (array.indexOf(element) != -1);
}

function arrayToString(array){
	var s = "";
	
	for (i in array){
		s += array[i];
		if (i != array.length-1){
			s += "\n";
		}
	}
	
	return s;
}