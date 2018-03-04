var loseState = {
    create: function(){
                // since we'll duplicate a bunch of the menu state, we'll just run its create function
            menuState.create();
            
            // Then we'll make a box to put the instructions in
            var graphics = game.add.graphics();
            graphics.lineStyle(2, 0xFFFFFF, 1);
            graphics.beginFill(0x222222, 1);
            graphics.drawRect(50, 250, 600, 300);
            graphics.endFill();
            
            var instructions = "We're sorry, but you didn't get to " + playState.maxTones + " tones.\n\nKeep Practicing and feel free to try again."
            
            var style = { font: '28pt coiny', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 560 };
            var helptext = game.add.text(70, 270, instructions, style);
    }
} 