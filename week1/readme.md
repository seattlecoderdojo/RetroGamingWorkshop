# Session 1: Game Basics

In our First Project, we'll learn how to set up a basic Phaser development environment we can code and test games in.

## Setting up our development environment

We'll be using a remote environment on Cloud9 for our workshop activities.

There are two things about the game development framework and this workshop that make it good have a remote development environment for this workshop.

1. This framework requires a server. If we use a development environment that already has a server set up, we don't have to waste time setting it up, and if any of you have an issue, it's easier to debug because you're all using the same environment.
2. Whether you're on your mom's laptop, your own, or one you borrowed from us, the remote environment can be reached from any computer you can use. So you can get to it from a Chromebook at school, a desktop at home, whatever you have.

#### **Signing up for Cloud9**

Cloud9 (c9.io) offers an educational account which CoderDojo chapters can get. If you're another CoderDojo checking out this repository on Github, look into it. 

If you're in our CoderDojo, we need your email address to send you an invitation to set up an account and join our "team." **All the kids who took the Vim Workshop have already done this.** We sent an email to a bunch more of you earlier and hopefully you've already accepted the invitation. If not, the address for requesting an invitation is on the board. We will budget 20 minutes for this in the workshop.

#### Setting Up a Workspace

Once you're signed up, you'll set up a workspace. Give it whatever name and description you want, make sure the team is Seattle CoderDojo, that it's a public hosted workspace (not sure if you get any private ones with your student account). And make sure to clone from the Github repo for this workshop. Copy this URL...

    https://github.com/seattlecoderdojo/RetroGamingWorkshop.git

![setting up the workspace](https://raw.githubusercontent.com/seattlecoderdojo/RetroGamingWorkshop/master/week1/assets/readme/workspace.jpg)

Click the "Create workspace" button and after a minute or two, you'll have a small instance server with the latest version of the workshop files.

Congratulations, your basic development environment is set up.

## Working with Phaser

Phaser is a JavaScript framework that provides functionality to help with many aspects of making games.

The difference between a library and a framework is that a library usually tends to address one specific task... like detecting when two game pieces hit each other. A framework tends to collect/create a number of libraries and manages how they work together for solving more complex problems... like making a game.   

You can see this in the credits in the phaser.js file. It brings together a number of other libraries plus its own elements:

    * Phaser uses Pixi.js for rendering, created by Mat Groves http://matgroves.com @Doormat23
    * Phaser uses p2.js for full-body physics, created by Stefan Hedman https://github.com/schteppe/p2.js @schteppe
    * Phaser contains a port of N+ Physics, converted by Richard Davey, original by http://www.metanetsoftware.com`

Phaser 2.10.1 is in the `scripts` directory of your workspace. Phaser 3 was recently released, but it's still *really* new and there aren't a lot of tutorials for it yet. Much like Python, the 2.x branch isn't going anywhere anytime soon and there's LOTS of stuff for it, so we're going to use it. It's still being maintained. The 2.10.1 release was February 18, a week before our first session of this workshop. 

### The base index.html

Because Phaser is a JavaScript framework, we can do our development with web browsers. The base web page looks like this.

```HTML
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="../scripts/phaser.min.js"></script>
    <script type="text/javascript" src="scripts/game.js"></script>
  </head>
  <body>
  </body>
</html>
```

There's no real content, just loading two scripts. The first script tag loads Phaser. The second loads *your* javascript that you're writing to make a game. Now, since this file is in the `week1` folder, it needs to go up a level to reach the main `scripts` folder, thus the "../" before it. We have the Phaser file in a separate folder, because we'll be using it in all of the projects. Rather than waste many megabytes of disk space duplicating it we keep it in one place and tell all our HTML files where to find it.

Also, because our browser caches files, after we've loaded it once from this place, our browser can load it from the cache and it will make every load of all our games faster. We're also using a minified version to speed up loading. "Minified" JavaScript removes all the space, all the comments, and shortens a lot of the variable and function names to make as small a file as possible, but still have it work the same way as the full-length file.

The full length and the minified files are both in that folder. You'll see that the full length is 3.375 megabytes, but the minified file is just 806 kilobytes. It will send faster over the internet and it will get read and processed faster. This makes the game experience better, even if you're using Phaser in a packaged game where everything is on disk.

### The game.js file

The game.js file for this week is in the `scripts` folder of `week1`. The very basic content is this...

```javascript
window.onload = function() {
  var game = new Phaser.Game(500, 500);
}
```

 

> ### Your first exercise: Run your first Phaser app
>
> Open the index.html file and the game.js file in the code editor inside Cloud9. With the index.html tab active, hover your mouse over the run button above it.
>
> ![getting ready for your first run](https://raw.githubusercontent.com/seattlecoderdojo/RetroGamingWorkshop/master/week1/assets/readme/firstrun.jpg)
>
> Click the "Run" button and Cloud9 will start up the Apache web server and give you a link to the index.html file so you can open the file in your browser.
>
> ![running your app](https://raw.githubusercontent.com/seattlecoderdojo/RetroGamingWorkshop/master/week1/assets/readme/firstrun_server.jpg)
>
> You may get a warning that you're viewing an application preview. That's okay. Click the button and you'll get a screen with a big black box on it. Doesn't do much, does it?



### Why doesn't it do anything?

Why are you just seeing a black box? Because that's all you've asked for so far.
```javascript
var game = new Phaser.Game(500, 500);
```
You've set up a stage that is 500 pixels high and 500 pixels wide. But you've done it with one line of code. Phaser is doing a lot of work behind the scenes determining what the browser supports and creating a game canvas your browser can work with. It's also built a bunch of infrastructure behind the scenes to manage sounds, images, and more.

More importantly you've generated a <u>game object</u>. Perhaps you've heard the term "object oriented programming" or have actually done some, but we'll explain a few concepts quickly.

**Variables** are buckets you can store things in; a number, a word, even a function or object.

**Functions** are discrete pieces of code that do things. As you saw above, we assigned a function that generated this game object to the `window.onload` event.

**Objects** are specialized buckets which contain variables (also called properties when they're in an object) and functions (also known as methods when they're in a method).

### Let's make our empty, actionless game do something

The most basic part of any game is to put an image on the screen. Whether it's a spaceship, a pirate, or your super cool logo.

In `game.js`, we'll create a slightly larger stage. Let's set it to 900 by 700. We'll also add a few more arguments, so our script opens like this.

```javascript
window.onload = function() {
   var game = new Phaser.Game(900, 700, Phaser.AUTO, '', { preload: preload, create: create });
}
```

When you create the game object, you can pass in more arguments than just the height and width. 

The third argument we're passing is the renderer. By choosing Phaser.AUTO we're letting Phaser choose the best available renderer, but we could choose a basic 2D HTML Canvas, WebGL for 3D, etc.

The 4th argument is the game's parent object. In this case, we're passing nothing.

The 5th argument is actually an object. It's written in Object Literal Notation, which is a great way for quickly defining an object. In this simple configuration object, we're telling the game object that the code for preloading will be in a function called "preload," and the code to "create" the game (setting up a whole bunch of its details) will be in a function called "create." 

So, let's create a knight variable that's global to this `window.onload()` function so it can be used by all of the functions in it. Then we'll preload our image by adding a `preload()` function to the `window.onload()` function. And if you're wondering... yes... functions can contain other functions.

```javascript
var knight;

function preload(){
  game.load.image('knight', '/week1/assets/gameart/Walk%20(1).png');
}
```

We're telling it to load an image we'll call "knight" and giving it the location where the image lives. The image is "Walk (1).png," because it's the first frame of a 10-frame walk animation we'll use in our platformer.

To give credit where it is due, we got our knight friend from [gameart2d.com](https://www.gameart2d.com/the-knight-free-sprites.html).  Duane (Sir Duane, actually, but his friends don't have to be formal) might not be as chunky and pixelated as we might hope for retro game art, but since we are living in the future, not everything has to feel like the 80s. We can have a *little* polish on the platformer we'll make later on.

Last, in our "create" function, we'll add the Duane to the game, making our whole game.js file look like this.

```javascript
window.onload = function() {
  var game = new Phaser.Game(900, 700, Phaser.AUTO, '', { preload: preload, create: create });
  var knight;
  
  function preload(){
    game.load.image('knight', '/week1/assets/gameart/Walk%20(1).png');
  }

  function create(){
    knight = game.add.sprite(game.world.centerX, game.world.centerY, 'knight');  
  } 
}
```

To add him, we call the game.add.sprite method, giving it an X coordinate, a Y coordinate, and the image we want to use. For the position coordinates, we're using the centerpoint of the "world" (or the big black box), so he'll be centered.

We can now refresh the screen with that black box in it and we'll see our knight.

### Okay, let's really center him

He's down in the lower right corner. How did that happen? Because the default positioning is to place the top-left corner of the image at that coordinate.

How do we fix it? 

We add one line to the create function, right after where we add the knight sprite.

```javascript
  knight.anchor.setTo(0.5, 0.5);
```
What does that do? That sets the anchor point from top left to halfway down and halfway through... the center of the image. So now Duane's center is at the screen's center.

> The anchor point of an image is where it's "anchored" to the screen. If the anchor point is the top left corner and we were to rotate the image, it would rotate around that point.

Save your `game.js` file.

Now reload your web page and see that Duane is one centered dude.

But just getting an image on the screen is child's play. I can do it with a Sharpie without even turning on the computer. We want him to move.

### Let's move Duane!

If we were writing this game from scratch, we'd now be setting up a game loop with frame animation, setting how many pixels Duane would move per frame, and then redrawing the canvas every frame.

Instead, with Phaser, we just enable Phaser's arcade physics for Duane and give him a little push by adding two lines to the create function. It should look like this.

```javascript
function create(){
  knight = game.add.sprite(game.world.centerX, game.world.centerY, 'knight');
  
  knight.anchor.setTo(0.5, 0.5);
  
  game.physics.enable(knight, Phaser.Physics.ARCADE);
  
  knight.body.velocity.x=150;
}
```

Save your game.js file and refresh the game. What happens?

Duane is moving to your right... and then disappears off the screen. In the universe of the game, he's still going, just not in any part of the game you can see.

### Introducing updates

The `create()` function just sets the stage for the game. The update function is what runs every frame after the game is created and starts running. To keep Duane from disappearing off into the great unseen, we'll need to check where he is, and if he's going off the screen, we can deal with it.

Remember how we had that object in the game object creation that told the game where to find the preload and create code. Let's add a pointer to the update code to it, simply by adding `update: update` to it and creating an update function.

About now, your game.js file should look like this:

```javascript
window.onload = function() {
  var knight;
  var game = new Phaser.Game(900, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update });
 
  function preload(){
    game.load.image('knight', '/week1/assets/gameart/Walk%20(1).png');
  }

  function create(){
    knight = game.add.sprite(game.world.centerX, game.world.centerY, 'knight');
    
    knight.anchor.setTo(0.5, 0.5);
    
    game.physics.enable(knight, Phaser.Physics.ARCADE);

    knight.body.velocity.x=150;    
  }
  
  function update(){    
  }
  
}
```

We can then add one line of code to the `update()` function to turn on world wrapping. 

```javascript
  function update(){
    game.world.wrap(knight); 
  }
```

In simple terms, world wrapping is a set of rules that basically asks "did this image move off the screen," and if it did, it pops it back in on the other side. You can tweak various arguments, but the bare minimum is to simply turn it on for your image. This is another nice thing that the framework handles for you.

It's not perfect though. If you wanted it to wrap precisely, so the moment Duane's sword point went out one side, it started coming in the other, you'd have to cut the wrapping and replace it with some more complex code that actually uses two Duanes.

### More updating fun

Now that we can regularly check for things, what else could we check for? Maybe a keypress to control Duane... like an arrow key? Another thing the framework can do for you is check if a "cursor" key like an arrow is pressed.

So to get the state of the cursors on each update, we can create a `cursors` object in the `update()` function.

    cursors = game.input.keyboard.createCursorKeys();

First we'll set the knight's velocity to 0, so he stands still if we're not pressing a key. Then we can check the cursor object and handle the keys that matter to us.

        knight.body.velocity.x = 0;
        if (cursors.left.isDown)
        {
            knight.body.velocity.x = -150;
        }
        else if (cursors.right.isDown)
        {
            knight.body.velocity.x = 150;
        }

Note how we have a condition for if left is down, then an "else if" for right. That prevents them from competing with each other. If left and right were pressed at the same time, left would win.

### Things to try

Try making Duane move faster or slower. Try making Duane move up and down. Try combining directions so he can move in a diagonal. If you're really feeling adventurous, try Duane's `scale.x` property and `scale.setTo` method to try to change his direction (hint, to flip him, multiply his X scale by -1). You get extra street cred if you Google anything you're stuck on instead of asking a mentor for help.

