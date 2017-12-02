var mapsList = ["map0","map1","map2"];
var ressources = {};
var colors = 
    [
        0x000000,
        0xFF5555,
        0x55FF55,
        0x5555FF
    ];

function loadAll(callback)
{
    PIXI.loader
        .add('cube', 'images/bloc2.png')
        .add('stairsL', 'images/stairsLeft.png')
        .add('stairsR', 'images/stairsRight.png')
        .add('player',  'images/worker.png');
    
    for(var map in mapsList)
        PIXI.loader.add(mapsList[map],'maps/'+mapsList[map]+'.json');
    
    PIXI.loader.load(initAll.bind(undefined,callback));
}

function initAll(callback,loader,resources)
{  
    for(let map in mapsList)
        ressources[mapsList[map]] = new Map(resources[mapsList[map]].data);
    
    callback();
}