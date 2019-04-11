'use strict';

const e = React.createElement;

class Lyrics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		elapsed: -1,
		lyrics: []
	};
  }
  
  setupLyrics(){	
	var self = this;
	var file = document.getElementById("lrcinput").files[0];
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
	  fractions = (seconds * 100) + seconds;
	  
	  this.state.lyrics.push({time: fractions, line: words});
  }
  
  getTime() {
    return this.state.elapsed;
  }
  
  getLine(num) {
	var s = '';

	this.state.lyrics.map((lyric) => {
		if (num >= lyric.time) {
			s = lyric.line;
		}
	});
	return s;
  }
  
  startTimer(){
	var _this = this;
	this.incrementer = setInterval(function () {
      _this.setState({
        elapsed: (_this.state.elapsed + 1)
      });
    }, 10);
  }

  handleStartClick() {
	this.setupLyrics();
    var _this = this;
	if (this.state.elapsed == -1) {
        _this.setState({
        elapsed: 0
      });
    }
	document.getElementById("player").play();
	this.startTimer();
  }
  

  render() {	
    if (this.state.elapsed != -1) {
      document.getElementById("lyrics").innerHTML = this.getLine(this.getTime());
	  return "";
    }
	
	var self = this;
	
	var vid = document.getElementById("player");

	// Assign an ontimeupdate event to the <video> element, and execute a function if the current playback position has changed
	vid.ontimeupdate = function() {self.state.elapsed = vid.currentTime * 100;};

    return e(
      'button',
      { onClick: () => this.handleStartClick() },
      'Start'
    );
  }
}

const domContainer = document.querySelector('#container');
ReactDOM.render(e(Lyrics), domContainer);