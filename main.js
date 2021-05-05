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

class ObjectList{

    constructor(id, memory){
        this.memory = memory;
        this.objects = [];
        this.id = id;
    }

    addObject(obj){
        let id = this.memory.newObj(obj);
        this.objects.push(id);
    }

}

class VisualServer{

    constructor(memory){
        this.memory = memory; 
        this.lists = new Map();
        this.renderer = null;
        return this;
    }

    newList(id){
        if(this.lists.get(id) ){
            return false;
        }
        
        this.lists.set(id, new ObjectList(id, this.memory));
        return this.lists.get(id);
    }

    setRenderer(renderer){
        //check if renderer object is correct
        this.renderer = renderer;

    }

    render(){
        if(this.render){

            console.log(this.lists)
            this.lists.forEach( list =>{

                list.objects.forEach( obj => {

                    this.memory.getObj(obj).render(this.renderer.ctx);

                })
                

            })
            


        }
    }

}

class ObjectMemory{

    constructor(){
        this.objMemory = new Map();
    }

    newObj = (obj)=>{
        let id = this.makeid(7);
        if(this.objMemory.get(id)){
            //try again if id is found already;
            return this.newObj(obj);
        }
        //set the object in memory
        this.objMemory.set(id, obj);
        return id;
    }

    getObj = (id)=>{
        if(this.objMemory.get(id)){
            return this.objMemory.get(id);
        }
        return false;
    }

    delObj = (id)=>{
        if(this.objMemory.get(id)){
            this.objMemory.delete(id);
            return true;
        }
        return false;
    }

    makeid(length) {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
       return result.join('');
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
        this.objMemory = new ObjectMemory();
       

        this.renderer =  new Renderer("screen");
        this.renderer.resize(320,200)

        
        this.init()
        return this;
    }

    init(){
        let vs = new VisualServer(this.objMemory);
        vs.setRenderer(this.renderer);
        vs.newList("test",1)
        let list = vs.newList("test2",1)
        
        //test object
        list.addObject({test:"test",
        render: (ctx)=>{
                //object can focus on its own rendering 
                ctx.fillRect(20, 10, 150, 100);
            }
        })

        vs.render();

        requestAnimationFrame(this.loop);
    }
    
    debug = ()=>{
        //enables the flag
        this.debugFlag = true;
        this.frameCounter =  document.createElement("div");
        //and adds the counter to the body of the page
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