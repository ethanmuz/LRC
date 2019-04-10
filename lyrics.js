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
	  var s = `[00:07.69]You're insecure
[00:09.66]Don't know what for
[00:11.42]You're turning heads through the door
[00:15.18]Don't need make-up
[00:17.19]to cover up
[00:19.25]Being the way that you are is enough
[00:23.60]Everyone else in the room can see it
[00:27.43]Everyone else but you
[00:30.60]Baby you light up my world like nobody else
[00:34.44]The way that you flip your hair gets me overwhelmed
[00:38.40]But when you smile at the ground it ain't hard to tell
[00:42.11]You don't know Oh oh
[00:44.75]You don't know you're beautiful
[00:46.76]If only you saw what I can see
[00:49.79]You'll understand why I want you so desperately
[00:53.65]Right now I'm looking at you and I can't believe
[00:57.44]You don't know Oh oh
[01:00.05]You don't know you're beautiful Oh oh
[01:03.91]That's what makes you beautiful
[01:08.91]So c-come on
[01:11.06]You got it wrong
[01:13.07]To prove I'm right
[01:14.18]I put it in a so-o-ong
[01:16.80]I don't know why you're being shy
[01:20.74]And turn away when I look into your eyes
[01:25.03]Everyone else in the room can see it 
[01:28.85]Everyone else but you
[01:32.12]Baby you light up my world like nobody else
[01:35.90]The way that you flip your hair gets me overwhelmed
[01:39.63]But when you smile at the ground it ain't hard to tell
[01:43.45]You don't know Oh oh
[01:46.17]You don't know you're beautiful
[01:48.24]If only you saw what I can see
[01:51.18]You'll understand why I want you so desperately
[01:55.04]Right now I'm looking at you and I can't believe
[01:58.95]You don't know Oh oh
[02:01.53]You don't know you're beautiful Oh oh
[02:05.30]That's what makes you beautiful
[02:07.86]Na na na na na na na na na na
[02:11.11]Na na na na na na na
[02:14.96]Na na na na na na na na na na
[02:18.74]Na na na na na na na
[02:21.97]Baby you light up my world like nobody else
[02:25.85]The way that you flip your hair gets me overwhelmed
[02:29.41]But when you smile at the ground it ain't hard to tell
[02:33.31]You don't know Oh oh
[02:36.07]You don't know you're beautiful
[02:38.03]Baby you light up my world like nobody else
[02:41.12]The way that you flip your hair gets me overwhelmed
[02:44.92]But when you smile at the ground it ain't hard to tell
[02:48.70]You don't know Oh oh
[02:51.43]You don't know you're beautiful
[02:53.45]If only you saw what I can see
[02:56.52]You'll understand why i want you so desperately
[03:00.35]Right now I'm looking at you and I can't believe
[03:04.15]You don't know Oh oh
[03:06.80]You don't know you're beautiful Oh oh
[03:10.67]You don't know you're beautiful Oh oh
[03:14.47]That's what makes you beautiful
[03:17.69]`;
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
    var _this = this;
	if (this.state.elapsed == -1) {
        _this.setState({
        elapsed: 0
      });
    }
	console.log(document.getElementById("uploader").value);
	document.getElementById("player").setAttribute("src", document.getElementById("uploader").value.split('\\').pop().split('/').pop());
	document.getElementById("player").play();
	this.startTimer();
  }

  render() {
	this.setupLyrics();
	
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