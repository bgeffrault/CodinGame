/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const surfaceN = parseInt(readline()); // the number of points used to draw the surface of Mars.
var landPoints = new Array();
var traject = new Array();
var landingZone = new Array(2);
var xToLand;
var yToLand;
var angle;
var speed;
var deltaX; //Distance max de la position d'attérissage
var outPutChoosen;
var gravity;

gravity = -3,711;

for (let i = 0; i < surfaceN; i++) {
    var inputs = readline().split(' ');
    const landX = parseInt(inputs[0]); // X coordinate of a surface point. (0 to 6999)
    const landY = parseInt(inputs[1]); // Y coordinate of a surface point. By linking all the points together in a sequential fashion, you form the surface of Mars.
    landPoints[i] = new Array(2);
    landPoints[i][0]=landX;
    landPoints[i][1] = landY;
}
console.error(landPoints);

//calcul de la position où attérir
for(var i = 0; i < surfaceN-1; i++){

    if(landPoints[i][1]==landPoints[i+1][1]){

        landingZone[0]=i;
        landingZone[1]=i+1;
        console.error("Landing zone : "+landingZone);
        //Récupération de la valeur y où attérir
        yToLand = landPoints[i][1];
    }
}
xToLand = (landPoints[landingZone[1]][0]+landPoints[landingZone[0]][0])/2;

console.error("Landing X point : "+xToLand);
console.error("Landing Y point : "+yToLand);

deltaX = Math.abs(landPoints[landingZone[1]][0]-landPoints[landingZone[0]][0])/2;
console.error("Delta X : "+ deltaX);

// game loop
while (true) {
    var inputs = readline().split(' ');
    const X = parseInt(inputs[0]);
    const Y = parseInt(inputs[1]);
    const hSpeed = parseInt(inputs[2]); // the horizontal speed (in m/s), can be negative.
    const vSpeed = parseInt(inputs[3]); // the vertical speed (in m/s), can be negative.
    const fuel = parseInt(inputs[4]); // the quantity of remaining fuel in liters.
    const rotate = parseInt(inputs[5]); // the rotation angle in degrees (-90 to 90).
    const power = parseInt(inputs[6]); // the thrust power (0 to 4).

    // VSpeed = VSpeed + (Power * sin(Angle)) + g
    // HSpeed = HSpeed + (Power * cos(Angle))
    // X = X + HSpeed
    // Y = Y + VSpeed
    // Fuel = Fuel - Power; 
    outPutChoosen = false;
    //Go to landing zone
    
    // Right tests
    if(X < xToLand - deltaX){
        //Go to the right
        console.error("Go to the right");
        //Check if a peak is above or between the stelite and the landing zone
        for(var i = 0; i < surfaceN-1; i++){
            if( X < landPoints[i][0] && landPoints[i][0] < xToLand) {
               
                if( (Y <= (landPoints[i][1]+400)) && (landPoints[i][1] != yToLand) ){ // Safe space 200
                    //There is a peak to take care of
                    if(!outPutChoosen){
                        // Go UP 
                        console.error("There is peak, Go up");
                        angle = 0;
                        speed = 4;
                        outPutChoosen=true;
                        break;
                    }
                }
                
            }
        }
        // No peak to worry about, so go to the right
        if(!outPutChoosen){
            if(Y>= yToLand + 600){
                console.error("No peak to take care of, go to the right");
                angle = -30;
                speed = 4;
                console.error("hSpeed " +Math.abs(hSpeed));
                //Test max speed (40 m/s) 
                if(Math.abs(hSpeed)>200 && hSpeed >0){
                    console.error("hSpeed > 200 ");
                    angle = 90;
                    speed = 4;
                    outPutChoosen=true;
                }
                
                else if(Math.abs(hSpeed)>100 && Math.abs(hSpeed)<=200 && hSpeed >0){
                    console.error("100 < hSpeed <= 200 ");
                    angle = 90;
                    speed = 4;
                    outPutChoosen=true;
                }
                else if(Math.abs(hSpeed)>30 && Math.abs(hSpeed)<=100 && hSpeed >0){
                    console.error("15 < hSpeed <= 100 ");
                    angle = 45;
                    speed = 4;
                    outPutChoosen=true;
                }
                else if( Math.abs(hSpeed) >= 0 && Math.abs(hSpeed)<=30 ){
                    console.error("0 < hSpeed <= 15 ");
                    angle = -30;
                    speed = 4;
                }
                else{
                    console.error("AUtre");
                    angle = -30;
                    speed = 4;
                }
            }
            else{
                if(Math.abs(hSpeed)<40){
                    angle = -30;
                    speed = 4;
                }
                else{
                    angle = 0;
                    speed = 4;
                }
            }
            console.error("Angle " + angle);
            console.error("Speed " + speed);
        }
    }
    
    else if(X > xToLand + deltaX){
        //Go to the left
        console.error("Go to the left");
        //Check if a peak is above / between the stelite and the landing zone
        for(var i = 0; i < surfaceN-1; i++){
            if( X > landPoints[i][0] && landPoints[i][0] > xToLand) {
               
                if( (Y <= (landPoints[i][1]+200)) && (landPoints[i][1] != yToLand) ){ // Safe space 200
                    //There is a peak to take care of
                    if(!outPutChoosen){
                        // Go UP 
                        console.error("There is peak, Go up");
                        angle = 0;
                        speed = 4;
                        outPutChoosen=true;
                        break;
                    }
                }
                
            }
        }
        // No peak to worry about, so go to the left
        if(!outPutChoosen){
            if(Y>= yToLand + 600){
                console.error("No peak to take care of, go to the right");
                angle = 30;
                speed = 4;
                console.error("hSpeed " +Math.abs(hSpeed));
                //Test max speed (40 m/s) 
                if(Math.abs(hSpeed)>200 ){
                    console.error("hSpeed > 200 ");
                    angle = -90;
                    speed = 4;
                    outPutChoosen=true;
                }
                
                else if(Math.abs(hSpeed)>100 && Math.abs(hSpeed)<=200 && hSpeed <0){
                    angle = -90;
                    speed = 4;
                    outPutChoosen=true;
                }
                else if(Math.abs(hSpeed)>30 && Math.abs(hSpeed)<=100 && hSpeed <0){
                    angle = -45;
                    speed = 4;
                    outPutChoosen=true;
                }
                else if( Math.abs(hSpeed) > 0 && Math.abs(hSpeed)<=30 ){
                    angle = 30;
                    speed = 4;
                }
                else{
                    angle = 0;
                    speed = 0;
                }
            }
            else{
                if(Math.abs(hSpeed)<40){
                    angle = 30;
                    speed = 4;
                }
                else{
                    angle = 0;
                    speed = 4;
                }
            }
            console.error("Angle " + angle);
            console.error("Speed " + speed);
        }
    }
    
    //Landing zone : tests
    else  if(X > xToLand - deltaX && X < xToLand + deltaX){
        console.error("Landing zone");
        angle = 0;
        speed = 0;
        
        var radian = angle * Math.PI / 180;
        var hSpeed1 = hSpeed + speed*Math.cos(radian);
        var vSpeed1 = vSpeed + speed*Math.sin(radian) + gravity;
        var x1 = X + hSpeed1;
        var y1 = Y + vSpeed1;
        
        //Test max speed (40 m/s) and the nexts positions are in the landing range
        if(Math.abs(hSpeed)>200 ){
                console.error("hSpeed > 200 ");
                angle = hSpeed > 0 ? 90 : -90;
                speed = 4;
                outPutChoosen=true;
        }
        
        else if(Math.abs(hSpeed)>100 && Math.abs(hSpeed)<=200){
            console.error("100 < hSpeed <= 200 ");
            angle = hSpeed > 0 ? 90 : -90;
            speed = 4;
            outPutChoosen=true;
        }
        else if(Math.abs(hSpeed)>5 && Math.abs(hSpeed)<=100 ){
            console.error("40 < hSpeed <= 100 ");
            angle = hSpeed > 0 ? 30 : -30;
            speed = 4;
            outPutChoosen=true;
        }
        else if( Math.abs(hSpeed) > 0 && Math.abs(hSpeed)<=5){
            console.error("0 < hSpeed <= 5 ");
            if(Math.abs(vSpeed)>30){
                console.error("vSpeed > 30 ");
                angle = 0;
                speed = 4;
            }
            else{
                console.error("vSpeed autres ..... ");
                angle = 0;
                speed = 0;
            }
            
        }
        console.error("Angle " + angle);
        console.error("Speed " + speed);
        
    }
    else{
        console.error("Error calculation");   
    }
    
    

    // rotate power. rotate is the desired rotation angle. power is the desired thrust power.
    console.log(angle + ' ' + speed);
}