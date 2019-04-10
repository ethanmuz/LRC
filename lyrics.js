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
	var s = "";
	
	var fileToLoad = document.getElementById("lrcinput").files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent){
		s = fileLoadedEvent.target.result;
		document.getElementById("text").innerHTML = s;
	};

    fileReader.readAsText(fileToLoad, "UTF-8");
	  
	var lines = s.split(/\r?\n/);
	lines.map((line) => this.addLine(line));
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
      return this.getLine(this.getTime());
    }

    return e(
      'button',
      { onClick: () => this.handleStartClick() },
      'Start'
    );
  }
}

const domContainer = document.querySelector('#container');
ReactDOM.render(e(Lyrics), domContainer);