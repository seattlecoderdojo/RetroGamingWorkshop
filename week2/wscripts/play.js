var playState = {
    
    //Set some game state variables

    init: function(){
        var ps = playState;
        ps.currentPanel = '';
        ps.myTurn = true;
        ps.myFade = 0;
        ps.myDelay = 300;
        ps.myTimeout = 2980;
        ps.speedDrop = 40
        ps.tones = [];
        ps.title = {};
        ps.label= {};
        ps.panels = [];
        ps.sprite_size = 300;
        ps.gameTracker = [];
        ps.toneCounter = 0;
        ps.deathClock = {};
        ps.maxTones = 4; // this is the maximum number of tones in a game
        ps.myFade = 440;
        ps.myTimeout = 2500;
        ps.gameTracker = [];
    },
    
    create: function(){

         game.add.sprite(0,0,'background');
         
         //add the title
         this.title = game.add.text(20,10,'Memory Tones', {font: '70px coiny', fill: '#ffffff'});
         this.title.x = (game.width - this.title.width)/2;

        //add the boxes
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

        //set our audio sprites
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
           if(this.tones[element].hasOwnProperty('isPlaying')){
               this.addFade(this.tones[element]);
             }
        }


        this.startTurn();

  
    },
    
    startTurn: function(){
        
        if(this.myTurn){
            this.myFade -= this.speedDrop; // makes each sequence play notes shorter
            this.myDelay *= .9166666;
            this.setLabel("I'll play some sounds");
            this.playNextSequence();
        } else {
            this.myTimeout *= .9366666;
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
        this.toneCounter = 0;
        setTimeout(this.playNextTone, this.myDelay);
    },


    playNextTone: function(){
       var ps = playState;
        if(ps.toneCounter < ps.gameTracker.length){
            var tonekey = ps.gameTracker[ps.toneCounter];
            ps.panels[tonekey].moveDown();
            ps.currentPanel = tonekey;
            ps.toneCounter += 1;
            ps.playTone(tonekey);
        } else {
            ps.myTurn = false;
            ps.startTurn();
        }
    },
    
    
    startPlayerTurn: function(){
        this.toneCounter = 0;
        this.deathClock = setTimeout(this.gameFail, this.myTimeout);
    },
    
  
    setLabel: function(labelText){
        if(this.label.hasOwnProperty('blendMode')){
            this.label.destroy(); // if there is a label, clear it
        }
        this.label = game.add.text(10, this.title.height + 20, labelText, {font: '40px coiny', fill: '#ffffff'})
        this.label.x = (game.width - this.label.width)/2;
    },



    panelClick: function(e){
        if((!this.checkSounds()) && (!this.myTurn) ){ 
            // if it's not the machine's turn and nothing else is playing
            // check to make sure the tone's the right one
            if(this.goodTone(e.key)){
                clearTimeout(playState.deathClock);
                this.panels[e.key].moveDown();
                this.currentPanel = e.key;
                this.playTone(e.key);
            } else {
                this.gameFail();
            }
        } else {
            console.log('Either something is playing or it is not your turn.')
        }
    },
  
    goodTone: function(key){
        if(key == this.gameTracker[this.toneCounter]){
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
      tone.onFadeComplete.add(function(item,vol){
        if(vol === 1){
          tone.fadeOut(playState.myFade * 2);
      } else {
          tone.stop();
          playState.panels[tone.key].moveUp();
          if(playState.myTurn){
              // play the next tone in the sequence
              setTimeout(playState.playNextTone, playState.myDelay);
          } else {
              //check win conditions and set death clock
              if(playState.toneCounter == playState.maxTones){
                  playState.tones["win"].play();
                  game.state.start('win');
              } else if (playState.toneCounter == playState.gameTracker.length){
                  playState.myTurn = true;
                  playState.startTurn();
              } else {
                  playState.deathClock = setTimeout(playState.gameFail, playState.myTimeout);
              }
            }
        }    
    })
    
  },
    
    checkSounds: function(){
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
        clearTimeout(playState.deathClock); // just in case the fail is a wrong tile
        console.log('game failed');
        playState.tones["fail"].play();
        game.state.start('lose');
    }
}