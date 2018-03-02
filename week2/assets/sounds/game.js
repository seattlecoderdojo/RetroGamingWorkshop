
var game;

window.onload = function() {
  game = new Phaser.Game(850, 850, Phaser.AUTO, '', { preload: preload, create: create  });

  var knight;


  function preload(){
    game.load.image('knight', '/week1/assets/gameart/Walk%20(1).png');
  }

  function create(){
    knight = game.add.sprite(game.world.centerX, game.world.centerY, 'knight');
    
    knight.anchor.setTo(0.5, 0.5);
    
    game.physics.enable(knight, Phaser.Physics.ARCADE);

    var pms = document.getElementById('pms');
    console.log(pms);
    pms.addEventListener("click", function(e){
        console.log(e.srcElement.name);
        var info = JSON.parse(e.srcElement.name);
        console.log(info);
    })

  }


}



