
class Player
{
    constructor()
    {        
        this.textures = [];
        this.animations =  [];
        
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
    
    initSprites()
    {
        this.globalTexture = PIXI.loader.resources.player.texture;
        
        for(let i = 0; i < 4; ++i)
        {
            let anim = [];
            for(let j = 0; j < 4; ++j)
            {
               let frame = new PIXI.Texture(this.globalTexture, new PIXI.Rectangle(i * 72, j * 72, 72, 72));
               anim.push(frame);
            }
            
            this.textures.push(anim);
            this.animations.push(new PIXI.extras.AnimatedSprite(anim));
            this.animations[i].animationSpeed = 0.2;
        }
        
        this.setPosition(0, 0, 1);
        this.setDirection(2);
    }
    
    setDirection(direction)
    {
        if(direction < 0 || direction >= 4) return;
        this.current = direction;
                
        for(let i = 0; i < 4; ++i)
            this.animations[i].visible = (i == this.current);        
    }
    
    setPosition(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        
        let pos = iso2Cartesian(x, y, z);
        
        for(let i = 0; i < 4; ++i)
        {
            this.animations[i].anchor.set(0.5);
            this.animations[i].x = pos.x;
            this.animations[i].y = pos.y;
            this.animations[i].zIndex = this.z; 
            
            this.animations[i].gotoAndStop(0);
        }
        
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
            else if(map.isBlock(newX, newY, this.z) && !map.isBlock(newX, newY, this.z + 1))
                newZ = this.z + 1;
            else if(!map.isBlock(newX, newY, this.z) && !map.isBlock(newX, newY, this.z - 1) && map.isBlock(newX, newY, this.z - 2))
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
            
            for(let i = 0; i < 4; ++i)
                this.animations[i].play();
                        
            this.moving = true;            
            this.setDirection(direction);
        }
        
        if(this.moving)
        {
            if(this.movement.cpt++ == this.speed)
            {
                this.moving = false;
                this.setPosition(this.gotoX, this.gotoY, this.gotoZ);
            }
            else
            {
                this.currentX += this.movement.x;
                this.currentY += this.movement.y;
            
                for(let i = 0; i < 4; ++i)
                {
                    this.animations[i].x = this.currentX;
                    this.animations[i].y = this.currentY;
                    this.animations[i].zIndex = this.currentZ; 
                }
            }
        }
    }
    
    addToStage(stage)
    {
        this.initSprites();     
        
        for(let i = 0; i < 4; ++i)
            stage.addChild(this.animations[i]);
    }
}