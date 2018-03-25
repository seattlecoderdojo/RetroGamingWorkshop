var splashState = function(){

  create: function(){

    mgd.background = game.add.tileSprite(0 , 0 , 1200 , 900 , 'starfield');


  }
  

  update: function(){

    mgd.background.tilePosition.y += mgd.background_speed;


  }

}