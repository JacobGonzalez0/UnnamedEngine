console.log("Working")

/* 

    scene
        -collections for storage
        -loader
        -renderer
        -textbox
        -background

    loader
        -axios
        -export
    textbox
        

        



*/

class Renderer{

    constructor(element){
        this.canvas = document.getElementById(element);
        this.context = this.canvas.getContext("2d");

        return this;
    }

    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
    }

    autoResize(){
        window.addEventListener('resize', ()=>{
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        })
    }

    get ctx(){
        return this.context;
    }

    set ctx(canvas){
        this.context = canvas.getContext("2d")
    }


}

class Main{

    fps;
    delta;

    constructor(){
        this.maxFps = 60;
        this.fps = 0;
        this.delta = 0;
        this.timeStep = 1000 / 60;
        this.framesThisSecond = 0;
        this.lastFpsUpdate = 0;
        this.lastFrameTimeMs = 0;
        this.debugFlag = false;

        this.renderer =  new Renderer("screen");
        this.renderer.resize(320,200)

        requestAnimationFrame(this.loop);

        return this;
    }
    
    debug = ()=>{
        this.debugFlag = true;
        this.frameCounter =  document.createElement("div");
        
        document.body.appendChild(this.frameCounter);
       
    }

    panic = ()=>{
        this.delta = 0;
    }

    update = (delta)=>{

    }

    draw(){
        if(this.debugFlag){
            this.frameCounter.innerHTML = "FPS: " + this.fps.toFixed(2);
        }
        
    }

    loop = (timestamp) => {

        if(timestamp < this.lastFrameTimeMs + (1000 / this.maxFps)){
            requestAnimationFrame(this.loop);
            return;
        }

        this.delta += timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;

        if(timestamp > this.lastFpsUpdate + 1000){
            this.fps = 0.25 * this.framesThisSecond + 0.75 * this.fps;

            this.lastFpsUpdate = timestamp;
            this.framesThisSecond = 0;

        }
        this.framesThisSecond++;

        let numUpdateSteps = 0;
        while(this.delta >= timestamp){
            this.update(timestamp);
            this.delta -= timestamp;
            if(++numUpdateSteps >= 240){
                this.panic();
                break;
            }
        }

        this.draw();
        requestAnimationFrame(this.loop)


    }

}

new Main().debug();