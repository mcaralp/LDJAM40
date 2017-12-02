

class Map
{
    constructor(data)
    {
        this.width = data.width;
        this.height = data.height;
        this.layers = [];
        
        for(var layer in data.layers)
            this.layers.push(new Layer(data.layers[layer],layer));
    }
    
    isBlock(x, y, z)
    {
        if(z < 0 || z >= this.layers.length) return false;
        return this.layers[z].isBlock(x, y);
    }
    
    addToStage(stage)
    {
        for(let i = 0; i < this.layers.length; ++i)
            this.layers[i].addToStage(stage);
    }
}