
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

	start(app)
	{
		this.bindedUpdate      = this.update.bind(this);
		this.bindedKeyPressed  = this.keyPressed.bind(this);
		this.bindedKeyReleased = this.keyReleased.bind(this);

		app.ticker.add(this.bindedUpdate);

		document.addEventListener("keydown", this.bindedKeyPressed);
        document.addEventListener("keyup", this.bindedKeyReleased);

        app.stage.addChild(this.bg);
		app.stage.addChild(this.container);

		this.reset();

		this.app = app;
            
	}

	stop(app)
	{
		app.ticker.remove(this.bindedUpdate);

		document.removeEventListener("keydown", this.bindedKeyPressed);
        document.removeEventListener("keyup", this.bindedKeyReleased);

        app.stage.removeChild(this.bg);
		app.stage.removeChild(this.container);

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

        for(let i = 0; i < this.orbs.length; ++i)
        {
            if(this.orbs[i].isDrowned())
                this.orbs[i].goTo(this.orbs[i].states.destroyed);

            if(this.orbs[i].isWinned())
                ++winned;
        }

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
	}

	keyPressed(event)
	{
		console.log('hello2');
		if(event.keyCode >= 37 && event.keyCode <= 40)
            this.lastMovement = event.keyCode;

        if(event.keyCode == 32)
            this.action = true;
	}

	keyReleased(event)
	{
		if(event.keyCode == this.lastMovement)
            this.lastMovement = 0;
        
	}



}