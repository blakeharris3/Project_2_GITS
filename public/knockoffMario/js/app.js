/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                              /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  Global Objects & variables  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                              ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




let direction = {
    left: false,
    right: false,
    up: false,
    down: false
}

let mapCollision = {
    leftCol: false,
    topCol: false,
    topCol2: false,
    rightCol: false,
    bottomCol: false
}

let hexx = "#";
const hex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "A", "B", "C", "D", "E", "F"]
let gravity = 0.5;
let timer = 0;
let time2 = 0;
let fireCounter = 0;
let distanceCounter = 0;
let theCounter = 0;

let player2 = false;
let jump = false;

let player1T;
let player2T;
let theVal;

let $Timer
let $button;
let first;
let aBlock;
let a2Block;
let a3Block;
let tutG;






const rainbow = (arr) => {
    hexx = "#";
    for (let r = 0; r < 6; r++) {
        let value = arr[Math.floor(Math.random() * arr.length)]
        hexx += value
    }
    return hexx;
}

const detWinner = () => {
    if (player1T > player2T) {
        $('html').html("Player 1 Wins! " + timer + "." + time2 + "s").css({
            "font-size": "32px",
            "background-color": "green",
            "font-family": "Comic Sans"
        })
    } else if (player1T < player2T) {
        $('html').html("Player 2 Wins! " + timer + "." + time2 + "s").css({
            "font-size": "32px",
            "background-color": "green",
            "font-family": "Comic Sans"
        })

    }
}


///////////////////////////////////////////////////////////////////
const gameOver = () => {
    $('html').html("Game Over").css({
        "font-size": "32px",
        "background-color": "red",
        "font-family": "Comic Sans"
    })
}
///////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////                  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////  setting up Canvas     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');


const createBoard = () => {

    $Timer = $("<h1>Timer 0s</h1>")
    $("body").append($Timer);

    c = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 1000;
}



const startTimer = (playerTime) => {
    if (player2 === true) {
        timer = 0;
        time2 = 0;
        theVal = "";
        player2 = false;
    }
    let running = window.setInterval(() => {
        time2++;
        if (time2 === 99) {
            timer++;
            time2 = 0;
        }
        $Timer.text(`Timer: ${timer}. ${time2}s`)

        if (block18.leftX <= 75) {
            window.clearInterval(running)
            $('html').html("good job your time is " + timer + "." + time2 + "s " + "player 2's turn!").css({
                "font-size": "32px",
                "background-color": "green",
                "font-family": "Comic Sans"
            })
            theVal = timer + "." + time2;

            playerTime = parseInt(theVal);
            player2 = true;

            return playerTime;

        }
    }, 10)
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////                             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////         All Classes         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////                             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Ground {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    theGround(groundx, groundy) {
        c.beginPath();
        c.moveTo(0, tutG.y);
        c.lineTo(groundx, groundy);
        c.strokeStyle = "blue";
        c.stroke();
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Block {
    constructor(x, y, width, height) {
        this.leftX = x;
        this.topY = y;
        this.width = width;
        this.height = height;
        this.rightX = x + width;
        this.bottomY = y + height;
    }
    theEnemies(abx, aby, abw, abh) {
        let color = rainbow(hex)

        if (theCounter < 18) {
            c.fillStyle = color;
            theCounter++;
        }
        c.fillRect(abx, aby, abw, abh);
        c.fill();
    }


    moving(groundy, Pspeed, Pjump, PTopY, PBottomY) {
        // if your on top of a block you can still move

        if (mapCollision.topCol2 === true) {
            first.topY += 0;
            first.bottomY += 0;


            if (direction.left == true && mapCollision.topCol === true && mapCollision.rightCol === false) {

                mapCollision.leftCol = false;
                this.leftX += Pspeed;
                this.rightX += Pspeed;
            } else if (direction.right == true && mapCollision.topCol === true && mapCollision.leftCol === false) {
                mapCollision.leftCol = false;
                distanceCounter += Pspeed / 5;
                this.leftX -= Pspeed;
                this.rightX -= Pspeed;
            } else if (direction.up === true && (mapCollision.topCol2 === true || mapCollision.topCol === true)) {
                //  mapCollision.topCol = false;
                console.log("jumping!")
                first.topY -= Pjump;
                first.bottomY -= Pjump;


            }
        }

        //controls moving directions
        else if (direction.up === true && (mapCollision.topCol2 === true || mapCollision.topCol === true)) {
            //  mapCollision.topCol = false;
            console.log("jumping!")
            first.topY -= Pjump / 2;
            first.bottomY -= Pjump / 2;

            //   let ti = window.setTimeout(()=>{

            //   }, 100)


        } else if (direction.right == true /*&& mapCollision.topCol === true */ && mapCollision.leftCol === false) {
            // console.log("direction right",direction.right,"ground collison", mapCollision.topCol,"left collison", mapCollision.leftCol )
            mapCollision.rightCol = false;
            this.leftX -= Pspeed;
            this.rightX -= Pspeed;
        } else if (direction.right === true && mapCollision.leftCol === true) {
            console.log("this happend")
            this.leftX += 0;
            this.rightX += 0;
        } else if (direction.left == true && mapCollision.topCol === true && mapCollision.rightCol === false) {

            mapCollision.leftCol = false;
            this.leftX += Pspeed;
            this.rightX += Pspeed;
        } else if (direction.left === true && mapCollision.rightCol == true && mapCollision.topCol === true) {
            this.leftX += 0;
            this.rightX += 0;
            //gameOver()
        } else if (direction.down == true /*&& mapCollision.topCol === true*/ ) {
            first.topY += Pjump / 6;
            first.bottomY += Pjump / 6;

        } else if (direction.down === true && mapCollision.topCol == true) {
            //gameOver()
            this.bottomY += 0;
            this.topY += 0;
        } else {

            if (PBottomY < groundy) {
                first.bottomY += gravity / 2;
                first.topY += gravity / 2;
            } else if (PBottomY === groundy) {
                mapCollision.topCol = true;
            }

            if (mapCollision.topCol2 === true) {
                PTopY += 0;
                PBottomY += 0;
            }



        }
    }
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



class ThePlayer {
    constructor(x, y, width, height, dx, dy, health, ammo, win) {
        this.leftX = x;
        this.topY = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
        this.rightX = x + width;
        this.bottomY = y + height;


        this.health = health;
        this.ammo = ammo;
        this.win = win;
    }

    //visual player
    thePlayer(firstx, firsty, firstW, firstH) {
        // const image = document.getElementById("player")

        if (distanceCounter % 2 === 0) {
            c.drawImage(image, 10, 10, 275, 275, firstx, firsty, firstW, firstH);
        } else {
            c.drawImage(image, 310, 10, 275, 275, firstx, firsty, firstW, firstH);
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
game = {


    colDetObjLeft(PTopY, PBottomY, PRightX, OTopY, OBottomY, OLeftX) {


        if (PRightX === OLeftX) {


            if (((PBottomY >= OTopY && PBottomY <= OBottomY) && (PTopY < OTopY && PTopY < OBottomY))) {
                mapCollision.leftCol = true;

                return mapCollision.leftCol;
            } else if (((PBottomY >= OTopY && PBottomY >= OBottomY) && (PTopY >= OTopY && PTopY <= OBottomY))) {
                mapCollision.leftCol = true;

            } else if ((PBottomY < OTopY && PBottomY < OBottomY) && (PBottomY < OTopY && PBottomY < OBottomY)) {
                mapCollision.leftCol = false;

            } else if ((PBottomY > OTopY && PBottomY > OBottomY) && (PBottomY > OTopY && PBottomY > OBottomY)) {
                mapCollision.leftCol = false;

            } else {
                mapCollision.leftCol = false;

            }
        } else {
            mapCollision.leftCol = false;

        }
    },

    colDetObjRight(PTopY, PBottomY, PRightX, OTopY, OBottomY, OLeftX) {

        if (OLeftX === PRightX) {

            if (((PBottomY >= OTopY && PBottomY <= OBottomY) && (PTopY < OTopY && PTopY < OBottomY)) || ((PBottomY >= OTopY && PBottomY >= OBottomY) && (PTopY >= OTopY && PTopY <= OBottomY))) {
                mapCollision.rightCol = true;
                return;
            } else if ((PBottomY < OTopY && PBottomY < OBottomY) && (PBottomY < OTopY && PBottomY < OBottomY)) {
                mapCollision.rightCol = false;

            } else if ((PBottomY > OTopY && PBottomY > OBottomY) && (PBottomY > OTopY && PBottomY > OBottomY)) {
                mapCollision.rightCol = false;

            } else {
                mapCollision.rightCol = false;


            }
        } else {
            mapCollision.rightCol = false;

        }
    },
    colDetObjTop(PLeftX, PRightX, OLeftX, ORightX, PBottomY, OTopY) {


        if (PBottomY === OTopY) {

            //top left
            if ((PLeftX <= OLeftX && PLeftX <= ORightX) && (PRightX >= OLeftX && PRightX <= ORightX)) {
                mapCollision.topCol2 = true;
                console.log("this")
                return mapCollision.topCol2

            }

            // larger block spilling over sides, center <=/>=
            else if ((PLeftX <= OLeftX && PLeftX < ORightX) && (PRightX > OLeftX && PRightX >= ORightX)) {
                mapCollision.topCol2 = true;
                console.log("is")
                return mapCollision.topCol2;
            } else if (PLeftX <= OLeftX && PLeftX < ORightX) {
                console.log("no problem here")
            }

            //top right
            else if (((PLeftX >= OLeftX && PLeftX < ORightX) && (PRightX > OLeftX && PRightX >= ORightX))) {
                mapCollision.topCol2 = true;
                console.log("bull")
                return mapCollision.topCol2;


            }

            // Ground collision, center
            else if (((PLeftX >= OLeftX && PLeftX <= ORightX) && (PRightX >= OLeftX && PRightX <= ORightX))) {
                mapCollision.topCol = true;
                //console.log("shit")
                return mapCollision.topCol;


            }


            // not coliding with the block or the ground
            else if ((PLeftX < OLeftX && PLeftX < ORightX) && (PRightX < OLeftX && PRightX < ORightX)) {
                mapCollision.topCol2 = false;
                console.log("a")
            } else if ((PLeftX > OLeftX && PLeftX > ORightX) && (PRightX > OLeftX && PRightX > ORightX)) {
                mapCollision.topCol2 = false;
                console.log("b")

            } else {
                mapCollision.topCol = false;
                console.log("c")
            }
        } else {
            mapCollision.topCol2 = false;

        }

    }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const init = () => {


    first = new ThePlayer(75, 230, 90, 80, 5, 7, 3, 3, false);
    aBlock = new Block(400, 320, 70, 70);
    a2Block = new Block(900, 320, 70, 70);
    block1 = new Block(1010, 320, 70, 70);
    block3 = new Block(1350, 300, 40, 90);
    block4 = new Block(1650, 340, 20, 50);
    block6 = new Block(1725, 315, 30, 75);
    block8 = new Block(2000, 355, 215, 35);
    block9 = new Block(2300, 360, 150, 30);
    block12 = new Block(2600, 360, 50, 30);
    block13 = new Block(2900, 340, 225, 50);
    block14 = new Block(3200, 370, 20, 20);
    block15 = new Block(3600, 350, 20, 20);
    block16 = new Block(3950, 370, 20, 20);
    block18 = new Block(4300, 280, 45, 110);
    tutG = new Ground(4700, 390);


}

//////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////
const animation = () => {
    requestAnimationFrame(animation);
    c.clearRect(0, 0, innerWidth, innerHeight);



    tutG.theGround(tutG.x, tutG.y);
    first.thePlayer(first.leftX, first.topY, first.width, first.height);
    aBlock.theEnemies(aBlock.leftX, aBlock.topY, aBlock.width, aBlock.height);
    a2Block.theEnemies(a2Block.leftX, a2Block.topY, a2Block.width, a2Block.height);
    block1.theEnemies(block1.leftX, block1.topY, block1.width, block1.height);
    block3.theEnemies(block3.leftX, block3.topY, block3.width, block3.height);
    block4.theEnemies(block4.leftX, block4.topY, block4.width, block4.height);
    block6.theEnemies(block6.leftX, block6.topY, block6.width, block6.height);
    block8.theEnemies(block8.leftX, block8.topY, block8.width, block8.height);
    block9.theEnemies(block9.leftX, block9.topY, block9.width, block9.height);
    block12.theEnemies(block12.leftX, block12.topY, block12.width, block12.height);
    block13.theEnemies(block13.leftX, block13.topY, block13.width, block13.height);
    block14.theEnemies(block14.leftX, block14.topY, block14.width, block14.height);
    block15.theEnemies(block15.leftX, block15.topY, block15.width, block15.height);
    block16.theEnemies(block16.leftX, block16.topY, block16.width, block16.height);
    block18.theEnemies(block18.leftX, block18.topY, block18.width, block18.height);



    // tutG collision
    //game.colDetObjTop(first.leftX,first.rightX,0, tutG.x, first.bottomY, tutG.y)

    //aBlock collision
    if (aBlock.leftX <= 190 && aBlock.rightX >= 0) {
        // colDetObjTop(     PLeftX,       PRightX,      OLeftX,      ORightX,      PBottomY,      OTopY)
        game.colDetObjTop(first.leftX, first.rightX, aBlock.leftX, aBlock.rightX, first.bottomY, aBlock.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, aBlock.topY, aBlock.bottomY, aBlock.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, aBlock.topY, aBlock.bottomY, aBlock.leftX);


    }
    // a2Block collision
    if (a2Block.leftX <= 190 && a2Block.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, a2Block.leftX, a2Block.rightX, first.bottomY, a2Block.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, a2Block.topY, a2Block.bottomY, a2Block.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, a2Block.topY, a2Block.bottomY, a2Block.leftX);
    }

    // block 1 collision
    if (block1.leftX <= 190 && block1.rightX >= 0) {
        game.colDetObjTop(first.leftX, first.rightX, block1.leftX, block1.rightX, first.bottomY, block1.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block1.topY, block1.bottomY, block1.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block1.topY, block1.bottomY, block1.leftX)


    }
    // block 3 collision
    else if (block3.leftX <= 190 && block3.rightX >= 0) {
        console.log("left: ", block3.leftX, "   right: ", block3.rightX)
        game.colDetObjTop(first.leftX, first.rightX, block3.leftX, block3.rightX, first.bottomY, block3.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block3.topY, block3.bottomY, block3.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block3.topY, block3.bottomY, block3.leftX);

    }
    // block 4 collision
    else if (block4.leftX <= 190 && block4.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, block4.leftX, block4.rightX, first.bottomY, block4.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block4.topY, block4.bottomY, block4.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block4.topY, block4.bottomY, block4.leftX);
    }
    // block 6  collision
    else if (block6.leftX <= 190 && block6.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, block6.leftX, block6.rightX, first.bottomY, block6.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block6.topY, block6.bottomY, block6.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block6.topY, block6.bottomY, block6.leftX);
    }
    // block 8 collision
    else if (block8.leftX <= 190 && block8.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, block8.leftX, block8.rightX, first.bottomY, block8.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block8.topY, block8.bottomY, block8.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block8.topY, block8.bottomY, block8.leftX);
    }
    // block 9 collision
    else if (block9.leftX <= 190 && block9.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, block9.leftX, block9.rightX, first.bottomY, block9.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block9.topY, block9.bottomY, block9.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block9.topY, block9.bottomY, block9.leftX);
    }
    // block 12 collision
    else if (block12.leftX <= 190 && block12.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, block12.leftX, block12.rightX, first.bottomY, block12.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block12.topY, block12.bottomY, block12.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block12.topY, block12.bottomY, block12.leftX);
    }
    // block 13 collision
    else if (block13.leftX <= 190 && block13.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, block13.leftX, block13.rightX, first.bottomY, block13.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block13.topY, block13.bottomY, block13.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block13.topY, block13.bottomY, block13.leftX);
    }
    // block 14 collision
    else if (block14.leftX <= 190 && block14.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, block14.leftX, block14.rightX, first.bottomY, block14.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block14.topY, block14.bottomY, block14.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block14.topY, block14.bottomY, block14.leftX);
    }
    // block 15 collision
    else if (block15.leftX <= 190 && block15.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, block15.leftX, block15.rightX, first.bottomY, block15.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block15.topY, block15.bottomY, block15.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block15.topY, block15.bottomY, block15.leftX);
    }
    // block 16 collision
    else if (block16.leftX <= 190 && block16.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, block16.leftX, block16.rightX, first.bottomY, block16.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block16.topY, block16.bottomY, block16.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block16.topY, block16.bottomY, block16.leftX);
    }

    // block 18 collision
    else if (block18.leftX <= 190 && block18.rightX >= 0) {

        game.colDetObjTop(first.leftX, first.rightX, block18.leftX, block18.rightX, first.bottomY, block18.topY)
        game.colDetObjRight(first.topY, first.bottomY, first.leftX, block18.topY, block18.bottomY, block18.rightX)
        game.colDetObjLeft(first.topY, first.bottomY, first.rightX, block18.topY, block18.bottomY, block18.leftX);
    }

    aBlock.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    a2Block.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block1.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block3.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block4.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block6.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block8.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block9.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block12.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block13.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block14.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block15.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block16.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);
    block18.moving(tutG.y, first.dx, first.dy, first.topY, first.bottomY);

}






//i did it




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////                                        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////    buttons & console log functions     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////                                         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// the funcion callbacks based on which key codes are pressed
$(document).on("keydown", (event) => {
    if (event.keyCode == 39) {
        preventDefault()
        direction.right = true;
        distanceCounter++;
    } else if (event.keyCode == 38) {
        preventDefault()
        direction.up = true;
        //jump = true;

    } else if (event.keyCode == 37) {
        preventDefault()
        direction.left = true;


    } else if (event.keyCode == 40) {
        preventDefault()
        direction.down = true;

    }

    // the function call that fires bullets
    else if (event.keyCode == 32) {
        preventDefault()
        //fire();

    }
}).on("keyup", (event) => {

    //resets direction object
    if (event.keyCode == 39) {

        direction.right = false;
    } else if (event.keyCode == 38) {

        direction.up = false;
    } else if (event.keyCode == 37) {

        direction.left = false;

    } else if (event.keyCode == 40) {

        direction.down = false;
    }

    //resets firing mechanic
    else if (event.keyCode == 32) {
        console.log("stopped firing");
        fireCounter = 0;
    };
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////               /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////   Function calls  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////               ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let $StartGame = $("#start")
$StartGame.click(() => {
    $('body').append(createBoard());
    if (player2 === false) {

        c.clearRect(0, 0, innerWidth, innerHeight)
        init();
        animation();
        startTimer(player1T)

    } else if (player2 === true) {
        c.clearRect(0, 0, innerWidth, innerHeight)
        init();
        animation();
        startTimer(Player2T)
    }
})











function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}