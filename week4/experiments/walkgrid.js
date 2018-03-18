var mgd = {}; // variable to hold "my game data" throughout
// setting our gameboard dimensions
mgd.MAXWIDTH = 1200; // set maximum width of game board in pixels;
mgd.MAXHEIGHT = 900; // set maximum height of game board in pixels;
//adding variables to control movement and speed of the grid
mgd.speed = 1.1;
mgd.speedup = 1.07;
mgd.drop = 4;
//move these up from elsewhere in the code for better organization
mgd.offsetx = 20;
mgd.offsety = 20;

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
    sequence: [0, 1, 2, 3, 4]
  }
]

var game = {} // will hold game object

window.onload = function(){
  game = new Phaser.Game(mgd.MAXWIDTH, mgd.MAXHEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update});

  function preload(){
    // load our animated sprites
    game.load.spritesheet('saucer', "../assets/gameart/shipsheet.png", 56 , 32, 5, 0, 0);
    game.load.spritesheet('alien', "../assets/gameart/aliensheet.png", 56 , 56 , 5 , 0 , 0 );
    game.load.spritesheet('rollien', "../assets/gameart/rolliensheet.png", 56 , 56 , 10 , 0 , 0 );
  }

  function create(){
    //might as add a background color better than basic black
    game.stage.backgroundColor = '#28283c';

    //let's create our aliens
    mgd.aliens = game.add.group();
    
    // loop through our grid of aliens
    for(var i = 0; i < mgd.grid.length; i++){
      //get a new alien type
      var alien = mgd.grid[i];
      //loop for the number of columns
      for(var j = 0; j < alien.rows; j++) {
        //loop for the number of aliens to go in each column
        for(var k = 0; k < alien.count; k++) {
          //add an alien to the row, starting at the x offset
          var templien = mgd.aliens.create((mgd.offsetx + (k * (alien.width + alien.hgap))), mgd.offsety, alien.alias);
          templien.animations.add('walk', alien.sequence);
          templien.animations.play('walk', alien.speed, true);
        }
        // increase mgd.offsety
        mgd.offsety += (alien.height + alien.vgap);
      } 
    }    

    // set our minimum and maximum dimensions for the game, then use the
    // SHOW_ALL scale mode to keep the game scaled.
    game.scale.setMinMax(400, 400, mgd.MAXWIDTH, mgd.MAXHEIGHT)
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  }

  function update(){
    // move the horde of aliens
    checkBounds();
    mgd.aliens.x += mgd.speed;
  }

  function checkBounds(){
    var w = mgd.aliens.width;
    var actualX = mgd.aliens.centerX - (w/2);
    if ((actualX  < 0)||(game.width < (actualX + w))){
      mgd.drop = mgd.drop * mgd.speedup;
      mgd.aliens.y += mgd.drop;
      mgd.speed = mgd.speed * -mgd.speedup;
    } 
  }
}

