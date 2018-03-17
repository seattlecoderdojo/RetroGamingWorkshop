# Week 4: Finishing "Alien Shootz"

Last week, we learned how to make animations with sprite sheets, add collisions so they could hit each other, and handle those collisions to kill a character. You may have even taken it to the next level and made the alien respawn so you had a rudimentary game.

This week we're going to build it into a full game. To do that, we have to learn a couple more things.

- Make a grid of aliens and make them work as a group.
- Gradually destroy our bunkers and let stuff through. (maybe - if there's time to design)
- Bringing it all together

Before we continue, you may ask "what's with the name?" Well, just to be on the right side of the law, we couldn't call it "Space Invaders," since that's trademarked, and pretty much every synonym of "attack" had already been combined with the word "alien" for some game or movie title. So we did what you do on the internet... we misspelled a word. 

## Making a grid of aliens

The first thing we have to do to make it like Space Invaders is have a grid of aliens that march back and forth across the screen, periodically dropping bombs. When one side of the alien horde hits the side of the screen, they turn and march back the other way. If I recall correctly (because it has been 30+ years since I played), they'd even move down a little bit each time they hit each side.

The goal of the game was to kill all the aliens, not just before they hit you with a bomb, but before they reached the bottom and an alien collided with you.

So, let's go into the experiments folder and look at the alien-march.js file.

-- having a missiles group and an aliens group may make the firing of missiles pretty easy... look at https://phaser.io/examples/v2/arcade-physics/group-vs-group

## Gradually destroying our bunkers (optional)

A great part of Space Invaders was that you had bunkers you could not only hide under, but you could make a thin channel through to shoot up at the aliens without exposing yourself too much. But the alien bombs slowly wore down the bunkers. 

Yes. per https://phaser.io/examples/v2/arcade-physics/group-vs-group we  can check overlap instead of collide. 

Background color: #28283c