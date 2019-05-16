'use strict';

class Lyrics {
  
	constructor(){
		var self = this;
		
		this.player = document.getElementById("player");
		this.startbutton = document.getElementById("startbutton");
		this.stopbutton = document.getElementById("stopbutton");
		this.timeslider = document.getElementById("timeslider");
		this.upload = document.getElementById("upload");
		this.currentLyrics = document.getElementById("currentLyrics");
		this.lyrics = document.getElementById("lyrics");
		this.currentTime = document.getElementById("currenttime");
		this.totalTime = document.getElementById("totaltime");
		
		this.LRCtime = 0;
		
		this.upload.onchange = function() {
			self.player.src = URL.createObjectURL(this.files[0]);
		}
		this.player.ontimeupdate = function() {
			self.currentTime.innerHTML = self.getTimeStringFromCentiseconds(self.player.currentTime * 100, Math.floor);
		};
		this.player.onended = function() {
			self.finish();
		};
		this.player.onloadedmetadata = function() {
			self.timeslider.max = self.player.duration * 100;
			self.totalTime.innerHTML = self.getTimeStringFromCentiseconds(self.timeslider.max, Math.ceil);
			self.getLRCtimeFromCentiseconds(self.timeslider.max);
		};
		this.startbutton.onclick = function(){
			if (self.player.src){
				self.initialize();
			}
		};
		this.stopbutton.onclick = function(){
			self.stop();
		};
		this.timeslider.oninput = function() {
			self.value = self.player.currentTime;
		}
		
		document.getElementById("halfspeed").onclick = function() {
			self.player.playbackRate = 0.5;
		}
		document.getElementById("fullspeed").onclick = function() {
			self.player.playbackRate = 1;
		}
	}
	
	initialize() {
		var self = this;
		this.startbutton.onclick = function() {
			self.play();
		}
		this.LRCtime = 0;
		this.playMusic();
		this.swapButtons();
	}
	
	play() {
		var currentTime  = this.LRCtime;
		var currentLine = this.currentLyrics.value;
		this.addToLyrics(currentTime, currentLine);
		this.currentLyrics.value = "";
		this.LRCtime = this.timeslider.value;
		this.playMusic();
		this.swapButtons();
	}
	
	stop() {
		this.stopMusic();
		this.swapButtons();
	}
	
	finish() {
		var self = this;
		this.stop();
		this.currentTime.innerHTML = this.totalTime.innerHTML;
		this.startbutton.onclick = function() {
			var currentTime  = self.LRCtime;
			var currentLine = self.currentLyrics.value;
			self.addToLyrics(currentTime, currentLine);
			self.currentLyrics.value = "";
			this.onclick = function(){};
		}
	}
	
	playMusic(){
		var self = this;
		this.player.play();
		this.incrementer = setInterval(function () {
			self.timeslider.value = self.player.currentTime * 100;
        }, 10);
	}
	
	stopMusic(){
		this.player.pause();
		clearInterval(this.incrementer);
	}
	
	swapButtons() {
		if (this.player.paused){
			this.startbutton.style = "";
			this.stopbutton.style = "display: none;";
		}
		else {
			this.startbutton.style = "display: none;";
			this.stopbutton.style = "";
		}
	}
	
	addToLyrics(time, line){
		if (this.lyrics.value.length != 0){
			this.lyrics.value += "\n";
		}
		time = this.getLRCtimeFromCentiseconds(time);
		this.lyrics.value += time + line;
	}
	
	getTimeStringFromCentiseconds(cs, func){
		var string = "";
		var minutes = Math.floor(cs / 6000) % 60;
		var seconds = func((cs / 100) % 60);
		if (seconds < 10){seconds = "0" + seconds;}
		return minutes + ":" + seconds;
    }
	
	getLRCtimeFromCentiseconds(cs){
		var string = "";
		var minutes = Math.floor(cs / 6000) % 60;
		var seconds = (cs / 100) % 60;
		var centiseconds = Math.floor((seconds - Math.floor(seconds)) * 100);
		seconds = Math.floor(seconds);
		if (minutes < 10){minutes = "0" + minutes;}
		if (seconds < 10){seconds = "0" + seconds;}
		if (centiseconds < 10) {centiseconds = "0" + centiseconds;}
		string = "[" + minutes + ":" + seconds + "." + centiseconds + "]";
		return string;
    }
  
}


let lyricsClass = new Lyrics();
