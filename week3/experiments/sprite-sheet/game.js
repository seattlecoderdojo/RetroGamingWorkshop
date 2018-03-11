window.onload = function() {
  game = new Phaser.Game(300, 300, Phaser.AUTO, '', { preload: preload, create: create  });
  
  function preload(){

    game.load.spritesheet('alien', 'aliensheet.png', 64, 64, 5, 0, 0);
  }

  function create(){

     var alien = this.game.add.sprite(30,30, 'alien');
     var wiggle = alien.animations.add('wiggle');
     alien.animations.play('wiggle', 10 ,true)

  }
}