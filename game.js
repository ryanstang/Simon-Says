// general variables
var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var notStarted = true;
var level = 1;
var running = false;

$(document).keypress(function(){
  /*
  listens for key press to start game
  */
  if (notStarted){
    nextSequence();
    notStarted = false;
  }
});

function nextSequence(){
  /*
  runs computer generated sequence,
  adding one new pattern everytime it is called
  */

  //change h1
  $("#level-title").text("Level " + level);
  level++;

  // tell user to watch and listen
  $(".subtitle").text("Watch And Listen!");

  // play previous gamePattern
  for(var i = 0; i < gamePattern.length; i++){
    doTimeout(i);
  }

  // random number from  0 - 3
  var randomNumber = Math.floor(Math.random() * 4);

  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // flash color button
  setTimeout(function(){
    $("#" + randomChosenColour).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
  }, 1000 * (gamePattern.length - 1));

  // let user click buttons by turning running off
  running = true;
  setTimeout(function(){
    running = false;
    $(".subtitle").text("Your Turn!");
  }, 1000 * (gamePattern.length));
}

function doTimeout(i){
  /*
  helper function for running current computer generated sequence
  */
  var colour = gamePattern[i];
  setTimeout(function(){
    $("#" + colour).fadeOut(100).fadeIn(100);
    playSound(colour);
  }, 1000 * i);
}

$(".btn").click(function(event){
  /*
  detects when user clicks button
  */
  // gamePattern still running
  if(!running){

  // get the color that user clicked on
  var userChosenColour = event.target.id;

  // add to userClickedPattern
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
}
});

function playSound(name){
  /*
    plays sound, given the name of the file
  */
  // play sound according to color
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour){
  // add class of pressed when user press the button
  $("#" + currentColour).addClass("pressed");
  setTimeout(function(){ $("#" + currentColour).removeClass("pressed");}, 100);
}

function checkAnswer(currentLevel){
  /*
  check if correct answer that user clicks on
  if answer is incorrect, resarts whole game
  */
  // check if same color on that index
  if(userClickedPattern[currentLevel] == gamePattern[currentLevel]){

    // check if gamelength equal current user pattern length
    if (userClickedPattern.length == gamePattern.length){
      userClickedPattern = [];
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }

  }else{
    // play wrong sound
    var audio = new Audio("sounds/wrong.mp3");
    audio.play();
    
    running = true;

    // add wrong style to body
    $("body").addClass("game-over");
    // remove after 200 milliseconds
    setTimeout(function(){
      $("body").removeClass("game-over");
    },200);

    $("#level-title").text("Game Over!");
    $(".subtitle").text("Press Any Key To Restart.");
    $(".highscore").text("Highscore: " + (level - 2));
    startOver();
  }
}

function startOver(){
  /*
  resets game
  */
  level = 1;
  userClickedPattern = [];
  gamePattern = [];
  notStarted = true;
}
