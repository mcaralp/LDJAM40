class Map
{
    constructor(data)
    {
        this.width = data.width;
        this.height = data.height;
        this.length = data.length;
        this.layers = [];

        this.orbs = data.orbs;
        this.player = data.player;

        this.layers.push(Layer.emptyLayer(this.width, this.height, data.layers.length, undefined));
       
        for(let i = data.layers.length; i--;)
            this.layers.unshift(new Layer(data.layers[i], i, this.layers[0]));
    }

    isPassable(x, y, z)
    {
        return this.layers[z].isPassable(x, y);
    }

    isBlock(x, y, z)
    {
        if(z < 0 || z >= this.layers.length) return false;
        return this.layers[z].isBlock(x, y);
    }

    isAltar(x, y, z)
    {
        if(z < 0 || z >= this.layers.length) return false;
        return this.layers[z].isAltar(x, y);
    }

    isChest(x, y, z)
    {
        if(z < 0 || z >= this.layers.length) return false;
        return this.layers[z].isChest(x, y);
    }

    updateLayers(currentLayer)
    {
        for(let i = this.layers.length; i--;)
            this.layers[i].update(currentLayer);
    }

    addToStage(stage)
    {
        for(let i = 0; i < this.layers.length; ++i)
            this.layers[i].addToStage(stage);
    }

    reset()
    {
        for(let i = 0; i < this.layers.length; ++i)
            this.layers[i].reset();
    }

    getWaterLevel(x, y, z)
    {
        return this.layers[z].getWaterLevel(x, y);
    }
}