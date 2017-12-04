
class Game
{
    constructor()
    {
        this.app = new PIXI.Application(screenWidth, screenHeight, {backgroundColor : 'black'});
        this.scenes = []; 

        this.scenes.push(new Title());
        this.scenes.push(new MapScene(1));
        this.scenes.push(new Complete());

        this.currentScene = 0;
    }

    start()
    {
        this.bindedUpdate      = this.update.bind(this);
        this.bindedKeyPressed  = this.keyPressed.bind(this);
        this.bindedKeyReleased = this.keyReleased.bind(this);

        this.app.ticker.add(this.bindedUpdate);

        document.addEventListener("keydown", this.bindedKeyPressed);
        document.addEventListener("keyup",   this.bindedKeyReleased);

        document.body.appendChild(this.app.view);

        this.scenes[this.currentScene].start(this.app.stage);

    }

    next()
    {
        this.scenes[this.currentScene].stop(this.app.stage);
        this.currentScene = (1 + this.currentScene) % this.scenes.length;
        this.scenes[this.currentScene].start(this.app.stage);
    }

    update(delta)
    {
        if(this.scenes[this.currentScene].update(delta))
            this.next();
    }

    keyPressed(event)
    {
        if(this.scenes[this.currentScene].keyPressed(event))
            this.next();
    }

    keyReleased(event)
    {
        if(this.scenes[this.currentScene].keyReleased(event))
            this.next();
    }


}