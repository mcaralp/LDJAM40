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
        this.containers = new Array(this.width * this.height);
        this.sprites = new Array(this.width * this.height);
        this.water   = new Array(this.width * this.height);
       
        for(let i = 0; i < this.height; ++i)
        {
            let line = [];
            for(let j = 0; j < this.width; ++j)
                line.push(parseInt(data[i][j], 16));
            this.matrix.push(line);
        }
               
        this.blocks = new Blocks();            
       
    }

    isPassable(x, y)
    {
        return this.blocks.isPassable(this.matrix[y][x]);
    }
   
    isTopTransparent()
    {
        return this.top === undefined || this.top.isTransparent();
    }

    isTopBlock(x, y)
    {
        return this.top !== undefined && this.top.isBlock(x, y);
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

    computeShape(x, y)
    {
        let block = this.matrix[y][x];
       
        let left  = !this.isBlock(x + 1, y);
        let right = !this.isBlock(x, y + 1);

        let top = (!this.isTransparent() && (this.isTopTransparent() || !this.isTopBlock(x, y))) || 
                  (this.isTransparent() && !this.isTopBlock(x, y));

        return {left: left, right: right, top: top};
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

                this.containers[i] = new PIXI.Container();

                let shape = this.computeShape(x, y);
               
                this.sprites[i] = new PIXI.Sprite(this.blocks.getBlock(block, shape.top, shape.left, shape.right));
               
                this.sprites[i].width  = cubeWidth;
                this.sprites[i].height = cubeHeight;
                this.containers[i].width  = cubeWidth;
                this.containers[i].height = cubeHeight;

                this.sprites[i].tint = color
                this.sprites[i].anchor.set(0.5);
                this.containers[i].zIndex = this.level;
                               
                let pos = iso2Cartesian(x, y, this.level);
                             
                this.containers[i].x = pos.x;
                this.containers[i].y = pos.y;

                this.containers[i].addChild(this.sprites[i]);
                stage.addChild(this.containers[i]);


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

        let alpha = 0;
        if(currentLayer < this.level)  
        {
            alpha = 0.5;
            this.transparent = true;
        } 
        else
        {
            alpha = 1;
            this.transparent = false;
        }

        for(let i = 0; i < this.width*this.height; ++i)
        {
            if(this.isBlock(x, y))
            {
                let block = this.matrix[y][x];               
                this.sprites[i].alpha = alpha;

                let shape = this.computeShape(x, y);
               
                this.sprites[i].texture = this.blocks.getBlock(block, shape.top, shape.left, shape.right);
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