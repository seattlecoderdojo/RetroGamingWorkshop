# Week 3 - A Space Invaders Style Game

For week three, we're going to cover a few new concepts. They are sprite sheets, animation, and collisions. What does that mean? We're going to learn a way to put all our game graphics in one image (because it improves performance). We're going to make things not only move, but move while they move. 

And those things are going to hit each other and explode.

### First, our art

I didn't intend to do a lesson on creating 8-bit game art. But I mistakenly thought that the Space Invaders characters aren't copyrighted. They seem to be. 

So, since I wanted at least one of our retro-style games to have some retro-style graphics, I figured I'd create a few. And wouldn't it be pointless for me to do that if I didn't document how I did it?

This example uses [Inkscape](https://www.inkscape.org), which is a wonderful SVG drawing program. A lot of people compare it to Adobe Illustrator. I have been using it for years and actually like it better than Illustrator, plus it works on Windows, Mac, and Linux,  and it's free. If you need an introduction to how it works, check out our [Seattle CoderDojo Inkscape videos](https://www.youtube.com/watch?v=f0mTWb5gF0c&list=PL_tz20e9Bk_hiYVtDZA5kf4l-91B0THWL).

![a plank pixel sheet](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/pixelblock-blank.jpg?raw=true)

As you can see, I have a file called `pixel-block.svg` open. You may not have it looking like graph paper when you open it. To do that, go to the *View* menu, and select "Page Grid." If the box is too big, you can use your minus key to make it smaller, or plus to make it bigger. 

If you don't have a 16x16 grid, go to *File->Document Properties*. In the panel that opens, go to the "Grids" tab, and in the box with the label "Major grid line every," enter 5.

See the little black box in the upper left corner, we'll use that as our pixel. We'll copy it and put the copies in the squares to make our drawing.

But how do we know which squares to put them in? We can figure that out by drawing some shapes with the Inkscape shape tools, then filling them in. So, we want to make an alien... hmm.

Take your circle tool, and draw a sideways oval like this. 

![sideways oval on grid](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/alien2.jpg?raw=true)

You can then start duplicating the block in the corner (select it, then *Edit->Duplicate*) and moving the duplicates into the grid boxes, filling out the circle. You'll start seeing your idea take shape. When you're done, you can select the circle and remove it. Add a box here, a box there, and then you have...

![the alien takes shape](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/alien3.jpg?raw=true)

Now, you may want to add some different colored blocks or change the color of some. Remember that to make sure we don't have any gaps, but everything fits to the boxes the same way, the blocks all have a fill and a stroke. You have to change the color for both. Not sure how to do that or what a fill and a stroke are? Watch the [Seattle CoderDojo Inkscape videos](https://www.youtube.com/watch?v=f0mTWb5gF0c&list=PL_tz20e9Bk_hiYVtDZA5kf4l-91B0THWL).

So we change some colors, add some more blocks, and we have a basic alien...

![Our basic alien](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/alien4.jpg?raw=true)

But we want this alien to actually crawl across our screen. So we need to animate it. The easiest way to do this is with layers. So let's open the *Layer* menu and select *Layers* to open the "Layers" panel on the right. 

![the layers panel](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/layers-1.jpg?raw=true)

Notice the eye and the lock. If the eye is closed, that layer is invisible. If the lock is locked, you can't change what's in it. A LOT of kids in our first Inkscape class would get confused about that one and accidentally blanked or locked layers, then thought they deleted their work or broke something. 

Next we'll select *Layers->Duplicate Current Layer*. You can double-click that copy where it appears in the panel and name it "Layer 2." Then close the eye on Layer 1, make sure the eye is open on Layer 2, make sure Layer 2 is selected in the panel, and then you can edit that layer. For this alien, we did 5 layers total.

Here's Layer 2:

![Layer 2](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/alien5.jpg?raw=true)

And Layer 5:

![Layer5](https://github.com/seattlecoderdojo/RetroGamingWorkshop/blob/master/week3/assets/readme/alien5.jpg?raw=true)

And if we then loop back and forth between Layer 1 and Layer 5, we get an animation like this...

<img src="https://media.giphy.com/media/5tdfm9mdr263RGXKNj/giphy.gif" height="125" width="125" alt="the animation" style="height:125;">

Using *File->Export Png Image*, we open the panel for that under the layers panel. You want to make sure your export area is the page, set your width and height to what you'd want (I'm using 125).  Then you can export each frame by making sure each panel has the eye closed except the one you're exporting, and making sure you change the file name.

**Pro Tip:** One thing that can be confusing is when you use the "Export As" button to set a file name, it doesn't actually save the photo. You still need to click the "Export Button" to save the graphic. And remember that all of these are different than the SVG file that Inkscape uses to hold all these layers.

