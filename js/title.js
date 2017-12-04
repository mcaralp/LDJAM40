
class Title
{
    constructor()
    {
        this.title = PIXI.loader.resources.title.texture;
        this.intro = PIXI.loader.resources.intro.texture;

        this.titleSprite = new PIXI.Sprite(this.title);
        this.introSprite = new PIXI.Sprite(this.intro);

        this.introSprite.visible = false;
        this.title = true;
        this.delta = 0;
    }

    reset()
    {
        this.introSprite.visible = false;
        this.titleSprite.visible = true;
        this.title = true;
        this.delta = 0;
    }

    start(stage)
    {
        stage.addChild(this.titleSprite);
        stage.addChild(this.introSprite);
    }

    stop(stage)
    {
        
        stage.removeChild(this.titleSprite);
        stage.removeChild(this.introSprite);

        this.reset();
    }

    update(delta)
    {
        return false;
    }

    keyPressed()
    {
        PIXI.loader.resources.bipSound.data.play();
        if(this.title)
        {
            this.introSprite.visible = true;
            this.titleSprite.visible = false;
            this.title = false;
        }
        else
            return true;

        return false;
    }

    keyReleased()
    {
        return false;
    }
}