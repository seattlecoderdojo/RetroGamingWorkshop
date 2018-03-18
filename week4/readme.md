# Week 4: Finishing "Alien Shootz"

Last week, we learned how to make animations with sprite sheets, add collisions so they could hit each other, and handle those collisions to kill a character. You may have even taken it to the next level and made the alien respawn so you had a rudimentary game.

This week we're going to build it into a full game. To do that, we have to do a few more things than we did last week. We'll do the ones in bold in class, the ones in italics will be for homework and next session.

- **Make a grid of aliens.**
- **Make the grid move.**
- **Make it possible to shoot them.**
- **Make them explode when shot.** 
- **Add sounds.**
- *Handle resetting when you've cleared a screen.*
- *Make the aliens drop bombs and add the loss scenarios for the player.*
- *Add scoring.*

This order isn't necessarily the order everyone would go in, but it was the order I went in as I built the code.

Before we continue, you may ask "what's with the name?" Well, just to be on the right side of the law, we couldn't call it "Space Invaders," since that's trademarked, and pretty much every synonym of "attack" or "attacker" had already been combined with the word "alien" for some game or movie title. So we did what you do on the internet... we misspelled a word on purpose. 

## Making a grid of aliens

The first thing we have to do to make it like Space Invaders is have a grid of aliens that march back and forth across the screen, periodically dropping bombs. When one side of the alien horde hits the side of the screen, they turn and march back the other way. If I recall correctly (because it has been 30+ years since I played), they'd even move down a little bit each time they hit each side.

The goal of the game was to kill all the aliens, not just before they hit you with a bomb, but before they reached the bottom and an alien collided with you.

So, let's go into the experiments folder and look at the grid.js file. We can look at what it does by running the grid.html file. We'll start off by setting up some basic information for our alien grid.

We'll set the maximum height and width, but later we'll add some code to help handle scaling.

```javascript
var mgd = {}; // variable to hold "my game data" throughout
// setting our gameboard dimensions
mgd.MAXWIDTH = 1200; // set maximum width of game board in pixels;
mgd.MAXHEIGHT = 900; // set maximum height of game board in pixels;
```

The next part is where I'll set up an array of objects. Each object is a block of labeled information about the enemies we'll put on the screen.

So the alien from last week goes first. It will be 56 pixels high and wide, I'm setting a horizontal and vertical gap between rows and layers, a count, how many rows of this enemy I want on screen, the frame rate for its animation sequence, and the sequence. I do that for each enemy. And since the saucers are shorter, I do three rows.

```javascript
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
];
```
A few more variables (the initial x and y offset of the grid and a global for `game`), and then we actually go into our window.onload event handler to launch our game and preload the sprite sheets for our aliens.

Remember, the spritesheet arguments go: nickname, path to file, width of a frame, height of a frame, number of frames to load, and padding and offsets that we don't put in our sheets (thus the zeroes).

```javascript
mgd.offsetx = 20;
mgd.offsety = 20;
var game = {} // will hold game object

window.onload = function(){
  game = new Phaser.Game(mgd.MAXWIDTH, mgd.MAXHEIGHT, Phaser.AUTO, '', { preload: preload, create: create});

  function preload(){
    // load our animated sprites
    game.load.spritesheet('saucer', "../assets/gameart/shipsheet.png", 56 , 32, 5, 0, 0);
    game.load.spritesheet('alien', "../assets/gameart/aliensheet.png", 56 , 56 , 5 , 0 , 0 );
    game.load.spritesheet('rollien', "../assets/gameart/rolliensheet.png", 56 , 56 , 10 , 0 , 0 );
  }
```
The next thing we'll do is actually place sprites on screen. We're going to **introduce a new concept** with the sprite group. And this brings a lot of benefits to the table.

[some benefits of sprite groups]

We add the group just like we'd add a sound or a sprite, but then we can start creating magic in it. Since we're going to do nested loops, it's too hard to use the loop counter as a counter for the aliens, so I'll just set my own.

First we set a loop to go through the array of our different aliens. Then we set a loop to do as many rows their definition calls for. Then we set a loop to create the actual row and place aliens.

When we place the aliens, instead of using the game.add.sprite method, we use the `create` method for groups to add sprites to them. Beyond that, it's pretty similar. The arguments we provide are the x and y positions plus the nickname we used when loading it from its spritesheet.

We set up its animation, set it playing, and move onto the next. When we finish a row, we update the vertical offset so the next row goes in at the right vertical position.

The last two lines of the create function set up the scaling. We give it a 400 for the height and width, which means that neither of them can go below 400 when scaling down. For the maximum, we give it the maximums we set at the beginning. 

Last we set the game's scale mode. I'm not an expert on the different modes, but SHOW_ALL seemed to give the right mix of benefits we needed.

The great thing about scaling is that you can do all your math and manipulation for *one* screen size and the scaling manager in Phaser will handle all the math to make it work for whatever screen size it's scaled to.

```javascript
  function create(){
    mgd.aliens = game.add.group();
    var aliencounter = 0;
    // loop through our grid of aliens
    for(var i = 0; i < mgd.grid.length; i++){
      //get a new alien type from the array
      var alien = mgd.grid[i];
      //loop for the number of columns
      for(var j = 0; j < alien.rows; j++) {
        //loop for the number of aliens to go in each column
        for(var k = 0; k < alien.count; k++) {
          //add an alien to the row, starting at the x offset
          var templien = mgd.aliens.create((mgd.offsetx + (k * (alien.width + alien.hgap))), mgd.offsety, alien.alias);
          templien.name = "alien" + aliencounter++;
          templien.animations.add('walk', alien.sequence);
          templien.animations.play('walk', alien.speed, true);
        }
        // increase mgd.offsety
        mgd.offsety += (alien.height + alien.vgap);
      } 
    }    

    // set our minimum and maximum dimensions for the game, then use the
    // SHOW_ALL scale mode to keep the game scaled.
    game.scale.setMinMax(400, 400, mgd.MAXWIDTH, mgd.MAXHEIGHT)
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  }
}
```

### LAB TIME

Run the grid.html file while you edit the grid.js file. Try resizing your browser to see how the game canvas resizes itself and the aliens.

Try using a comment indicator `//` before the scaling lines of code to turn them off. See what impact that has.

What happens to your grid when you change some of the variables from the beginning around?

## Making our grid move

It might seem simple to make our grid move. We've got a group and we even set up physics on it. The problem is that our group doesn't have a body of its own for physics to act on. It has 70 little bodies. On the other hand, it has some location coordinates.

Open up the `walkgrid` .html and .js files. Let's look at what we need to add to make our group move. We'll ignore the code that's stayed the same and look just at the changes.

First we're going to add some variables to 
```javascript
//adding variables to control movement and speed of the grid
mgd.speed = 1.1;
mgd.speedup = 1.07;
mgd.drop = 4;
```
We set the initial `speed` of the aliens, and their `speedup` factor. What does 1.07 mean? It means that each time they hit a speedup point, they'll speed up by 7%. As the aliens come down at you, we have to define how much they'll `drop` each time they hit a drop point. 

```javascript
window.onload = function(){
  game = new Phaser.Game(mgd.MAXWIDTH, mgd.MAXHEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update});

```
We'll skip over all our grid creation stuff because it hasn't changed. But in our game object creation we've added an update function. Must mean we're getting serious.

Our preload and create don't change except for adding a better background color. And then we get to the update. Now, because the group itself doesn't have a body, we can do one of two things. We can just manually move the group, or we can iterate through the group and set an acceleration on all of them.

So we just move them by the current speed and then we run a check to see if the group has hit one of the sides.

An interesting bug I discovered with my boys when we playtested an early iteration, was that if you just used the X coordinate of the group, you got odd behavior when you shot columns off the left side. So we have to calculate the `actualX` of the group. For us that means the "center" of the group, minus half the current width.

If we reach other side, we increase the drop by the speedup rate and then drop the group. We also multiply the speed by **negative** the speedup rate. Why is that? Because multiplying the speed by the speedup rate is necessary, and we also have to toggle whether it's positive or negative to change the direction the group moves. My multiplying by negative the speedup rate, we get both. If the rate is positive, it becomes negative because a negative times a positive is negative. If the rate is negative, it becomes positive, because a negative times a negative is positive.

```javascript
  function update(){
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
}
```

### LAB TIME

> If you're at Dojo, who can tell me right away something that is horribly wrong with how this grid of aliens is set up? 
>
> If you're not, I'll tell you. IT'S TOO HIGH. Where are we going to put our score? Where are we going to tell the player other information? The top!! A 20 pixel *offset* is too small. What variable would we change to make a bigger gap between the first row and the top? I gave you a hint.

Try changing the speed up rate, drop amount, and initial speed to see how that impacts the motion.

**YOU WILL NOT HAVE TIME FOR THIS AT DOJO, BUT TRY IT AT HOME IF YOU WANT: ** Change things so that instead of moving the group as a whole, you move each individual alien and have each one turn when they hit the edge. I haven't done it, so it should be interesting to see what happens.

## Shootzing the aliens

No, that's not a typo. Since this game is called "Alien Shootz," it's just a really lame attempt to be clever. You can all mock me for a moment. The moment is now over.

Now we need to add our hero to the screen, set up their movement, and make it possible for them to shoot the aliens.

Open the `shootgrid` .html and .js files. You can close your older ones to keep your tabs from getting messy. **Don't run the .html file yet**.

We have to add a bit of code to this. We'll try to go through it quickly and just call out the interesting bits.

```javascript
mgd.MIN_GAP = 400;
mgd.MAX_MISSILES = 3;
mgd.missile_speed = -300;
mgd.last_shot = 0; // will hold the time stamp for the last shot
mgd.missiles_live = 0; // helps enforce max missiles on screen
mgd.herospeed = 300;
mgd.sfx = []; // an array for our explosions
mgd.enemycount = 0;
```
All we've done is set variables similar to the last week where we made it possible for the ninja girl to shoot the alien. The gap is the minimum time in milliseconds between missiles. The comments really explain the rest.

We'll skip down to our preload...
```javascript
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
```
Here we've added one more animation for the explosion, static images for the hero and missile, four explosion sounds we got from "The Essential Retro Video Game Sound Effects Collection" by Juhani Junkala, and a background track ("Ipsi") we picked up from https://www.dl-sounds.com/ which offers a nice assortment of free music tracks for games. 

Their background music file was pretty high quality. I downsampled it to a lower bitrate to make a smaller file at acceptable quality so the game loads faster.

If we skip down into our `create` function...
```javascript
    mgd.ipsi = game.add.audio('bg', .35, true);
    mgd.ipsi.play();
```
We don't need to fade tones in and out here. So we can just play them. We play the `bg` alias (a.k.a. the "Ipsi" music track), and feed two more arguments to the `game.add.audio` function: volume (.35 so it plays at 35% volume since it is background), and looping (true because we want it to start over when it ends).

```javascript
    game.stage.backgroundColor = '#28283c';

    mgd.aliens = game.add.group();
    mgd.aliens.enableBody = true;
    mgd.aliens.physicsBodyType = Phaser.Physics.ARCADE;

    mgd.missiles = game.add.group();
    mgd.missiles.enableBody = true;
    mgd.missiles.physicsBodyType = Phaser.Physics.ARCADE; 
```
In earlier versions of the script, we just added the group. Now we're enabling the physics body and setting the body type to arcade physics. This will allow us to more easily check for collisions and going out of bounds. 

We've also added a group for missiles.
``` javascript
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
```
I marked the new bits. We add a name to each alien which we won't use at the moment, but could be handy later. We set their body type to immovable, so when the missile hits it doesn't push the alien. We add to the alien count for each created, then add a handler for each alien's `onKilled` event to reduce the number. When the number hits 0, we can invoke a function to handle winning a level.
```javascript
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
```
We've added a bunch of missiles. By putting them in a group, it makes it a bit easier to handle when members of this group collide with members of the alien group. Since we don't want them all on screen, they get created at 0,0 with their exists and visible variables set to 0.

Another interesting part is that we can set them to automatically check the world bounds (when they're active) and run a reset function when they are out of bounds.

Last, we add an `onKilled` event handler to reduce the count of missiles on screen by 1 and make sure we don't accidentally go negative.
```javascript
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
```
Last we add our hero and enable the hero's game physics. Right now it will only allow us to help move the hero around, but eventually we could start letting the aliens fight back, and it could come in handy then too.
```javascript
function update(){
    /*********** START NEW CODE ****************/
    game.physics.arcade.overlap(mgd.missiles, mgd.aliens, collisionHandler, null, this);
```
The line above could possibly be the most important and useful line of code in the game. When an overlap is detected between one of the missiles in our missile group and an alien in the alien group, this calls a function AND SENDS IT POINTERS TO WHICH ALIEN AND WHICH MISSILE MET.

Think of all the code you'd have to write to handle 70 aliens and check all the collision possibilities. Instead... one line. This is why people use frameworks.

The rest of the code is the same as you remember from last week for moving the hero and handling the spacebar or the same as it was in the last script we looked at. Let's look at the new stuff.
```javascript
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
```
We've seen the code to ensure we don't fire too many or too fast, but the interesting part is the firing itself. It pulls a missile from the missiles group and makes it active. If one is available, we move it to the middle of the hero and set it in motion with the missile speed.
```
  function resetMissile(missile) {
      missile.kill();
  }

  function collisionHandler(missile, alien){
    addExplosion(missile);
    missile.kill();
    alien.kill();
  }
```
This is all we need to do... if the missile goes offscreen, we invoke it's `kill` function which deactivates it and puts it back into the group of available inactive missiles.

If a missile overlaps an alien... that handler sent pointers to the missile and the alien to our `collisionHandler` function. We just send the missile pointer to the `addExplosion` function (which makes an explosion happen on screen) and then `kill` the missile and alien that overlapped.
```javascript
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
```
For the explosion, we add our explosion sprite *close* to where the missile was, set the animation, and play it. But what's that line right before the play? The sprite has a `killOnComplete` property. If we set it to `true` before we play the animation, the sprite disappears from the screen when the animation ends.
```javascript
  function levelwin(){
    // HMMMM... What goes here?
  }
}
```
And we have an empty function to call when the level is won. Hmm, what should go there?

At this point, we can move the ship, fire missiles, blow up aliens... but how do we win?

### LAB TIME

Google adding text (or look back at our Simon clone) and add scoring. Should there be a different score for each alien? How could you do that.

There's a bomb image in the `assets/gameart` folder. Could you have the aliens start dropping bombs? How would you handle the collision between a bomb and our hero? What if an alien ran into our hero?

How do we start the next level?



