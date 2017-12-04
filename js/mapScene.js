
class MapScene
{
    constructor(id)
    {
        this.lastMovement = 0;
        this.action = false;

        this.bg = new PIXI.Sprite(PIXI.loader.resources.background.texture);

        this.title = new PIXI.Sprite(PIXI.loader.resources['level' + id].texture);
        this.gameOver = new PIXI.Sprite(PIXI.loader.resources.gameOver.texture);
        this.victory = new PIXI.Sprite(PIXI.loader.resources.victory.texture);
        
        this.map = ressources["map" + id];
        this.orbs = [];
        this.player = new Player(this.map, this.orbs);

        for(let i = 0; i < this.map.orbs.length; ++i)
            this.orbs.push(new Orb(this.map, i));
        
      
        this.container = new PIXI.Container(); 


        this.map.addToStage(this.container);
        this.player.addToStage(this.container);
        for(let i = 0; i <this. map.orbs.length; ++i)
            this.orbs[i].addToStage(this.container);

        this.orbCountTexture = PIXI.loader.resources.orbCount.texture;

        this.orbCountTextures = [];
        for(let i = 0; i < 5; ++i)
            this.orbCountTextures.push(new PIXI.Texture(this.orbCountTexture, new PIXI.Rectangle(0, i * cubeHeight, cubeWidth, cubeHeight)));

        this.displayTexture = PIXI.loader.resources.display.texture;
        this.headDisplayTexture = new PIXI.Texture(this.displayTexture, new PIXI.Rectangle(0, 0, cubeWidth, cubeHeight));
        this.chestDisplayTexture = new PIXI.Texture(this.displayTexture, new PIXI.Rectangle(cubeWidth, 0, cubeWidth, cubeHeight));

        this.head  = new PIXI.Sprite(this.headDisplayTexture);
        this.chest = new PIXI.Sprite(this.chestDisplayTexture);

        this.orbsHead  = new PIXI.extras.AnimatedSprite(this.orbCountTextures);
        this.orbsChest = new PIXI.extras.AnimatedSprite(this.orbCountTextures);

        this.head.x = 20;
        this.head.y = 20;

        this.chest.x = 40 + cubeWidth;
        this.chest.y = 20;

        this.orbsHead.x = 20;
        this.orbsHead.y = 40 + cubeHeight;

        this.orbsChest.x = 40 + cubeWidth;
        this.orbsChest.y = 40 + cubeHeight;

        this.states = {begin: 0, play: 1, victory: 2, end: 3};
        this.state = this.states.begin;

        this.updateZ();
    }

    reset()
    {
        this.map.reset();
        this.player.reset(this.map);
        for(let i = 0; i < this.orbs.length; ++i)
            this.orbs[i].reset(this.map);

        this.updateZ();
        this.state = this.states.begin;

        this.action = false;
        this.lastMovement = 0;

    }

    updateZ()
    {
        this.map.updateLayers(this.player.z);

        let pos = this.player.getPosition();

        this.container.x = ((screenWidth / 2) - pos.x); 
        this.container.y = ((screenHeight / 2) - pos.y); 

        this.container.children.sort(MapScene.sortBlocks);
    }

    static sortBlocks(a, b)  
    {
        if(a.zIndex < b.zIndex) return -1;
        if(a.zIndex > b.zIndex) return 1;


        return 0;
    }

    start(stage)
    {
        stage.addChild(this.bg);
        stage.addChild(this.container);

        stage.addChild(this.head);
        stage.addChild(this.chest);
        stage.addChild(this.orbsHead);
        stage.addChild(this.orbsChest);
        stage.addChild(this.title);
        stage.addChild(this.gameOver);
        stage.addChild(this.victory);
    }

    stop(stage)
    {

        stage.removeChild(this.bg);
        stage.removeChild(this.container);

        stage.removeChild(this.head);
        stage.removeChild(this.chest);
        stage.removeChild(this.orbsHead);
        stage.removeChild(this.orbsChest);
        stage.removeChild(this.title);
        stage.removeChild(this.gameOver);
        stage.removeChild(this.victory);

        this.reset();
    }

    update()
    {
        switch(this.state)
        {
            case this.states.begin:
                this.title.visible = true;
                this.gameOver.visible = false;
                this.victory.visible = false;

                if(this.action)
                {
                    this.state = this.states.play;
                }
                break;

            case this.states.play:
                this.title.visible = false;
                this.gameOver.visible = false;
                this.victory.visible = false;

                let oldZ = this.player.z;
                if(this.player.move(this.lastMovement, this.map))
                {
                    // TODO: update water

                }
                if(this.action)
                    this.player.action(); 

                this.updateZ();

                let winned = 0;
                let placable = 0;

                for(let i = 0; i < this.orbs.length; ++i)
                {
                    if(this.orbs[i].isDrowned())
                        this.orbs[i].goTo(this.orbs[i].states.destroyed);

                    if(this.orbs[i].isWinned())
                        ++winned;

                    if(this.orbs[i].isPlacable())
                        ++placable;
                }

                this.orbsHead.gotoAndStop(placable);
                this.orbsChest.gotoAndStop(winned);

                if(winned == this.orbs.length)
                {
                    this.state = this.states.victory;
                    // TODO: end of level
                }

                if(this.player.isDrowned())
                {
                    this.state = this.states.end;
                }

                this.action = false;
                break;

            case this.states.end:

                this.title.visible = false;
                this.gameOver.visible = false;
                this.victory.visible = false;

                if(this.player.playDead())
                {
                    this.gameOver.visible = true;
                    if(this.action)
                        this.reset();
                    
                }

                this.action = false;
                break;

            case this.states.victory:

                this.title.visible = false;
                this.gameOver.visible = false;
                this.victory.visible = true;

                if(this.action)
                {
                    return true;
                }

                this.action = false;
                break;
                
        }


        return false;
    }

    keyPressed(event)
    {
        
        if(event.keyCode >= 37 && event.keyCode <= 40)
            this.lastMovement = event.keyCode;

        if(event.keyCode == 32)
            this.action = true;     

        return false;
    }

    keyReleased(event)
    {
        if(event.keyCode == this.lastMovement)
            this.lastMovement = 0;

        return false;
        
    }



}