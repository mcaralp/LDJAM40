
class Player
{
    constructor()
    {
        this.texture = PIXI.loader.resources.player.texture;
        this.current = new PIXI.Texture(this.texture, new PIXI.Rectangle(0, 0, 72, 72));
        this.sprite = new PIXI.Sprite(this.current);
        
        this.setPosition(0, 0, 1);
    }
    
    setPosition(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        
        let pos = iso2Cartesian(x, y, z);
        
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
        this.sprite.anchor.set(0.5);
        this.sprite.zIndex = this.z;

        console.log(pos.x, pos.y);
    }
    
    move(movement, map)
    {
        let newX = this.x;
        let newY = this.y;
        switch(movement)
        {
            case 37:
                newY += 1;
                break;
            case 38:
                newX -= 1;
                break;
            case 39:
                newY -= 1;
                break;
            case 40:
                newX += 1;
                break;
        }
        
        //console.log(newX, newY);
        
        if((newX != this.x || newY != this.y) && map.isBlock(newX, newY, this.z - 1) && !map.isBlock(newX, newY, this.z))
        {
            console.log(newX, newY);
            
            this.x = newX;
            this.y = newY;
                       
            let pos = iso2Cartesian(this.x, this.y, this.z);        
            this.sprite.x = pos.x;
            this.sprite.y = pos.y;
        }
    }
    
    addToStage(stage)
    {
        stage.addChild(this.sprite);
      
    }
}