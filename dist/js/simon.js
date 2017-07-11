window.onload = function() {
  // Init variable
  var gameCount = 0,playCount = 0,strict = false,power = false,speed = 750;
  var simon = [];
  var player = [];

  // Init event listeners
  var btns = document.getElementsByClassName("button");
  function addBtnListener() {
    for (var i = 0 ; i < btns.length ; i++) {
      btns[i].addEventListener("click",btnPress);
    }
  }
  function removeBtnListener() {
    for (var i = 0 ; i < btns.length ; i++) {
      btns[i].removeEventListener("click",btnPress);
    }
  }

  var startBtn = document.getElementById("start");
  var screen = document.getElementById("screen");
  var strictBtn = document.getElementById("strict");
  var strictLed = document.getElementById("led");
  var powerBtn = document.getElementById("power");
  var audios = document.getElementsByClassName("audio");
  startBtn.addEventListener("click",start);
  strictBtn.addEventListener("click",switchStrict);
  powerBtn.addEventListener("click",switchPower);

  // Start a new game
  function start() {
    if (power) {
      removeBtnListener();
      initVariables();
      newGame();
      gameCount = 1;
      processGame();
    }
  }

  function initVariables() {
    simon = [];
    player = [];
    gameCount = 0;
    playCount = 0;
    speed = 750;
  }

  function newGame() {
    simon = [];
    for (var g = 0 ; g < 20 ; g++) {
      var rand = Math.floor(Math.random() * 4) + 1;
      simon.push(rand);
    }
  }

  function switchStrict() {
    if (power) {
      strict = !strict;
      var strictState = strict ? "on" : "" ;
      strictLed.setAttribute("class",strictState);
    }
  }

  function switchPower() {
    if(power && strict)
      switchStrict();
    if (power) {
      screenDisplay("");
      initVariables();
      removeBtnListener();
    } else {
      screenDisplay("--");
    }
    power = !power;
    var state = power ? "on" : "";
    powerBtn.setAttribute("class",state);
  }

  function screenDisplay(txt) {
    screen.innerText = txt;
  }

  function showOff(n) {
    playSound(n);
    lightBtn(n);
  }

  function playSound(n) {
    audios[n - 1].pause();
    audios[n - 1].currentTime = 0;
    audios[n - 1].play();
  }

  function lightBtn(btnN) {
    var btn = btns[btnN - 1];
    var btnClass = btn.getAttribute("class");
    var tmpClass = btnClass + " light";
    btn.setAttribute("class",tmpClass);
    window.setTimeout(function() {
      btn.setAttribute("class",btnClass);
    },speed/2);
  }

  function processGame() {
    screenDisplay(gameCount);
    var count = 1;
    function playNext() {
      if (count <= gameCount) {
        showOff(simon[count - 1]);
        window.setTimeout(function(){
          count++;
          playNext();
        },speed);
      } else {
        playerTime();
      }
    }
    playNext();
  }

  function playerTime() {
    playCount = 1;
    addBtnListener();

    // removeBtnListener();
  }

  function btnPress() {
    if (power) {
      var theBtn = Number(this.value);
      if (theBtn === simon[playCount - 1]) {
        removeBtnListener();
        showOff(theBtn);
        if (playCount === gameCount) {
          if (gameCount === simon.length) {
            victory();
          } else {
            window.setTimeout(function() {
              gameCount++;
              if (gameCount >= 13)
                speed = 400;
              else if (gameCount >= 9)
                speed = 500;
              else if (gameCount >= 5)
                speed = 650;
              processGame();
            }, 2000);
          }
        } else {
          window.setTimeout(function() {
            playCount++;
            addBtnListener();
          }, speed/3);
        }
      } else {
        removeBtnListener();
        playSound(5);
        screenDisplay("!!");
        window.setTimeout(function() {
          if (strict) {
            start();
          } else {
            processGame();
          }
        },2000);

      }
    }
  }

  function victory() {
    playSound(6);
    screenDisplay(";-)");
    window.setTimeout(function() {
      start();
    },5000);
  }

};