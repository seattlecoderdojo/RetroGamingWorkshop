var playState = {

  create: function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //might as add a background color better than basic black
    mgd.background = game.add.tileSprite(0 , 0 , 1200 , 900 , 'starfield');

    //set score text

    mgd.scoreshow = game.add.text(20,20, "SCORE: " + mgd.score , {font: '30px pcsenior', fill: '#EEE'});
    mgd.hiscoreshow = game.add.text(20,20, "HIGH SCORE: " + mgd.highscore, {font: '30px pcsenior', fill: '#EEE'});
    mgd.hiscoreshow.x = game.width - 20 - mgd.hiscoreshow.width;

    //start the background music playing, but only if it wasn't before
    if(!mgd.ipsi === undefined){
      mgd.ipsi.stop();
    }
    mgd.ipsi = game.add.audio('bg', .35, true);
    mgd.ipsi.play();

    mgd.loadGroups();

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

    mgd.bombcounter = 0;

  },

  update: function(){
    mgd.background.tilePosition.y += mgd.background_speed;

    game.physics.arcade.overlap(mgd.missiles, mgd.aliens, mgd.collisionHandler, null, this);

    game.physics.arcade.collide(mgd.hero, mgd.aliens, mgd.heroDie, null, this);

    game.physics.arcade.collide(mgd.hero, mgd.bombs, mgd.heroDie, null, this);

    game.physics.arcade.collide(mgd.missiles, mgd.bombs, mgd.dualHandler, null, this);

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
      mgd.fireMissile();
    }

    mgd.bombcounter++;
    if(mgd.bombcounter >= mgd.bombinterval){
      console.log('bigger');
      if(mgd.bombinterval > mgd.minbombinterval){
        mgd.bombinterval -= Math.floor(Math.random()*2); // coin flip to reduce by 1
      }
      mgd.dropABomb();
      mgd.bombcounter = 0;
      mgd.curbombspeed += 0.25;
      if(mgd.curbombspeed > mgd.maxbombspeed){
        mgd.curbombspeed = mgd.maxbombspeed;
      }
    }

    /*********** END NEW CODE ****************/

    // move the horde of aliens
    mgd.checkBounds();
    mgd.aliens.x += mgd.curspeed;
  },

}

mgd.dropABomb = function (){
  //who drops the bomb?
  var enemy = Math.floor(Math.random() * mgd.enemycount);
  var kids = mgd.aliens.children;
  var counter = 0;
  var myalien = 0;
  for(var i = 0; i < kids.length; i++){
    if(kids[i].alive){
      if(counter == enemy){
        myalien = i;
        break;
      } else {
        counter++;
      }
    }
  }

  var bomb = mgd.bombs.getFirstExists(false);

  if (bomb)
  {
      bomb.reset(mgd.aliens.children[myalien].worldPosition.x + 15, mgd.aliens.children[myalien].worldPosition.y + 14);
      bomb.body.velocity.y = mgd.curbombspeed;
  }

}


mgd.checkBounds = function(){
  var w = mgd.aliens.width;
  var actualX = mgd.aliens.centerX - (w/2);
  if ((actualX  < 0)||(game.width < (actualX + w))){
    mgd.drop = mgd.drop * mgd.speedup;
    mgd.aliens.y += mgd.drop;
    mgd.curspeed = mgd.curspeed * -mgd.speedup;
  } 
},

// all new from here on out
mgd.fireMissile = function(){
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

mgd.resetMissile = function(missile) {
    missile.kill();
}

mgd.collisionHandler = function (missile, alien){
  mgd.addExplosion(missile);
  mgd.score += alien.scoreval;
  mgd.updateScore();
  missile.kill();
  alien.kill();
}

mgd.dualHandler = function (missile, bomb){
  console.log('bomsle');
  mgd.addExplosion(missile);
  mgd.addExplosion(bomb);
  missile.kill();
  bomb.kill();
  mgd.score += mgd.bombscore;
  mgd.updateScore();
}

mgd.addExplosion = function (missile){
  var sploder = game.add.sprite(missile.x,missile.y - 20,'explosion');
  var splode = sploder.animations.add('splode', [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0]);
  splode.killOnComplete = true; // HMM this is interesting
  sploder.animations.play('splode', 20, false);
  // play sound
  var soundnum = Math.floor(Math.random() * 4);
  mgd.sfx[soundnum].volume = .6;
  mgd.sfx[soundnum].play();
}


mgd.updateScore = function () {
  if(mgd.scoreshow.hasOwnProperty('blendMode')){ 
      // ^^^ check if there's a text object in the label
      mgd.scoreshow.destroy(); // clear the label
  }
  mgd.scoreshow = game.add.text(20,20, "SCORE: " + mgd.score , {font: '30px pcsenior', fill: '#EEE'});
}

mgd.loadGroups = function(){
  var aliencounter = 0;

  mgd.aliens = game.add.group();
  mgd.aliens.enableBody = true;
  mgd.aliens.physicsBodyType = Phaser.Physics.ARCADE;

  mgd.missiles = game.add.group();
  mgd.missiles.enableBody = true;
  mgd.missiles.physicsBodyType = Phaser.Physics.ARCADE; 

  mgd.bombs = game.add.group();
  mgd.bombs.enableBody = true;
  mgd.bombs.physicsBodyType = Phaser.Physics.ARCADE; 

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
        templien.exists = true;
        templien.visible = true;
        templien.scoreval = alien.value;
        templien.body.immovable = true; // -- new
        templien.animations.add('walk', alien.sequence);
        templien.animations.play('walk', alien.speed, true);
        mgd.enemycount += 1; // -- new + function below
        templien.events.onKilled.add(function(){
          mgd.enemycount -= 1;
          if(mgd.enemycount <= 0){
            mgd.levelwin();
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
      b.events.onOutOfBounds.add(mgd.resetMissile, this);
      b.events.onKilled.add(function(){ // helps us track how many missiles on screen
        mgd.missiles_live -= 1;
        if(mgd.missiles_live < 0) mgd.missiles_live = 0;
      })
  }

  // stock up on some bombs
  for (var k = 0; k < 20; k++)
  {
      var d = mgd.bombs.create(0, 0, 'bomb');
      d.name = 'bomb' + k;
      d.exists = false;
      d.visible = false;
      d.checkWorldBounds = true;
      d.body.immovable = true;
      d.events.onOutOfBounds.add(mgd.resetMissile, this);
  }


}

mgd.heroDie = function(hero,alien){
  console.log('hero died');
  mgd.addExplosion(mgd.hero);
  mgd.hero.kill();
  window.setTimeout(function(){
    game.state.start('over');
  }, 600);
  alien.kill();
}


mgd.levelwin = function (){
  mgd.levelreset();
  mgd.loadGroups();
  console.log(mgd.curspeed)
}

