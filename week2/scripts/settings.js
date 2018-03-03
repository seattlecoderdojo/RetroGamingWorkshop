/* First let's set up a simple game data object that holds our settings. 
   We can put it here so it's easy to find. And we'll put it in the global
   scope so all the other functions have access to it. */
   
   var mtdata = {
    winnable: true, // end at a number (true) or go until fail (false)
    win_length: 10, // the number it will end at if winnable is true
    last_length: 0, // the last sequence length completed
    best_length: 0  // the longest sequence length completed
}