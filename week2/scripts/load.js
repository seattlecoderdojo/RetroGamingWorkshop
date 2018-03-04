var loadState = {

  preload: function(){

    // Quick bit of text to let people know the game is loading.
    game.add.text(100,100,'Loading assets', {font: '50px coiny', fill: '#ffffff'});
    
    //let's load our sounds
    game.load.audio('tone1', 'assets/sounds/tone1.mp3');
    game.load.audio('tone2', 'assets/sounds/tone2.mp3');
    game.load.audio('tone3', 'assets/sounds/tone3.mp3');
    game.load.audio('tone4', 'assets/sounds/tone4.mp3');
    game.load.audio('fail', 'assets/sounds/fail.mp3');
    game.load.audio('win', 'assets/sounds/270528__littlerobotsoundfactory__jingle-win-00.mp3');
    
    //let's load our graphics
    game.load.image('panel1', 'assets/gameart/panel1.png')
    game.load.image('panel1-lit', 'assets/gameart/panel1-lit.png')
    game.load.image('panel2', 'assets/gameart/panel2.png')
    game.load.image('panel2-lit', 'assets/gameart/panel2-lit.png')
    game.load.image('panel3', 'assets/gameart/panel3.png')
    game.load.image('panel3-lit', 'assets/gameart/panel3-lit.png')
    game.load.image('panel4', 'assets/gameart/panel4.png')
    game.load.image('panel4-lit', 'assets/gameart/panel4-lit.png')
    game.load.image('playbutton', 'assets/gameart/playbutton.png')
    game.load.image('helpbutton', 'assets/gameart/helpbutton.png')
    game.load.image('background', 'assets/gameart/pixabay-lattice.jpg')
  },

  create: function(){
      
      //let's start the menu
      game.state.start('menu');
  }

}