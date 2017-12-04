class Layer
{
    constructor(data, level, top)
    {
        this.width = data[0].length;
        this.height = data.length;
        this.level = level;
        this.matrix = data;
        this.transparent = false;
        this.top = top;
        this.sprites = new Array(this.width * this.height);
        this.water   = new Array(this.width * this.height);
        this.waterLevel = new Array(this.width * this.height);

        this.waterLevel.fill(0);
   
        this.blocks = new Blocks();  

        this.initSprites();

        console.log(this.width, this.height);
       
    }

    static emptyLayer(width, height, level, top)
    {
        let matrix = [];

        for(let i = 0; i < height; ++i)
        {
            let line = [];
            for(let j = 0; j < width; ++j)
                line.push(0);

            matrix.push(line);
        }

        return new Layer(matrix, level, top);
    }

    reset()
    {
        this.waterLevel.fill(0);
    }

    isAltar(x, y)
    {
        if(x >= this.width || x < 0 || y >= this.height || y < 0) return false;
        return this.blocks.isAltar(this.matrix[y][x]);
    }

    isChest(x, y)
    {
        if(x >= this.width || x < 0 || y >= this.height || y < 0) return false;
        return this.blocks.isChest(this.matrix[y][x]);
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

    getWaterLevel(x, y)
    {
        if(x >= this.width || x < 0 || y >= this.height || y < 0) return 0;
        let block = this.matrix[y][x];       
        if(!this.blocks.isWater(block)) return 0;
        return this.waterLevel[x + y * this.width];
    }

    getTopWaterLevel(x, y)
    {
        if(this.top === undefined) return 0;
        return this.top.getWaterLevel(x, y);
    }
   
    isBlock(x, y)
    {
        if(x >= this.width || x < 0 || y >= this.height || y < 0) return false;
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

    computeWaterShape(x, y)
    {
        let block = this.matrix[y][x];
       
        let left  = this.getWaterLevel(x + 1, y) == 0;
        let right = this.getWaterLevel(x, y + 1) == 0;

        let top =  this.getWaterLevel(x, y) < 12 || (this.getWaterLevel(x, y) == 12 && this.getTopWaterLevel(x, y) == 0);

        return {left: left, right: right, top: top};
    }
   
    initSprites()
    {
       
        let x = 0;
        let y = 0;

        let color = this.blocks.getColor(this.level);   
       
        for(let i = 0; i < this.width*this.height; ++i)
        {    
            let block = this.matrix[y][x];       
            if(this.isBlock(x,y))
            {
                
                             

                let shape = this.computeShape(x, y);        
                let pos = iso2Cartesian(x, y, this.level);

                this.sprites[i] = new PIXI.Sprite(this.blocks.getBlock(block, 1, 1, 1));
                if(!this.blocks.isChest(block))
                    this.sprites[i].tint = color
                this.sprites[i].anchor.set(0.5); 
                this.sprites[i].x = pos.x;
                this.sprites[i].y = pos.y;                
                this.sprites[i].zIndex = this.level * this.width * this.height + x + y * this.width;

                if(this.level == 2)
                    console.log(this.sprites[i].zIndex,  x, y, block);

            }
            if(this.blocks.isWater(block))
            {
                let posWater = iso2Cartesian(x, y, this.level);
                let shape = this.computeWaterShape(x, y); 

                this.water[i] = new PIXI.Sprite(this.blocks.getWater(block, shape.top, shape.left, shape.right, this.waterLevel[i]));
                this.water[i].anchor.set(0.5);
                this.water[i].alpha = 0.5;
                this.water[i].x = posWater.x;
                this.water[i].y = posWater.y;  
                this.water[i].zIndex = this.level * this.width * this.height + x + y * this.width;
            }

           
            if(++x == this.width)
            {
                x = 0;
                y++;
            }
        }
       
    }

    update(currentLayer)
    {
        let x = 0;
        let y = 0;

        let alpha = 0;
        if(currentLayer < this.level)  
        {
            alpha = 0.8;
            this.transparent = true;
        } 
        else
        {
            alpha = 1;
            this.transparent = false;
        }

        for(let i = 0; i < this.width*this.height; ++i)
        {
            let block = this.matrix[y][x];       
            if(this.isBlock(x, y))
            {
                        
                this.sprites[i].alpha = alpha;

                let shape = this.computeShape(x, y);
               
                    this.sprites[i].texture = this.blocks.getBlock(block, shape.top, shape.left, shape.right);
                //else
                    //this.sprites[i].texture = this.blocks.getBlock(block, 1, 1, 1);
            }

            if(this.blocks.isWater(block))
            {
                let shape = this.computeWaterShape(x, y); 

                this.water[i].texture = this.blocks.getWater(block, shape.top, shape.left, shape.right, this.waterLevel[i]);
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
        let x = 0;
        let y = 0;
       
        for(let i = 0; i < this.width*this.height; ++i)
        {    
            let block = this.matrix[y][x];       
            if(this.isBlock(x,y))
                stage.addChild(this.sprites[i]);

            if(this.blocks.isWater(block))
                stage.addChild(this.water[i]);
           
            if(++x == this.width)
            {
                x = 0;
                y++;
            }
        }
    }
}