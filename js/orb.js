class Orb
{
	constructor(map, id)
	{
		this.map = map;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.id = id;

		this.states = {ok : 0, pocket: 1, chest: 2, destroyed: 3}

		this.state = this.states.ok;

		this.initSprite(this.map.orbs[id].x, this.map.orbs[id].y, this.map.orbs[id].z);
	}

	reset()
	{
		this.goTo(this.states.ok, this.map.orbs[this.id].x, this.map.orbs[this.id].y, this.map.orbs[this.id].z);
	}

	initSprite(x, y, z)
	{
		this.globalTexture = PIXI.loader.resources.orb.texture; 

		this.textures = [];
		for(let j = 0; j < 12; ++j)
        {
           let frame = new PIXI.Texture(this.globalTexture, new PIXI.Rectangle(0, j * cubeHeight, cubeWidth, cubeHeight));
           this.textures.push(frame);
        }
        this.animation = new PIXI.extras.AnimatedSprite(this.textures);
        this.animation.animationSpeed = 0.2;
        this.animation.play();

        this.setPosition(x, y, z);

	}

	isOk()
	{
		return this.state == this.states.ok;
	}

	isPlacable()
	{
		return this.state == this.states.pocket;
	}

	isWinned()
	{
		return this.state == this.states.chest;
	}

	isDrowned()
    {
        return this.map.getWaterLevel(this.x, this.y, this.z) >= 9;
    }


	setPosition(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;

		let pos = iso2Cartesian(x, y, z);
       
        this.animation.anchor.set(0.5);
        this.animation.x = pos.x;
        this.animation.y = pos.y;
        this.animation.zIndex = this.z * this.map.width * this.map.height + this.x + this.y * this.map.width + 0.1;
	}

	goTo(state, x, y, z)
	{
		switch(state)
		{
			case this.states.ok:
				this.state = this.states.ok;
				this.setPosition(x, y, z);
				this.animation.visible = 1;
				break;

			case this.states.pocket:
				this.state = this.states.pocket;
				this.animation.visible = 0;
				break;

			case this.states.chest:
				this.state = this.states.chest;
				this.animation.visible = 0;
				break;

			case this.states.destroyed:
				this.state = this.states.destroyed;
				this.animation.visible = 0;
				break;
		}
	}

	addToStage(stage)
	{
		stage.addChild(this.animation);
	}
}