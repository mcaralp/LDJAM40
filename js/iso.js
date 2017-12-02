
var diamondHeight = 32;
var diamondWidth = 64;
var cubeHeight = 50;
var cubeWidth = diamondWidth;

function iso2Cartesian(isoX, isoY, isoZ)
{
     var x = isoX * diamondWidth/2 - isoY * diamondWidth/2;
     var y = isoX * diamondHeight/2 + isoY * diamondHeight/2 - isoZ*(this.cubeHeight - this.diamondHeight);
    return {x:x, y:y};
}