var splashState = {

  create: function(){

    mgd.background = game.add.tileSprite(0 , 0 , 1200 , 900 , 'starfield');
    //mgd.background2 = game.add.tileSprite(0 , 0 , 1200 , 900 , 'starfield2');
   
    var titleshadow = game.add.text(17,7,'Alien\nShootz', {font: '220px bitwise', fill: '#000', align: 'center'});
    var title = game.add.text(20,10,'Alien\nShootz', {font: '220px bitwise', fill: '#CDCDCD', align: 'center'});
    title.x = (game.width - title.width)/2;
    title.y = (game.height - title.height)/2;
    titleshadow.x = title.x - 6;
    titleshadow.y = title.y - 6;
    title.alpha = .6;
    titleshadow.alpha = .5;
    title.lineSpacing = -50;
    titleshadow.lineSpacing = -50;

    var highscore = game.add.text(20,20, 'HIGH SCORE: ' + mgd.highscore, {font: '30px pcsenior', fill: '#EEE'});
    highscore.x = (game.width - highscore.width)/2;

    var tostart = game.add.text(20,20, 'TO START HIT SPACEBAR', {font: '50px pcsenior', fill: '#EEE'});
    tostart.x = (game.width - tostart.width)/2;
    tostart.y = 80 + (title.y + title.height);
    
    mgd.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //game.scale.setMinMax(400, 300, mgd.MAXWIDTH, mgd.MAXHEIGHT)
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.windowConstraints = {'right':'visual', 'bottom':'visual'}; //NEW
  },
  

  update: function(){

    mgd.background.tilePosition.y += mgd.background_speed - .5;
    //mgd.background.tilePosition.x += .5;
    //mgd.background2.tilePosition.y += mgd.background_speed;

    if(mgd.spaceKey.isDown){
      mgd.gamereset();  
      mgd.levelreset();
      game.state.start('play');
    }
    


  }

}