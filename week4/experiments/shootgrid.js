var mgd = {}; // variable to hold "my game data" throughout
// setting our gameboard dimensions
mgd.MAXWIDTH = 1200; // set maximum width of game board in pixels;
mgd.MAXHEIGHT = 900; // set maximum height of game board in pixels;
mgd.speed = 1.1;
mgd.speedup = 1.07;
mgd.drop = 4;
mgd.offsetx = 20;
mgd.offsety = 70; // updated to allow for the score
mgd.MIN_GAP = 400;
mgd.MAX_MISSILES = 3;
mgd.missile_speed = -300;
mgd.last_shot = 0; // will hold the time stamp for the last shot
mgd.missiles_live = 0; // helps enforce max missiles on screen
mgd.herospeed = 300;
mgd.sfx = []; // an array for our explosions
mgd.enemycount = 0;

// define our enemies grid...
mgd.grid =[
  {
    alias: 'alien', 
    width: 56,
    hgap: 22, 
    height: 56, 
    vgap: 25, 
    count: 10, 
    rows: 2, 
    speed: 12,
    sequence: [0, 1, 2, 3, 4, 3, 2, 1]
  },
  {
    alias: 'rollien', 
    width: 56, 
    hgap: 22, 
    height: 56, 
    vgap: 25, 
    count: 10, 
    rows: 2,  
    speed: 16,
    sequence: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0]
  },
  {
    alias: 'saucer', 
    width: 56, 
    hgap: 22, 
    height: 32, 
    vgap: 25, 
    count: 10, 
    rows: 3, 
    speed: 10,
    sequence: [0, 1, 2, 3, 4]
  }
]

var game = {} // will hold game object

window.onload = function(){
  game = new Phaser.Game(mgd.MAXWIDTH, mgd.MAXHEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update});

  function preload(){
    // load our animated sprites
    game.load.spritesheet('saucer', "../assets/gameart/shipsheet.png", 56 , 32, 5, 0, 0);
    game.load.spritesheet('alien', "../assets/gameart/aliensheet.png", 56 , 56 , 5 , 0 , 0 );
    game.load.spritesheet('rollien', "../assets/gameart/rolliensheet.png", 56 , 56 , 10 , 0 , 0 );
    game.load.spritesheet('explosion', "../assets/gameart/explosionsheet.png", 56 , 56, 7, 0 , 0); //new

    //load our static sprites
    game.load.image('missile', "../assets/gameart/missile.png");
    game.load.image('hero', "../assets/gameart/hero.png");

    //Load our sound effects
    game.load.audio('splode1','../assets/sounds/explosion1.mp3');
    game.load.audio('splode2','../assets/sounds/explosion2.mp3');
    game.load.audio('splode3','../assets/sounds/explosion3.mp3');
    game.load.audio('splode4','../assets/sounds/explosion4.mp3');
    game.load.audio('bg','../assets/sounds/ipsi-comp.mp3');

  }

  function create(){
    //might as add a background color better than basic black
    game.stage.backgroundColor = '#28283c';

    var aliencounter = 0;

    //start the background music playing, but only if it wasn't before
    if(mgd.ipsi === "flake"){
      mgd.ipsi = game.add.audio('bg', .35, true);
      mgd.ipsi.play();
    }

    game.stage.backgroundColor = '#28283c';

    mgd.aliens = game.add.group();
    mgd.aliens.enableBody = true;
    mgd.aliens.physicsBodyType = Phaser.Physics.ARCADE;

    mgd.missiles = game.add.group();
    mgd.missiles.enableBody = true;
    mgd.missiles.physicsBodyType = Phaser.Physics.ARCADE; 

    // loop through our grid of aliens
    for(var i = 0; i < mgd.grid.length; i++){
      //get a new alien type
      var alien = mgd.grid[i];
      //loop for the number of columns
      for(var j = 0; j < alien.rows; j++) {
        //loop for the number of aliens to go in each column
        for(var k = 0; k < alien.count; k++) {
          //add an alien to the row, starting at the x offset
          aliencounter++;
          var templien = mgd.aliens.create((mgd.offsetx + (k * (alien.width + alien.hgap))), mgd.offsety, alien.alias);
          templien.name = "alien" + aliencounter; // -- new
          templien.body.immovable = true; // -- new
          templien.animations.add('walk', alien.sequence);
          templien.animations.play('walk', alien.speed, true);
          mgd.enemycount += 1; // -- new + function below
          templien.events.onKilled.add(function(){
            mgd.enemycount -= 1;
            if(mgd.enemycount <= 0){
              levelwin();
            }
          });
        }
        // increase mgd.offsety
        mgd.offsety += (alien.height + alien.vgap);
      } 
    }    

    // stock up on some missiles -- NEW
    for (var i = 0; i < 20; i++)
    {
        var b = mgd.missiles.create(0, 0, 'missile');
        b.name = 'missile' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetMissile, this);
        b.events.onKilled.add(function(){ // helps us track how many missiles on screen
          mgd.missiles_live -= 1;
          if(mgd.missiles_live < 0) mgd.missiles_live = 0;
        })
    }

    // put our hero on the screen -- NEW
    var herox = (game.width - 56) / 2;
    var heroy = (game.height - 98)
    mgd.hero = game.add.sprite(herox, heroy, 'hero');
    game.physics.enable(mgd.hero, Phaser.Physics.ARCADE);

    // set up controls -- NEW
    mgd.cursors = game.input.keyboard.createCursorKeys();
    mgd.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    mgd.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

    //set up our explosions array -- NEW
    mgd.sfx.push(game.add.audio('splode1'));
    mgd.sfx.push(game.add.audio('splode2'));
    mgd.sfx.push(game.add.audio('splode3'));
    mgd.sfx.push(game.add.audio('splode4'));

    // set our minimum and maximum dimensions for the game, then use the
    // SHOW_ALL scale mode to keep the game scaled.
    game.scale.setMinMax(400, 400, mgd.MAXWIDTH, mgd.MAXHEIGHT)
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  }

  function update(){
    /*********** START NEW CODE ****************/
    game.physics.arcade.overlap(mgd.missiles, mgd.aliens, collisionHandler, null, this);

    //set up our hero's moves
    mgd.hero.body.collideWorldBounds =  true;
    mgd.hero.body.velocity.x = 0;
    if (mgd.cursors.left.isDown)
    {
        mgd.hero.body.velocity.x = -mgd.herospeed;
    }
    else if (mgd.cursors.right.isDown)
    {
        mgd.hero.body.velocity.x = mgd.herospeed;
    }

    if(mgd.spaceKey.isDown){
      fireMissile();
    }
    /*********** END NEW CODE ****************/

    // move the horde of aliens
    checkBounds();
    mgd.aliens.x += mgd.speed;
  }

  function checkBounds(){
    var w = mgd.aliens.width;
    var actualX = mgd.aliens.centerX - (w/2);
    if ((actualX  < 0)||(game.width < (actualX + w))){
      mgd.drop = mgd.drop * mgd.speedup;
      mgd.aliens.y += mgd.drop;
      mgd.speed = mgd.speed * -mgd.speedup;
    } 
  }

  // all new from here on out
  function fireMissile(){
    var timestamp = Date.now();
    // check if it's been at least MIN_GAP since the last shot and there aren't 
    // more than MAx_MISSILES on screen.
    if(((timestamp - mgd.last_shot) < mgd.MIN_GAP)||(mgd.missiles_live >= mgd.MAX_MISSILES)){
      return true;
    }

    mgd.missiles_live++;

    missile = mgd.missiles.getFirstExists(false);

    if (missile)
    {
        missile.reset(mgd.hero.x + 26, mgd.hero.y - 14);
        missile.body.velocity.y = mgd.missile_speed;
        mgd.last_shot = timestamp;
    }
  }

  function resetMissile(missile) {
      missile.kill();
  }

  function collisionHandler(missile, alien){
    addExplosion(missile);
    missile.kill();
    alien.kill();
  }

  function addExplosion(missile){
    var sploder = game.add.sprite(missile.x,missile.y - 20,'explosion');
    var splode = sploder.animations.add('splode', [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0]);
    splode.killOnComplete = true; // HMM this is interesting
    sploder.animations.play('splode', 20, false);
    // play sound
    var soundnum = Math.floor(Math.random() * 4);
    mgd.sfx[soundnum].volume = .6;
    mgd.sfx[soundnum].play();
  }


  function levelwin(){
    // HMMMM... What goes here?
  }


}

