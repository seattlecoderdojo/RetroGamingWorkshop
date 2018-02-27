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

- An intro screen
- A game screen
- The necessary game art
- And code!



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

