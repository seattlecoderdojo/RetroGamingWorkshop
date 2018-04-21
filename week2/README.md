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

The four colored panels would light up while it played a sequence of tones, each matching a tone. You'd then have to reproduce that sequence. If you made an error, you lost. If you completed the sequence, it would add a light/tone and you'd have to reproduce the new extended sequence. This would go on until you failed or reproduced the longest sequence it offered.

We're going to make this game, but we can't call it Simon, because Hasbro owns that name. We'll call it Memory Tones, because I searched the Trademark Office database and no one owns it.

### What this game will have

To make this game, we'll need... 

- Assets
- An intro screen
- A game screen
- A help screen (to explain the game)
- And code (to make it all work)


## Let's look at our assets

You'll find our button images in the `week2/assets/gameart` folder. They're actually pretty simple. We have four colored buttons in both plain and lit states. We have a "Play" button to start a game and a "?" button (for help), and their text is part of the graphic. The other text for titles and messaging will be done with a Google Web Font. 

The one downside of Google Web Fonts is the game has to download them from Google to get going. If you don't want a bad connection to Google messing up your look or you want to package up the game so it can be played offline, you can download the fonts from Google. This one is called Coiny Regular and it is licensed under the OFL (open font license). We're using it for the "Memory Tones" text below.

![a demo game board](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week2/assets/readme/board_demo.png?raw=true)



The image above is just a "simulation" I made before even coding the game. In the end, it came out a *little* different.

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

Aside from the base skeleton, we've added in a style section. Using CSS we define the font so the browser knows where to load it from, because there's no option to load it directly in Phaser 2. Phaser's standard behavior with fonts is to use fonts already installed on the system. So by loading it with CSS, the browser treats it like a system font closely enough to trick Phaser into treating it like one.

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

Let's go into the main `week2` folder. You'll find the same structure as `week1`: 

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

This is different from the base skeleton of the "Move Duane" game we made last week. There are no `preload`, `create`, or `update` functions. That's because each state can contain its own. This can be good for a more complex game where levels load independently instead of trying to load everything for all levels into memory at once.

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
      game.load.audio('panel1', 'assets/sounds/tone1.mp3');
      game.load.audio('panel2', 'assets/sounds/tone2.mp3');
      game.load.audio('panel3', 'assets/sounds/tone3.mp3');
      game.load.audio('panel4', 'assets/sounds/tone4.mp3');
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

I will point out that the sound with the really long filename is from freesound.org and provided there by Little Robot Sound Factory under a CC3.0 Attribution license.

And then we get to your `menu.js` file. This is where we're actually starting to put stuff on the screen.

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

When we use the `game.add.text` function, it creates a text object and gives us back a pointer for that object. In the load screen, we didn't that pointer in a variable, because we weren't going to do anything with it. But here we're doing something... centering the text. Therefore we want to store a pointer to the text object.

We can then center the text by changing the title's x position to: 

- the game's width
- minus the title text's width
- divided by two. 

And since this is done programmatically, we can change the size of the text and experiment with the size of our title. Add those lines to your `create` and see what happens when you change the size of the text from 70px to whatever you want. It should stay centered.

Change it back to 70px when you're ready to move forward.

Next we'll add our "Play" and "Help" buttons. Again, we'll position them programmatically. That way if you want to change your background or the size/shape of the board, you'll get a better look.

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

Next, we turn the buttons on, by setting their `inputEnabled` property to true, then setting a handler to do something when they're clicked, just like we did for the sound demo. But this time, the action will be loading a new stage.

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

Like the other states, we create an object with it's name and put functions in it.  But since we're basically duplicating the menu screen and adding some instructions, we can simply call the `menuState` object's `create` function to do all that work.

The `graphics` object lets us draw on the game stage. We set the style for the outer line of what we'll draw, set a fill color, draw a rectangle, and end the filling process. Now we have a nice big dark grey rectangle for our help text to go in.

We set the instruction text in a string first, because it makes that much text a little easier to manage, then we set the style for the text. As you can see, we're adding a few elements to the style. We're setting an alignment, making sure it wraps instead of running off the right side of the screen, and telling it at what width it should wrap.

And because we used the menu's creation code, we've still got the "Play" and "Help" buttons enabled.

So next, we do our `playState` .

#### play.js

And here's where the magic happens. The game. Because it's complex, I'm not going to make you cut and paste bits in progressively. There's too much chance for you to accidentally miss a bracket in the pasting. We're just going to look at the pieces and understand what they do.

First thing to note is that we start off with `init` instead of `preload`. The first function in a state that gets run is `init`, even before preload. We'll put some initialization variables in there, the comments explain them. 

You'll note the use of the keyword `this` in there. It can refer to the function it's in or the object holding it, depending on how things are being built. In this case, it refers to the object holding it. 

```javascript
var playState = {
    
    //Set some game state variables

    init: function(){
        this.myTurn = true;
        this.myDelay = 300; // initial time between played tones
        this.myTimeout = 2980; // initial timeout (time allowed between tiles)
        this.myFade = 440; // initial fade in/out length
        this.speedDrop = 40; // each round, the fade gets this much shorter
        this.tones = []; // holds the sounds
        this.panels = []; // holds the panel images
        this.gameTracker = []; //holds the current sequence
        this.toneCounter = 0; // counts through tones played
        this.label= {}; // holds the graphic object with the message
        this.sprite_size = 300; // size of panels
        this.deathClock = {}; // holds the timeout object
        this.maxTones = 4; // this is the maximum number of tones in a game
        this.myTimeout = 2500;
        this.gameTracker = [];
    },
```
Now we get to our `create` function. We'll set up our board with the background and title again.

An array is like a supervariable that holds other variables in slots that have names or numbers. We created some empty arrays in the initialization, and we'll fill them with our panel graphics and tones to help keep everything organized for later use.

```javascript
    create: function(){

         game.add.sprite(0,0,'background');
         
         //add the title
         this.title = game.add.text(20,10,'Memory Tones', {font: '70px coiny', fill: '#ffffff'});
         this.title.x = (game.width - this.title.width)/2;

        //add the boxes into an array
        this.panels["panel1-lit"] = game.add.sprite(45, 180, 'panel1-lit'); 
        this.panels["panel1-lit"].width = 300; 
        this.panels["panel1-lit"].height =300; 
        
        this.panels["panel1"] = game.add.sprite(45, 180, 'panel1'); 
        this.panels["panel1"].width = 300; 
        this.panels["panel1"].height =300; 
                
        this.panels["panel2-lit"] = game.add.sprite(355, 180, 'panel2-lit'); 
        this.panels["panel2-lit"].width = 300; 
        this.panels["panel2-lit"].height =300; 
        
        this.panels["panel2"] = game.add.sprite(355, 180, 'panel2'); 
        this.panels["panel2"].width = 300; 
        this.panels["panel2"].height =300; 

        this.panels["panel3-lit"] = game.add.sprite(45, 490, 'panel3-lit'); 
        this.panels["panel3-lit"].width = 300; 
        this.panels["panel3-lit"].height =300; 
        
        this.panels["panel3"] = game.add.sprite(45, 490, 'panel3'); 
        this.panels["panel3"].width = 300; 
        this.panels["panel3"].height =300; 

        this.panels["panel4-lit"] = game.add.sprite(355, 490, 'panel4-lit'); 
        this.panels["panel4-lit"].width = 300; 
        this.panels["panel4-lit"].height =300; 
        
        this.panels["panel4"] = game.add.sprite(355, 490, 'panel4'); 
        this.panels["panel4"].width = 300; 
        this.panels["panel4"].height =300; 

        //set our audio sprites in an array
        this.tones["panel1"] = game.add.audio('panel1');
        this.tones["panel2"] = game.add.audio('panel2');
        this.tones["panel3"] = game.add.audio('panel3');
        this.tones["panel4"] = game.add.audio('panel4');
        this.tones["fail"] = game.add.audio('fail');
        this.tones["win"] = game.add.audio('win');
```
As before, we need to set each panel to be clickable and set a handler for that click. Just to be on the safe side, as we move through our array, we'll make sure the item we're dealing with has the structure we need. That way an unexpected item is less likely to cause an error and break the game.

```javascript
        // set our panels active
        for(var element in this.panels){
           if(this.panels[element].hasOwnProperty('events')){
               this.panels[element].inputEnabled = true;
               this.panels[element].events.onInputDown.add(this.panelClick,this);
             }
        }
```
We do something similar with the rones, but here, we run a function to set up the fade-in/out handler for each tone. It helps us keep the code more readable if we split out that work into a function.

```javascript
       // set stops on our tones
        for(var element in this.tones){
            //make sure the element is an audio sprite
           if(this.tones[element].hasOwnProperty('isPlaying')){
              //run the addFade function on the tone
               this.addFade(this.tones[element]);
             }
        }


        this.startTurn();  
    },
```
When it's all completed, we run the `startTurn` function, which really launches the game. It checks whose turn it is, adjusts a few things, and then starts the appropriate mechanisms for that turn.

```javascript
    startTurn: function(){
        
        if(this.myTurn){ // check if it's the computer's turn
            this.myFade -= this.speedDrop; // makes each sequence play notes shorter
            this.myDelay *= .9166666; // shortens delay by 1/12th of current delay
            this.setLabel("I'll play some sounds");
            this.playNextSequence();
        } else { // it's the player's turn
            this.myTimeout *= .9366666; // reduce the amount of time the player has to click/tap a panel
            this.setLabel("Now Your Turn");
            this.startPlayerTurn();
        }
        
    },
```
The `playNextSequence` function manages adding a tone to the sequence and then playing them all in order. 

```javascript    
    
    playNextSequence: function(){
        // generate a random number between 1 and 4
        var newTone = Math.floor((Math.random() * 4) + 1);
        // add it to the tracking array
        this.gameTracker.push("panel" + newTone);

        //play the sequence()
        this.toneCounter = 0; // initialize the sequence tracking counter
        setTimeout(this.playNextTone, this.myDelay);
    },
```
Now here, in `playNextTone`, you see I'm setting a variable to represent the `playState` object instead of using `this`. Why?

When `playNextTone` is called by the timeout, it sort of exists outside of the `playState` object and in a special bubble created by the timeout. For that reason, it thinks `this` means that bubble, not `playState`. For that reason, we have to give it a little help.

```javascript

    playNextTone: function(){
       var ps = playState; // use ps because setTimeout changes the context of "this"
        if(ps.toneCounter < ps.gameTracker.length){ // are there tones left to play
            var tonekey = ps.gameTracker[ps.toneCounter]; 
            ps.panels[tonekey].moveDown(); // move the solid panel under the lit
            ps.toneCounter += 1;
            ps.playTone(tonekey);
        } else {
            ps.myTurn = false;
            ps.startTurn();
        }
    },
    
```
The comments explain what happens here. But why do we start a "death clock?" Because at this point, the game is waiting for the player to click panels and play tones until they complete reproducing the sequence that was just played.

There has to be a certain amount of time where it's been waiting long enough. That's the death clock. If it runs out, the game ends.

```javascript    
    startPlayerTurn: function(){
        this.toneCounter = 0; // initialize the sequence tracking number
        // the deathClock is a timer that will automatically end the game
        // if you wait too long to click a panel
        this.deathClock = setTimeout(this.gameFail, this.myTimeout);
    },
    
  
    setLabel: function(labelText){
        if(this.label.hasOwnProperty('blendMode')){ 
            // ^^^ check if there's a text object in the label
            this.label.destroy(); // clear the label
        }
        this.label = game.add.text(10, this.title.height + 20, labelText, {font: '40px coiny', fill: '#ffffff'})
        this.label.x = (game.width - this.label.width)/2;
    },

```
This is the function that handles when the player clicks on a panel. The first thing it does is check to make sure no other sounds are playing and that it's the player's turn. If those conditions aren't met, it shows a message in the diagnostics console, but otherwise ignores the click.

At this point, it runs the `goodTone` function (right below it) to determine if the click it got is the right one for the sequence. If not... game over. If so, it uses the `moveDown` method to move the solid panel under the lit one and starts the fade in on the tone.

```javascript
    panelClick: function(e){
        // this.checkSounds makes sure nothing's playing
        if((!this.checkSounds()) && (!this.myTurn) ){ 
            // if it's not the machine's turn and nothing else is playing
            if(this.goodTone(e.key)){
                // ^^^ check to make sure the tone's the right one
                // we hit a good tone, stop the deathClock... for now
                clearTimeout(playState.deathClock);
                this.panels[e.key].moveDown(); // move the solid panel under the lit
                this.playTone(e.key);
            } else {
                this.gameFail();
            }
        } else {
            // you've clicked a panel, but that click is rejected
            console.log('Either something is playing or it is not your turn.')
        }
    },
  
    goodTone: function(key){
        if(key == this.gameTracker[this.toneCounter]){
            //advance the counter and confirm
            this.toneCounter += 1;
            return true;
        } else {
            return false;
        }
        
    },
```
Like we saw for the panel click, this is the function for starting the tone when it's the computer's turn. Now, the computer should never try to start a tone while something else is playing, but just to be careful we make sure with `checkSounds`.

Then it's pretty simple. We fade in the tone.

```javascript
  
    playTone: function(name){
        // check if anything is already playing, and do nothing if it is 
        if(this.checkSounds()){
            return true;
         }
       // set the global fade length to the value passed in, then fade in.
        this.tones[name].fadeIn(this.myFade);
    },
```
Now we get to the fade-in/out handler mentioned when we were setting up the tones. This does a lot of magic attached to each tone.

It adds a function to be run when a fade ends. The function first checks if it's a fade-in or fade-out based on the volume which is passed to the function along with an object identifying the item when the fade completes.

If it's at full volume, it simply starts the fade-out.

It's when it fades out that we need to do a lot of things. We first make sure the playing is stopped (and not just at 0 volume). Then we move the solid panel image up above the lit panel image.

If it's the computer's turn, we just send it back to the sequence manager with a timeout creating a little delay between tones.

If it's the player's turn, we check 3 things...
* did you win the whole game, then start the win state
* did you simply complete the current sequence, then start the computer's next turn
* did you simply have a correct tone, then start the death clock and wait for another tone

```javascript    
        
    addFade: function(tone){
      //add a function to run when a fade in or out completes on this tone
      tone.onFadeComplete.add(function(item,vol){
        if(vol === 1){ // if at full volume (fade-in completed), start fade-out
          tone.fadeOut(playState.myFade * 2);
      } else {
          //fade out is completed
          tone.stop(); // make sure the done is stopped
          playState.panels[tone.key].moveUp(); //move solid panel back above the lit
          if(playState.myTurn){ // if it's the computer's turn, keep playing sequence
              // play the next tone in the sequence
              setTimeout(playState.playNextTone, playState.myDelay);
          } else {
              //players turn: check win conditions and set death clock
              if(playState.toneCounter == playState.maxTones){
                  //they completed the full length sequence set by maxTones and won the game
                  playState.tones["win"].play(); // play the winning sound
                  game.state.start('win'); // start the win state
              } else if (playState.toneCounter == playState.gameTracker.length){
                  // if they completed the current sequence, but it was shorter than maxTones
                  // start a new turn for the computer which will add a tone to the sequence
                  playState.myTurn = true;
                  playState.startTurn();
              } else {
                  // start the deathClock waiting for the next tone
                  playState.deathClock = setTimeout(playState.gameFail, playState.myTimeout);
              }
            }
        }    
    })
    
  },
```
These last two bits are functions we discussed earlier. One loops through the tones array and checks if any are playing.

The other ends the game because the player made a mistake or let the death clock run out.

```javascript    
    checkSounds: function(){
        //runs through all the tones in our array and makes sure none is playing
        var mydef = false;
        for (var i in playState.tones){
            if(this.tones[i].hasOwnProperty('isPlaying')){
                if(this.tones[i].isPlaying){
                    mydef = true;
                }
            }
        }
        return mydef;
    },
    
    gameFail: function(){
        // what happens when you lose
        clearTimeout(playState.deathClock); // just in case the fail is a wrong tile
        console.log('game failed');
        playState.tones["fail"].play();
        game.state.start('lose');
    }
}
```

We'll skip walking through the win and lose files, because they are simply copies of the help state but with different text. 

And that's the game.

Think about some ways you could make it harder?

Could you make the panels play different sounds every time, but require the player to click the panels in the same sequence? 

Could you change how fast it starts, how fast it speeds up, how many panels are in the sequence at the start? 

Could you shuffle the positions of the panels after each turn, so the player has to remember the color sequence, because the positions keep changing?

Could you add more panels and tones?

Have fun.

[Try the playable demo.](https://yiddish.ninja/games/memorytones/)

