'use strict';

class Lyrics {
  
  constructor(){
	var self = this;
	
	this.stop();
	this.setupSongOptions();
	
	this.lyrics = [];
	this.lyricsText = document.getElementById("lyrics");
	
	this.player = document.getElementById("player");
	this.player.ontimeupdate = function() {
		self.lyricsText.innerHTML = self.getLine();
		console.log(self.getLine());
		document.getElementById("currenttime").innerHTML = self.getTimeStringFromCentiseconds(self.player.currentTime * 100, Math.floor);
	};
	this.player.onended = function() {
		self.stop();
	};
	this.player.onloadedmetadata = function() {
		self.timeslider.max = self.player.duration * 100;
		document.getElementById("totaltime").innerHTML =  self.getTimeStringFromCentiseconds(self.timeslider.max, Math.ceil);
	};
	this.startbutton = document.getElementById("startbutton");
	this.stopbutton = document.getElementById("stopbutton");
	this.startbutton.onclick = function(){
		if (self.player.src){
			self.play();
		}
	};
	this.stopbutton.onclick = function(){
		self.pause();
	};
	this.timeslider = document.getElementById("timeslider");
	timeslider.oninput = function() {
		self.player.currentTime = this.value / 100;
		
	}
	this.songselector = document.getElementById("songselector");
	this.songselector.onchange = function(){
		self.stop();
		var songname = self.songselector.value;
		self.player.src = "https://s3.us-east-2.amazonaws.com/ethanmuz.lrc/" + songname + ".mp3";
		self.setupLyrics(songname);
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
  
  setupSongOptions() {
	  var songlist = `1Train
3500
90210
All Ass
Antidote
Apple Pie
ASTROTHUNDER
Bad and Boujee (feat. Lil Uzi Vert)
Bank
Bars
beibs in the trap
Big On Big
Big Rings
Boss Bitch
Brown Paper Bag
BUTTERFLY EFFECT
Call Casting
Can't Feel My Face
CAN'T SAY
CAROUSEL
Cocaine Castle
Cocoon
coordinate
Curve (feat. The Weeknd)
Deadz (feat. 2 Chainz)
Drip Too Hard
Dump Dump
Everyday
Exotic
Feds Watching
First Class
Fit In
Freak No More
Fuck Out My Face
Fuckin' Problems
Get Right Witcha
goosebumps
Handsome And Wealthy
Heartless
Hood Pope
Hook Up
HOUSTONFORNICATION
How To Love
HYFR (Hell Ya Fucking Right)
HAM
I Can Tell
I Get The Bag (feat. Migos)
I'm Straight
Impossible
Jersey
Jumpman
Kelly Price (feat. Travis Scott)
Let It Go
Long Live A$AP
Lord Pretty Flacko Jodye 2 (LPFJ2)
Love Me
Lucid Dreams
Mamacita
Money Longer
Moon Rock
My Dawg
Myself
NC-17
Never Needed No Help
Never Recover
Nightcrawler
NO BYSTANDERS
Oh My Dis Side
outside
pick up the phone
Pornography
Reminder
Rich As Fuck
Right Now
sdp interlude
Seals Pills
Shabba
SICKO MODE
Sides
SKELETONS
Slippery (feat. Gucci Mane)
STARGAZING
Still Here
Swimming Pools (Drank)
T-Shirt
the ends
The Hills
through the late night
Throwing Shade
Tone it Down (feat. Chris Brown)
Too Hotty
Transporter
untitled 07 levitate
WAKE UP
way back
What The Price
Wishy Washy
WOA
wonderful
XO TOUR Llif3
Yes Indeed
YOSEMITE
You Was Right`
	  var songs = songlist.split(/\r?\n/);
	  songs.map((song) => this.addSongToSelector(song));
  }
  
  addSongToSelector(songname){
    var opt = document.createElement('option');
    opt.value = songname;
    opt.innerHTML = songname;
    this.songselector.appendChild(opt);
  }
}

let lyricsClass = new Lyrics();
