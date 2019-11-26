/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
 
 //TO DO Optimiser la vitesse du code
 
 
const CHROMOSOME_SIZE = 100;
const POPULATION_SIZE = 100;
//Selection parameters : Select the best 30% individuals
//Randomly select 20% of the rest
const BESTSELECTION = 20/100;
const RANDOMSELECTION = 0/100;
const REPRODUCTION = 90/100;
const MUTATION = 0.1/100;

//Init data
const POSINITX = 2500; //Adapter la simu
const POSINITY = 2700;
const SPEEDINITX = 0;
const SPEEDINITY = 0;
const GRAVITY = -3.711;
const LANDINGXSIZE = 7000;
const MAXLANDINGSPEEDV = 38; // A prendre en compte
const MAXLANDINGSPEEDH = 18; // A prendre en compte

//FITNESS "
const distanceRatio = 0.45;
const angleRatio = 0.1;
const speedRatio = 0.45;

const VSpeedRatio = 0.8; //Fitness Proportation of the speedRatio apply on V/H
const HSpeedRatio = 0.2;

//DRAW ?
const draw=true;

function random_Thrust_Output(thrustI){
    var thrustO = thrustI;
    rand = Math.round(Math.random()*100);
    if(rand<=33){
        thrustO =  thrustO > 0 ? thrustO -1 : thrustO;
    } else if(33 < rand && rand<=66){
        thrustO =  thrustO;
    } else {
        thrustO =  thrustO < 4 ? thrustO + 1 : thrustO;
    }
    //console.error("Thrust :"+thrustO);
    return thrustO;
    //return 1;                                                //Pour les tests
}

function random_Angle_Output(angleI){
    var angleO = angleI;
    var rand = Math.round(Math.random()*100);
    var diff = Math.floor((Math.random() * 15) + 1);
    if(rand<=33){
        angleO =  angleO+diff < 90 ? angleO +diff : 90;
    } else if(33 < rand && rand<=66){
        angleO =  angleO;
    } else {
        angleO =  angleO-diff > -90 ? angleO - diff : -90;
    }
    //console.error("Angle :"+angleO);
    return angleO;
                                              //Pour les tests
}

class Gene {
    constructor(pThrust, pAngle){
        this.thrust = random_Thrust_Output(pThrust);
        this.angle = random_Angle_Output(pAngle);
    }
    
}

class Chromosome {
    constructor(chrom_size){
        
        this.gene = new Array(chrom_size);
        for(let i = 0 ; i<chrom_size;i++){
            //console.error("Construction du gene : "+i); 
            this.gene[i] = i === 0 ? new Gene(0,0) : new Gene(this.gene[i-1].thrust,this.gene[i-1].angle);
        }
    }
}

class GeneticPopulation {
    constructor(pop_size, chrom_size){
        this.chromo = new Array(pop_size);
        for(let i = 0 ; i<pop_size;i++){
            //console.error("Construction de l'indicidu : "+i);
            this.chromo[i] = new Chromosome(chrom_size);
        }
    }
}

function simulation(chromo, posInitX, posInitY, speedInitX, speedInitY, nbrOfSurface, landPoints, landX, landY, deltaX, solution){
	var previousPosX = posInitX;
    var previousPosY = posInitY;
    var previousSpeedX = speedInitX;
    var previousSpeedY = speedInitY;
    var newPosX;
    var newPosY;
    var simuPosX;
    var simuPosY;
    var collision=false;
	var oldDrawPosX;
	var oldDrawPosY;
	var indexCollision=-1;
    for(let i=0; i<CHROMOSOME_SIZE;i++){
        //console.error("i : "+i);
        //console.error("Chrom :" + chromo.gene[i].thrust);

        var thrust = chromo.gene[i].thrust;
		var pThrust = i > 0 ? chromo.gene[i-1].thrust : 0;
		//Controle limit rotation
		if(thrust < pThrust ){ //Décroissant
			thrust = thrust >= pThrust-1 ? thrust : pThrust-1 ;
		} else if(thrust > pThrust ){ //Croissant
			thrust = thrust <= thrust+1 ? thrust : thrust+1 ;
		}
        //console.error("Thrust : " + thrust);
		
        var angle = chromo.gene[i].angle;
		var pAngle = i > 0 ? chromo.gene[i-1].angle : 0;
		//Controle limit rotation
        if(angle < pAngle ){ //Décroissant
			angle = angle >= pAngle-15 ? angle : pAngle-15 ;
		} else if(angle > pAngle ){ //Croissant
			angle = angle <= pAngle+15 ? angle : pAngle+15 ;
		}
		
        angleRadian = angle * Math.PI / 180; 
        
        //Calcule NewV first
        newPosX = Math.round((previousPosX + previousSpeedX + (thrust*(Math.cos(angleRadian+Math.PI/2))))*1000)/1000;
        newPosY = Math.round((previousPosY + previousSpeedY + (thrust*(Math.sin(angleRadian+Math.PI/2))) + GRAVITY)*1000)/1000;
        
        
        //SimuPosX et Y to dump
        simuPosX = Math.round((previousPosX  + (newPosX-previousPosX)/2)*1000)/1000;
        simuPosY = Math.round((previousPosY  + (newPosY-previousPosY)/2)*1000)/1000;
        
		if(draw || solution){
			if(i==0){
				drawLine(posInitX,posInitY,simuPosX,simuPosY,"#000000");
				
			} else {
				drawLine(oldDrawPosX,oldDrawPosY,simuPosX,simuPosY,"#000000");
			}
        }
		
		previousSpeedX = Math.round((newPosX - previousPosX)*1000)/1000;
        previousSpeedY = Math.round((newPosY - previousPosY)*1000)/1000;
        
        //console.error(" previousSpeedY : " +previousSpeedY);
        var tmp = i+1;
        //console.error("Time : " + tmp + "   Simu pos X : " +simuPosX +"   previousSpeedX : " + previousSpeedX);
        //console.error("Time : " + tmp + "   Simu pos Y : " +simuPosY +"   previousSpeedY : " + previousSpeedY);
        //To do : dump new pos
        
        //Check for collision
        for(let j = 1; j < nbrOfSurface; j++){
            //landPoints[i][0]=landX;
            //landPoints[i][1] = landY;
            x1 = landPoints[j-1][0];
            y1 = landPoints[j-1][1];
            x2 = landPoints[j][0];
            y2 = landPoints[j][1];
            collision = intersects(oldDrawPosX, oldDrawPosY, simuPosX, simuPosY, x1, y1, x2, y2);
			if(collision) break;
            //To do : if collision, put the last 2 gene (maybe 90/15 = 6 genes to go to angle 0) ?
        }
		if(collision) {
			indexCollision=i;
			break;
		}
        //Continu the simulation
        previousPosX = newPosX;
        previousPosY = newPosY;
		oldDrawPosX = simuPosX;
		oldDrawPosY = simuPosY;
    }
    //Collision -> get the fitness score
    var score = fitness_Score(previousSpeedX, previousSpeedY, angle, simuPosX, simuPosY, landX, landY, deltaX, collision);
	//console.error("Score :" + score);
	//Adaptation des angles pour collision
	if(score >= distanceRatio && indexCollision>-1){
		if(Math.abs(angle)>0){
			//console.error("index collision (gene) :" +indexCollision);
			chromo.gene[indexCollision].angle = 0;
			while(Math.abs(chromo.gene[indexCollision-1].angle) > Math.abs(chromo.gene[indexCollision].angle)+15){
				chromo.gene[indexCollision-1].angle = chromo.gene[indexCollision-1].angle > 0 ? chromo.gene[indexCollision].angle + 15 : chromo.gene[indexCollision].angle - 15;
				indexCollision--;
			}
		}
	}
	if(score ==1){
		for(let k=indexCollision+1;k<CHROMOSOME_SIZE;k++){
			chromo.gene[k].angle = 0;
		}
	}
    return score;
}

// return true iff the line intersetcs
function intersects(x1,y1,x2,y2, x3,y3,x4,y4) {
    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    if (isNaN(x)||isNaN(y)) {
        return false;
    } else {
        if (x1>=x2) {
            if (!(x2<=x&&x<=x1)) {return false;}
        } else {
            if (!(x1<=x&&x<=x2)) {return false;}
        }
        if (y1>=y2) {
            if (!(y2<=y&&y<=y1)) {return false;}
        } else {
            if (!(y1<=y&&y<=y2)) {return false;}
        }
        if (x3>=x4) {
            if (!(x4<=x&&x<=x3)) {return false;}
        } else {
            if (!(x3<=x&&x<=x4)) {return false;}
        }
        if (y3>=y4) {
            if (!(y4<=y&&y<=y3)) {return false;}
        } else {
            if (!(y3<=y&&y<=y4)) {return false;}
        }
    }
    return true;
}

function fitness_Score(HSpeed, VSpeed, angle, x, y, landX, landY, deltaX, collision){
    //console.error("fitness score ...");
	var score = 0;  
    var distanceScore = 0;
    var angleScore = 0;
    var speedScore = 0;
    
	if(collision){
		
		//console.error("distance score "+distanceScore);
		//Calcul angle/speed score -----------------------
		
		//Calcul distance score -----------------------
		var distanceX = landX-x;
		if(Math.abs(distanceX)<100){
			distanceScore = distanceRatio;
		} else {
			distanceScore = distanceRatio / (Math.sqrt((landX-x)*(landX-x)+(landY-y)*(landY-y))) ;
		
		} 
		
		if(distanceScore>=distanceRatio){
			console.error("On prend en compte la speed");
			//Speed score
			if(Math.abs(HSpeed)<=MAXLANDINGSPEEDH && Math.abs(VSpeed) <=MAXLANDINGSPEEDV){
				speedScore = speedRatio;
			} else {
				
				if(Math.abs(HSpeed)<=MAXLANDINGSPEEDH){
					speedScore = speedRatio*HSpeedRatio;
				} else{
					speedScore = (speedRatio*HSpeedRatio)/(1+Math.abs(HSpeed)-MAXLANDINGSPEEDH);
				}
				
				if(Math.abs(VSpeed)<=MAXLANDINGSPEEDV){
					speedScore = speedRatio*VSpeedRatio +speedScore
				} else{
					speedScore = (speedRatio*VSpeedRatio)/(1+Math.abs(VSpeed)-MAXLANDINGSPEEDV) + speedScore; 
				}
			}
			
			if(speedScore>speedRatio){
				confirm("Speedscore > speedRatio");
			}
		}
		
		//Si speedscore a atteind son max ou pourcentage du max ...
		//Si distanceScore a atteind son max ou pourcentage du max ..
		if(speedScore+distanceScore>=(distanceRatio+speedRatio)/2){
			if(distanceScore>=distanceRatio/2){
				angleScore = ((angleRatio*10)/(1+Math.abs(angle)))/10;
				if(angleScore>angleRatio){
					confirm("angleScore > angleRatio");
				}
			}
			//console.error("Score : "+ score +"  AngleScore : " + angleScore + " SpeedScore : " + speedScore + " distanceScore : " + distanceScore + " distance : " + distanceX +" HSPEED : " + HSpeed + " VSPEED : " + VSpeed + " Angle : " + angle);
			
		}
		
			
		score =angleScore + speedScore + distanceScore;
		if(score >= 1){
			console.error("solution");
		}
	} else {
		score = 0;
	}
    return score;
}

function selection(sortedScoreChromo,scoreChromo,basePopulation, sumFitnessScores, newGeneration){

	//
	
	
	/*
	console.error("Debug :");
	console.error("sortedScoreChromo " + sortedScoreChromo);
	console.error("scoreChromo " + scoreChromo);
	console.error("basePopulation " + basePopulation);*/
	
	//Best pop
	var offset = 0;
	var pScore = 0;
	for(let i=0; i<(POPULATION_SIZE*BESTSELECTION);i++){
		var scoreSorted = sortedScoreChromo[i];
		var index =scoreChromo.indexOf(scoreSorted);
		//Améliorer l'offset
		if(pScore == scoreSorted && i!=0) {
			offset = index;
			index =scoreChromo.indexOf(scoreSorted, offset+1);
		}
		//console.error("i : " +i+"  scoreSorted  :"+scoreSorted +" index " + index  + "  offset :"+offset);
		
		pScore = scoreSorted;
	    newGeneration.chromo[i] = basePopulation.chromo[index];
	    //console.error("New gene Best " +i+ " : " +newGeneration.chromo[i]);
	}
	
	
	//Random selection
	for(let i=(POPULATION_SIZE*BESTSELECTION); i < (POPULATION_SIZE*BESTSELECTION + POPULATION_SIZE*RANDOMSELECTION); i++){
	    var rand = Math.floor(Math.random() * POPULATION_SIZE-1) + 1 ; 
		//console.error("Random selection index: " + rand);
	    newGeneration.chromo[i] = basePopulation.chromo[rand];
	    //console.error("RANDOMSELECTION "+basePopulation.chromo[rand]);
	    //console.error("New gene Random " +i+ " : " +newGeneration.chromo[i]);
	}
	
	//Reproduction Crossover
	for(let i=(POPULATION_SIZE*REPRODUCTION); i<POPULATION_SIZE;i++){
    	/*var p1 = Math.floor(Math.random()*POPULATION_SIZE);
    	var p2 = Math.floor(Math.random()*POPULATION_SIZE);*/
		
		var index1;
		var index2;
		for(let k=0; k<2; k++){
			var sum=0;
			var j = 0;
			var randNumber = Math.random()*sumFitnessScores;
			while(sum<randNumber){
				sum = sum + sortedScoreChromo[j];
				j++;
				//console.error(" Sum : " + sum + " randNumber : " + randNumber + " sumFitnessScores : "+sumFitnessScores);
			}
			if(k==0) index1 = j-1;
			if(k==1) index2 = j-1;
				
		}
		
		var indexTemp1 = sortedScoreChromo[index1];
		var indexTemp2 = sortedScoreChromo[index2];
		
		var p1 =scoreChromo.indexOf(indexTemp1);
		var p2 =scoreChromo.indexOf(indexTemp2);
		
		
    	//console.error("p1 :"+p1 + "    basepop.chromo[p1] ",basePopulation.chromo[p1]);
		//console.error("p2 :"+p2 + "    basepop.chromo[p2] ",basePopulation.chromo[p2]);
    	newGeneration.chromo[i] = crossover(basePopulation.chromo[p1], basePopulation.chromo[p2]);
	    //Mutation
	    newGeneration.chromo[i] = mutation(newGeneration.chromo[i]);
	    //console.error("New gene Crossover " +i+ " : " +newGeneration.chromo[i]);
	}
	for(let i=0; i<POPULATION_SIZE; i++){
        //console.error("Newgene " +i+ " : " +newGeneration.chromo[i]);
    }
	
	return newGeneration;
}

function crossover(parent1, parent2){
    //Two-point and k-point crossover
    var ar = new Array(2);
    var child = new Chromosome(CHROMOSOME_SIZE);
    ar[0] = Math.floor(Math.random()*CHROMOSOME_SIZE)+1;
    ar[1] = Math.floor(Math.random()*CHROMOSOME_SIZE)+1;
    ar.sort((a,b) => a-b);
    for(let i=0; i<CHROMOSOME_SIZE;i++){
        if(i < ar[0]){
            child.gene[i] = parent1.gene[i];  
        } else if (ar[0] <= i && i<ar[1]){
            child.gene[i] = parent2.gene[i];  
        } else {
            child.gene[i] = parent1.gene[i];  
        }
    }
    //console.error("p1 : " + parent1.gene[38].angle);
    //console.error("p2 : " + parent2.gene[38].angle);
    //console.error("child : " + child.gene[38].angle);
    return child;
}

function mutation(chromo){
    var rand = Math.random();
    if(rand<=MUTATION){
        var i = Math.floor(Math.random()*(CHROMOSOME_SIZE-1))+1;
        console.error("MUTATION On i : " + i);
        //console.error("chromo.gene[i].angle: " + chromo.gene[i].angle);
        //console.error("chromo.gene[i].thrust" + chromo.gene[i].thrust);
		var pAngle = chromo.gene[i-1].angle;
		//console.error("Previous angle :"+pAngle);
        chromo.gene[i].angle = random_Angle_Output(pAngle);
        chromo.gene[i].thrust = random_Thrust_Output(chromo.gene[i-1].thrust);
        //console.error("chromo.gene[i].angle: " + chromo.gene[i].angle);
        //console.error("chromo.gene[i].thrust" + chromo.gene[i].thrust);
    }
    return chromo;
}

//-------------------------------------Drawing functions-------------------------------
function drawCanvas(){
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasDiv');
	var canvas = document.createElement('canvas');
	var att1 = document.createAttribute("width");
	var att2 = document.createAttribute("height");
	var att3 = document.createAttribute("id");
	att1.value = "700";
	att2.value = "300";
	att3.value = "canvas";
	canvas.setAttributeNode(att1);
	canvas.setAttributeNode(att2);
	canvas.setAttributeNode(att3);
	canvasDiv.appendChild(canvas);
}

function drawLine(x1,y1,x2,y2,color){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	ctx.moveTo(x1/10, (3000-y1)/10);
	ctx.lineTo(x2/10, (3000-y2)/10);
	// set line color
    //context.strokeStyle = '#ff0000';
	ctx.strokeStyle = color;
	ctx.stroke();
}

function cleanCanvas(){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);	
	ctx.beginPath();
}
//-------------------------------------END Drawing functions-------------------------------

//var chromo = new Chromosome(CHROMOSOME_SIZE);
//console.error("chromo T:" + chromo.gene[0].thrust);
//console.error("chromo A:" + chromo.gene[0].angle);
//var basePopulation = new GeneticPopulation(POPULATION_SIZE, CHROMOSOME_SIZE);
//console.error("Individu 99 thrust:"+basePopulation.chromo[99].gene[99].thrust);
//console.error("Individu 99 angle:"+basePopulation.chromo[99].gene[99].angle);

//console.error("Individu 0 thrust:"+basePopulation.chromo[0].gene[0].thrust);
//console.error("Individu 0 angle:"+basePopulation.chromo[0].gene[0].angle);

//Search the landing zone ----------------------------------------
function run(){
	const surfaceN = 7;//parseInt(readline()); // the number of points used to draw the surface of Mars.
	var landPoints = new Array(surfaceN);
	var landingZone = new Array(2);
	var deltaX; //Distance max de la position d'attérissage

	for (let i = 0; i < surfaceN; i++) {
		//var inputs = readline().split(' ');
		//const landX = parseInt(inputs[0]); // X coordinate of a surface point. (0 to 6999)
		//const landY = parseInt(inputs[1]); // Y coordinate of a surface point. By linking all the points together in a sequential fashion, you form the surface of Mars.
		landPoints[i] = new Array(2);
		switch(i) {
			case 0 :
				landPoints[i][0]=0;
				landPoints[i][1] = 100;
				break;
			case 1 :
				landPoints[i][0]=1000;
				landPoints[i][1] = 500;
				break;
			case 2 :
				landPoints[i][0]=1500;
				landPoints[i][1] = 1500;
				break;
			case 3 :
				landPoints[i][0]=3000;
				landPoints[i][1] = 1000;
				break;
			case 4 :
				landPoints[i][0]=4000;
				landPoints[i][1] = 150;
				break;
			case 5 :
				landPoints[i][0]=5500;
				landPoints[i][1] = 150;
				break;
			case 6 :
				landPoints[i][0]=6999;
				landPoints[i][1] = 800;
				break;
		}
		//landPoints[i][0]=landX;
		//landPoints[i][1] = landY;
	}
	//console.error(landPoints);
	if(draw) drawCanvas();
	//calcul la position où attérir
	for(var i = 0; i < surfaceN-1; i++){
		if(landPoints[i][1]==landPoints[i+1][1]){

			landingZone[0]=i;
			landingZone[1]=i+1;
			//console.error("Landing zone : "+landingZone);
			//Récupération de la valeur y où attérir
			yToLand = landPoints[i][1];
		}
	}
	xToLand = (landPoints[landingZone[1]][0]+landPoints[landingZone[0]][0])/2;

	deltaX = Math.abs(landPoints[landingZone[1]][0]-landPoints[landingZone[0]][0])/2;
	//console.error("Delta X : "+ deltaX);
	//----------------------------------------

	//SIMULATION
	var generation = 0;
	var basePopulation = new GeneticPopulation(POPULATION_SIZE, CHROMOSOME_SIZE);
	var scoreChromo = new Array(POPULATION_SIZE);
	var sortedScoreChromo = new Array(POPULATION_SIZE) ;
	var solution = false;
	var bestChromo = new Chromosome(CHROMOSOME_SIZE);
	var pBestScore=0;
	var bestScore=0;
	var scoreMoy;
	var sumFitnessScores = 0 ;
	var newGeneration = new GeneticPopulation(POPULATION_SIZE, CHROMOSOME_SIZE);
	
	var tMoy = 0;
	var tMoyMoy = 0 ;
	while(!solution){
		generation++;
		console.error("Begin new generation : "+generation);
		//console.error("Base pop : ", basePopulation);
		if(draw){
			cleanCanvas();
			for(var i = 0; i < surfaceN-1; i++){
				drawLine(landPoints[i][0],landPoints[i][1],landPoints[i+1][0],landPoints[i+1][1],"#ff0000");
			}
		}
		console.error("Simulation ...");
		scoreMoy=0;
		sumFitnessScores=0;
		for(let i =0; i <POPULATION_SIZE; i++){
			//console.error("index pop :" +i);
			//Ajouter dans la simu la contrainte +-15 et de puissance
			var t0 = performance.now();
			scoreChromo[i] = simulation(basePopulation.chromo[i], POSINITX, POSINITY, SPEEDINITX, SPEEDINITY, surfaceN, landPoints, xToLand, yToLand, deltaX, solution);
			var t1 = performance.now();
			tMoy= tMoy + t1 - t0;
			sortedScoreChromo[i] = scoreChromo[i];
			scoreMoy = scoreMoy + scoreChromo[i];
			sumFitnessScores = sumFitnessScores + scoreChromo[i];
			//console.error("Chromo : " + i + "  Score : " + scoreChromo[i]);
			
		}
		//console.log("Call to doSomething took " + tMoy/POPULATION_SIZE + " milliseconds.");
		tMoyMoy = tMoyMoy + tMoy;
		tMoy=0;
		//console.error("Score not sorted : " , scoreChromo);
		//console.error("Score before sorted (array 2): " , sortedScoreChromo);
		
		console.error("Sorting ...");

		//console.error("Chromo : " + 0 + "  Score : " + scoreChromo[0]);
		sortedScoreChromo.sort((a, b) => b - a); // For descending sort
		
		//console.error("Sorted score : " , sortedScoreChromo);
		
		bestScore = sortedScoreChromo[0];
		scoreMoy = scoreMoy / POPULATION_SIZE ; 
		console.error("bestScore : " + bestScore + " pBestScore : " +pBestScore + " ScoreMoy : " + scoreMoy + " SumScore : " + sumFitnessScores);
		if(bestScore< pBestScore){
			//confirm("Best score regression");
		}
		
		//Check if there is a solution
		if(sortedScoreChromo[0]>=1){
			//We got a solution
			console.error("We got a solution");
			solution=true;
			console.error("index : "+scoreChromo.indexOf(sortedScoreChromo[0]));
			bestChromo = basePopulation.chromo[scoreChromo.indexOf(sortedScoreChromo[0])];
			drawCanvas();
			cleanCanvas();
			for(var i = 0; i < surfaceN-1; i++){
				drawLine(landPoints[i][0],landPoints[i][1],landPoints[i+1][0],landPoints[i+1][1],"#ff0000");
			}
			simulation(bestChromo, POSINITX, POSINITY, SPEEDINITX, SPEEDINITY, surfaceN, landPoints, xToLand, yToLand, deltaX, solution);
			console.log("Call to doSomething took average " + tMoyMoy/generation + " milliseconds.");
			break;
		}
		//console.error("Chromo : " + 0 + "  Score : " + scoreChromo[0]);
		//console.error("Best chromo : " + bestChromo);
		console.error("Selection ...");
		basePopulation = selection(sortedScoreChromo,scoreChromo,basePopulation,sumFitnessScores, newGeneration);
		
		console.error("END SELECTION New pop ");
		pBestScore = bestScore;
		/*for(let i=0; i<POPULATION_SIZE; i++){
			console.error("basepop " +i+ " : " +basePopulation.chromo[i]);
		}*/
		
	}
/*
	for(let i=0; i<CHROMOSOME_SIZE;i++){
		var outputAngle = bestChromo.gene[i].angle;
		var outputThrust = bestChromo.gene[i].thrust;
		console.log(outputAngle + ' ' + outputThrust);
	}*/
}