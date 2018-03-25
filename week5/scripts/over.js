var overState = {

  create: function(){

    if(mgd.score > mgd.highscore) {
      mgd.highscore = mgd.score;
    }
  

    mgd.background = game.add.tileSprite(0 , 0 , 1200 , 900 , 'starfield');
    mgd.background2 = game.add.tileSprite(0 , 0 , 1200 , 900 , 'starfield2');
   
    var titleshadow = game.add.text(17,7,'Game\nOver', {font: '260px bitwise', fill: '#000', align: 'center'});
    var title = game.add.text(20,10,'Game\nOver', {font: '260px bitwise', fill: '#CDCDCD', align: 'center'});
    title.x = (game.width - title.width)/2;
    title.y = (game.height - title.height)/2;
    titleshadow.x = title.x - 6;
    titleshadow.y = title.y - 6;
    title.alpha = .6;
    titleshadow.alpha = .5;
    title.lineSpacing = -30;
    titleshadow.lineSpacing = -30;

    var highscore = game.add.text(20,20, 'YOUR SCORE: ' + mgd.score + " - HIGH SCORE: " + mgd.highscore, {font: '30px pcsenior', fill: '#EEE'});
    highscore.x = (game.width - highscore.width)/2;
  },
  

  update: function(){

    mgd.background.tilePosition.y += mgd.background_speed - .5;
    mgd.background.tilePosition.x += .5;
    mgd.background2.tilePosition.y += mgd.background_speed;


    window.setTimeout(function(){
      game.state.start('splash');
    }, 5000);

  }

}