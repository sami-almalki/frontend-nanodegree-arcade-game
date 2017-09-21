/* ************ Global Definitions ************ */

// Some global constants
const OBJECTS_WIDTH = 101;
const OBJECTS_HEIGHT = 171;
const CANVAS_WIDTH = 505;
const CANVAS_HEIGHT = 606;
const ENEMY_X = [0, 171, 342, 513];
const ENEMY_Y = [63, 145, 230];

// Some global variables
var scoreSound = new Audio('sounds/score.wav');
var beepSound = new Audio('sounds/beep.wav');
var gameOver = false;
var bestScore = 0;

// Update the score
function updateScoreLives(status) {
    if (status === 'won') {
        scoreSound.play();
        player.score += 100;
        bestScore = player.score > bestScore ? player.score : bestScore;
    } else if (status === 'lost') {
        beepSound.play();
        player.score = 0;
        player.lives > 1 ? player.lives-- : gameOver = true;
    }
}

/* ************ Enemy Object ************ */

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // The initial location for our enemies
    this.x = x;
    this.y = y;

    // The initial speed for our enemies
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply enemy's movement by the dt parameter to ensure
    // the game runs at the same speed for all computers.
    this.x < CANVAS_WIDTH ? this.x += this.speed * dt : this.x = -OBJECTS_WIDTH;

    // Check the collisions between the player and enemies
    if ((player.x <= this.x + OBJECTS_WIDTH/2 && player.x + OBJECTS_WIDTH/2 >= this.x)
        && (player.y <= this.y + OBJECTS_HEIGHT/3 && player.y + OBJECTS_HEIGHT/3 >= this.y)) {
            updateScoreLives('lost');
            player.x = (CANVAS_WIDTH/2)-(OBJECTS_WIDTH/2);
            player.y = CANVAS_HEIGHT-OBJECTS_HEIGHT-(OBJECTS_HEIGHT/4);
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* ************ Player Object ************ */

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
  // The image/sprite for the player, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/char-boy.png';

  // The initial location for the player
  this.x = x;
  this.y = y;

  // The player's speed
  this.speed = speed;

  // The player's score and lives
  this.score = 0;
  this.lives = 5;
};

// Update the player's position
Player.prototype.update = function() {
    // Player cannot go outside the screen (right/left)
    if (this.x >= CANVAS_WIDTH-OBJECTS_WIDTH) {
        this.x = CANVAS_WIDTH-OBJECTS_WIDTH;
    } else if (this.x <= 0) {
        this.x = 0;
    }

    // Player cannot go outside the screen (up/down)
    if (this.y >= CANVAS_HEIGHT-OBJECTS_HEIGHT-(OBJECTS_HEIGHT/4)) {
        this.y = CANVAS_HEIGHT-OBJECTS_HEIGHT-(OBJECTS_HEIGHT/4);
    } else if (this.y <= OBJECTS_HEIGHT/4) {
        updateScoreLives('won');
        this.x = (CANVAS_WIDTH/2)-(OBJECTS_WIDTH/2);
        this.y = CANVAS_HEIGHT-OBJECTS_HEIGHT-(OBJECTS_HEIGHT/4);
    }
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle player movement
Player.prototype.handleInput = function (key) {
    switch (key) {
        case 'left':
            this.x -= OBJECTS_WIDTH;
            break;
        case 'up':
            this.y -= 83;
            break;
        case 'right':
            this.x += OBJECTS_WIDTH;
            break;
        case 'down':
            this.y += 83;
            break;
    }
};

/* ************ Objects Instantiation ************ */

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player((CANVAS_WIDTH/2)-(OBJECTS_WIDTH/2),
                        CANVAS_HEIGHT-OBJECTS_HEIGHT-(OBJECTS_HEIGHT/4),
                        100);
var allEnemies =[];

for (var i=0; i<7; i++) {
    var enemy = new Enemy(ENEMY_X[Math.floor(Math.random() * 4)],
                          ENEMY_Y[Math.floor(Math.random() * 3)],
                          Math.floor(Math.random() * (200 - 70)) + 70);
    allEnemies.push(enemy);
}

/* ************ Key Presses Handling ************ */

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
