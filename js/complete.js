
class Complete
{
    constructor()
    {
        this.complete = PIXI.loader.resources.complete.texture;
        this.bg = PIXI.loader.resources.background.texture;

        this.completeSprite = new PIXI.Sprite(this.complete);
        this.bgSprite = new PIXI.Sprite(this.bg);

    }

    start(stage)
    {
        stage.addChild(this.bgSprite);
        stage.addChild(this.completeSprite);
    }

    stop(stage)
    {       
        stage.removeChild(this.bgSprite);
        stage.removeChild(this.completeSprite);

    }

    update(delta)
    {
        return false;
    }

    keyPressed()
    {
        PIXI.loader.resources.bipSound.data.play();
        return true;
    }

    keyReleased()
    {
        return false;
    }
}