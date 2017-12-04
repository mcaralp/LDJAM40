
var mapsList = ["map0","map1","map2"];
var ressources = {};

const screenWidth  = 800;
const screenHeight = 600;

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
        .add('player',  'images/player.png')
        .add('player0',  'images/Player0.png')
        .add('player1',  'images/Player1.png')
        .add('player2',  'images/Player2.png')
        .add('player3',  'images/Player3.png')
        .add('player4',  'images/Player4.png')
        .add('player5',  'images/Player5.png')
        .add('player6',  'images/Player6.png')
        .add('player7',  'images/Player7.png')
        .add('player8',  'images/Player8.png')
        .add('player9',  'images/Player9.png')
        .add('altar', 'images/hotel.png')
        .add('grid', 'images/GridSheet.png')
        .add('orb', 'images/OrbSheet.png')
        .add('background', 'images/Background.png')
        .add('altarWater', 'images/WaterHotelSheet.png');
   
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