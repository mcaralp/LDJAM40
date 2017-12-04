
class MapScene
{
	constructor(id)
	{
		this.lastMovement = 0;
        this.action = false;

		this.bg = new PIXI.Sprite(PIXI.loader.resources.background.texture);
        
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
	}

	reset()
	{
		this.map.reset();
		this.player.reset(this.map);
		for(let i = 0; i < this.orbs.length; ++i)
            this.orbs[i].reset(this.map);

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
	}

	stop(stage)
	{

        stage.removeChild(this.bg);
		stage.removeChild(this.container);

		stage.removeChild(this.head);
		stage.removeChild(this.chest);
		stage.removeChild(this.orbsHead);
		stage.removeChild(this.orbsChest);

		this.reset();
	}

	update()
	{
		let oldZ = this.player.z;
        if(this.player.move(this.lastMovement, this.map))
        {
            // TODO: update water

        }
        
        this.map.updateLayers(this.player.z);

        let pos = this.player.getPosition();

        this.container.x = ((screenWidth / 2) - pos.x); 
        this.container.y = ((screenHeight / 2) - pos.y); 



        this.container.children.sort(MapScene.sortBlocks);

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
            // TODO: end of level
        }

        if(this.player.isDrowned())
        {
            // TODO game over
        }

        if(this.action)
            this.player.action();        

        this.action = false;

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