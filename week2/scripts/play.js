var playState = {
    
    //Set some game state variables

    init: function(){
        this.myTurn = true;
        this.myDelay = 230; // initial time between played tones
        this.myTimeout = 2980; // initial timeout (time allowed between tiles)
        this.myFade = 400; // initial fade in/out length
        this.speedDrop = 40; // each round, the fade gets this much shorter
        this.tones = []; // holds the sounds
        this.panels = []; // holds the panel images
        this.gameTracker = []; //holds the current sequence
        this.toneCounter = 0; // counts through tones played
        this.label= {}; // holds the graphic object with the message
        this.sprite_size = 300; // size of panels
        this.deathClock = {}; // holds the timeout object
        this.maxTones = 12; // this is the maximum number of tones in a game
        this.myTimeout = 2500;
        this.gameTracker = [];
    },
    
    create: function(){

         game.add.sprite(0,0,'background');
         
         //add the title
         this.title = game.add.text(20,10,'Memory Tones', {font: '70px coiny', fill: '#ffffff'});
         this.title.x = (game.width - this.title.width)/2;

        //add the boxes into an array
        this.panels["panel1-lit"] = game.add.sprite(45, 180, 'panel1-lit'); 
        this.panels["panel1-lit"].width = this.sprite_size; 
        this.panels["panel1-lit"].height = this.sprite_size; 
        
        this.panels["panel1"] = game.add.sprite(45, 180, 'panel1'); 
        this.panels["panel1"].width = this.sprite_size; 
        this.panels["panel1"].height = this.sprite_size; 
                
        this.panels["panel2-lit"] = game.add.sprite(355, 180, 'panel2-lit'); 
        this.panels["panel2-lit"].width = this.sprite_size; 
        this.panels["panel2-lit"].height = this.sprite_size; 
        
        this.panels["panel2"] = game.add.sprite(355, 180, 'panel2'); 
        this.panels["panel2"].width = this.sprite_size; 
        this.panels["panel2"].height = this.sprite_size; 

        this.panels["panel3-lit"] = game.add.sprite(45, 490, 'panel3-lit'); 
        this.panels["panel3-lit"].width = this.sprite_size; 
        this.panels["panel3-lit"].height = this.sprite_size; 
        
        this.panels["panel3"] = game.add.sprite(45, 490, 'panel3'); 
        this.panels["panel3"].width = this.sprite_size; 
        this.panels["panel3"].height = this.sprite_size; 

        this.panels["panel4-lit"] = game.add.sprite(355, 490, 'panel4-lit'); 
        this.panels["panel4-lit"].width = this.sprite_size; 
        this.panels["panel4-lit"].height = this.sprite_size; 
        
        this.panels["panel4"] = game.add.sprite(355, 490, 'panel4'); 
        this.panels["panel4"].width = this.sprite_size; 
        this.panels["panel4"].height = this.sprite_size; 

        //set our audio sprites in an array
        this.tones["panel1"] = game.add.audio('panel1');
        this.tones["panel2"] = game.add.audio('panel2');
        this.tones["panel3"] = game.add.audio('panel3');
        this.tones["panel4"] = game.add.audio('panel4');
        this.tones["fail"] = game.add.audio('fail');
        this.tones["win"] = game.add.audio('win');

        // set our panels active
        for(var element in this.panels){
           if(this.panels[element].hasOwnProperty('events')){
               this.panels[element].inputEnabled = true;
               this.panels[element].events.onInputDown.add(this.panelClick,this);
             }
        }

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
    
    
    playNextSequence: function(){
        // generate a random number between 1 and 4
        var newTone = Math.floor((Math.random() * 4) + 1);
        // add it to the tracking array
        this.gameTracker.push("panel" + newTone);

        //play the sequence()
        this.toneCounter = 0; // initialize the sequence tracking counter
        setTimeout(this.playNextTone, this.myDelay);
    },


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
  
  
    playTone: function(name){
        // check if anything is already playing, and do nothing if it is 
        if(this.checkSounds()){
            return true;
         }
       // set the global fade length to the value passed in, then fade in.
        this.tones[name].fadeIn(this.myFade);
    },
    
        
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