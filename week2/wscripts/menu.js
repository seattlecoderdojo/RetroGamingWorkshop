var menuState = {
    
    create: function(){
        // since we did the preload in the last state, we'll make our board now.
        // graphics are loaded bottom to top, so we'll start with our background
    
         game.add.sprite(0,0,'background');
         
         //add the title
         var title = game.add.text(20,10,'Memory Tones', {font: '70px coiny', fill: '#ffffff'});
         title.x = (game.width - title.width)/2;
         
         // add the play and help buttons
           //set our button top position as 20px below the title
           var buttontop = title.y + title.height + 20;
           
           //set a value of px between the edges of the buttons
           var midbuffer = 80;
           
           //add the buttons to the game
           var play = game.add.sprite(20, buttontop , 'playbutton');
           var help = game.add.sprite(0, buttontop , 'helpbutton');
        
           //get the centering for the buttons with their spacing
           var sidebuffer = (game.width - (play.width + help.width + midbuffer))/2;
           
           //reposition the buttons
           play.x = sidebuffer;
           help.x = sidebuffer + play.width + midbuffer;
           
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
    
    }    
    
}