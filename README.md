a3-wfyang
===============

## Team Members

1. Wayne Yang wfyang@uw.edu

## Empirical Knight Move Probabilities

In order to visualize the empirical distribution of move choices by chess players for a knight from a given square, I have created an interactive chess board to view the probability of a given move on the board itself.  When a square is clicked on the main board, the squares where a knight can legally move are hi-lighted and display the conditional probability of moving to that target square conditional on the clicked position.  Below the main board, there are two smaller boards where the corresponding conditional probabilities are displayed for two famous grandmasters: Bobby Fischer and Magnus Carlsen.  At the top of the visualization, users may opt to show all the games, show only the losses, or show only the wins and draws.

The data used in the main board is from the Free Internet Chess System games database.  I used a sample of 5000 standard games (15 minutes a side) played in January 2015 with an average FICS rating (between the two players) greater than 2000.  The data is available in pgn format here at http://www.ficsgames.org/download.html .

The Magnus Carlsen data is available at http://www.magnuscarlsenchess.com/games.php

The Bobby Fischer data was obtained from http://www.chess.com/download/view/the-complete-career-of-bobby-fischer

## Running Instructions

The visualization is available at http://waynefanyang.github.io

Otherwise, download the repository and open index.html in a browser that is not Chrome.

## Story Board




### Changes between Storyboard and the Final Implementation

In the original plan, I had wanted to have an actual image of a knight piece which would be dragged around onto various positions to display the probabilities.  However, I eventually decided that was a bit contrived and a clunky interactive element.  Also, it was easier to just have click handlers on the individual squares.  The original mock-up also included a slider for FICS rating but it turned out that the full FICS dataset was too large to undergo the constant reprocessing used to produce the figure.  

The most significant change between the storyboard and the final implementation is the addition of the data for the grandmasters.  While the statistics just within the FICS data is interesting in its own right, having the data for two renowned player offers a different basis for comparison and exploration.


## Development Process

Once the design was set, the whole assignment took approximately fifteen hours.  The first couple hours were spent figuring out how to parse / format the data.  The next big hurdle was getting somewhat acquainted with both JavaScript and d3.  It took several hours just to set up a grid with mouse-over behaviour.  It took more than twice that time to figure out a way to redraw the grid with the appropriate colours on a click event.  This is probably due to my inexperience with JavaScript / web development in general.  At first I was trying for an elegant / clever solution, but eventually I settled on updating the data and redrawing the whole board based on the appropriate click events.  Then once the main interactive element was complete, it was more or less smooth sailing to attach the actual data and compute the relevant values on the fly.  I did end up using Underscore.js for easy array filtering.   Once all the moving pieces were correctly implemented, getting everything to look OK on the same file took a bit of elbow grease and a lot of luck.  