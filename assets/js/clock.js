var intervalId;

// prevents countdown clock from speeding up
var clockRunning = false;


// countdown object object
var countdown = {

  time: 30,

  reset: function() {

    countdown.time = 30;
    
    // Change the "display" div to "00:30."

    $("#display").text("00:30");
    
  },
  start: function() {

    // Use setInterval to start the countdown and set the clock to running.
    if (!clockRunning) {
      intervalId = setInterval(countdown.count, 1000);
      clockRunning = true;
    }
  },

  stop: function() {

    // Use clearInterval to stop the countdown and set the clock to not running.
    clearInterval(intervalId);
    clockRunning = false;
  },
 
  count: function() {

    // decrement time by 1.
    countdown.time--;

    // Get the current time, pass that into the countdown.timeConverter function, and save the result in a variable.
    var converted = countdown.timeConverter(countdown.time);
    if (converted === "00:00"){
      countdown.stop();
      
    }

    // Use the variable we just created to show the converted time in the "display" div.
    $("#display").text(converted);
  },

  
  timeConverter: function(t) {

    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes === 0) {
      minutes = "00";
    }
    else if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
  }
};