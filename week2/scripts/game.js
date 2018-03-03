window.onload = function(){
  var game = new Phaser.Game(700, 803, Phaser.AUTO, 'gamediv');

  //adding our states - 'name', then the actual function that handles it.
  game.state.add('boot', bootState);
  game.state.add('load', loadState);
  game.state.add('menu', menuState);
  game.state.add('play', playState);
  game.state.add('help', helpState);
  game.state.add('win', wintate);
  game.state.add('lose', loseState);
  

  game.state.start('load');

}