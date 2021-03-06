window.onload = function() {
  game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update  });
  ps = {};

  function preload(){
    //pre load our villain and hero
    game.load.spritesheet('alien', '../sprite-sheet/aliensheet.png', 64, 64, 5, 0, 0);
    game.load.spritesheet('duane', '../sprite-sheet/duanesheet.png', 104, 125, 10, 0, 0);

  }

  function create(){
    game.stage.backgroundColor = "#220055";
    //add our hero and villain to the screen and set their animations
    ps.duane = this.game.add.sprite( 63 , 475 ,'duane');
    ps.duane.animations.add('kill');
    ps.duane.animations.play( 'kill', 12 , true );

    ps.alien = this.game.add.sprite( 240 , 90 ,'alien');
    ps.alien.animations.add('walk', [0, 1, 2, 3, 4, 3, 2, 1]);
    ps.alien.animations.play( 'walk', 8 , true );

    //center their anchors and enable their physics
    ps.duane.anchor.setTo(0.5, 0.5);
    game.physics.enable(ps.duane, Phaser.Physics.ARCADE);   
    
    ps.alien.anchor.setTo(0.5, 0.5);
    game.physics.enable(ps.alien, Phaser.Physics.ARCADE);   
    ps.alien.body.velocity.x = 150;
  }

  function update(){ 
    //make sure no one runs away into the ether
    this.game.world.wrap(ps.alien); 
    this.game.world.wrap(ps.duane); 

    //set up our input keys
    cursors = game.input.keyboard.createCursorKeys();

    //enable moving duane left and right
    ps.duane.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        ps.duane.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        ps.duane.body.velocity.x = 150;
    }

    //enable moving duane up and down
    ps.duane.body.velocity.y = 0;
    if (cursors.up.isDown)
    {
        ps.duane.body.velocity.y = -150;
    }
    else if (cursors.down.isDown)
    {
        ps.duane.body.velocity.y = 150;
    }

  }

}