# Session 2: Making a Memory Tones Game

In this session we will learn about a few JavaScript concepts and dive deeper into Phaser's tools for managing different parts of your game.

For those of you encountering this repository after the workshop is done and all the pieces are in place, you can just clone the repository and have all the game stuff. For those of you in our first run of this workshop, you'll be learning a little Git as we go.

## Introducing the terminal tab and updating our project

Below your coding area, there is a set of tabs where the outputs of processes are displayed and where you also have a terminal tab. This terminal contains the command line for the Linux server that is holding your game. It is the bash shell, so you'll see `bash - "your server name"`. If you don't have that, click the plus symbol next to the tabs and you can open a terminal tab.

![the terminal tab in Cloud9](https://raw.githubusercontent.com/seattlecoderdojo/RetroGamingWorkshop/master/week2/assets/readme/termintro.png)

To get the Week 2 content, you'll use the command `git pull` in the terminal. Your "week2" folder will get downloaded and appear. 

*If you get a merge conflict error* it means you made some changes to your files in your project that conflict with the files on the server. An easy workaround for this is to update with three commands.

```bash
git stash
git pull
git stash apply
```

This stashes any files, pulls down the new stuff, then applies your old stuff so you keep your projects that you've been working on.

## What we're going to make

Around 40 years ago, a game called "Simon" debuted. It was actually a variant on an Atari game called "Touch Me" from a couple of years earlier. It sold for \$24.95 which would be close to \$100 today.

![simon](https://upload.wikimedia.org/wikipedia/commons/9/99/OriginalSimon.jpg)

Each of the four colored panels would light up while it played a sequence of tones. You'd then have to reproduce that sequence. If you made an error, you lost. If you completed the sequence, it would add a light/tone and you'd have to reproduce the new extended sequence. This would go on until you failed or reproduced the longest sequence it offered.

We're going to make this game, but we can't call it Simon, because Hasbro owns that name. We'll call it Memory Tones, because I searched the Trademark Office database and no one owns it.

### What this game will have

To make this game, we'll need... 

- Assets
- An intro screen
- A game screen
- A help screen (to explain the game)
- And code (to make it all work)


## Let's look at our assets

You'll find our button images in the `week2/assets/gameart` folder. They're actually pretty simple. We have four colored buttons in both plain and lit states. We have a "Play" button to start a game and a "?" button (for help). The other text will be done with a Google Web Font. 

The one downside of Google Web Fonts is the game has to download them from Google to get going. If you don't want a bad connection to Google messing up your look or you want to package up the game so it can be played offline, you can download the fonts from Google. This one is called Coiny Regular and it is licensed under the OFL (open font license). We're using it for the "Memory Tones" text below.

![a demo game board](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week2/assets/readme/board_demo.png?raw=true)

Our other important assets in this game will be our sounds. To get them, I went searching online for a MIDI synthesizer and found this doozy. http://www.caseyrule.com/projects/piano/

I experimented with different instruments and notes until I got a combo that I liked. I then recorded the full play time of each of four notes. I did this because it's easier right now to teach you to use some prerecorded sounds than how to build an orchestra into your project and generate all the sounds.

Because as the game speeds up, the sounds get shorter, I needed to either make a bunch of different copies of the sounds, trimmed to different lengths, or I needed to figure out a way to make them play for different amounts of time programmatically. 

Because simply starting and stopping can feel abrupt, I decided to use Phaser's built in functionality to fade in and fade out sounds. Let's look at the code.

You'll find the code in the `week2/assets/sounds/` folder. The `index.html` file is in there just to keep people from looking at the contents of the directory. The important files are `soundtest.html` (which is the one you'll want to run to play it) and `game.js`. The files are in here because they're just for a test and not actually part of the game.

The HTML file is just like the other ones you're used to, except for one thing.

```html
<html>
  <head>
    <script src="../../../../scripts/phaser.js"></script>
    <script src="game.js"></script>
    <style>
      /*
        ADDING OUR CHOSEN DISPLAY FONT HERE IN THE CSS
        If our CSS was more complex, we'd separate it out
        into an external stylesheet. 
      */
      @font-face {
      font-family: "coiny";
      font-style: normal;
      font-weight: 400;
      src: url("../fonts/Coiny-Regular.ttf");
      }
    </style>
  </head>
  <body>
  </body>
</html>
```

Aside from the base skeleton, we've added in a style section. Using CSS we define the font so the browser knows where to load it from, because there's no option to load it directly in Phaser 2.

```JavaScript
var game;

window.onload = function() {
  game = new Phaser.Game(650, 650, Phaser.AUTO, '', { preload: preload, create: create  });
  var music;
  var fadeLength = 0;
```
This is our standard opening, setting up the game object with size, renderer, a few known functions, and a couple of global variables.

```JavaScript
  function preload(){
    //preload the sounds
    game.load.audio('tone1', 'tone1.mp3');
    game.load.audio('tone2', 'tone2.mp3');
    game.load.audio('tone3', 'tone3.mp3');
    game.load.audio('tone4', 'tone4.mp3');
  }
```
Pre-loading the sounds. At this point, it should be pretty much like you remember from last week. We use the game object's load method, but this time with audio. We give it a name for the audio object and the location of the file. Because our test script is in the same folder with the audio files, we can just use the file names.

```JavaScript

  function create(){
    //set the text on the screen to get the font buffering into memory
    this.game.add.text(0, 0, "hack", {font:"1px coiny", fill:"#FFFFFF"});

    //set our tone
    music = game.add.audio('tone1');
	
    /* To have it fade in and out, we add a function for when the fade is 
       complete. The fade in brings the volume to 1. We check if volume 
       is 1. If so, we play the fade out. For a good length the fade out 
       takes twice as long. To ensure that the music stops playing 
       (even though the volume's faded out'), we stop it when the fade
       out happens  */

     music.onFadeComplete.add(function(item,vol){
        if(vol === 1){
        music.fadeOut(fadeLength*2);
      }  else {
        music.stop();
      }
    });

     //we give the text a brief time to load before writing it
    setTimeout(setText,800); 
  }
```
We do a teeny tiny add text just to get the font loading since Phaser 2 doesn't have the best font handling. We set our tone, now that we've loaded it, as a game audio object which is what we'll use for manipulating it.

Now it might seem a little backward, but we need to add some functionality to that audio object which handles when the music fade (in or out) completes. So we're technically putting in code to handle the end of a tone before we put in code to handle the start. The comment in the code explains what we're doing.

And since we couldn't quite pre-load the font, we'll just wait 8/10ths of a second to give it a chance to load. At this point, we call a new function called `setText`. 

```JavaScript
  function setText(){
    // Set a style for the font, similar to CSS
    var style = {font: "45px coiny", fill: "#ffffff"};

    // Apply the text to the screen
    var text1 = this.game.add.text(10,10,"Play Long Sound", style);
    var text2 = this.game.add.text(10,70,"Play Medium Sound", style);
    var text3 = this.game.add.text(10,130,"Play Short Sound", style);

    // Each text item needs to be enabled as an input element 
    // and given a function for what happens when it's pressed
    text1.inputEnabled = true;
    text1.events.onInputDown.add(function(){playMySound(600);}, this);

    text2.inputEnabled = true;
    text2.events.onInputDown.add(function(){playMySound(400);}, this);

    text3.inputEnabled = true;
    text3.events.onInputDown.add(function(){playMySound(200);}, this);
  }
```
We set a style for the text and add three text elements to the screen. We then have to enable them as input objects and set a handler for the events we want to respond to. We want to respond to an "input down" (basically a mouse click or a tap). When that happens, we call `playMySound` with a number as an argument. That number is how many thousandths of a second the fade-in should be (and the fade-out will be double).

```JavaScript
  function playMySound(fade){
     // check if the music is already playing, and do nothing if it is 
     if(music.isPlaying){
        return true;
      }
      // set the global fade length to the value passed in, then fade in.
      fadeLength = fade;
      music.fadeIn(fade);
  }
}
```
Last we have the function that starts the sound playing. First we check to see if it already is, because if it is, we don't want it to start over. We want it to finish before another starts playing. We set the global fadeLength to the fade length we set (so the fade-out knows what value to use) and we start playing with a fade in.

Try changing the tone in the pre-load and the play lengths. About the maximum length you can have is 700 because the tone is about 2.1 seconds long.


## Making our game

Let's go into the main week 2 folder. You'll find the same structure: 

- an index.html file similar to the one we used in the sound test, but even more complex.
- a readme.md file, which is this document you're reading.
- a scripts directory with your game.js file and a few others
- an assets directory with your game art, fonts, and sounds for this game.

#### Let's examine our `index.html` file first

```html
<html>
  <head>
    <script type="text/javascript" src="../scripts/phaser.js"></script>
    <script type="text/javascript" src="scripts/load.js"></script>
    <script type="text/javascript" src="scripts/menu.js"></script>
    <script type="text/javascript" src="scripts/play.js"></script>
    <script type="text/javascript" src="scripts/help.js"></script>
    <script type="text/javascript" src="scripts/win.js"></script>
    <script type="text/javascript" src="scripts/lose.js"></script>
    <script type="text/javascript" src="scripts/game.js"></script>
```
Whoa, what's with all of the .js files? We're going to use Phaser's states functionality to help us track the different game states and we'll use a different file for each state. We don't have to. In fact, all those could go into one file. But by keeping them in different files, it helps us organize our code.

What is a state? The names sort of describe what they do. The menu state displays the menu. The play state is when you're playing the game. And so on...

But why is `game.js` last in the list? It will contain references to all the other states. We need to load it last so all those states are in memory *before* it starts referencing them.

```html
    <style>
      /*
        ADDING OUR CHOSEN DISPLAY FONT HERE IN THE CSS
        If our CSS was more complex, we'd separate it out
        into an external stylesheet. 
      */
      @font-face {
      font-family: "coiny";
      font-style: normal;
      font-weight: 400;
      src: url("../fonts/Coiny-Regular.ttf");
      }
    </style>    
  </head>
  <body>
    <div id="gamediv" style="height:803px;width:700px;padding:0px; margin-left:auto; margin-right:auto;"></div>
  </body>
</html>
```
We've seen the style element in the header from the tones tester. 

The other change we're going to see is the `div` element between the body tags, we've given it some simple styling to make it as tall and wide as our game board and center it in the browser. We'll refer to it again in a moment.

#### Let's drop into the scripts folder 

First we'll look at the code in the game.js file. Although we want the interpreter to load the other files first so it knows they exist, we know that already, so we can look at things in a more logical order.

```javascript
window.onload = function(){
  game = new Phaser.Game(700, 803, Phaser.AUTO, 'gamediv');

  //adding our states - 'name', then the actual function that handles it.
  game.state.add('load', loadState);
  game.state.add('menu', menuState);
  game.state.add('play', playState);
  game.state.add('help', helpState);
  game.state.add('win', winState);
  game.state.add('lose', loseState);

  game.state.start('load');
}
```

This is different from the base skeleton of the "Move Duane" game we made last week. There are no `preload`, `create`, or `update` functions. That's because each state can contain its own. This can be good for a high-end game where levels load independently instead of trying to load everything for all levels into memory at once.

We have six states: 

1. load - we don't have a complex game, so we'll load all our content here.
2. menu - the main screen with options for playing or help
3. play - the state in which the game runs
4. help - the help screen that explains the game
5. win - the screen displayed if the player wins
6. lose - the screen displayed if the player loses

I've already pre-populated this in the files you downloaded. There's no point in making you type or copy them. But note that we add states to the game with `game.state.add`. It takes two arguments. Much like with our sprites or other assets when we're loading them, it takes an alias and a pointer. The pointer is to an object that will be used when the `game.state.start` function is fed its alias.

And speaking of loading sprites, let's take a quick peek at the `load.js` file.

#### **load.js**

``` javascript

    preload: function(){

      // Quick bit of text to let people know the game is loading.
      game.add.text(100,100,'Loading assets', {font: '50px coiny', fill: '#ffffff'});
      
      //let's load our sounds
      game.load.audio('tone1', 'assets/sounds/tone1.mp3');
      game.load.audio('tone2', 'assets/sounds/tone2.mp3');
      game.load.audio('tone3', 'assets/sounds/tone3.mp3');
      game.load.audio('tone4', 'assets/sounds/tone4.mp3');
      game.load.audio('fail', 'assets/sounds/fail.mp3');
      game.load.audio('win', 'assets/sounds/270528__littlerobotsoundfactory__jingle-win-00.mp3');
      
      //let's load our graphics
      game.load.image('panel1', 'assets/gameart/panel1.png')
      game.load.image('panel1-lit', 'assets/gameart/panel1-lit.png')
      game.load.image('panel2', 'assets/gameart/panel2.png')
      game.load.image('panel2-lit', 'assets/gameart/panel2-lit.png')
      game.load.image('panel3', 'assets/gameart/panel3.png')
      game.load.image('panel3-lit', 'assets/gameart/panel3-lit.png')
      game.load.image('panel4', 'assets/gameart/panel4.png')
      game.load.image('panel4-lit', 'assets/gameart/panel4-lit.png')
      game.load.image('playbutton', 'assets/gameart/playbutton.png')
      game.load.image('helpbutton', 'assets/gameart/helpbutton.png')
      game.load.image('background', 'assets/gameart/pixabay-lattice.jpg')
    },

    create: function(){    
        //let's start the menu
        game.state.start('menu');
    }

 }
```

We're loading the tones for our four panels, a failure tone, a win sound, the four panels in plain and lit states, our buttons, and a background for our gameboard. Again, there's no point in me making you type all this in.

But then we get to your `menu.js` file. This is where we're actually starting to put stuff on the screen.

#### **menu.js**

```javascript
var menuState = {    
  create: function(){

  }    
}
```

Basically, we're just creating the menuState object using object literal notation (which we introduced last week). In that object, we're setting up a create method which will be run first as the state is applied to the game. 

When that state is applied, the game stage will be cleared and the loading message removed. So what do we want to do?

If we wanted to change the background color, we could do that. Put the following line inside your `create` function.

```game.stage.backgroundColor = "#FFDD22";```

Try running the index.html file for week 2 and you should see a quick "loading" message on a black background that gets replaced with a garish colored screen.

Obviously, we don't want to use that as our background color and last week a couple of you asked about using images as backgrounds. So I found a free image at Pixabay.org that wasn't horrible and made a background out of it.

To add a background image, we just make it our first sprite. All other sprites will be drawn in the order they're placed, so everything will go on top of it.

` game.add.sprite(0,0,'background');`

Now we start adding other elements. First our title.

```javascript
var title = game.add.text(20,10,'Memory Tones', {font: '70px coiny', fill: '#ffffff'});
title.x = (game.width - title.width)/2;
```

When we use the `game.add.text` function, it creates a text object and gives us back a pointer for that object. In the load screen, we didn't put a `var title =` in front of it the line adding the text, because we weren't going to do anything with it. But here we're doing something... centering the text.

We do this by changing the title's x position to the game's width, minus the title text's width, divided by two. And since this is done programmatically, we can change the size of the text and experiment with the size of our title. Add those lines to your `create` and see what happens when you change the size of the text from 70px to whatever you want. It should stay centered.

Change it back to 70px when you're ready to move forward.

Next we'll add our "Play" and "Help" buttons. Again, we'll position them mathematically. That way if you want to change your background or the size/shape of the board, you'll get a better look.

```
   //set our button top position as 20px below the title
   var buttontop = title.y + title.height + 20;
   
   //set a value of px between the edges of the buttons
   var midbuffer = 50;
   
   //add the buttons to the game
   play = game.add.sprite(20, buttontop , 'playbutton');
   help = game.add.sprite(0, buttontop , 'helpbutton');

   //get the centering for the buttons with their spacing
   var sidebuffer = (game.width - (play.width + help.width + midbuffer))/2;
   
   //reposition the buttons
   play.x = sidebuffer;
   help.x = sidebuffer + play.width + midbuffer;
```

By adding the width of the two buttons and the spacing between them, we can center them as a group.

Add this code to your `create` function. When you run it, you'll see the buttons added to your game board. 

You can change the `midbuffer` value to see how changing the space between the buttons changes the look of the game board.

Next, we sort of turn the buttons on, by setting their `inputEnabled` property to true, then setting a handler to do something when they're clicked, just like we did for the sound demo. But this time, the action will be loading a new stage.

```       javascript
//make them clickable!
play.inputEnabled = true;
help.inputEnabled = true;

//handle their clicks
play.events.onInputDown.add(function(){
	game.state.start('play');
}, this);

help.events.onInputDown.add(function(){
	game.state.start('help');
}, this);
```

Let's go look at the help state, because it's going to be easier than the play state.

#### **help.js**

```javascript
var helpState = {
    
   create: function(){
        // since we'll duplicate a bunch of the menu state, we'll just run its create function
        menuState.create();
        
        // Then we'll make a box to put the instructions in
        var graphics = game.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 1);
        graphics.beginFill(0x222222, 1);
        graphics.drawRect(50, 250, 600, 500);
        graphics.endFill();
        
        var instructions = "The game will light up boxes and play sounds in a sequence. When it's done, click those boxes to make those sounds in the same order. Each turn will have a longer sequence of boxes. \n\nGood Luck."
        
        var style = { font: '28pt Coiny', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 560 };
        var helptext = game.add.text(70, 270, instructions, style);
    }    
}
```

Just like the other states, we create an object with it's name and then put functions in it.  But since we're just basically duplicating the menu screen with some instructions, we can literally just call the `menuState` object's `create` function to do all that work.

The `graphics` object lets us draw a box. We set the style for the outer line, set a fill color, draw a rectangle, and end the filling process. Now we have a nice big dark grey rectangle for our help text to go in.

We set the instruction text in a string, then set the style for the text. As you can see, we're adding a few elements to the style. We're setting an alignment, making sure it wraps instead of running off the right side of the screen, and telling it at what width it should wrap.

And because we used the menu's creation code, we've still got the "Play" and "Help" buttons enabled.

So next, we do our `playState` .

#### play.js

