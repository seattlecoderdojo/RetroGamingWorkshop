var game;

window.onload = function() {
  game = new Phaser.Game(650, 650, Phaser.AUTO, '', { preload: preload, create: create  });
  var music;
  var fadeLength = 0;

  function preload(){
    //preload the sounds
    game.load.audio('tone1', 'tone1.mp3');
    game.load.audio('tone2', 'tone2.mp3');
    game.load.audio('tone3', 'tone3.mp3');
    game.load.audio('tone4', 'tone4.mp3');
  }

  function create(){
    //set the text on the screen to get the font loading
    this.game.add.text(0, 0, "hack", {font:"1px coiny", fill:"#FFFFFF"});

    //set our tone
    music = game.add.audio('tone1');
	
    /* To have it fade in and out, we add a function for when the fade is 
       complete. The fade in brings the volume to 1. We check if volume 
       is 1. If so, we play the fade out. For a good length the fade out 
       takes twice as long. To ensure that the music stops playing 
       (even though the volume's faded out'), we stop it when the fade
       out happens  */

     music.onFadeComplete.add(function(item,vol){
        if(vol === 1){
        music.fadeOut(fadeLength*2);
      } else {
        music.stop();
      }
    });
	
     //we give the text a brief time to load before writing it
    setTimeout(setText,800); 
  }

  function setText(){
    // Set a style for the font, similar to CSS
    var style = {font: "45px coiny", fill: "#ffffff"};

    // Apply the text to the screen
    var text1 = this.game.add.text(10,10,"Play Long Sound", style);
    var text2 = this.game.add.text(10,70,"Play Medium Sound", style);
    var text3 = this.game.add.text(10,130,"Play Short Sound", style);

    // Each text item needs to be enabled as an input element 
    // and given a function for what happens when it's pressed
    text1.inputEnabled = true;
    text1.events.onInputDown.add(function(){playMySound(600);}, this);

    text2.inputEnabled = true;
    text2.events.onInputDown.add(function(){playMySound(400);}, this);

    text3.inputEnabled = true;
    text3.events.onInputDown.add(function(){playMySound(200);}, this);
  }


  function playMySound(fade){
     // check if the music is already playing, and do nothing if it is 
     if(music.isPlaying){
        return true;
      }
      // set the global fade length to the value passed in, then fade in.
      fadeLength = fade;
      music.fadeIn(fade);
  }
}