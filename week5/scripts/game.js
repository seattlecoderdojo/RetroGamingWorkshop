// setting our gameboard dimensions
mgd.MAXWIDTH = 1200; // set maximum width of game board in pixels;
mgd.MAXHEIGHT = 900; // set maximum height of game board in pixels;
mgd.MIN_GAP = 200; // minimum wait between missile fires in 1/1000 of a second
mgd.MAX_MISSILES = 9;
mgd.missile_speed = -800;
mgd.herospeed = 400;
mgd.sfx = []; // an array for our explosions
mgd.highscore = 0;
mgd.levelup = 10; // NEW: how many levels before we should we should increment the multiplier
                  // set to 0 if we shouldn't increment it.
mgd.background = {};
mgd.background_speed = 1.5;

mgd.gamereset = function(){
  // this reset function resets the game, keeping the high score, but putting everything else back to new
  mgd.startspeed = 19.1;
  mgd.levelspeed = mgd.startspeed; //NEW: to help keep track of the last level's start speed
  mgd.curspeed = mgd.startspeed; // NEW: to track in-level speed
  mgd.lives = 3; //NEW to track lives per game
  mgd.dead = 0; //NEW to track how many times you died this game
  mgd.speedup = 1.11;
  mgd.drop = 4;
  mgd.bombspeed = 300;
  mgd.curbombspeed = mgd.bombspeed; // so we can speed up bombs
  mgd.level = 0;
  mgd.levelscore = 1; // NEW: a score multiplier for the enemy values
  mgd.score = 0;
}

mgd.levelreset = function(){
  // this reset function resets only the values that need resetting at the beginning of a new level
  mgd.last_shot = 0; // will hold the time stamp for the last shot
  mgd.missiles_live = 0; // helps enforce max missiles on screen
  mgd.offsetx = 20;
  mgd.offsety = 70; // updated to allow for the score
  mgd.enemycount = 0; // counts how many enemies are on screen
  mgd.level++; // increment the level number
  mgd.levelspeed = mgd.levelspeed * mgd.speedup;
  mgd.curspeed = mgd.levelspeed;
}

//initialize values
mgd.gamereset();
mgd.levelreset();


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
    value: 25, // NEW: how much the enemy is worth
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
    value: 20, // NEW: how much the enemy is worth
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
    value: 10, // NEW: how much the enemy is worth
    sequence: [0, 1, 2, 3, 4]
  }
];

window.onload = function(){
  game = new Phaser.Game(mgd.MAXWIDTH, mgd.MAXHEIGHT, Phaser.AUTO, 'gamediv');

  //adding our states - 'name', then the actual function that handles it.
  game.state.add('load', loadState);
  game.state.add('splash', splashState);
  game.state.add('play', playState);
  //game.state.add('help', helpState);
  game.state.add('over', overState);  

  game.state.start('load');

}