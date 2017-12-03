
var mapsList = ["map0","map1","map2"];
var ressources = {};

function loadAll(callback)
{
    PIXI.loader
        .add('cube', 'images/bloc56Sheet.png')
        .add('stairsLT', 'images/stairs56_3_1.png')
        .add('stairsRT', 'images/stairs56_3_2.png')
        .add('stairsLB', 'images/stairs56_3_3.png')
        .add('stairsRB', 'images/stairs56_3_4.png')
        .add('player',  'images/player.png');
   
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