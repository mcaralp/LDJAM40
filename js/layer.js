class Layer
{
    constructor(data, level, top)
    {
        this.width = data[0].length;
        this.height = data.length;
        this.level = level;
        this.matrix = [];
        this.transparent = false;
        this.top = top;
        this.sprites = new Array(this.width * this.height);
       
        for(let i = 0; i < this.height; ++i)
        {
            let line = [];
            for(let j = 0; j < this.width; ++j)
                line.push(parseInt(data[i][j], 16));
            this.matrix.push(line);
        }
               
        this.blocks = new Blocks();            
       
    }
   
    isTopTransparent()
    {
       
    }
   
    isTransparent()
    {
        return this.transparent;
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
                let block = this.matrix[y][x];
                let color = this.blocks.getColor(block);
               
                let left  = !this.isBlock(x + 1, y);
                let right = !this.isBlock(x, y + 1);
               
                this.sprites[i] = new PIXI.Sprite(this.blocks.getBlock(block, 1, left, right));
               
                this.sprites[i].width  = cubeWidth;
                this.sprites[i].height = cubeHeight;
                this.sprites[i].tint = color
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