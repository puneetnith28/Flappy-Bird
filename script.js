let move_speed = 3, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let bird_props, background;
let score_val, message, score_title;
let game_state = 'Start';
let bird_dy = 0;
let score = 0;
let pipe_seperation = 0;

let animationId;
let isTransitioning = false; // The new flag

function initializeElements() {
    bird_props = bird.getBoundingClientRect();
    background = document.querySelector('.background').getBoundingClientRect();
    score_val = document.querySelector('.score_val');
    message = document.querySelector('.message');
    score_title = document.querySelector('.score_title');

    img.style.display = 'none';
    message.classList.add('messageStyle');
}

document.addEventListener('keydown', handleInput);
document.addEventListener('touchstart', handleInput);
document.addEventListener('keyup', handleRelease);
document.addEventListener('touchend', handleRelease);

function handleInput(e) {
    if (game_state === 'Start' || game_state === 'End') {
        if (!isTransitioning && (e.key === 'Enter' || e.type === 'touchstart')) {
            e.preventDefault();
            startGame();
        }
    } else if (game_state === 'Play') {
        if (e.key === 'ArrowUp' || e.key === ' ' || e.type === 'touchstart') {
            e.preventDefault();
            img.src = 'images/Bird-2.png';
            bird_dy = -7.6;
        }
    }
}

function handleRelease(e) {
    if (game_state === 'Play') {
        if (e.key === 'ArrowUp' || e.key === ' ' || e.type === 'touchend') {
            e.preventDefault();
            img.src = 'images/Bird.png';
        }
    }
}

function startGame() {
    isTransitioning = true; 
    
    cancelAnimationFrame(animationId);
    document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
    
    img.style.display = 'block';
    img.src = 'images/Bird.png';
    bird.style.top = '40vh';

    // ✅ Reset bird_props immediately
    bird_props = bird.getBoundingClientRect();

    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    
    bird_dy = 0;
    score = 0;
    pipe_seperation = 0;
    
    setTimeout(() => {
        isTransitioning = false; 
        gameLoop();
    }, 50);
}

function gameLoop() {
    if (game_state !== 'Play') return;
    
    movePipes();
    applyGravity();
    createPipes();

    animationId = requestAnimationFrame(gameLoop);
}

function movePipes() {
    let pipe_sprite = document.querySelectorAll('.pipe_sprite');
    pipe_sprite.forEach((element) => {
        let pipe_sprite_props = element.getBoundingClientRect();
        bird_props = bird.getBoundingClientRect();

        // Collision check
        if (bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && 
            bird_props.left + bird_props.width > pipe_sprite_props.left && 
            bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && 
            bird_props.top + bird_props.height > pipe_sprite_props.top) {
            endGame();
            return;
        } 
        // Score increment
        else if (pipe_sprite_props.right < bird_props.left && 
                 pipe_sprite_props.right + move_speed >= bird_props.left && 
                 element.increase_score === '1') {
            score++;
            score_val.innerHTML = score;
            sound_point.play();
        }
        
        // Remove pipe when off-screen
        if (pipe_sprite_props.right <= 0) {
            element.remove();
        } else {
            element.style.left = (pipe_sprite_props.left - move_speed) + 'px';
        }
    });
}

function applyGravity() {
    bird_dy += grativy;
    bird.style.top = (bird_props.top + bird_dy) + 'px';

    // ✅ Update props AFTER moving
    bird_props = bird.getBoundingClientRect();

    // Collision with top or bottom
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
        endGame();
        return;
    }
}

function createPipes() {
    if (pipe_seperation > 115) {
        pipe_seperation = 0;
        let pipe_posi = Math.floor(Math.random() * 43) + 8;
        
        // Upper pipe
        let pipe_sprite_inv = document.createElement('div');
        pipe_sprite_inv.className = 'pipe_sprite';
        pipe_sprite_inv.style.top = (pipe_posi - 70) + 'vh';
        pipe_sprite_inv.style.left = '100vw';
        document.body.appendChild(pipe_sprite_inv);
        
        // Lower pipe
        let pipe_sprite = document.createElement('div');
        pipe_sprite.className = 'pipe_sprite';
        pipe_sprite.style.top = (pipe_posi + 35) + 'vh';
        pipe_sprite.style.left = '100vw';
        pipe_sprite.increase_score = '1';
        document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
}

function endGame() {
    game_state = 'End';
    message.innerHTML = `Game Over <br>Score: ${score} <br>Tap or Enter To Restart`;
    message.classList.add('messageStyle');
    img.style.display = 'none';
    sound_die.play();

    cancelAnimationFrame(animationId);
}

window.onload = initializeElements;
