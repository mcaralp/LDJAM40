
var mapsList = ["map0","map1","map2"];
var ressources = {};

function loadAll(callback)
{
    PIXI.loader
        .add('cube', 'images/bloc56Sheet.png')
        .add('stairsLT', 'images/StairsSheet1.png')
        .add('stairsRT', 'images/StairsSheet2.png')
        .add('stairsLB', 'images/StairsSheet3.png')
        .add('stairsRB', 'images/StairsSheet4.png')
        .add('cubeWater', 'images/WaterSheet.png')
        .add('stairsLTWater', 'images/WaterStairs1Sheet.png')
        .add('stairsRTWater', 'images/WaterStairs2Sheet.png')
        .add('stairsLBWater', 'images/WaterStairs3Sheet.png')
        .add('stairsRBWater', 'images/WaterStairs4Sheet.png')
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