class Orb
{
	constructor()
	{
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}

	initSprite()
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
	}

	hide()
	{

	}

	addToStage(stage)
	{
		this.initSprite();

		stage.addChild(this.animation);
	}
}