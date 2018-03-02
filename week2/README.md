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

```JavaScript {.line-numbers }
var game;

window.onload = function() {
  game = new Phaser.Game(650, 650, Phaser.AUTO, '', { preload: preload, create: create  });
  var music;
  var fadeLength = 0;

  function preload(){
    //preload the sounds

    game.load.audio('tone1', 'tone1.mp3');
    game.load.audio('tone2', 'tone2.mp3');
    game.load.audio('tone3', 'tone3.mp3');
    game.load.audio('tone4', 'tone4.mp3');
  }

  function create(){
    //set the text on the screen to get the font loading
    this.game.add.text(0, 0, "hack", {font:"1px coiny", fill:"#FFFFFF"});

    //set our tone
    music = game.add.audio('tone1');
	
    /* To have it fade in and out, we add a function for when the fade is 
       complete. The fade in brings the volume to 1. We check if volume is 1.
       If so, we play the fade out. For a good length the fade out takes twice 
       as long */

     music.onFadeComplete.add(function(item,vol){
        if(vol === 1){
        music.fadeOut(fadeLength*2);
      }
    });
	
     //we give the text a brief time to load before writing it
    setTimeout(setText,800); 
  }

  function setText(){
    // Set a style for the font, similar to CSS
    var style = {font: "45px coiny", fill: "#ffffff"};

    // Apply the text to the screen
    var text1 = this.game.add.text(10,10,"Play Long Sound", style);
    var text2 = this.game.add.text(10,70,"Play Medium Sound", style);
    var text3 = this.game.add.text(10,130,"Play Short Sound", style);

    // Each text item needs to be enabled as an input element and given a function for what happens when it's pressed
    text1.inputEnabled = true;
    text1.events.onInputDown.add(longSound, this);

    text2.inputEnabled = true;
    text2.events.onInputDown.add(mediumSound, this);

    text3.inputEnabled = true;
    text3.events.onInputDown.add(shortSound, this);
  }

  function longSound(){playMySound(600);}
  function mediumSound(){playMySound(400);}
  function shortSound(){playMySound(250)};

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
And since you already learned the basics of putting a picture on the screen, we'll take a moment to go through a simple game I coded up the other day.






## A quick refresher

Let's go into the week 2 folder. You'll find the same structure: 

- an index.html file that's the same as last week's and loads the game.js folder
- a readme.md file, which is this document you're reading.
- a scripts directory with your game.js file
- an assets directory with gameart and readme directories
  - the readme directory contains the graphics used in this document.

Let's look at the code in the game.js file

```javascript
window.onload = function(){
  var game = new Phaser.Game(900, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update });

  function preload(){

  }

  function create(){

  }

  function update(){

  }

}
```

This is the base skeleton of the "Move Duane" game we made last week. Not much of a game, but we'll get into some more game mechanics to make games more fun as we move along.

States:

​	Boot

​	Loading

​	Pending

​	Play

​	Instructions

​	Game Over


