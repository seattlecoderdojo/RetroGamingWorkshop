var winState =  {
    
  create: function(){
              // since we'll duplicate a bunch of the menu state, we'll just run its create function
          menuState.create();
          
          // Then we'll make a box to put the instructions in
          var graphics = game.add.graphics();
          graphics.lineStyle(2, 0xFFFFFF, 1);
          graphics.beginFill(0x222222, 1);
          graphics.drawRect(50, 250, 600, 500);
          graphics.endFill();
          
          var instructions = "You WON!\n\nYou got " + playState.maxTones + " tones.\n\nWanna play again?"
          
          var style = { font: '44pt Coiny', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 560 };
          var helptext = game.add.text(70, 270, instructions, style);
  }

}