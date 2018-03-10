# Week 3 - A Space Invaders Style Game

For week three, we're going to cover a few new concepts. They are sprite sheets, animation, and collisions. What does that mean? We're going to learn a way to put all our game graphics in one image (because it improves performance). We're going to make things not only move, but move while they move. 

And those things are going to hit each other and explode.

**NOTE FOR THE KIDS WHO ARE DOING THIS DURING OUR FIRST ROUND AT DOJO - PULL FROM GITHUB TO GET THE LATEST FILES. IF YOU'RE DOING THIS AFTER MARCH 25, 2018, YOU PROBABLY ALREADY HAVE ALL THE LATEST FILES**

### First, our art - A DO AT HOME PORTION

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

### Enter the Sprite Sheet

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



### Little things, hitting each other

<iframe seamless="seamless" style="width: 100%; border: none; display: block; **max-width: 420px; height: 360px;**" src="https://getyarn.io/yarn-clip/embed/5bf075c1-3725-4ddb-91b7-d20fa18a4b91?autoplay=false"> </iframe>

