////////////////////////////////////////////////////////////////////////////////////////////////////////Variables
var playerName = document.getElementById("player-name");
var newPlayer = document.getElementById("new-player");
var cont = document.getElementById("cont");
var welcome = document.getElementById("welcome");
var game = document.getElementById("game");
var endGame = document.getElementById("end");
var finalScore = document.getElementById("final-score");
var shark= document.getElementById("shark");
var upBtn= document.getElementById("up");
var downBtn= document.getElementById("down");
var shootBtn= document.getElementById("shoot");
var pause= document.getElementById("pause");
var volume= document.getElementById("volume");
var nameDisp = document.getElementById("current-player");
var lifeDisp = document.getElementById("life");
var scoreDisp = document.getElementById("score");
var missileDisp = document.getElementById("missile");
var levelDisp = document.getElementById("level");
var bubbles = document.querySelector('.bubbles');
var score;
var gameSpeed;
var pos= 250;
var speed= 20;
var level;
var levelScore= 100;
var currentBgPosition = 0;
var gameIsOn= false;
var volumeIsOn= true;
var name;
var life;
var score;
var missile;
var obs;
var f;
var bg;
//sounds
var bgSound = new sound("sounds/bg.mp3");
var eatsound = new sound("sounds/eat3.wav");
var missleSound= new sound("sounds/shot2.wav");
var explosionSound = new sound("sounds/explosion.wav");

/////////////////////////////////////////////////////////////////////////////////////////////////////////Functions
//function to display player data
function display()
{
    nameDisp.textContent= name;
    scoreDisp.textContent= score;
    lifeDisp.textContent= life;
    missileDisp.textContent= missile;
    levelDisp.textContent= level;
}
//function to move the shark up
function up()
{
    if(gameIsOn)
    {
        if(pos > 110)
        {
            pos-= speed;
            shark.style.top= pos + "px";
        }
    }
}
//function to move the shark down
function down()
{
    if(gameIsOn)
    {
        if(pos < 560)
        {
            pos+= speed;
            shark.style.top= pos + "px";
        }
    }   
}
//function to create a fish
function createFish()
{
    if(gameIsOn)
    {
        var image= document.createElement("img");
        //random fish kind
        var r1= Math.floor(Math.random()*7);
        image.src= "images/fish" +r1+ ".png";
        image.setAttribute("class", "fish");
        image.setAttribute("alt", "fish");
        image.style.right = "-150px";
        //random position
        var r2= Math.floor(Math.random()*451) + 110;
        image.style.top = r2 + "px";
        //random speed
        var r2= Math.floor(Math.random()*10) + gameSpeed;
        image.setAttribute("speed", r2);
        game.appendChild(image);
    }
}
//function to move fish
function moveFish()
{
    if(gameIsOn)
    {
        f= document.querySelectorAll(".fish");
        var newP;
        for(let i=0; i<f.length; i++)
        {
            newP = parseInt(f[i].style.right) + parseInt(f[i].getAttribute("speed"));
            f[i].style.right = newP +"px";
            if(newP>900 && newP<940 && parseInt(f[i].style.top)>(parseInt(shark.style.top)-30) && parseInt(f[i].style.top)<(parseInt(shark.style.top)+40))
            {
                if(f[i].style.display !== "none")
                {
                    if(volumeIsOn)
                    {
                        eatsound.play();
                    }
                    score +=10;
                    display();
                    if(score % levelScore === 0 && score !== 0)
                    {
                        level++;
                        localStorage.setItem(`${name}_level`, level);
                        levelUp();
                        display();
                        gameSpeed += 5;
                        localStorage.setItem(`${name}_speed`, gameSpeed);
                    }
                }
                f[i].style.display= "none";
            }
            if(newP > 1600)
            {
                f[i].remove();
            }
        }
        localStorage.setItem(name, score);
    }
}
//function to create an obstacle
function createObstacle()
{
    if(gameIsOn)
    {
        var image= document.createElement("img");
        //random fish kind
        var r1= Math.floor(Math.random()*2);
        image.src= "images/sub" +r1+ ".png";
        image.setAttribute("class", "sub");
        image.setAttribute("alt", "obstacle");
        image.style.right = "-150px";
        //random position
        var r2= Math.floor(Math.random()*451) + 110;
        image.style.top = r2 + "px";
        //random speed
        var r2= Math.floor(Math.random()*15) + gameSpeed + 1;
        image.setAttribute("speed", r2);
        game.appendChild(image);
    }
}
//function to move obstacle
function moveObstacle()
{
    if(gameIsOn)
    {
        obs= document.querySelectorAll(".sub");
        var newP;
        for(let i=0; i<obs.length; i++)
        {
            newP = parseInt(obs[i].style.right) + parseInt(obs[i].getAttribute("speed"));
            obs[i].style.right = newP +"px";
            if(newP>900 && newP<940 && parseInt(obs[i].style.top)>(parseInt(shark.style.top)-50) && parseInt(obs[i].style.top)<(parseInt(shark.style.top)+40))
            {  
                if(obs[i].style.display !== "none")
                {
                    life--;
                    if(volumeIsOn)
                    {
                        explosionSound.play();
                    }
                    if(life<1)
                    {
                        gameIsOn = false;
                        bgSound.stop();
                        game.style.display= "none";
                        endGame.style.display= "block";
                        finalScore.textContent= score;
                        score= 0;
                        life= 5;
                        missile= 50;
                        gameSpeed= 2;
                        level= 1;
                        localStorage.setItem(`${name}_level`, level);
                        localStorage.setItem(`${name}_speed`, gameSpeed);
                        localStorage.setItem(name, score);
                        localStorage.setItem(`${name}_life`, life);
                        localStorage.setItem(`${name}_missile`, missile);
                    }
                    display();
                    shark.style.display = "none";
                    setTimeout(()=>{
                        shark.style.display = "block";
                        setTimeout(()=>{
                            shark.style.display = "none";
                            setTimeout(()=>{shark.style.display = "block";}, 250);
                        }, 250);
                    }, 250);
                }
                obs[i].style.display= "none";
            }
            localStorage.setItem(`${name}_life`, life);
            if(newP > 1600)
            {
                obs[i].remove();
            }
        }
    }
}
//function to create missile
function createMissile()
{
    if(gameIsOn && missile !== 0)
    {
        var image= document.createElement("img");
        image.src= "images/missile.png";
        image.setAttribute("class", "missile");
        image.setAttribute("alt", "missile");
        image.style.right = "900px";
        image.style.top = shark.style.top;
        game.appendChild(image);
        missile--;
        display();
        localStorage.setItem(`${name}_missile`, missile);
        if(volumeIsOn)
        {
            missleSound.play();
        }
    }
}
//function to move missile
function moveMissile()
{
    if(gameIsOn)
    {
        var m= document.querySelectorAll(".missile");
        var newP;
        for(let i=0; i<m.length; i++)
        {
            newP = parseInt(m[i].style.right) - 20;
            m[i].style.right = newP +"px";
            if(newP < 0)
            {
                m[i].style.display = "none";
            }
            for(let j=0; j<obs.length; j++)
            {
                if(parseInt(m[i].style.top)>(parseInt(obs[j].style.top)-20) && parseInt(m[i].style.top)<(parseInt(obs[j].style.top)+30) && parseInt(m[i].style.right)>(parseInt(obs[j].style.right)-20) && parseInt(m[i].style.right)<(parseInt(obs[j].style.right)+20))
                {
                    if(m[i].style.display !== "none" && obs[j].style.display !== "none")
                    {
                        m[i].style.display = "none";
                        obs[j].style.display = "none";
                        if(volumeIsOn)
                        {
                            explosionSound.play();
                        }
                    }
                }
            }
            for(let k=0; k<f.length; k++)
            {
                if(parseInt(m[i].style.top)>(parseInt(f[k].style.top)-20) && parseInt(m[i].style.top)<(parseInt(f[k].style.top)+20) && parseInt(m[i].style.right)>(parseInt(f[k].style.right)-15) && parseInt(m[i].style.right)<(parseInt(f[k].style.right)+15))
                {
                    if(m[i].style.display !== "none" && f[k].style.display !== "none")
                    {
                        m[i].style.display = "none";
                        f[k].style.display = "none";
                    }
                }
            }
            if(newP < -140)
            {
                m[i].remove();
            }
        }
    }
}


//functions to move game background 
function scrollGameBackground()
{
    if(gameIsOn)
    {
        currentBgPosition --;
        document.getElementById("game").style.backgroundPosition= currentBgPosition +"px 0";
        if (currentBgPosition === -1540)
        {
            currentBgPosition= 0;
        }
    }
}
function beginBg(){
    bg= setInterval(scrollGameBackground, 15);
}

//function constructor to create a sound audio
function sound(source) 
{
    this.sound = document.createElement("audio");
    this.sound.src = source;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

//function to display level up
function levelUp()
{
    let lev = document.createElement("div");
    lev.classList.add("level-up");
    lev.textContent= "Level Up!";
    game.appendChild(lev);
    setTimeout(()=>{
        lev.remove();
    }, 2000);
}

///////////////////////////////////////////////////////////////////////////////////////////////////Event Listeners
//create a new player
newPlayer.addEventListener("click", ()=> {
    var n = playerName.value;
    if(localStorage.getItem(n) === null)
    {
        name= n;
        score= 0;
        life= 5;
        missile= 50;
        gameSpeed= 2;
        level= 1;
        localStorage.setItem(`${n}_speed`, gameSpeed);
        localStorage.setItem(n, score);
        localStorage.setItem(`${n}_life`, life);
        localStorage.setItem(`${n}_missile`, missile);
        localStorage.setItem(`${n}_level`, level);
        welcome.style.display = "none";
        game.style.display = "block";
        gameIsOn= true;
        bgSound.play();
        display();
        beginBg();
    }
    else
    {
        alert("Already Exists, Choose Another Name");
    }
});
//continue with existing player
cont.addEventListener("click", ()=> {
    var n = playerName.value;
    if(localStorage.getItem(n) === null)
    {
        alert("Doesn't Exist, Create new player");
    }
    else
    {
        name= n;
        score= parseInt(localStorage.getItem(n));
        life= parseInt(localStorage.getItem(`${n}_life`));
        missile= parseInt(localStorage.getItem(`${n}_missile`));
        gameSpeed= parseInt(localStorage.getItem(`${n}_speed`));
        level = parseInt(localStorage.getItem(`${n}_level`));
        welcome.style.display = "none";
        game.style.display = "block";
        gameIsOn= true;
        bgSound.play();
        display();
        beginBg();
    }
});

document.addEventListener("keydown", (event)=>{
    if(event.keyCode == 38) 
    {
        up();
    }
    else if(event.keyCode == 40) 
    {
        down();
    }
    else if(event.keyCode == 32) 
    {
        createMissile();
    }
});

upBtn.addEventListener("click", function(){
    window.requestAnimationFrame(up);
});
downBtn.addEventListener("click", function(){
    window.requestAnimationFrame(down);
});
shootBtn.addEventListener("click", createMissile);

pause.addEventListener("click", ()=>{
    if(gameIsOn)
    {
        pause.innerHTML= '<i class="fas fa-play"></i>';
        gameIsOn = false;
        bgSound.stop();
        clearInterval(bg);
    }
    else
    {
        pause.innerHTML= '<i class="fas fa-pause"></i>';
        gameIsOn = true;
        if(volumeIsOn)
        {
            bgSound.play();
        }
        beginBg();
    }
});

volume.addEventListener("click", ()=>{
    if(volumeIsOn)
    {
        volume.innerHTML = '<i class="fas fa-volume-mute"></i>';
        volume.style.color = "rgb(248, 248, 244)";
        volumeIsOn= false;
        bgSound.stop();
    }
    else
    {
        volume.innerHTML = '<i class="fas fa-volume-up"></i>';
        volume.style.color = "white";
        volumeIsOn= true;
        if(gameIsOn)
        {
            bgSound.play();
        }
    }
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////Code
game.style.display = "none";
endGame.style.display = "none";
shark.style.top= pos + "px";
setInterval(createFish, 1000);
setInterval(moveFish, 20);
setInterval(createObstacle, 2000);
setInterval(moveObstacle, 25);
setInterval(moveMissile, 25);