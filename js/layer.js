

class Layer
{
    constructor(data,level)
    {
        this.width = data[0].length;
        this.height = data.length;
        this.level = level;
        this.matrix = data;
        this.sprites = new Array(this.width * this.height);
      
        console.log(this.width, this.height, this.level, this.matrix);
        
        
    }
    
    isBlock(x, y)
    {
        if(x >= this.width && x < 0 || y >= this.height || y < 0) return false;
        return this.matrix[y][x] > 0;
    }
    
    initSprites(stage)
    {
        
        let x = 0;
        let y = 0;
        
        for(let i = 0; i < this.width*this.height; ++i)
        {            
            if(this.isBlock(x,y))
            {
                let color = this.matrix[y][x];
                if(color >= 32 && color <64)
                {
                    color -= 32;
                    this.sprites[i] = new PIXI.Sprite(PIXI.loader.resources.stairsL.texture);
                }
                else if(color >= 64)
                {
                    color -= 64;
                    this.sprites[i] = new PIXI.Sprite(PIXI.loader.resources.stairsR.texture);
                }
                else
                {
                    this.sprites[i] = new PIXI.Sprite(PIXI.loader.resources.cube.texture);
                }
                
                this.sprites[i].width  = cubeWidth;
                this.sprites[i].height = cubeHeight;
                this.sprites[i].tint = colors[color];
                this.sprites[i].anchor.set(0.5);
                this.sprites[i].zIndex = this.level;
                                
                let pos = iso2Cartesian(x, y, this.level);
                              
                this.sprites[i].x = pos.x;
                this.sprites[i].y = pos.y;

                stage.addChild(this.sprites[i]);
            }
            
            if(++x == this.width)
            {
                x = 0;
                y++;
            }
        }
        
    }

    setCurrentLayer(currentLayer)
    {
        let x = 0;
        let y = 0;

        console.log(this.level, currentLayer < this.level);

        for(let i = 0; i < this.width*this.height; ++i)
        {
            if(this.isBlock(x, y))
            {
                if(currentLayer < this.level)                    
                    this.sprites[i].alpha = 0.5;
                else
                    this.sprites[i].alpha = 1;
            }

            if(++x == this.width)
            {
                x = 0;
                y++;
            }
        }
    }
    
    addToStage(stage)
    {
        this.initSprites(stage);
    }
}