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
    }

    context(){
        return this.context;
    }

}

class Main{

    fps;

    constructor(){
        this.fps = 60
        this.renderer =  new Renderer("screen");

        requestAnimationFrame(this.loop);


    }

    update(){

    }

    draw(){

    }

    loop = () => {

        this.update();
        this.draw();
        

        requestAnimationFrame(this.loop)


    }

}

new Main();