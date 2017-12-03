class Player
{
    constructor()
    {       
        this.textures = [];
        this.animation =  null;
       
        this.current = 2;
               
        this.x = 0;
        this.y = 0;
        this.z = 1;
       
        this.currentX = 0;
        this.currentY = 0;
        this.currentZ = 0;
       
        this.gotoX = 0;
        this.gotoY = 0;
        this.gotoZ = 0;
       
        this.moving = false;
       
        this.speed = 20;
       
    }

    getPosition()
    {
        return {x: this.animation.x, y: this.animation.y}
    }
   
    initFrames(direction, waterLevel)
    {
        console.log(waterLevel);
        let anim = [];
        for(let j = 0; j < 4; ++j)
        {
           let frame = new PIXI.Texture(this.globalTexture[waterLevel], new PIXI.Rectangle(direction * 72, j * 72, 72, 72));
           anim.push(frame);
        }
       
        return anim;
    }
   
    initSprites()
    {
        this.globalTexture = [];
        this.globalTexture[0] = PIXI.loader.resources.player.texture; 
        this.globalTexture[1] = PIXI.loader.resources.player0.texture;   
        this.globalTexture[2] = PIXI.loader.resources.player1.texture;   
        this.globalTexture[3] = PIXI.loader.resources.player2.texture;   
        this.globalTexture[4] = PIXI.loader.resources.player3.texture;   
        this.globalTexture[5] = PIXI.loader.resources.player4.texture;   
        this.globalTexture[6] = PIXI.loader.resources.player5.texture;   
        this.globalTexture[7] = PIXI.loader.resources.player6.texture;   
        this.globalTexture[8] = PIXI.loader.resources.player7.texture;   
        this.globalTexture[9] = PIXI.loader.resources.player8.texture;   
        this.globalTexture[10] = PIXI.loader.resources.player9.texture; 

      
        this.animation = new PIXI.extras.AnimatedSprite(this.initFrames(this.current, this.map.getWaterLevel(this.x, this.y, this.z)));
        this.animation.animationSpeed = 0.2;
       
        this.setPosition(0, 0, 1);
        this.setDirection(2);
    }
   
    setDirection(direction)
    {
        if(direction < 0 || direction >= 4) return;
        this.current = direction;

        let l1 = this.map.getWaterLevel(this.x, this.y, this.z);
        let l2 = this.map.getWaterLevel(this.gotoX, this.gotoY, this.gotoZ);
       
        if(this.animation.playing)
        {
            this.animation.stop();      
            this.animation.textures = this.initFrames(this.current, l1 < l2 ? l1 : l2);
            this.animation.play();
        }
        else
            this.animation.textures = this.initFrames(this.current,  l1 < l2 ? l1 : l2);
    }

    setMap(map)
    {
        this.map = map;
    }
   
    setPosition(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;

        this.gotoX = x;
        this.gotoY = y;
        this.gotoZ = z;
       
        let pos = iso2Cartesian(x, y, z);

        this.currentX = pos.x;
        this.currentY = pos.y;
        this.currentZ = pos.z;
       
  
        this.animation.anchor.set(0.5);
        this.animation.x = pos.x;
        this.animation.y = pos.y;
        this.animation.zIndex = this.z * this.map.width * this.map.height + this.x + this.y * this.map.width;
        this.animation.gotoAndStop(0);
       
       
    }
   
    move(movement, map)
    {  
       
        let newX = this.x;
        let newY = this.y;
        let direction = -1;
        switch(movement)
        {
            case 37:
                newY += 1;
                direction = 3;
                break;
            case 38:
                newX -= 1;
                direction = 0;
                break;
            case 39:
                newY -= 1;
                direction = 1;
                break;
            case 40:
                newX += 1;
                direction = 2;
                break;
        }
              
        if(!this.moving && (newX != this.x || newY != this.y))
        {     
            let newZ = 0;
            if(map.isBlock(newX, newY, this.z - 1) && !map.isBlock(newX, newY, this.z))
                newZ = this.z;
            else if(map.isBlock(newX, newY, this.z) && !map.isBlock(newX, newY, this.z + 1) && map.isPassable(newX, newY, this.z))
                newZ = this.z + 1;
            else if(!map.isBlock(newX, newY, this.z) && !map.isBlock(newX, newY, this.z - 1) && map.isBlock(newX, newY, this.z - 2) && map.isPassable(this.x, this.y, this.z - 1))
                newZ = this.z - 1;
            else return;
           
            this.gotoX = newX;
            this.gotoY = newY;
            this.gotoZ = newZ;
                      
            let pos = iso2Cartesian(this.x, this.y, this.z); 
           
            this.currentX = pos.x;
            this.currentY = pos.y;
            this.currentZ = newZ < this.z ? this.z : this.gotoZ;
           
            let cible = iso2Cartesian(this.gotoX, this.gotoY, this.gotoZ);
           
            this.movement = {
                x: (cible.x - this.currentX) / this.speed,
                y: (cible.y - this.currentY) / this.speed,
                cpt: 0
            }

            this.animation.textures = this.initFrames(this.current, this.map.getWaterLevel(this.gotoX, this.gotoY, this.gotoZ));

            console.log(this.map.getWaterLevel(this.gotoX, this.gotoY, this.gotoZ));
           
            this.animation.play();
                       
            this.moving = true;           
            this.setDirection(direction);
        }
       
        if(this.moving)
        {
            if(this.movement.cpt++ == this.speed)
            {
                this.moving = false;
                this.setPosition(this.gotoX, this.gotoY, this.gotoZ);
                this.setDirection(this.current);
            }
            else
            {
                this.currentX += this.movement.x;
                this.currentY += this.movement.y;           
               
                this.animation.x = Math.round(this.currentX);
                this.animation.y = Math.round(this.currentY);
                let z1 = this.gotoZ * this.map.width * this.map.height + this.gotoX + this.gotoY * this.map.width + 0.1;
                let z2 = this.z * this.map.width * this.map.height + this.x + this.y * this.map.width + 0.1;

                this.animation.zIndex = z1 > z2 ? z1 : z2;
               
            }
        }
    }
   
    addToStage(stage)
    {
        this.initSprites();    
       
        stage.addChild(this.animation);
    }
}
