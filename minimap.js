window.AddonBundleScriptVersion = "1.0";
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
window.thingsToDraw = {};
window.thingsToDrawOld = {};
var fun = function(){
    window.drawThings();
}
var userData = localStorage.getObject('islewardMinimap')
if(userData !== undefined && userData !== null){
    window.mapScale = userData.mapScale;
    window.xOffset = userData.xOffset;
    window.yOffset = userData.yOffset;
    window.opacity = userData.opacity;
} else{
    window.mapScale = 3;
    window.xOffset=0;
    window.yOffset=0;
    window.opacity=1;
}
window.drawMapPixel = function(i,j){
    var ctx = window.uiMap[0].getContext('2d');
    if(window.map[i][j] == 0){
        ctx.fillStyle = "#2c2136";
    } else{
        if (window.collisionMap[i][j] == 0) {
            ctx.fillStyle = "#757b92";
        } else {
            ctx.fillStyle = "#000000";
        }
    }
    ctx.fillRect(i,j, 1, 1);
}

window.toggleMap = function() {
    if (!window.collisionMap) {
        return;
    }
    if (window.uiMap.css("display") == "block") {
        window.uiContainer.css('background-color', 'transparent');
        window.uiContainer.removeClass('blocking');
        window.uiMap.css("display", "none");
        for(var i=jQuery(".minimapName").length-1;i>=0;--i){
            jQuery(".minimapName").eq(i).css("display", "none");
        }
        return;
    } else {
        window.uiMap.css("display", "block");
        window.drawMap();
        window.drawThings();
        for(i=jQuery(".minimapName").length-1;i>=0;--i){
            jQuery(".minimapName").eq(i).css("display", "block");
        }
    }
};
window.drawMap = function() {
    if (!window.collisionMap || window.uiMap.css("display") != "block") {
        return;
    }

    window.uiMap[0].width = window.collisionMap.length * window.mapScale;
    window.uiMap[0].height = window.collisionMap[0].length * window.mapScale;

    var ctx = window.uiMap[0].getContext('2d');
    ctx.scale(window.mapScale, window.mapScale);
    ctx.clearRect(0, 0, window.uiMap[0].width, window.uiMap[0].height);

    for (var i = 0; i < window.collisionMap.length; i++) {
        for (var j = 0; j < window.collisionMap[i].length; j++) {
            window.drawMapPixel(i,j);
        }
    }
    window.uiMap.css({
        'position': "absolute",
        'left': window.xOffset,
        'top': (window.uiContainer[0].clientHeight / 2) - (window.uiMap[0].height / 2)+window.yOffset,
        'background-color': "#3c3f4c",
        'border': "4px solid #505360",
    });
};
window.drawThings = function() {
    if (window.uiMap.css("display") != "block") {
        return;
    }
    var ctx = window.uiMap[0].getContext('2d');
    Object.keys(window.thingsToDrawOld).forEach(function(key) {
        for(var i=-2;i<=2;++i){
            for(var j=-2;j<=2;++j){
                window.drawMapPixel(window.thingsToDrawOld[key].x+i,window.thingsToDrawOld[key].y+j);
            }
        }
    });

    Object.keys(window.thingsToDraw).forEach(function(key) {
        thingsToDrawOld[key] = {};
        Object.keys(window.thingsToDraw[key]).forEach(function(key2) {
            thingsToDrawOld[key][key2] = thingsToDraw[key][key2];
        });
        ctx.fillStyle = window.thingsToDraw[key].color;
        if(window.thingsToDraw[key].name == player.name){
            ctx.fillStyle = "#ffff00";
        }
        for(var i=-1;i<=1;++i){
            for(var j=-1;j<=1;++j){
                ctx.fillRect(window.thingsToDraw[key].x+i,window.thingsToDraw[key].y+j, 1, 1);
            }
        }
        if(thingsToDraw[key].name != "sun_carp" && thingsToDraw[key].name.indexOf("pumpkin") == -1){
            var top = (window.uiContainer[0].clientHeight / 2) - (window.uiMap[0].height / 2)+ window.yOffset+window.thingsToDraw[key].y*window.mapScale;
            var left = window.xOffset+window.thingsToDraw[key].x*window.mapScale;
            top -= jQuery(".minimapName."+window.thingsToDraw[key].name)[0].clientHeight;
            left -= jQuery(".minimapName."+window.thingsToDraw[key].name)[0].clientWidth/2;
            jQuery(".minimapName."+window.thingsToDraw[key].name).eq(0).css("top",top);
            jQuery(".minimapName."+window.thingsToDraw[key].name).eq(0).css("left",left);
            if(window.localStorage.iwd_opt_shownames !== undefined){
                if(window.localStorage.iwd_opt_shownames != "true"){
                    jQuery(".minimapName."+window.thingsToDraw[key].name).eq(0).css("display","none");
                } else{
                    jQuery(".minimapName."+window.thingsToDraw[key].name).eq(0).css("display","block");
                }
            }
        }
    });
}
addons.register({
    init: function(events) {
        window.uiContainer = jQuery('.ui-container');
        window.uiMap = jQuery('<canvas class="addon-uiMap"></canvas>').appendTo(window.uiContainer);
        window.uiMap.css("display", "none");
        window.uiMap.css("pointer-events","none");
        window.uiMap.css("opacity","1.0");
        events.on('onGetMap', this.onGetMap.bind(this));
        events.on('onKeyDown', this.onKeyDown.bind(this));
        events.on('onGetObject', this.onGetObject.bind(this));
        events.on('onRezone', this.onRezone.bind(this));
    },
    onGetMap: function(mapData) {
        if (mapData.collisionMap) {
            window.collisionMap = mapData.collisionMap;
            window.map = mapData.map;
        }
    },
    onRezone: function(data) {
        window.thingsToDraw = {};
        if (window.uiMap.css("display") == "block") {
            window.drawMap();
            window.drawThings();
        }
        for(var i=jQuery(".minimapName").length-1;i>=0;--i){
            jQuery(".minimapName").eq(i).remove();
        }
    },
    onKeyDown: function(key) {
        if (!key) {
            return;
        } else if (key == "n") {
            window.toggleMap();
        } else if (key == "13") {
            if (window.mapScale > 1) {
                window.mapScale-=0.1;
                window.drawMap();
            }
        } else if (key == "11") {
            if (window.mapScale < 11) {
                window.mapScale+=0.1;
                window.drawMap();
            }
        } else if (key == "5") {
            if(window.opacity >= 0.1){
                window.opacity-=0.1;
                window.uiMap.css('opacity',window.opacity);
            }
        } else if (key == "6") {
            if(window.opacity <= 0.9){
                window.opacity+=0.1;
                window.uiMap.css('opacity',window.opacity);
            }
        } else if (key == "7") {
            window.yOffset-=30;
            window.uiMap.css('top',(window.uiContainer[0].clientHeight / 2) - (window.uiMap[0].height / 2)+window.yOffset);
        }
        else if (key == "8") {
            window.yOffset+=30;
            window.uiMap.css('top',(window.uiContainer[0].clientHeight / 2) - (window.uiMap[0].height / 2)+window.yOffset);
        }
        else if (key == "9") {
            window.xOffset-=30;
            window.uiMap.css('left',window.xOffset);
        }
        else if (key == "0") {
            window.xOffset+=30;
            window.uiMap.css('left',window.xOffset);
        }
        localStorage.setObject('islewardMinimap', {xOffset:window.xOffset, yOffset:window.yOffset,mapScale:window.mapScale,opacity:window.opacity});
    },
    onGetObject: function(obj) {
        if(obj.name !== undefined){
            var safeName = obj.name.split(' ').join('_');
            if((obj.account !== undefined) || (safeName.toLowerCase() === "m'ogresh" || safeName.toLowerCase() === "radulos" || safeName.toLowerCase() === "sun_carp" || (obj.isRare != undefined && obj.isRare == true)) || safeName.toLowerCase().indexOf("pumpkin") != -1 ){
                if(safeName.toLowerCase() === "m'ogresh"){
                    window.thingsToDraw[obj.id] = {x: obj.x, y: obj.y, color:"#00ff00", name:"mogresh", textColor:"rgb(0,255,0)"};
                } else if(safeName.toLowerCase() === "radulos"){
                    window.thingsToDraw[obj.id] = {x: obj.x, y: obj.y, color:"#00ff00", name:"radulos", textColor:"rgb(0,255,0)"};
                } else if(safeName.toLowerCase() === "sun_carp"){
                    window.thingsToDraw[obj.id] = {x: obj.x, y: obj.y, color:"#00ffff", name:"sun_carp", textColor:"rgb(0,100,255)"};
                } else if (safeName.toLowerCase().indexOf("pumpkin") != -1){
                    window.thingsToDraw[obj.id] = {x: obj.x, y: obj.y, color:"#ffffff", name:"pumpkin", textColor:"rgb(0,100,255)"};
                }else{
                    if(obj.isRare != undefined && obj.isRare == true){
                        if(jQuery(".minimapName."+safeName)[0] != undefined){
                            var newName = safeName+(~~(Math.random()*99));
                            window.thingsToDraw[obj.id] = {x: obj.x, y: obj.y, color: "#ff00ff", name:newName , textColor:"rgb(0,255,0)"};
                        } else{
                            window.thingsToDraw[obj.id] = {x: obj.x, y: obj.y, color: "#ff00ff", name:safeName , textColor:"rgb(0,255,0)"};
                        }
                    } else{
                        window.thingsToDraw[obj.id] = {x: obj.x, y: obj.y, color: "#ff0000", name:safeName , textColor:"rgb(0,255,0)"};
                    }
                }
                if(window.thingsToDraw[obj.id].name != "sun_carp" && window.thingsToDraw[obj.id].name.indexOf("pumpkin") == -1){
                    var el = jQuery('<div class="minimapName '+window.thingsToDraw[obj.id].name+'"></div>').appendTo('.ui-container');
                    el.css('color',window.thingsToDraw[obj.id].textColor);
                    el.css('position','absolute');
                    el.text(window.thingsToDraw[obj.id].name);
                    el.css('display',window.uiMap.css("display"));
                }
            }
        } else{
            if(obj.id in window.thingsToDraw){
                if(obj.x !== undefined && obj.y !== undefined){
                    window.thingsToDraw[obj.id].x = obj.x;
                    window.thingsToDraw[obj.id].y = obj.y;
                }

                if(obj.destroyed !== undefined && obj.destroyed == true){
                    jQuery(".minimapName."+window.thingsToDraw[obj.id].name).remove();
                    delete window.thingsToDraw[obj.id];
                }
            }
        }
    }
});
setInterval(fun, 2000);