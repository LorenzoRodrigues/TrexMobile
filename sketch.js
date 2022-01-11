var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var cloudsGroup, obstaclesGroup;

var PLAY = 1;
var END  = 0;
var gameState = PLAY;

var restart, gameOver, imggameOver, imgrestart;

var die, jump, checkpoint;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  imgrestart = loadImage("restart.png");
  imggameOver = loadImage("gameOver.png");

  checkpoint = loadSound("checkpoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height - 70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height - 20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(width/2,height - 10,width,10);
  invisibleGround.visible = false;
  
  console.log("Olá" + 5);
  
  score = 0;

  cloudsGroup = new Group();

  obstaclesGroup = new Group();
  
  //ativando raio de colisão
  //trex.debug = true;
  trex.setCollider("circle",0,0,50);

  restart = createSprite(width/2,height/2 + 50);
  restart. addImage("reinicio", imgrestart);
  gameOver = createSprite(width/2,height/2);
  gameOver. addImage("fimdejogo", imggameOver);
  restart.scale = 0.5;
  gameOver.scale = 1;
}

function draw() {
  background(180);

  text("Pontuação: "+ score, width/2 - 50,height - 500);
  
  if(gameState === PLAY){
    score = score + Math.round(frameRate()/60);
    
    restart.visible = false;
    gameOver.visible = false;
    
    ground.velocityX = -(4 + 3* score/100);
    
    if(touches.length > 0 || keyDown("space")&& trex.y >height - 50) {
      trex.velocityY = -13;
      jump.play();
      touches = []; 
      
   }
   
  if (score % 100 === 0 && score > 0){
    checkpoint.play();
  }
   //gravidade do trex
  trex.velocityY = trex.velocityY + 0.8

  //reiniciamento to solo
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  //gere as nuvens
  spawnClouds();

  //gere obstáculos no solo
 spawnObstacles();
  
 if(trex.isTouching(obstaclesGroup)){
  gameState = END;
  die.play();
  //trex.velocityY = -13;
  //jump.play();

  
 }
}
  else if(gameState === END){
   ground.velocityX = 0;
   
   //zerando a velocidade dos sprites
   obstaclesGroup.setVelocityXEach(0);
   cloudsGroup.setVelocityXEach(0);
   //tempo de vida infinito dos grupos
   cloudsGroup.setLifetimeEach(-1);
   obstaclesGroup.setLifetimeEach(-1);
   
   trex.changeAnimation("collided" , trex_collided);
   trex.velocityY = 0;
   restart.visible = true;
   gameOver.visible = true;

   if(touches.length > 0 || mousePressedOver(restart)){
     reset();
     touches = [];
   }
  }
  
  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height - 30,10,40);
   obstacle.velocityX = -(6 + score/100);

   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo             
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(height - 100,height - 300));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir vida útil à variável
    cloud.lifetime = 200;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
  
}

function reset(){
  gameState = PLAY;
  
  restart.visible = false;
  gameOver.visible = false;
  
  //mudar a animação pro trex correndo
  trex.changeAnimation("running" , trex_running);
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score = 0;
}
