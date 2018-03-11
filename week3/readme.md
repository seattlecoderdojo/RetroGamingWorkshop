# Week 3 - A Space Invaders Style Game

For week three, we're going to cover a few new concepts. They are sprite sheets, animation, and collisions. What does that mean? We're going to learn a way to put all our game graphics in one image (because it improves performance). We're going to make things not only move, but move while they move. 

And those things are going to hit each other and explode.

**NOTE FOR THE KIDS WHO ARE DOING THIS DURING OUR FIRST ROUND AT DOJO - PULL FROM GITHUB TO GET THE LATEST FILES. IF YOU'RE DOING THIS AFTER MARCH 25, 2018, YOU PROBABLY ALREADY HAVE ALL THE LATEST FILES**

## Part 1: Making Game Art - A DO AT HOME PORTION

I didn't intend to do a lesson on creating 8-bit game art. But I mistakenly thought that the Space Invaders characters aren't copyrighted. They seem to be. 

So, since I wanted at least one of our retro-style games to have some retro-style graphics, I figured I'd create a few. And wouldn't it be pointless for me to do that if I didn't document how I did it?

This is not part of the workshop for a very specific reason... you could spend all session playing with this and other pixel art tools (like [Piskelapp.com](https://piskelapp.com)).

This example uses [Inkscape](https://www.inkscape.org), which is a wonderful SVG drawing program. A lot of people compare it to Adobe Illustrator. I have been using it for years and actually like it better than Illustrator, plus it works on Windows, Mac, and Linux,  and it's free. If you need an introduction to how it works, check out our [Seattle CoderDojo Inkscape videos](https://www.youtube.com/watch?v=f0mTWb5gF0c&list=PL_tz20e9Bk_hiYVtDZA5kf4l-91B0THWL).

![a plank pixel sheet](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/pixelblock-blank.jpg?raw=true)

As you can see, I have a file called `pixel-block.svg` open. You may not have it looking like graph paper when you open it. To do that, go to the *View* menu, and select "Page Grid." If the box is too big, you can use your minus key to make it smaller, or plus to make it bigger. 

If you don't have a 16x16 grid, go to *File->Document Properties*. In the panel that opens, go to the "Grids" tab, and in the box with the label "Major grid line every," enter 5.

See the little black box in the upper left corner, we'll use that as our pixel. We'll copy it and put the copies in the squares to make our drawing.

But how do we know which squares to put them in? We can figure that out by drawing some shapes with the Inkscape shape tools, then filling them in. So, we want to make an alien... hmm.

Take your circle tool, and draw a sideways oval like this. 

![sideways oval on grid](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/alien2.jpg?raw=true)

You can then start duplicating the block in the corner (select it, then *Edit->Duplicate*) and moving the duplicates into the grid boxes, filling out the circle. You'll start seeing your idea take shape. When you're done, you can select the circle and remove it. Add a box here, a box there, and then you have...

![the alien takes shape](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/alien3.jpg?raw=true)

Now, you may want to add some different colored blocks or change the color of some. Remember that to make sure we don't have any gaps, but everything fits to the boxes the same way, the blocks all have a fill and a stroke. You have to change the color for both. Not sure how to do that or what a fill and a stroke are? Watch the [Seattle CoderDojo Inkscape videos](https://www.youtube.com/watch?v=f0mTWb5gF0c&list=PL_tz20e9Bk_hiYVtDZA5kf4l-91B0THWL).

So we change some colors, add some more blocks, and we have a basic alien...

![Our basic alien](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/alien4.jpg?raw=true)

But we want this alien to actually crawl across our screen. So we need to animate it. The easiest way to do this is with layers. So let's open the *Layer* menu and select *Layers* to open the "Layers" panel on the right. 

![the layers panel](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/layers-1.jpg?raw=true)

Notice the eye and the lock. If the eye is closed, that layer is invisible. If the lock is locked, you can't change what's in it. A LOT of kids in our first Inkscape class would get confused about that one and accidentally blanked or locked layers, then thought they deleted their work or broke something. 

Next we'll select *Layers->Duplicate Current Layer*. You can double-click that copy where it appears in the panel and name it "Layer 2." Then close the eye on Layer 1, make sure the eye is open on Layer 2, make sure Layer 2 is selected in the panel, and then you can edit that layer. For this alien, we did 5 layers total.

Here's Layer 2:

![Layer 2](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/alien5.jpg?raw=true)

And Layer 5:

![Layer5](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/alien5.jpg?raw=true)

And if we then loop back and forth between Layer 1 and Layer 5, we get an animation like this...

<img src="https://media.giphy.com/media/5tdfm9mdr263RGXKNj/giphy.gif" height="125" width="125" alt="the animation" style="height:125;">

Using *File->Export Png Image*, we open the panel for that under the layers panel. You want to make sure your export area is the page, set your width and height to what you'd want (I'm using 125).  Then you can export each frame by making sure each panel has the eye closed except the one you're exporting, and making sure you change the file name.

**Pro Tip:** One thing that can be confusing is when you use the "Export As" button to set a file name, it doesn't actually save the photo. You still need to click the "Export Button" to save the graphic. And remember that all of these are different than the SVG file that Inkscape uses to hold all these layers.

## Part 2: Enter the Sprite Sheet

Sprite sheets help condense multiple graphics into one file which you can chop back up into the individual images in the game. Why would you want to do this?

If we go look at the [free download of our knight](https://www.gameart2d.com/the-knight-free-sprites.html), Duane, from Lesson 1, Duane has 7 different movements of 10 frames each. That is 70 different files. A browser can download six to thirteen files from one given website at a time. Each of those downloads has time needed to make the connection, download, and then terminate before the next one can start. All of that is added to the time it takes to download the actual file.

All that connection overhead and connection limits create a choke point.

![Chokepoint](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/chokepoint.png?raw=true)



It slows down the loading of your game at the start, slows down the preloading of levels, etc. One big file transmits faster than a lot of little ones, and the speed savings are much bigger than the time it takes for Phaser to chop that file up. So when we put all those sprite files into one, we call it a "Sprite Sheet."

What does a spritesheet look like? Let's look at one we'll use in the game.This was made with an online sprite sheet maker I found that is free and Phaser friendly: [ZeroSprites.com](http://zerosprites.com/).

![Alien Sprite Sheet](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/aliensheet.png?raw=true)

Those are 5 frames of an animation of one of the bad guys in our game, the alien we made above. Notice they're right on top of each other. Some sprite sheet makers will go side to side, some top to bottom, some will try to go more square with multiple rows. I've found that [ZeroSprites.com](http://zerosprites.com/) and their top to bottom sheets were the easiest to get right.

So in the `week3` folder, you'll see a folder called `experiments`, and in that a folder called `sprite-sheet`. Open it.

The index.html is the basic one. But we'll look at our game.js.

```javascript
window.onload = function() {
  game = new Phaser.Game(300, 300, Phaser.AUTO, '', { preload: preload, create: create  });
  function preload(){
    game.load.spritesheet('alien', 'aliensheet.png', 64, 64, 5, 0, 0);
  }
```
It starts like any of the other ones with the `window.onload` creating a 300x300 game board, but in our preload function, we have a new asset type. We've loaded image and audio types, but now we have a spritesheet type. And like the others, you give it a nickname and a pointer to the file in the arguments, but here we have 4 more arguments (and we could have more).

The four arguments after the file name are the width of each frame (in pixels), the height of each frame (in pixels), the number of frames to load, and any margin or padding your spritesheet might have for each frame.

Let's finish up the file.

```  javascript
  function create(){}
     var alien = this.game.add.sprite(30,30, 'alien');
      var wiggle = alien.animations.add('wiggle');
      alien.animations.play('wiggle', 10 ,true)
  }
}
```
In the create function, we add the alien like we would any sprite. But because it's a spritesheet with frames, we can add an animation to it, which we'll name "wiggle." Then we tell the game to play "wiggle" at ten frames per second, and the "true" is for whether it should loop/repeat.

Let's open the index.html for the folder, make sure it's the active document, and click play in Cloud9, then load it up. Everyone do this. What do you see? 

Now, let's look at our alien. We're not moving it, but we are playing its animation frames, so it's "legs" are moving. But they only move in one direction, from left to right, and then reset. Maybe that's a little hard to notice, so let's change 10 to 5 so slow it down by half, and reload.

How can we make it go back and forth? Well, you remember those five frames? They each got a number as they were imported. And because computers start counting at 0, their numbers are 0 - 4.

When we add that named animation, we can specify which frames it includes. So let's change that line, where we define "wiggle."

```javascript
var wiggle = alien.animations.add('wiggle', [1, 2, 3]);
```

We talked about arrays last week in the Memory Tones game. Here we're setting the array of frames to be just 2 - 4. Remember, because we start from zero, one is actually the second frame. Reload and let's look at how that changes things.      

Now we're just seeing the middle of the animation loop. How could we see the whole animation go to one end and back? What would our sequence be? Do you know without peeking below?

```javascript
var wiggle = alien.animations.add('wiggle', [0, 1, 2, 3, 4, 3, 2, 1]);
```

Why don't we include zero at the end? Are we doubling up four in the middle? Because zero will play at the beginning of the next loop, if we put it at the end of the loop, we'll play it twice. 

Try it with the version above, and then add a zero on to the end of the array to see how that changes things.

See how it pauses just a bit at the start? That's because the zero frame is being played twice

#### LAB: ADD MORE ANIMATED SPRITES

There are two more spritesheets in this directory: `ships.png` and `duanesheet.png`. 

Ships has 5 frames, is vertical, and is 64 pixels wide by 180 pixels high. 

Duanesheet has 10 frames, is vertical, and is 104 pixels wide by 125 high.

Add them to the stage and animate them.



## Part 3: Little things, hitting each other

If you've never seen [Time Bandits](https://www.imdb.com/title/tt0081633), I highly recommend it. In it, Ian Holm (playing Napoleon) sums up many video games (clicking the image below will take you to yarn.com to play a short video clip).

[![Time Bandits](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/timebandits.jpg?raw=true)](https://getyarn.io/yarn-clip/5bf075c1-3725-4ddb-91b7-d20fa18a4b91)

In many video games, when a sprite touches another sprite, something is supposed to happen. If a player shoots at the enemy and hits them, we will need to do something about it. So we usually implement whatever was shot at the enemy as a sprite and then we need to detect when sprites touch sprites. These are called "collisions," or as I like to call them: "little things, hitting each other."

Let's go to the `collisions` folder in the `week3\experiments` folder. In this one we have two collision experiments, `index.html` (paired with `game.js`), and `fire.html` (paired with `fire.js`). 

Let's look at game.js...
```javascript
window.onload = function() {
  game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update  });
  ps = {};

  function preload(){
    //pre load our villain and hero
    game.load.spritesheet('alien', '../sprite-sheet/aliensheet.png', 64, 64, 5, 0, 0);
    game.load.spritesheet('duane', '../sprite-sheet/duanesheet.png', 104, 125, 10, 0, 0);

  }

  function create(){
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
```
This is all stuff you've seen before, so no need to step through it in detail. We're adding Duane and the alien to the screen, setting their animations, adding physics, and enabling movement. The alien goes across the screen endlessly and Duane responds to your arrow keys.

Open `index.html` in Cloud9, make it the active tab, and click "Run," then open the resulting URL in the browser. Move Duane up so the alien will run into him. What happens?

The alien passes right over him. Why does it pass over rather than under? Remember, they layer in the order we added them to the game in our `create` function. We added Duane first, then the alien second, so the alien will be on top.

Now let's add collision detection. Under the up/down detection for Duane, add this line.

`this.game.physics.arcade.collide(ps.duane, ps.alien);` 

Now reload and move Duane into the alien's path. What happens when they collide? Basically, the alien stops, and if you move Duane, he pushes the alien, with the alien continuing to move after Duane stops.

We can change this by messing with the game physics, but we'll get more into game physics with the platformer. What concerns us now is handling that collision.

We can add a function to the arguments we pass to the collide function.
```javascript
    this.game.physics.arcade.collide(ps.duane, ps.alien, function(){
        ps.alien.destroy();
    });
```

Reload. Guide Duane to hit the alien. Our alien is gone. 

But it doesn't feel like Duane touched it, really, because what's being measured when they collide is the boxes that would fit around them... the 64x64 pixel box the alien occupies, the 104x125 box Duane occupies. 

We could do really exact polygon maps and use P2 physics to make sure their actual edges have to touch, but that's a bit advanced.

What we can do instead is shrink the body size of Duane and the alien so they'll overlap, but just a little, before they actually "collide." 

Go back up to the right above where set the alien's velocity and we'll add in a couple of lines of code.

```javascript
ps.duane.body.setSize(54, 75, 25, 25);  
ps.alien.body.setSize(44, 44, 10, 10); 
```

We've dropped Duane's width and height by 50 (104 to 54, 125 to 75) and we've set offsets of 25 and 25, so that the smaller body size will be put in the middle, using half off the shrink amount as the offset.

We've done the same to the alien, but by 20, with offsets of 10.

Reload and see how close they come or even overlap. Change the numbers around, save, reload and see how it affects the collision point.

### Next experiment is the fire...

If we open `fire.js`, we'll find it's very similar to the initial file we started for testing collisions, but with a few changes. Let's look at it...
```javascript
window.onload = function() {
  game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update  });
  ps = {};
  ps.projectiles = [];

  function preload(){
    //pre load our villain and hero
    game.load.spritesheet('alien', '../sprite-sheet/aliensheet.png', 64, 64, 5, 0, 0);
    game.load.spritesheet('duane', '../sprite-sheet/duanesheet.png', 104, 125, 10, 0, 0);
    game.load.spritesheet('missile', '../sprite-sheet/missilesheet.png', 8, 18, 4, 0, 0);
  }

  function create(){
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

    // set up input
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    cursors = game.input.keyboard.createCursorKeys();

    //reduce the alien's personal space
    ps.alien.body.setSize(44, 44, 10 ,10 );
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
  }
}
```

One of the differences is that we're adding an array to the `ps` object, called `projectiles`. This array will hold things we're shooting... like the missile sprite sheet we've added.

We've moved the creation of the cursor object up to `create`. I'd seen it in `update` in an example, so I'd thought it had to be there. But creating an object is more work than updating it, which means a potentially slower game. So I tried it in `create` and it worked. I also added a variable 