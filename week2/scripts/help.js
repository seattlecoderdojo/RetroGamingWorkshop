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
           
           var style = { font: '28pt coiny', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 560 };
           var helptext = game.add.text(70, 270, instructions, style);

   }    
   
}