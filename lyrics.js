'use strict';

class Lyrics {
  
  constructor(){
	var self = this;
	
	this.lyricsText = document.getElementById("lyrics");
	this.elapsed = -1;
	this.lyrics = [];
	
	this.player = document.getElementById("player");
	this.player.ontimeupdate = function() {self.elapsed = self.player.currentTime * 100;};
	this.player.onpause = function() {self.playerWasPaused()};
	this.player.onplay = function() {self.playerWasPlayed()};
	this.player.onended = function() {
		self.elapsed = -1;
		self.player.currentTime = 0;
		self.lyricsText.innerHTML = "";
	};
	this.startbutton = document.getElementById("startbutton");
	this.stopbutton = document.getElementById("stopbutton");
	this.startbutton.onclick = function(){
		self.player.play();
	};
	this.stopbutton.onclick = function(){
		self.player.pause();
	};
	this.mp3upload = document.getElementById('mp3upload');
	this.mp3upload.onchange = function(e){
		self.player.src = URL.createObjectURL(this.files[0]);
	}
	this.lrcupload = document.getElementById('lrcupload');
	this.lrcupload.onchange = function(e){
		self.lyrics = [];
		self.setupLyrics();
	}
  }
  
  setupLyrics(){	
	var self = this;
	var file = this.lrcupload.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
		var lines = evt.target.result.split(/\r?\n/);
		lines.map((line) => self.addLine(line));
    }
  }
  
  addLine(lyricLine){	  
	  var minutes = parseInt(lyricLine.substring(1,3));
	  var seconds = parseInt(lyricLine.substring(4,6));
	  var fractions = parseInt(lyricLine.substring(7,9));
	  var words = lyricLine.substring(10);
	 
	  seconds = (minutes * 60) + seconds;
	  fractions = (seconds * 100) + fractions;
	  
	  this.lyrics.push({time: fractions, line: words});
  }
  
  getLine(num) {
	var s = '';

	this.lyrics.map((lyric) => {
		if (num >= lyric.time) {
			s = lyric.line;
		}
	});
	return s;
  }
  
  playerWasPaused() {
	this.startbutton.style = "";
	this.stopbutton.style = "display: none;";
	clearInterval(this.incrementer);
  }
  
  playerWasPlayed() {
	var self = this;
	if (this.elapsed == -1) {
        this.elapsed = 0;
    }
	this.startbutton.style = "display: none;";
	this.stopbutton.style = "";
	this.incrementer = setInterval(function () {
      self.elapsed = self.player.currentTime * 100;
	  self.lyricsText.innerHTML = self.getLine(self.elapsed);
    }, 10);
  }
}

let lyricsClass = new Lyrics();