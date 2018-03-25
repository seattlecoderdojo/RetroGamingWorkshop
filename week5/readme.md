# Week 5 - Finishing Dojo Invaders

For my personal project, I chose the name "Alien Shootz."

![the splash screen](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week5/assets/readme/splash.jpg?raw=true)

Since last week, I've added:

- Scoring (including different scores for each alien)
- Dropping bombs (which you can shoot)
- Level and game resets (more on that soon)
- Collisions between the aliens/ship and bombs/ship
- Moving star field background

Things I brought back from our memory tones game:

- Game states
- Custom fonts
- A start/splash screen
- A "game over" screen

Things I'd have liked to do, but there wasn't time:

- Add bunkers
- Have bombs and missiles take pieces out of the bunkers
- Clean up the code a little more and improve the comments


So how do we go through this? File by file, feature by feature?

Let's start with the part that you're probably most interested in...

## How did you do the scrolling background?

This is probably one of the easier things. Phaser actually has some built-in goodness to handle this for you. Let's go to the code.

First, we create two star field images that are sized exactly to our game screen. One has the background color I'd originally chosen for the game, one has a transparent background. That way the transparent one can be overlaid on the other. 

Alternatively, you could do both with transparent backgrounds and just overlay them on the background color of your choice. 

We load them in our loading state the way we would any other image.  

*`load.js`*

```javascript
    game.load.image('starfield', "assets/gameart/starfield.png");
    game.load.image('starfield2', "assets/gameart/starfield2.png");
```

To then get them moving we add them to the state where we want them by setting them up as a `tileSprite`, then literally by moving them.

The `tileSprite` type automatically wraps, so if it's the same size of the screen and moved in any direction, it will just wrap. This isn't the best option for all backgrounds, but it can be useful in many cases.

For our splash screen (the one with the title), we're adding and moving both images. Something interesting to note is that we're only moving one of them sideways. If you're just watching casually, the bigger spots and little spots seem to be moving toward each other. But if you watch carefully, the bigger spots are moving straight down. There's no sideways motion.

*`splash.js`*

```javascript
//in create
  mgd.background = game.add.tileSprite(0 , 0 , 1200 , 900 , 'starfield');
  mgd.background2 = game.add.tileSprite(0 , 0 , 1200 , 900 , 'starfield2');

//in update
  mgd.background.tilePosition.y += mgd.background_speed - .5;
  mgd.background.tilePosition.x += .5;
  mgd.background2.tilePosition.y += mgd.background_speed;

```

Then in `play.js` we're just doing the first background to keep everything from being too distracting.

### Lab time

If you've got the `week5` directory loaded up in Cloud9, open the scripts folder. You can edit the base speed in the `game.js` file. You can edit the background updates in the `splash.js` or `play.js` files to see how that changes the background.

**Something to think about (but not try to do right now)** - If you were trying to scroll a much longer background, but keep it repeating, what would be a way to do it without using the tileSprite mechanisms?

## Those titles are WAY cooler than in Memory Tones

For our splash screen titles, I added a few techniques besides just putting some text on the screen and centering it. Let's go to the code...

```javascript
//create
    var title = game.add.text(20,10,'Alien\nShootz', {font: '220px bitwise', fill: '#CDCDCD', align: 'center'});
    title.x = (game.width - title.width)/2;
    title.y = (game.height - title.height)/2;
    title.alpha = .6;
    title.lineSpacing = -50;
    title.setShadow(6, 6, 'rgba(0,0,0,.6)', 5);
```

Let's break this down. First, we're doing multiline text, by using the newline indicator (`\n`) in between the words. We're also adding `align: 'center'` to the text properties, so the words are centered against each other. 

We then center this text item, by setting its X and Y coordinates to be 1/2 of the game width minus the text item's width. If you remember from week 1, we can also do this by setting the text item's positioning to the game center, then setting the text item's anchor to its middle. I do it this way because I like doing the math.

We set the text item's `alpha` property, which is how opaque (not see-through) it is. Setting 1 would make it completely opaque (not see through) and 0 would make it completely transparent (so see-through you can't see it). I've set it at .6 to show the stars passing behind it, but just a little.

The `lineSpacing` property changes the vertical spacing between the lines. I'm using a negative value because I want them to appear closer together.

Then I use the text item's `setShadow` method to set a semi-transparent drop shadow. The first two values are the horizontal and vertical offsets. The offsets here push it 6 pixels to the right and 6 pixels down. We could also use negative values to move it left and up. The next argument `'rgba(0,0,0,.6)'` sets the red, green, blue, and alpha values.  The zeros make it black, the .6 is the same as our title. The last value is the blur amount.

### Lab time

Play with the `setShadow` arguments. What happens when you change the offsets, the blur, the alpha value?



## Adding the scoring

We've already seen how to place and update text in the Memory tones game, so I won't go over it here. 
What I will do is talk about how to keep score, and this will also lead into how to handle levels.

##### *`game.js`*

In prior variations of this, we had a lot of values, but some of these have been moved into `mgd.gamereset` and `mgd.levelreset` functions.

The values in the main area are ones we expect will never change or that we will never want to reset for the duration of the game. So the height, width, number of missiles allowed on screen, minimum wait between firing them, etc.

In the `mgd.gamereset`, we reset only the things we'll reset to start a new game, like the score. 

As we go down into our alien grid, I've added a new property to each alien... it's value. This will become important momentarily.

##### *`play.js`*

```javascript
//create 
 mgd.scoreshow = game.add.text(20,20, "SCORE: " + mgd.score , {font: '30px pcsenior', fill: '#EEE'});
...
mgd.loadGroups();
```

So we add our score text to the screen of the game. That's about it for the `create` section, except that we've moved out all our alien and missile creation to a `mgd.loadgroups` function. This is important because we're going to need to recreate our alien grid over and over again, so it's good that we're breaking it out into a function that we can use again and again.

In the `mgd.loadGroups` function, it's pretty much the same as last week, except for two things. In the grid creation, we've added `templien.scoreval = alien.value;`. This will add the value from the alien/rollien/ship's grid definition to the sprite's properties.

We'll also note that we've added functions to create a sprite group for the bombs, which is basically the same as the one for the missiles except it's not keeping track of how many are on screen.

We've added two lines to the `mgd.collisionHandler` function. 

```javascript
  mgd.score += alien.scoreval;
  mgd.updateScore();
```

That `scoreval` property we added to the alien just became useful. Since we get the object for the alien that was hit (so we can remove it from the screen), we can also grab its `scoreval` property. The `updateScore` function just updates the text item being held in `mgd.scoreshow` the same way we updated in the Memory Tones game in week 2.

Later, when we end the game, we'll check to see if the score is larger than the high score, and update accordingly.

## Those resets, though

Seemed so hard. Now that we put the grid-making in a function and created a function to handle resetting the necessary values... resetting to go to the next level is two calls...

```javascript
mgd.levelwin = function (){
  mgd.levelreset();
  mgd.loadGroups();
}
```

Now, if you wanted to, you could add a level indicator up in the scoring line and add some code to increment a level counter.

And after the hero dies and you get kicked out to the `over` state, then to the splash `state` after 5 seconds, the game and level resets are part of the code that runs when you hit the space bar to start.

## Dropping rhymes... no, dropping bombs

This ends up being not much harder than missiles. You literally create the bombs group and send bombs flying the same way as you do missiles. There are three differences...

- The bombs don't collide with the aliens, but can collide with both missiles and the hero.
- The bombs are dropped based on a timing formula instead of user input
- The bombs are worth 5 points if a missile destroys them

I'm running short on write-up time, so the places to look for how this is done...

- `loadGroups` where we create the bombs like the missiles
- `update` where we add collision detection for the bombs with the hero and with the missiles
- `update` where we increment the `bombcounter` which tracks how long it's been between bombs
- `update` where, if it's been long enough and we're not below the minimum interval, we do a coin-flip (generate a random number that will be 0 or 1) to see if we reduce the interval between bombs, drop a bomb, and then if it's not at max speed, we up the speed on the next one by just a little bit.
- `mgd.dropABomb` where we pick a random enemy from the ones still in the grid, then drop the bomb from its location. Note we have to use the alien's `worldPosition` to get its real position on screen, as its straight-up X and Y are the ones it had when it was first placed in the grid.
- `mgd.heroDie` is used to handle both when the aliens hit the hero or a bomb hits the hero.
- `mgd.dualHandler`  is used for when a bomb and a missile collide. It replaces both with explosions, takes them off screen, and ups the score by 5.

And that's it. I have to get ready to come to Dojo. Thanks for sticking with this for 5 weeks. Suggestions to make it better are appreciated.



## A parting thought

If you want to keep learning about Phaser, Emanuele Feronato has written [a lot of great tutorials](http://www.emanueleferonato.com/category/phaser/).