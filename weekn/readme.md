# Week N - Last Touches

In the final week, we got a basic version of the game with scoring, level resets, and the aliens dropping bombs. But I really wanted the bunkers, though there wasn't time to finish them. So, while our Dojo is on Spring Break, we're going to add the final and hardest part. The bunkers.

## Step 1: Put the bunkers on the screen

In game.js, where we're setting up a lot of our variables in the `mgd` object, we'll add two lines of code.

```javascript
mgd.numBunkers = 4;
mgd.craters = [];
mgd.bombcraters = []
```

Later we'll add some code to evenly space the bunkers across the screen. And the craters/bombcraters values we'll be setting up will eventually be sprite groups holding crater sprites. We need that group because we'll use sprites that are the color of the background to cover up bits of the bunkers as they get hit.

We'll also update our game creation call.

```javascript
game = new Phaser.Game(mgd.MAXWIDTH, mgd.MAXHEIGHT, Phaser.CANVAS, 'gamediv', null, false, false);
```

In Week 5, we'd stopped at the 'gamediv', but this time we're adding three optional values. The first is where we could specify a state to use as the start. Since we're programmatically handling it, we pick `null`.

The second is whether the background should be transparent: `false`.

The third is for "antialising" which is a process used to smooth the edges of objects. But we want it off because our game is supposed to be blocky AND (capitalized because this is important) it blends colors to create a transition between edges instead of harsh edges. That creates patterns of different colors you don't even notice, but the code to tell if the tip of a bomb is touching the bunker will notice and not trigger when it looks to you like it hit the bunker.

**We'll next go to the `load` state (load.js).**

Now, if you look at the craters in the assets folder, they'll look different than they did in Week 5. In Week 5, I thought some dissolving at the edges would look good. Nah. The craters really needed more solid edges. It not only looked better, but it works better.

So we load our bunker and crater sprites.

```javascript
    game.load.image('bombcrater', "assets/gameart/bomb-crater.png");
    game.load.image('missilecrater', "assets/gameart/missile-crater.png");
    game.load.image('bunker', "assets/gameart/bunker.png"); // new
```

So far, it's totally like we're not writing any code at all.

**Not to worry, we'll write plenty in the `play` state (play.js).**

The first new line of code you'll see in the `create` function is calling ` mgd.addBunkers()`.

```javascript
mgd.addBunkers = function(){ // adds bunkers and craters
  mgd.bunkerY = game.height - 185;

  mgd.bunkers = game.add.group();
  mgd.bunkers.enableBody = true;
  mgd.bunkers.physicsBodyType = Phaser.Physics.ARCADE;

  var bunkerbase = game.cache.getImage("bunker");
  var bunkergap = ((game.width * .8) - (mgd.numBunkers * bunkerbase.width))/(mgd.numBunkers - 1)

  for(var bu = 0; bu < mgd.numBunkers; bu++){
    var newX;
    if(bu == 0){
      newX = game.width * 0.1;
    } else {
      newX = mgd.bunkers.children[bu-1].position.x + bunkerbase.width + bunkergap;
    }

    var d = mgd.bunkers.create(newX, mgd.bunkerY, 'bunker');
    d.name = "bunker" + bu;
    d.exists = true;
    d.visible = true;
    d.body.immovable = true;
  }
```

To keep it short, we're creating a sprite group for the bunkers. Everything else is pretty much the math of placing the bunkers. The first part of that is pulling the bunker image from the cache so we can get some information about it, notably it's width.

We've set that the bunker group edges will be at 10% and 90% respectively, so the bunker gap is the width of that 80% space minus the width of all the bunkers, then divide that by the number of spaces, which is always 1 less than the number of bunkers. 

Don't believe me? How many spaces are between two bunkers? You've got two bunkers and one space. Every time you add a bunker, you add a space, but the number of bases never catches up.

Then we loop through the number of bunkers and add them to the `mgd.bunkers` group.

If you've spotted that we don't have a closing brace, that's because we still need to create the crater sprite groups.

## Step 2: Bomb and shoot the bunkers

In the `mgd.addBunkers()` function we also add the sprite groups to add the craters. Why not in the `mgd.addGroups()` function where we add the aliens, missiles, and bombs? For me it's because we might at some point add difficulty levels where the player starts without bunkers. And if you're not adding the bunkers, no point in adding the craters. 

But we are, so the code looks like this:

```javascript
  mgd.craters = game.add.group();
  var dcount = 0;
  while(dcount < 200){
    var nop = mgd.craters.create(0,0,'missilecrater');
    nop.exists = false;
    nop.visible = false;
    nop.scale.x = 1.3;
    nop.scale.y = 0.8;
    dcount++;
  }

  mgd.bombCraters = game.add.group();
  dcount = 0;
  while(dcount < 200){
    nop = mgd.bombCraters.create(0,0,'bombcrater');
    nop.exists = false;
    nop.visible = false;
    nop.scale.x = 1.3;
    nop.scale.y = 1.1;
    dcount++;
  }
```

They're very similar to the routines for adding the missile and bomb sprites, but with one notable exception. We're changing their scale to make them wider or narrower, taller or shorter. This way we can fine tune them easily with reloads of the gameplay rather than adjusting the images constantly. These numbers seemed to work well, but you can play with them and see if you find a better set of values.

Now our bunkers are placed on screen, our groups are set... time to get into the game action!

First we go to the top of the `update()` function to set the collision handlers for the bombs and missiles to interact with the bunkers.

```javascript
game.physics.arcade.collide(mgd.bunkers, mgd.missiles, mgd.bunkerMissileHandler, null, this);
game.physics.arcade.collide(mgd.bunkers, mgd.bombs, mgd.bunkerBombHandler, null, this);
```

And from those we call `mgd.bunkerMissileHandler` and `mgd.bunkerBombHandler`.

```javascript
mgd.bunkerMissileHandler = function( bunker, missile ){
  // get missile tip location
  var tipX = (missile.worldPosition.x + (missile.width/2)) - 1;
  var tipY = missile.worldPosition.y - 1; //y is the contact point
  var pixcolor = game.context.getImageData(tipX,tipY,1,1);
  var pixel = mgd.toHex(pixcolor);
  if(mgd.matchRange(pixel)){
    mgd.addExplosion(missile);
    var crater = mgd.craters.getFirstExists(false);
    if (crater)
    {
        crater.reset(missile.x + (missile.width - crater.width), missile.y - crater.height + 9);
    }
    missile.kill(); 
  }     
}  

mgd.bunkerBombHandler = function( bunker, bomb ){
  // get missile tip location
  var tipX = (bomb.worldPosition.x + (bomb.width/2)) - 1;
  var tipY = bomb.worldPosition.y + bomb.height + 1; //y is the contact point
  for(var k = -2; k <= 2; k++) {
    var pixcolor = game.context.getImageData(tipX + k,tipY,1,1);
    var pixel = mgd.toHex(pixcolor);
    if(pixel == "ecececff"){
      mgd.addExplosion(bomb);
      var crater = mgd.bombCraters.getFirstExists(false);
      if (crater)
      {
          crater.reset(bomb.x, bomb.y + bomb.height - 13);
      }
      bomb.kill();
      break;        
    }
  }
}

mgd.toHex = function(pixcolor){
  var retVal = "";
  for(var c in pixcolor.data){
    if(pixcolor.data[c] < 16) retVal = retVal + "0";
    retVal = retVal + pixcolor.data[c].toString(16);
  } 
  return retVal;
}
```

They both work in the same way. 

When there is a collision between the bomb or missile sprite and the bunker sprite, they can't just wipe each other out. So the routines first determine the front center point of the bomb or missile. 

Since the missiles are narrower and we're not as concerned with registering edge hits, we just check if the pixel right in front of it is the color of the bunker. For the bombs, we check a range 7 pixels wide just in front of it.

If any of those pixels are bunker colored, we register a hit, explode the bomb or missile, and overlay a a crater sprite (basically a jagged blob of the background color) where we hit. That way, it looks like bits of the bunker is just being chipped away.

You may remember where we turned anti-aliasing off back when we created the game object. If it was on, we'd have to compare the pixels to a range of 9 or 10 different blend colors.

The last bit of code, `mgd.toHex(pixcolor)` takes the pixel color data, which is an array of [RGBA values](https://24ways.org/2009/working-with-rgba-colour/) from 0 to 255 and converts them into a base 16 string we can compare against the bunker color ("ecececff").

## Step 3: Play the game

If you have loaded the full repo into your Cloud9 instance or you have set things up on your server, you'll be able to play the game.

## Lab Ideas

It's pretty easy to get to 7 or 8 thousand just by shooting a hole in a bunker, then sitting there and holding down the space key. 

How can you make this game harder?

- Could you slow down the firing rate (gap between missiles)? 
- Allow fewer missiles on screen? 
- Slow down the missile motion?
- Could you add a way to ensure that one press of the space bar fired only one missile?
- Make the bombs faster?
- Make the bombs take out bigger chunks of bunker? 
- Expand the area the bombs check for a bunker hit?
- Those are ones I thought up in 10 minutes. What can you think of?

Can you add a Saucer that flies across the top of the screen?

Can you add a boss fight every 5 levels? What would that boss look like?



Have fun and thanks for following along.

-- Greg