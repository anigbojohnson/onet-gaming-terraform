let value = 2;
let size = 50;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let rectangle = [];
var currentList = new Set();
var frontierList=[];
var visitedList = new Set();
const solution = new Map();
var prevousIndex;
var prevousColor;
var prevousRowIndex;
var prevousColIndex ;
var col;
var row;
var indexRow;
var indexCol;
 let interval =0;
 let check = 0;
 let minutesInterval =0;
 let hourInterval =0;
var TableData = new Array();
let seconds = document.getElementById('seconds');
let minutes = document.getElementById('minutes');
let hours = document.getElementById('hours');
let copyRectangle;


function shaffleOnet(){

  let random ;
   var temp;
   let tempXPoint;
   let tempYPoint;
   let tempColor;
   let tempX;
   let tempY;
   let randomXPoint;
   let randomYPoint;
   let randomColor;
   let randomX;
   let randomY;

  for (let index = rectangle.length-1; index > 0; index--) {
    let random = Math.floor(Math.random() * (index + 1) );
     temp = rectangle[index];
     tempXPoint = rectangle[index].xPoint;
     tempYPoint = rectangle[index].yPoint;
     tempColor = rectangle[index].color;
     tempX = rectangle[index].x;
     tempY = rectangle[index].y;

     rectangle[index] = rectangle[random];


     randomXPoint = rectangle[random].xPoint;
     randomYPoint = rectangle[random].yPoint;
     randomColor = rectangle[random].color;
     randomX = rectangle[random].x;
     randomY = rectangle[random].y;
    rectangle[random] = temp;



    rectangle[index] =  new Rectangle(randomXPoint, randomYPoint , rectangle[random].width, rectangle[random].height, tempColor,-999,-1,randomX,randomY);
    rectangle[random] =  new Rectangle(tempXPoint, tempYPoint, rectangle[random].width, rectangle[random].height, randomColor,-999,-1,tempX,tempY);

       if(rectangle[index]!=0){
        rectangle[index].drawRectangle(ctx);
       }
      if(rectangle[index]==0){
        rectangle[index].updateDrawRectangle(ctx);
       }

       if(rectangle[random]!=0){
        rectangle[random].drawRectangle(ctx);
       }
      if(rectangle[random]==0){
        rectangle[random].updateDrawRectangle(ctx);
       }

    }


}



function partern(value) {
  // clear rectangles
  rectangle.length = 0;

  // color patterns
  const patterns = {
    one: [
      ["#f0f0f0", "red", "yellow", "yellow", "#f0f0f0", "#f0f0f0", "#800000", "#800000"],
      ["#f0f0f0", "#00cc00", "blue", "blue", "#33ffff", "#800000", "#f0f0f0", "#f0f0f0"],
      ["red", "yellow", "red", "#FFC0CB", "#FFC0CB", "#33ffff", "#00cc00", "#f0f0f0"],
      ["red", "black", "yellow", "yellow", "#FFC0CB", "#FFC0CB", "red", "#800000"],
      ["red", "black", "#00cc00", "#FFC0CB", "#00cc00", "#33ffff", "#00cc00", "#f0f0f0"],
      ["red", "black", "yellow", "#33ffff", "#00cc00", "blue", "blue", "#f0f0f0"],
      ["#800000", "#800000", "#00cc00", "#FFC0CB", "#f0f0f0", "#33ffff", "black", "#f0f0f0"],
      ["#f0f0f0", "#00cc00", "#33ffff", "#FFC0CB", "#FFC0CB", "blue", "yellow", "#f0f0f0"],
      ["red", "yellow", "blue", "#f0f0f0", "#FFC0CB", "#FFC0CB", "#f0f0f0", "#f0f0f0"]
    ],
    two: [
      ["yellow", "#00cc00", "#33ffff", "#f0f0f0", "#800000", "#f0f0f0", "red", "#f0f0f0"],
      ["red", "blue", "red", "blue", "#33ffff", "#800000", "#00cc00", "yellow"],
      ["blue", "#00cc00", "#33ffff", "#FFC0CB", "black", "#f0f0f0", "yellow", "#800000"],
      ["#f0f0f0", "#f0f0f0", "#f0f0f0", "yellow", "#00cc00", "black", "#FFC0CB", "#f0f0f0"],
      ["red", "#800000", "blue", "#FFC0CB", "#800000", "yellow", "#f0f0f0", "#f0f0f0"],
      ["red", "black", "#33ffff", "red", "black", "yellow", "yellow", "#f0f0f0"],
      ["red", "#800000", "#FFC0CB", "#FFC0CB", "#f0f0f0", "#f0f0f0", "#f0f0f0", "black"],
      ["#00cc00", "#00cc00", "#f0f0f0", "#f0f0f0", "#f0f0f0", "blue", "blue", "#f0f0f0"],
      ["#33ffff", "#33ffff", "blue", "blue", "#800000", "#800000", "#f0f0f0", "#f0f0f0"]
    ],
    three: [
      ["#f0f0f0","#f0f0f0","#33ffff","#33ffff","yellow","red","red","#800000"],
      ["#f0f0f0","#FFC0CB","#FFC0CB","#33ffff","#00cc00","#00cc00","black","#f0f0f0"],
      ["#FFC0CB","blue","#800000","#FFC0CB","#33ffff","black","blue","blue"],
      ["#f0f0f0","#f0f0f0","#800000","yellow","red","#f0f0f0","#f0f0f0","#f0f0f0"],
      ["red","red","yellow","yellow","#00cc00","yellow","#33ffff","#33ffff"],
      ["#f0f0f0","#FFC0CB","black","#800000","black","#800000","red","#f0f0f0"],
      ["#f0f0f0","#f0f0f0","#f0f0f0","#FFC0CB","#00cc00","yellow","yellow","#FFC0CB"],
      ["red","yellow","#33ffff","#FFC0CB","#FFC0CB","blue","yellow","#f0f0f0"],
      ["black","#800000","#f0f0f0","yellow","#f0f0f0","#00cc00","#FFC0CB","#FFC0CB"]
    ]
  };

  const colors = patterns[value];
  if (!colors) return;

  // build rectangles
  colors.forEach((row, r) => {
    row.forEach((color, c) => {
      const rect = new Rectangle(c * size, r * size, size, size, color, r + 1, -1, r, c);
      if (color === "#f0f0f0") rect.updateDrawRectangle(ctx);
      else rect.drawRectangle(ctx);
      rectangle.push(rect);
    });
  });

  // extract table data
  $('#myMatrix tr').each(function(row, tr) {
    TableData[row] = {};
    $(tr).find('td:gt(0)').each(function(i, td) {
      TableData[row][i] = $(td).text();
    });
  });

  TableData.shift();
}


function increaseOjectSize(val){
if(val === "one"){
     value =1;


    var i = 0, j =0;
    canvas.width = 200;
    canvas.height = 225;
    for(var index =0; index< 9; index++ ){

       j=0;
          for ( var count= 0; count < 8 ; count++) {

               var initial= ( 7*index)+count+index;

               rectangle[initial] = new Rectangle( j , i , 25 , 25 , rectangle[initial].color ,rectangle[initial].row, -1 ,rectangle[initial].x, rectangle[initial].y );

              if( rectangle[initial].image instanceof Object ){
                 rectangle[initial].drawImageInRectangle(ctx,rectangle[initial].colorValue);
                 continue;
              }


              if(rectangle[initial].colorValue==0){
                    rectangle[initial].updateDrawRectangle(ctx);
              } else{
                    rectangle[initial].drawRectangle(ctx);
              }

              j= j + 25;
           }

            i = i + 25;
    }

  }
  if(val === "two"){
    value = 2;
      var i = 0, j =0;
    canvas.width = 400;
    canvas.height = 450;
           for(var index =0; index< 9; index++ ){

       j=0;
          for ( var count= 0; count < 8 ; count++) {

               var initial= ( 7*index)+count+index;

               rectangle[initial] = new Rectangle( j , i , 50 , 50 , rectangle[initial].color ,rectangle[initial].row, -1 ,rectangle[initial].x, rectangle[initial].y );
              if(rectangle[initial].colorValue==0){
                    rectangle[initial].updateDrawRectangle(ctx);
              } else{
                    rectangle[initial].drawRectangle(ctx);
              }

              j= j + 50;
           }

            i = i + 50;
    }
  }
  if(val === "three"){
    value = 3;

      var i = 0, j =0;
    canvas.width = 600;
    canvas.height = 675;
            for(var index =0; index< 9; index++ ){

       j=0;
          for ( var count= 0; count < 8 ; count++) {

               var initial= ( 7*index)+count+index;

               rectangle[initial] = new Rectangle( j , i , 75 , 75 , rectangle[initial].color ,rectangle[initial].row, -1 ,rectangle[initial].x, rectangle[initial].y );
              if(rectangle[initial].colorValue==0){
                    rectangle[initial].updateDrawRectangle(ctx);
              } else{
                    rectangle[initial].drawRectangle(ctx);
              }

              j= j + 75;
           }

            i = i + 75;
    }
  }
  if(val === "four"){
     value = 4;

      var i = 0, j =0;
     canvas.width = 800;
     canvas.height = 900;
               for(var index =0; index< 9; index++ ){

       j=0;
          for ( var count= 0; count < 8 ; count++) {

               var initial= ( 7*index)+count+index;

               rectangle[initial] = new Rectangle( j , i , 100 , 100 , rectangle[initial].color ,rectangle[initial].row, -1 ,rectangle[initial].x, rectangle[initial].y );
              if(rectangle[initial].colorValue==0){
                    rectangle[initial].updateDrawRectangle(ctx);
              } else{
                    rectangle[initial].drawRectangle(ctx);
              }

              j= j + 100;
           }

            i = i + 100;
    }

  }

}



function fulScreen(size){

  //var fullSize = document.getElementsByClassName("onFull");
  if(size === "on"){

    var onetGrid = document.getElementById("onet-grid");
    onetGrid.style.display = "grid";
    onetGrid.style.gridTemplateColumns = "100%";
    var tableOne = document.getElementsByClassName("tableOne");
    tableOne[0].style.display="none";
    var tableTwo = document.getElementsByClassName("tableTwo");
    tableTwo[0].style.display = "block";



  }
  if(size === "collapse"){
    var onetGrid = document.getElementById("onet-grid");
    onetGrid.classList.remove("onet-grid");



    var attr = document.createAttribute("class");
    attr.value = "grid-contain";
    onetGrid.setAttributeNode(attr);
    onetGrid.style.display = "grid";
    onetGrid.style.gridTemplateColumns = "30% 70%";
  onetGrid.style.height ="1000px";
  onetGrid.style.gap ="20px";



    var tableOne = document.getElementsByClassName("tableOne");
    tableOne[0].style.display = "block";
      tableOne[0].style.border = "1px solid black";
    tableOne[0].style.paddingLeft = "20px";
tableOne[0].style.paddingRight = "20px";


    var tableTwo = document.getElementById("tableTwo");
    tableTwo.style.border = "1px solid black";
    tableTwo.style.padding = "20px";

  }
}
function axisGraph(){

  const ctx = document.getElementById('chart');
  ctx.style.display = "block";

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


function partternImage(pattern){

if(canvas.width == 200 && canvas.height == 225){

    for(var index =0; index< 9; index++ ){


          for ( var count= 0; count < 8 ; count++) {

               var initial= ( 7*index)+count+index;
                if(rectangle[initial].colorValue!=0 && pattern=='color'){
                    rectangle[initial]. drawRectangle(ctx);
              }

              if(rectangle[initial].colorValue!=0 && pattern=='animal'){
                    rectangle[initial].drawImageInRectangle(ctx, rectangle[initial].colorValue);

              }
               if(rectangle[initial].colorValue==0){
                    rectangle[initial]. updateDrawRectangle(ctx);
              }

           }

    }

  }
  if( canvas.width == 400 &&  canvas.height == 450){
      for(var index =0; index< 9; index++ ){

          for ( var count= 0; count < 8 ; count++) {

               var initial= ( 7*index)+count+index;

               if(rectangle[initial].colorValue!=0 && pattern=='color'){
                    rectangle[initial]. drawRectangle(ctx);
              }

              if(rectangle[initial].colorValue!=0 && pattern=='animal'){
                    rectangle[initial].drawImageInRectangle(ctx, rectangle[initial].colorValue);

              }
               if(rectangle[initial].colorValue==0){
                    rectangle[initial]. updateDrawRectangle(ctx);
              }

           }

    }
}
 if( canvas.width == 600 &&  canvas.height == 675){
      for(var index =0; index< 9; index++ ){

          for ( var count= 0; count < 8 ; count++) {

               var initial= ( 7*index)+count+index;

                       if(rectangle[initial].colorValue!=0 && pattern=='color'){
                    rectangle[initial]. drawRectangle(ctx);
              }

              if(rectangle[initial].colorValue!=0 && pattern=='animal'){
                    rectangle[initial].drawImageInRectangle(ctx, rectangle[initial].colorValue);

              }
               if(rectangle[initial].colorValue==0){
                    rectangle[initial]. updateDrawRectangle(ctx);
              }

           }

    }
  }

   if( canvas.width == 800 &&  canvas.height == 900){
      for(var index =0; index< 9; index++ ){

          for ( var count= 0; count < 8 ; count++) {

               var initial= ( 7*index)+count+index;

                     if(rectangle[initial].colorValue!=0 && pattern=='color'){
                    rectangle[initial]. drawRectangle(ctx);
              }

              if(rectangle[initial].colorValue!=0 && pattern=='animal'){
                    rectangle[initial].drawImageInRectangle(ctx, rectangle[initial].colorValue);

              }
               if(rectangle[initial].colorValue==0){
                    rectangle[initial]. updateDrawRectangle(ctx);
              }

           }

    }
  }
}

class Rectangle{
  constructor(xPoint, yPoint, width , height,color,posRow,posCol,x,y){


    this.setColor(color);
    this.width = width ;
    this.height = height ;
    this.xPoint = xPoint;
    this.yPoint = yPoint;



     this.x =x;
      this.y =y;
      var xy= x+''+y;

      console.log(xy)
     document.getElementById(xy).innerHTML = this.colorValue;



  }

  drawImageInRectangle(ctx,value){


    switch(value){

    case  1:
      this.image =document.getElementById("cat");
      break;

     case 2:
      this.image =document.getElementById("dog");
      break;

      case 3:
      this.image =document.getElementById("hen");
      break;

      case 4:
      this.image =document.getElementById("lion");
      break;

      case 5:
      this.image =document.getElementById("monkey");
      break;

      case 6:
      this.image =document.getElementById("bird");
      break;

      case 7:
      this.image =document.getElementById("peagon");
      break;

      case 8:
      this.image =document.getElementById("goat");
      break;

      case 9:
      this.image =document.getElementById("fish");
      break;
    }
    ctx.drawImage(this.image,this.xPoint,this.yPoint,this.width,this.height);
    ctx.lineWidth=2;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(this.xPoint,this.yPoint,this.width,this.height);
  }
  drawRectangle(context){
    context.fillStyle=this.color;
    context.fillRect(this.xPoint,this.yPoint,this.width,this.height);
    context.lineWidth=2;
    context.strokeStyle = 'black';
    context.strokeRect(this.xPoint,this.yPoint,this.width,this.height);
  }

   updateDrawRectangle(context){
    context.fillStyle=this.color;
    context.fillRect(this.xPoint,this.yPoint,this.width,this.height);
    context.lineWidth=0;
    context.strokeStyle = 'white';
    context.strokeRect(this.xPoint,this.yPoint,this.width,this.height);
  }

  setColor(color){
     this.color=color;
      switch(this.color){
      case "red":
          this.colorValue  =1;
          break;
      case "black":
          this.colorValue  =2;
          break;
      case "yellow":
          this.colorValue  =3;
          break;
      case "#FFC0CB":
          this.colorValue  =4;
          break;
      case "#33ffff":
          this.colorValue  =5;
          break;
      case "#00cc00":
          this.colorValue  =6;
          break;
      case "blue":
          this.colorValue=7;
          break;
      case "#800000":
         this.colorValue  =8;
         break
      case "#f0f0f0":
        this.colorValue=0;
        break;
       }

  }

}
initializeOnet();

function initializeOnet() {
  const colors = [
    // row 0
    ["#f0f0f0","#f0f0f0","#f0f0f0","#f0f0f0","#f0f0f0","#f0f0f0","#f0f0f0","#f0f0f0"],
    // row 1
    ["#f0f0f0","#00cc00","red","blue","#33ffff","#800000","black","#f0f0f0"],
    // row 2
    ["#f0f0f0","black","red","blue","#33ffff","red","#FFC0CB","#f0f0f0"],
    // row 3
    ["#f0f0f0","#33ffff","#800000","yellow","red","#FFC0CB","red","#f0f0f0"],
    // row 4
    ["#f0f0f0","#00cc00","blue","black","#00cc00","yellow","#00cc00","#f0f0f0"],
    // row 5
    ["#f0f0f0","#FFC0CB","#33ffff","red","black","#800000","blue","#f0f0f0"],
    // row 6
    ["#f0f0f0","#800000","yellow","#FFC0CB","#00cc00","#33ffff","blue","#f0f0f0"],
    // row 7
    ["#f0f0f0","#00cc00","#33ffff","#FFC0CB","#FFC0CB","blue","yellow","#f0f0f0"],
    // row 8
    ["#f0f0f0","#f0f0f0","#f0f0f0","#f0f0f0","#f0f0f0","#f0f0f0","#f0f0f0","#f0f0f0"]
  ];

  rectangle.length = 0; // clear old data

  colors.forEach((rowColors, row) => {
    rowColors.forEach((color, col) => {
      const rect = new Rectangle(col * 50, row * 50, size, size, color, row + 1, -1, row, col);
      if (color === "#f0f0f0") {
        rect.updateDrawRectangle(ctx); // neutral (gray, no border)
      } else {
        rect.drawRectangle(ctx);       // active (colored, black border)
      }
      rectangle.push(rect);
    });
  });

  // extract table data dynamically
  $('#myMatrix tr').each(function(row, tr){
    TableData[row] = {};
    $(tr).find('td').each(function(i, td){
      if (i > 0) TableData[row][i-1] = $(td).text();
    });
  });
  TableData.shift();
}


let intervalId;

canvas.addEventListener('click',(event)=>{
  let   BBoffsetX,BBoffsetY,response;
  response=canvas.getBoundingClientRect();
event.preventDefault();
event.stopPropagation();
  BBoffsetX=event.clientX -response.left;
  BBoffsetY=event.clientY-response.top;
check = check + 1 ;

  if(check==1){
   intervalId = setInterval(function(){
   interval = interval + 1;
    seconds.innerHTML = interval;
    if(interval == 59){
      seconds.innerHTML =0;
      interval =0;
      minutesInterval = minutesInterval + 1;
      minutes.innerHTML= minutesInterval
    }
    if(minutesInterval==59 && interval==59){
      minutes.innerHTML =0;
      minutesInterval =0;
      hourInterval= hourInterval+1;
      hours.innerHTML =hourInterval;
    }
  },1000);

}
for(let index=0; index<rectangle.length; index++){

   if(BBoffsetX>= rectangle[index].xPoint && BBoffsetX<=rectangle[index].xPoint+ rectangle[index].width && BBoffsetY>= rectangle[index].yPoint && BBoffsetY<= rectangle[index].yPoint+ rectangle[index].height){
       frontierList.push( rectangle[index].x+''+ rectangle[index].y);
       TableData[ rectangle[index].x][ rectangle[index].y] ='0';
       makeMatch( rectangle[index].color, rectangle[index].x, rectangle[index].y, rectangle[index].colorValue, rectangle[index],rectangle);
  }
}

let timerStatus = true;
for(let index=0; index < rectangle.length; index++){
  if(rectangle[index].colorValue!=0)
    timerStatus = false
}
if(timerStatus === true){
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "red";
 ctx.textAlign = "center";
  ctx.fillText("Congratulations", canvas.width/2, canvas.height/2);
  clearInterval(intervalId);
}
    solution.clear();
    currentList.clear();
    visitedList.clear();


});

function makeMatch(color,indexRow,indexCol,colourValue,rect,rectangleArray){

  function getVisited(p, t){
    let joinRowCol= p+''+t;
    let status=false;
    visitedList.forEach (function(value) {
      if(value==joinRowCol)
        status = true;
      })
      return status;
  }

function  index(i, j){

  if(i<0 || j<0 || i>8 || j>7){
    return -1;
  }else{
      return 0;
    }

}

  function   validate(p,t,position){

    switch(position){

      case 'TOP':
      var rowVisited = p-1;
      if(index(rowVisited ,t)==0 && TableData[p-1][t]=='0'){

        if( getVisited(rowVisited ,t)==false){

          frontierList.push(rowVisited +''+t);
          solution.set(rowVisited+''+t,indexRow +''+indexCol);
          return 0;
        } else{
          return -1;
        }
      } else{
        return -1;
      }
      break;
      case 'RIGHT':
      var rowVisited = p;
        var colVisited = t+1;
      if(index(rowVisited ,colVisited)==0 && TableData?.[p]?.[t+1]=='0'){

        if(getVisited(rowVisited ,colVisited)==false){
          frontierList.push(rowVisited +''+colVisited);
          solution.set(rowVisited+''+colVisited,indexRow +''+indexCol);
          return 0;
        }else{
          return -1;
        }
      } else{
        return -1;
      }
      break;

      case 'BOTTOM':
      var rowVisited = p+1;
      var colVisited = t;
      if(index(rowVisited ,colVisited)==0 && TableData[p+1]?.[t]=='0'){

        if(getVisited(rowVisited ,colVisited)==false){
          frontierList.push(rowVisited +''+colVisited);
          solution.set(rowVisited+''+colVisited,indexRow +''+indexCol);
          return 0;
        }else{
          return -1;
        }
      } else{
        return -1;
      }
      break;

      case 'LEFT':
      var rowVisited = p;
      var colVisited = t-1;
      if(index(rowVisited ,colVisited)==0 && TableData?.[p]?.[t-1]=='0'){

        if(getVisited(rowVisited ,colVisited)==false){
          frontierList.push(rowVisited +''+colVisited);
          solution.set(rowVisited+''+colVisited,indexRow +''+indexCol);

          return 0;
        } else{
          return -1;
        }
      } else{
        return -1;
      }
      break;
    }
  }

    if(color === prevousColor){
      var keyValFrontier = frontierList.shift();

        currentList.forEach((point) => {
                                            if (point == pp) {
                                              currentList.delete(point);
                                          }
                                          });

      indexRow =parseInt(keyValFrontier.charAt(0), 10);
      indexCol =parseInt(keyValFrontier.charAt(1),10);
      currentList.add(indexRow +''+indexCol);
       var pp=indexRow +''+indexCol;
       currentList.add(pp);
       visitedList.add(pp);

         if(validate(indexRow,indexCol,'TOP')==0 ){
         }
         if(validate(indexRow,indexCol,'RIGHT')==0){
         }
         if(validate(indexRow,indexCol,'BOTTOM')==0 ){
         }
         if(validate(indexRow,indexCol,'LEFT' )==0 ){
         }

      if(frontierList.length==0){
        return 0;
      }


      if( makeMatch(color,indexRow,indexCol,colourValue,rect,rectangleArray)==0){
         let processedResult = processSolutionArray(solution,rect, prevousIndex,rectangleArray);
      }

} else{
               prevousColor = color;
               prevousIndex = indexRow+''+indexCol;
               frontierList.pop(prevousIndex);
        }
}

 function processSolutionArray(processedArray ,rect,valueIndex ,rectangleArray){

   let indexR;
  let indexC;
  var indexRR;
  var indexCC;
  let counting=0;
  let solutionArray =[];
  let copySolutionArray=[];
  let RR,CC;
  let i,j;
  var keys;

  var rectangleCordinate = rect.x+''+rect.y;
  while (valueIndex != rectangleCordinate) {
    keys = valueIndex;
    if(valueIndex = processedArray.get(keys)){
      solutionArray.push(keys);
      solutionArray.push(valueIndex);
    }
}

for(let index =0; index < solutionArray.length ; index++){
  if(copySolutionArray.indexOf(solutionArray[index])==-1){
    copySolutionArray.push(solutionArray[index]);
  }
}

for(i=0, j=2  ; j<copySolutionArray.length; i++,j++ ){
    indexRR =parseInt(copySolutionArray[i].charAt(0), 10);
    indexCC =parseInt(copySolutionArray[i].charAt(1),10);

    RR= parseInt(copySolutionArray[j].charAt(0), 10);
    CC= parseInt(copySolutionArray[j].charAt(1), 10);
    if(indexRR != RR && indexCC!=CC){
      counting = counting + 1;
      if(counting>2)
        return -1;
    }
}

for(var index=0; index<copySolutionArray.length;index++){
    indexR =parseInt(copySolutionArray[index].charAt(0), 10);
    indexC =parseInt(copySolutionArray[index].charAt(1),10);


for(var counter = 0; counter < rectangleArray.length;counter++){



    if(rectangleArray[counter].x == indexR && rectangleArray[counter].y==indexC){
        if(rectangleArray[counter].width==25){
          locateMatrixOnet(25);
        }
        if(rectangleArray[counter].width==50){

          locateMatrixOnet(50);
        }
        if(rectangleArray[counter].width==75){
          locateMatrixOnet(75);
        }
        if(rectangleArray[counter].width==100){
          locateMatrixOnet(100);
        }

    }

  }
}


function locateMatrixOnet(locate){
   var joinRC = indexR+""+indexC;
      let updateTableValue = document.getElementById(joinRC);

       updateTableValue.innerText = "0";
        ctx.fillStyle="red";
       ctx.fillRect(rectangleArray[counter].xPoint, rectangleArray[counter].yPoint, locate, locate);
       ctx.lineWidth=2;
       ctx.strokeStyle = 'white';
       ctx.strokeRect(rectangleArray[counter].xPoint, rectangleArray[counter].yPoint, locate, locate);
       rectangleArray[counter].setColor("#f0f0f0",ctx);
       TableData[indexR][indexC] ='0';
}

function clear(){
  for(var index=0; index<copySolutionArray.length;index++){
    indexR =parseInt(copySolutionArray[index].charAt(0), 10);
    indexC =parseInt(copySolutionArray[index].charAt(1),10);

for(var counter = 0; counter < rectangleArray.length;counter++){

    if(rectangleArray[counter].x == indexR && rectangleArray[counter].y==indexC){
      if(rectangleArray[counter].width==25)
        ctx.clearRect(rectangleArray[counter].xPoint, rectangleArray[counter].yPoint, 25, 25);
     if(rectangleArray[counter].width==50)
        ctx.clearRect(rectangleArray[counter].xPoint, rectangleArray[counter].yPoint, 50, 50);
     if(rectangleArray[counter].width==75)
        ctx.clearRect(rectangleArray[counter].xPoint, rectangleArray[counter].yPoint, 75, 75);
     if(rectangleArray[counter].width==100)
        ctx.clearRect(rectangleArray[counter].xPoint, rectangleArray[counter].yPoint, 100, 100);
     }

   }
 }
}


 setTimeout(clear, 3000);
prevousIndex =-999;
prevousColor =-999;
prevousRowIndex =-999;
prevousColIndex =-999;
}
