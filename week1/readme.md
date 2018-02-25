# Session 1: Game Basics

In our First Project, we'll learn how to set up a basic Phaser Development and Testing environment.

## Setting up our development environment

We'll be using a remote environment on Cloud9 for our workshop activities.

There are three things about the game development framework and this workshop that makes us want to have a remote development environment for this workshop.

1. This framework requires a server. If we use a development environment that already has a server set up, we don't have to waste time setting it up, and if any of you have an issue, it's easier to debug because you're all using the same environment.
2. Whether you're on your mom's laptop, your own, or one you borrowed from us, the remote environment can be reached from any computer you can use. So you can get to it from a Chromebook at school, a desktop at home, whatever you have.

#### **Signing up for Cloud9**

Cloud9 (c9.io) offers an educational account which CoderDojo chapters can get. If you're another CoderDojo checking out this repository look into it. 

If you're in our CoderDojo, we need your email address to send you an invitation to set up an account and join our "team." We sent an email to you earlier and hopefully you've already accepted the invitation. If not, we'll have mentors in the class ready to send you one. We will budget 20 minutes for this in the workshop.

Students who took the Vim workshop will have these accounts already

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
    var game = new Phaser.Game(500, 500);
You've set up a stage that is 500 pixels high and 500 pixels wide. But you've done it with one line of code. Phaser is doing a lot of work behind the scenes determining what the browser supports and creating a game canvas your browser can work with. It's also built a bunch of infrastructure behind the scenes to manage sounds, images, and more.

### Let's make it do something

The most basic part of any game is to put an image on the screen. Whether it's a spaceship, a pirate, or your super cool logo.

[ basic objects, game states, add an image (preload, position), images (all square, but using transparency allows any shape), make it move in an automated way, make it bounce off the walls, make it go across-out-back-in-other-side, make it respond to input, create a win condition where you guide it to a corner]

