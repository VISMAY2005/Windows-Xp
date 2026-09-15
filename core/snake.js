/* ===============================
   snake.js — FULL WORKING GAME
   =============================== */

/* Simple snake game. Call `initSnakeGame(windowId)` after creating a canvas with id `snake-<windowId>`.
   It sets up a loop and leaves a cleanup function on the canvas for safe removal. */

function initSnakeGame(windowId){
  const canvas=document.getElementById(`snake-${windowId}`);
  const ctx=canvas.getContext('2d');

  const size=20;
  let snake=[{x:5,y:5}];
  let dir={x:1,y:0};
  let food={x:10,y:10};
  let running=true;

  // Draw the whole game: background, snake, and food
  function draw(){
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle='lime';
    snake.forEach(s=>ctx.fillRect(s.x*size,s.y*size,size,size));

    ctx.fillStyle='red';
    ctx.fillRect(food.x*size,food.y*size,size,size);
  }

  // Game step: move head, check collisions, handle food
  function step(){
    if(!running)return;
    const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};

    // Wall collision -> stop the game
    if(head.x<0||head.y<0||head.x>=canvas.width/size||head.y>=canvas.height/size){
      running=false; return;
    }

    snake.unshift(head);

    // Eat food -> grow and respawn food, else move forward
    if(head.x===food.x&&head.y===food.y){
      food={
        x:Math.floor(Math.random()*20),
        y:Math.floor(Math.random()*15)
      };
    }else{
      snake.pop();
    }

    draw();
  }

  // Keyboard controls: change direction but prevent reversing into self
  window.addEventListener('keydown',e=>{
    if(e.key==='ArrowUp'&&dir.y===0)dir={x:0,y:-1};
    if(e.key==='ArrowDown'&&dir.y===0)dir={x:0,y:1};
    if(e.key==='ArrowLeft'&&dir.x===0)dir={x:-1,y:0};
    if(e.key==='ArrowRight'&&dir.x===0)dir={x:1,y:0};
  });

  draw();
  const loop=setInterval(step,120);

  // Expose a cleanup function on the canvas so window manager can stop the loop
  canvas._snakeCleanup=()=>clearInterval(loop);
}

window.initSnakeGame=initSnakeGame;
