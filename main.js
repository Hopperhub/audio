var audio = document.querySelector("audio");

console.log(audio.canPlayType('audio/mp4; codecs="mp4a.40.5"')); // 判断浏览器能否播放指定的音频/视频类型

var play = document.querySelector("#play"); // 播放
var pause = document.querySelector("#pause"); // 暂停
var operateBtns = document.querySelectorAll(".operate-btn");
var previous = document.querySelector("#previous"); // 上一首
var next = document.querySelector("#next"); // 下一首

var audiosSrc = [
  {
    name: "小宝贝",
    singer: "夏天播放",
    src: "assets/audios/夏天播放 - 小宝贝.mp3"
  },
  {
    name: "慢慢",
    singer: "许鹤缤",
    src: "assets/audios/许鹤缤 - 慢慢.mp3"
  },
  {
    name: "烟火里的尘埃",
    singer: "吕泽洲",
    src: "assets/audios/吕泽洲 - 烟火里的尘埃 (Live).mp3"
  }
];
var playIndex = 0;

var getCurTime = ""; // 获取时间的定时器变量
var duration = ""; // 音频长度

var timePoint = document.querySelector(".time-point");

// 已加载音频元数据
audio.onloadedmetadata = function() {
  var endTime = document.querySelector(".end-time");

  drag(timePoint);
  duration = this.duration;
  endTime.innerHTML = formatDuration(duration);
  curTime();
};

play.onclick = playToggle;
pause.onclick = playToggle;

// 播放/暂停 切换
function playToggle() {
  var isPlay = this.id === "play";

  if (isPlay) {
    audio.play();
    curTime();
  } else {
    audio.pause();
    clearInterval(getCurTime);
  }

  for (var btn of operateBtns) {
    btn.style.display = this.id === btn.id ? "none" : "inline-block"; // 按钮样式的切换
  }
}

previous.onclick = srcToggle;
next.onclick = srcToggle;

function srcToggle() {
  var isNext = this.id === "next";

  changeSrc(isNext);
}

// 音频路径切换
function changeSrc(isNext) {
  var name = document.querySelector(".audio-name");
  var singer = document.querySelector(".singer");

  isNext ? playIndex++ : playIndex--;

  // 循环处理
  if (playIndex < 0) {
    playIndex = audiosSrc.length - 1;
  } else if (playIndex > audiosSrc.length - 1) {
    playIndex = 0;
  }

  var selectedAudio = audiosSrc[playIndex];
  audio.src = selectedAudio.src;
  name.innerHTML = selectedAudio.name;
  singer.innerHTML = selectedAudio.singer;
  play.style.display = "none";
  pause.style.display = "inline-block";
  audio.play();
}

function curTime() {
  clearInterval(getCurTime);

  getCurTime = setInterval(function() {
    timeLocation(audio.currentTime, duration);
  }, 30);
}

// 时间点位置
function timeLocation(currentTime, duration) {
  if (!audio.ended) {
    var left = parseFloat(currentTime / duration) * 240;

    left > 224 && (left = 224); // 音频结束点
    setTimePointLocation(left, false);
  } else {
    changeSrc(true);
  }
}

// 拖拽
function drag(obj) {
  var disX = 0;
  var disY = 0;

  obj.onmousedown = function(ev) {
    clearInterval(getCurTime);
    var event = ev || event;
    var moveLeft = "";

    disX = event.clientX - obj.offsetLeft;
    disY = event.clientY - obj.offsetTop;

    if (obj.setCapture) {
      // 事件捕获
      obj.onmousemove = mousemove;
      obj.onmouseup = mouseup;

      obj.setCapture(); // 调用事件捕获，解决 IE7 以下的拖拽 bug
    } else {
      document.onmousemove = mousemove;
      document.onmouseup = mouseup;
    }

    function mousemove(ev) {
      var event = ev || event;
      var left = event.clientX - disX;

      if (left < 0) {
        left = 0;
      } else if (left > 224) {
        left = 224;
      }

      setTimePointLocation(left, true);
    }

    function mouseup() {
      this.onmousemove = null;
      this.onmouseup = null;
      if (obj.releaseCapture) {
        obj.releaseCapture(); // 关闭事件捕获
      }
    }
    return false;
  };
}

// 设置时间点位置
function setTimePointLocation(left, isMove) {
  var startTime = document.querySelector(".start-time");
  var outlineBar = document.querySelector(".outline-bar");

  timePoint.style.left = left + "px";
  outlineBar.style.width = left + "px";

  if (isMove) {
    audio.currentTime = left / 224 * duration;
  }

  startTime.innerHTML = formatDuration(audio.currentTime); // 音频当前播放位置
}
