var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

var feed,lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed=createButton("Feed the Dog");
  feed.position(900,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  lastFed=database.ref('FeedTime');
  lastFed.on("value",function (data){
    lastFed=data.val();
  });

  if(lastFed>=12){
    fill(0);
    textSize(25);
    text("Last Fed : " + lastFed + " PM",50,30);
  }
  else if(lastFed==0){
    fill(0);
    textSize(25);
    text("Last Fed : 12 AM",50,30);
  }
  else{
    fill(0);
    textSize(25);
    text("Last Fed : " + lastFed + " AM",50,30);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

 var food_stock_val=foodObj.getFoodStock();
 if(food_stock_val <= 0){
   foodObj.updateFoodStock(food_stock_val * 0);
 }
 else{
  foodObj.updateFoodStock(food_stock_val-1);
 }

  hour();

  database.ref('/').update({
   Food:foodObj.getFoodStock(),
   FeedTime:hour()
 })

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

