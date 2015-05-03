a3-wfyang
===============

## Team Members

1. Wayne Yang wfyang@uw.edu

## Empirical Knight Move Probabilities

In order to visualize the empirical distribution of move choices by chess players for a knight from a given square, I have created an interactive chess board to view the probability of a given move on the board itself.  When a square is clicked on the main board, the squares where a knight can legally move are hi-lighted and display the conditional probability of moving to that target square conditional on the clicked position.  Below the main board, there are two smaller boards where the corresponding conditional probabilities are displayed for two famous grandmasters: Bobby Fischer and Magnus Carlsen.  At the top of the visualization, users may opt to show all the games, show only the losses, or show only the wins and draws.

The data used in the main board is from the Free Internet Chess System games database.  I used a sample of 10000 standard games (15 minutes a side) played in 2014 with an average FICS rating greater than 2000.  The data is available in pgn format here at http://www.ficsgames.org/download.html .

The Magnus Carlsen data is available at http://www.magnuscarlsenchess.com/games.php

The Bobby Fischer data was obtained from http://www.chess.com/download/view/the-complete-career-of-bobby-fischer

## Running Instructions

The visualization will be available at http://waynefanyang.github.io

Otherwise, download the repository and open a3.html in a browser that is not Chrome.

## Story Board




### Changes between Storyboard and the Final Implementation

In the original plan, I had wanted to have an actual image of a knight piece which would be dragged around onto various positions to display the probabilities.  However, I eventually decided that was a bit contrived and a clunky interactive element.  Also, it was easier to just have click handlers on the individual squares.  The original mock-up also included a slider for FICS rating but it turned out that the full FICS dataset was too large to undergo the constant reprocessing used to produce the figure.


## Development Process

Once the design was set, the whole assignment took approximately twenty hours.  The first couple hours were spent figuring out how to parse / format the data.  The next big hurdle was getting somewhat acquainted with both JavaScript and d3.  It took several hours just to set up a grid with mouse-over behaviour.  It took almost twice that time to figure out a way to redraw the grid with the appropriate colours on a click event.  