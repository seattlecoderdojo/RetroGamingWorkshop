window.onload = function() {
  game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update  });
  var ps = {};
  var bs = {};
  ps.projectiles = [];
  ps.last_shot = 0;
  ps.MIN_GAP = 300;
  ps.MAX_MISSILES = 19;
  ps.MISSILE_SPEED = -300;

  function preload(){
    //pre load our villain and hero
    game.load.spritesheet('alien', '../sprite-sheet/aliensheet.png', 64, 64, 5, 0, 0);
    game.load.spritesheet('duane', '../sprite-sheet/duanesheet.png', 104, 125, 10, 0, 0);
    game.load.spritesheet('missile', '../sprite-sheet/missilesheet.png', 8, 18, 4, 0, 0);

  }

  function create(){
    bs = this;
    //add our hero and villain to the screen and set their animations
    ps.duane = this.game.add.sprite( 63 , 475 ,'duane');
    ps.duane.animations.add('kill');
    ps.duane.animations.play( 'kill', 12 , true );

    ps.alien = this.game.add.sprite( 240 , 90 ,'alien');
    ps.alien.animations.add('walk', [0, 1, 2, 3, 4, 3, 2, 1]);
    ps.alien.animations.play( 'walk', 8 , true );

    //center their anchors and enable their physics
    ps.duane.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(ps.duane, Phaser.Physics.ARCADE);   
    
    ps.alien.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(ps.alien, Phaser.Physics.ARCADE);   
    ps.alien.body.velocity.x = 150;
    ps.alien.enableBody = true;
    ps.duane.enableBody = true;

    // set up input
    ps.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    cursors = game.input.keyboard.createCursorKeys();

    //reduce the alien's personal space
    ps.alien.body.setSize(54, 54, 5 , 5 );

  }

  function update(){ 
    //make sure no one runs away into the ether
    this.game.world.wrap(ps.alien); 
    ps.duane.body.collideWorldBounds =  true;

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

   if(ps.spaceKey.isDown){
      shootMissile(ps.duane.body.x, ps.duane.body.y);
    }

    for(var mno = 0;  mno < ps.projectiles.length; mno++){
      this.game.physics.arcade.collide(ps.projectiles[mno], ps.alien, function(){
        ps.alien.destroy();
        ps.projectiles[mno].destroy();
        ps.projectiles = ps.projectiles.splice(mno,1);
      });
    }
    
    checkMissiles();

  }

  function shootMissile(x,y){
    var timestamp = Date.now();
    // check if it's been at least MIN_GAP since the last shot and there aren't 
    // more than MAx_MISSILES on screen.
    if(((timestamp - ps.last_shot) < ps.MIN_GAP)||(ps.projectiles.length >= ps.MAX_MISSILES)){
      return true;
    }

    //we're good, so let's set the time of the last shot
    ps.last_shot = timestamp;

    //now let's create our missile and send it flying;
    var missile = game.add.sprite(x, y + 20, 'missile'); //place it
    missile.animations.add('fire');
    missile.animations.play('fire', 12 , true); // animate the little fire exhaust
    game.physics.enable(missile, Phaser.Physics.ARCADE);
    missile.body.velocity.y = ps.MISSILE_SPEED;
    ps.projectiles.push(missile);
  }

  function checkMissiles(){
    for(var i = 0; i < ps.projectiles.length; i++ ){
      //check if missile's location is it's height above the top of the panel
      if(ps.projectiles[i].y < (0 - ps.projectiles[i].height)){
        ps.projectiles[i].destroy(); // destroy the sprite
        ps.projectiles.pop();
      }
    }
  }


}