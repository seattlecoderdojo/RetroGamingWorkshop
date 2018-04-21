//moved here since this is the first file loaded
var mgd = {}; // variable to hold "my game data" throughout
var game = {};

var loadState = {

  preload: function(){
    // load our animated sprites
    game.load.spritesheet('saucer', "assets/gameart/shipsheet.png", 56 , 32, 5, 0, 0);
    game.load.spritesheet('alien', "assets/gameart/aliensheet.png", 56 , 56 , 5 , 0 , 0 );
    game.load.spritesheet('rollien', "assets/gameart/rolliensheet.png", 56 , 56 , 10 , 0 , 0 );
    game.load.spritesheet('explosion', "assets/gameart/explosionsheet.png", 56 , 56, 7, 0 , 0); //new

    //load our static sprites
    game.load.image('missile', "assets/gameart/missile.png");
    game.load.image('hero', "assets/gameart/hero.png");
    game.load.image('bomb', "assets/gameart/bomb.png");
    game.load.image('starfield', "assets/gameart/starfield.png");
    game.load.image('starfield2', "assets/gameart/starfield2.png");
    game.load.image('bombcrater', "assets/gameart/bomb-crater.png");
    game.load.image('missilecrater', "assets/gameart/missile-crater.png");
    game.load.image('bunker', "assets/gameart/bunker.png"); // new

    //Load our sound effects
    game.load.audio('splode1','assets/sounds/explosion1.mp3');
    game.load.audio('splode2','assets/sounds/explosion2.mp3');
    game.load.audio('splode3','assets/sounds/explosion3.mp3');
    game.load.audio('splode4','assets/sounds/explosion4.mp3');
    game.load.audio('bg','assets/sounds/ipsi-comp.mp3');

  },

  create: function(){
    // Quick bit of text to let people know the game is loading.
    game.add.text(400,350,'Loading', {font: '50px bitwise', fill: '#EFEFEF'});
    game.add.text(400,420,'Assets', {font: '50px pcsenior', fill: '#EFEFEF'});

    game.scale.setMinMax(400, 400, mgd.MAXWIDTH, mgd.MAXHEIGHT)
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          
      //let's start the splash screen
      var timeout = window.setTimeout(function(){
        game.state.start('splash');
      }, 1000);
  }

}
