const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var player, bgImg;
var ground1, ground2, ground3;
var obsImg, obstacle, obstacleGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var health = 100;
var hunger = 100;
var radiation = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var rd, hg, foodGroup, apple, banana, garlic, meat, potato, water;
var rdImg, hgImg, appleImg, bananaImg, garlicImg, meatImg, potatoImg, waterImg;

function preload(){
  bgImg = loadImage("images/bg.jpg");
  hgImg = loadImage("images/hunger.png");
  rdImg = loadImage("images/rd.png");
  obsImg = loadImage("images/animal.png");
  appleImg = loadImage("images/apple.png");
  bananaImg = loadImage("images/banana.png");
  garlicImg = loadImage("images/garlic.png");
  meatImg = loadImage("images/meat.png");
  potatoImg = loadImage("images/potato.png");
  waterImg = loadImage("images/water.png");

}

function setup() {
  createCanvas(displayWidth, 710);

  hg = createSprite(50,60);
  hg.addImage(hgImg);
  hg.scale = 0.015;

  rd = createSprite(50,110);
  rd.addImage(rdImg);
  rd.scale = 0.03;

  foodGroup = new Group();
  obstacleGroup = new Group();
  
	engine = Engine.create();
	world = engine.world;
  
  ground1 = createSprite(displayWidth/2,700,displayWidth*2,20);
  ground2 = createSprite(displayWidth/2,450,displayWidth*2,20);
  ground3 = createSprite(displayWidth/2,250,displayWidth*2,20);

  player = createSprite(200,450,50,50);

  obstacle = (-50,200,50,50);
  
	Engine.run(engine);
}

function draw() {
  background(bgImg);

  player.collide(ground1);
  player.collide(ground2);
  player.collide(ground3);
  
  obstacleGroup.collide(ground1);
  obstacleGroup.collide(ground2);
  obstacleGroup.collide(ground3);

  stroke(25);
  strokeWeight(3);
	textSize(30);
	fill(255,100,100);
  text("Health:  " + health, 25, 25);

	fill(200,150,200);
  text(hunger, 85, 70);

	fill(100,255,100);
  text(radiation, 85, 120);

  if(gameState === PLAY){
    
    //moving player
    if(keyDown("UP")){
      player.y -= 20;
    }
    if(keyDown("DOWN")){
      player.y += 20;
    }

    //making player jump
    if(keyDown("SPACE")){
      player.velocityY = -10;
      //Matter.Body.applyForce(player.body,player.body.position,{x:0,y:-10});
    }
  
    //add gravity
    player.velocityY = player.velocityY + 0.5;

    //creating wild animal
    //Matter.Body.applyForce(obstacle.body,obstacle.body.position,{x:-2,y:0});
    /*if(frameCount % 150 === 0){
      obstacle = new Obstacle(displayWidth+20,random(225,685),50,50);
    }*/

    if(frameCount % 15 === 0 && health >= 1 && radiation === 100){
      health -= 1;
    }

    if(frameCount % 100 === 0){
      hunger -= 1;
    }

    if(frameCount % 150 === 0 && radiation <= 99){
      radiation += 1;
    }

    if(foodGroup.isTouching(player)){
      hunger += 5;
      foodGroup.destroyEach();
    }

    if(health === 0){
      gameState = END;
    }

    if(hunger >= 100){
      hunger = 100;
    }

    if(player.isTouching(obstacleGroup)){
      health = Math.round(health-50);
    }
    
  spawnFoods();
  spawnObstacles();

  }else if(gameState === END){
    foodGroup.setVelocityXEach(0);
    foodGroup.setLifetimeEach(-1);
   
    player.setVelocity(0,0);

  }
  
  /*ground1.display();
  ground2.display();
  ground3.display();
  player.display();
  obstacle.display();*/

  drawSprites();
}

function spawnFoods() {
  if(frameCount % 120 === 0) {
    var food = createSprite(width,400);
    food.velocityX  = -4;
    //- (6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: food.addImage(appleImg);        
      food.scale = 0.07;
              break;
      case 2: food.addImage(bananaImg);        
      food.scale = 0.04;
              break;
      case 3: food.addImage(garlicImg);        
      food.scale = 0.05;
              break;
      case 4: food.addImage(meatImg);        
      food.scale = 0.05;
              break;
      case 5: food.addImage(potatoImg);        
      food.scale = 0.03;
              break;
      case 6: food.addImage(waterImg);        
      food.scale = 0.1;
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle   
    food.lifetime = width/4;
    foodGroup.add(food);
  }
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(width,random(210,685),50,50);
    obstacle.velocityX  = -4;
    obstacle.velocityY  = 4;

    obstacle.addImage(obsImg);
    obstacle.scale = 0.2;
    
    //assign scale and lifetime to the obstacle   
    obstacle.lifetime = width/4;
    obstacleGroup.add(obstacle);
  }
}