'use strict';

class Lyrics {
  
  constructor(url){
	var self = this;
	
	this.player = document.getElementById("player");
	this.startbutton = document.getElementById("startbutton");
	this.stopbutton = document.getElementById("stopbutton");
	this.timeslider = document.getElementById("timeslider");
	this.songselector = document.getElementById("songselector");
	this.lyricsText = document.getElementById("lyrics");
	
	this.stop();
	this.setupSongOptions(url);
	
	this.lyrics = [];
	
	this.player.ontimeupdate = function() {
		self.lyricsText.innerHTML = self.getLine();
		document.getElementById("currenttime").innerHTML = self.getTimeStringFromCentiseconds(self.player.currentTime * 100, Math.floor);
	};
	this.player.onended = function() {
		self.stop();
	};
	this.player.onloadedmetadata = function() {
		self.timeslider.max = self.player.duration * 100;
		document.getElementById("totaltime").innerHTML =  self.getTimeStringFromCentiseconds(self.timeslider.max, Math.ceil);
	};
	this.startbutton.onclick = function(){
		if (self.player.src){
			self.play();
		}
	};
	this.stopbutton.onclick = function(){
		self.pause();
	};
	this.timeslider.oninput = function() {
		self.player.currentTime = this.value / 100;
		
	}
	this.songselector.onchange = function(){
		self.stop();
		var songname = self.songselector.value;
		self.setupLyrics(songname);
		self.player.src = "https://s3.us-east-2.amazonaws.com/ethanmuz.lrc/" + songname + ".mp3";
	};
  }
  
  getTimeStringFromCentiseconds(cs, func){
	  var string = "";
	  var minutes = Math.floor(cs / 6000) % 60;
	  var seconds = func((cs / 100) % 60);
	  if (seconds < 10){seconds = "0" + seconds;}
	  return minutes + ":" + seconds;
  }
  
  setupLyrics(songname){	
	var self = this;
	this.lyrics = [];
	var reader = new FileReader();
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			reader.readAsText(xhttp.response, "UTF-8");
		}
	};
	xhttp.open("GET", "https://s3.us-east-2.amazonaws.com/ethanmuz.lrc/" + songname + ".lrc", true);
	xhttp.responseType = "blob";
	xhttp.send();
    reader.onload = function (evt) {
		var lines = evt.target.result.split(/\r?\n/);
		lines.map((line) => self.addLine(line));
    }
  }
  
  addLine(lyricLine){
	  if (!isNaN(lyricLine.substring(1,2))){
	    var minutes = parseInt(lyricLine.substring(1,3));
	    var seconds = parseInt(lyricLine.substring(4,6));
	    var fractions = parseInt(lyricLine.substring(7,9));
	    var words = lyricLine.substring(10);
	 
	    seconds = (minutes * 60) + seconds;
	    fractions = (seconds * 100) + fractions;
	  
	    this.lyrics.push({time: fractions, line: words});
	  }
  }
  
  getLine() {
	var s = '';
	var timeElapsed = this.player.currentTime * 100;

	this.lyrics.map((lyric) => {
		if (timeElapsed >= lyric.time) {
			s = lyric.line;
		}
	});
	return s;
  }
  
  pause() {
	this.player.pause();
	this.startbutton.style = "";
	this.stopbutton.style = "display: none;";
	clearInterval(this.incrementer);
  }
  
  stop(){
	  this.pause();
	  this.lyricsText.innerHTML = "";
	  this.player.pause();
	  this.player.currentTime = 0;
	  this.timeslider.value = this.player.currentTime;
	  document.getElementById("currenttime").innerHTML = this.getTimeStringFromCentiseconds(this.player.currentTime * 100, Math.floor);
  }
  
  play() {
	var self = this;
	this.player.play();
	this.startbutton.style = "display: none;";
	this.stopbutton.style = "";
	this.incrementer = setInterval(function () {
	  self.timeslider.value = self.player.currentTime * 100;
	  self.lyricsText.innerHTML = self.getLine();
    }, 10);
  }
  
  setupSongOptions(url) {
	var self = this;
	  
	var songs = [];
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.send();
 
	xhr.onreadystatechange = function(e){
		if (xhr.readyState == 4 && xhr.status == 200) {
			var response = JSON.parse(xhr.responseText);
			songs = response.songs;
			songs.map((song) => self.addSongToSelector(song));
		}
	};

  }
  
  addSongToSelector(songname){
    var opt = document.createElement('option');
    opt.value = songname;
    opt.innerHTML = songname;
    this.songselector.appendChild(opt);
  }
}

var url = "http://ec2-3-86-251-183.compute-1.amazonaws.com/";

let lyricsClass = new Lyrics(url);
