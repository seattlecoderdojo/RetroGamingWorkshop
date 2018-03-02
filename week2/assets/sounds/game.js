
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
    //set the text on the screen and set its play function
    this.game.add.text(0, 0, "hack", {font:"1px coiny", fill:"#FFFFFF"});
    
    music = game.add.audio('tone1');

    music.onFadeComplete.add(function(item,e){
        if(e === 1){
        music.fadeOut(fadeLength*2);
      }
    });

    setTimeout(setText,800); 

  }


  function setText(){
    var style = {font: "45px coiny", fill: "#ffffff"};
    var text1 = this.game.add.text(10,10,"Play Long Sound", style);
    var text2 = this.game.add.text(10,70,"Play Medium Sound", style);
    var text3 = this.game.add.text(10,130,"Play Short Sound", style);

    text1.inputEnabled = true;
    text1.events.onInputDown.add(longSound, this);

    text2.inputEnabled = true;
    text2.events.onInputDown.add(mediumSound, this);

    text3.inputEnabled = true;
    text3.events.onInputDown.add(shortSound, this);
  }

  function longSound(){playMySound(600);}
  function mediumSound(){playMySound(400);}
  function shortSound(){playMySound(250)};


  function playMySound(fade){
      if(music.isPlaying){
        return true;
      }
      fadeLength = fade;
      music.fadeIn(fade);
  }

}



