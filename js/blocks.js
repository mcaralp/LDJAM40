class Blocks
{
    constructor()
    {
        this.colors = 
        [
            0x55FF55,
            0xFF5555,
            0x5555FF
        ];

        
        this.cube = PIXI.loader.resources.cube.texture;
        this.cubeShapes = [];
        for(let i = 0; i < 8; ++i)
            this.cubeShapes.push(new PIXI.Texture(this.cube, new PIXI.Rectangle(i * cubeWidth, 0, cubeWidth, cubeHeight)));
        
        this.stairsLT = PIXI.loader.resources.stairsLT.texture;
        this.stairsLTShapes = [];
        for(let i = 0; i < 8; ++i)
            this.stairsLTShapes.push(new PIXI.Texture(this.stairsLT, new PIXI.Rectangle(0, 0, cubeWidth, cubeHeight)));
        
        this.stairsRT = PIXI.loader.resources.stairsRT.texture;
        this.stairsRTShapes = [];
        for(let i = 0; i < 8; ++i)
            this.stairsRTShapes.push(new PIXI.Texture(this.stairsRT, new PIXI.Rectangle(0, 0, cubeWidth, cubeHeight)));
        
        this.stairsLB = PIXI.loader.resources.stairsLB.texture;
        this.stairsLBShapes = [];
        for(let i = 0; i < 8; ++i)
            this.stairsLBShapes.push(new PIXI.Texture(this.stairsLB, new PIXI.Rectangle(0, 0, cubeWidth, cubeHeight)));
        
        this.stairsRB = PIXI.loader.resources.stairsRB.texture;
        this.stairsRBShapes = [];
        for(let i = 0; i < 8; ++i)
            this.stairsRBShapes.push(new PIXI.Texture(this.stairsRB, new PIXI.Rectangle(0, 0, cubeWidth, cubeHeight)));
    }

    isPassable(block)
    {
        let idBlock = this.getId(block);

        console.log(idBlock);

        switch(idBlock)
        {
            case 2:
            case 3:
            case 4:
            case 5:
                return true;

            default:
                return false;
        }
    }
   
    
    getBlock(block, top, left, right)
    {
        let index = (top << 2) + (left << 1) + right;
        let idBlock = this.getId(block);
                
        switch(idBlock)
        {
            case 1:
                return this.cubeShapes[index];                
            case 2:
                return this.stairsLTShapes[index];                
            case 3:
                return this.stairsRTShapes[index];
            case 4:
                return this.stairsLBShapes[index];
            case 5:
                return this.stairsRBShapes[index];
        }
    }
    
    getId(block)
    {
        return block & 0xF;
    }
    
    getColor(block)
    {
        return this.colors[(block >> 4) & 0xF];
    }
}
