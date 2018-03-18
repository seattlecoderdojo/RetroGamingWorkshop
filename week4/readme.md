# Week 4: Finishing "Alien Shootz"

Last week, we learned how to make animations with sprite sheets, add collisions so they could hit each other, and handle those collisions to kill a character. You may have even taken it to the next level and made the alien respawn so you had a rudimentary game.

This week we're going to build it into a full game. To do that, we have to do a few more things than we did last week.

- Make a grid of aliens.
- Make it possible for them to march back and forth across the screen, accounting for when a whole column is shot off one of the sides.
- Make it possible to shoot all of them.
- Make them explode when shot. 
- Add sounds.
- Handle resetting when you've cleared a screen.
- Make the aliens drop bombs and add the loss scenarios for the player.
- Add scoring.

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


