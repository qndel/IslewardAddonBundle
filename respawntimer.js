window.AddonBundleScriptVersion = "1.0";
window.AddonBundleScriptName = "BossRespawn";
addons.register({
    init: function(events) {
        events.on('onGetObject', this.onGetObject.bind(this));
    },
    onGetObject: function(obj) {
        // if(typeof obj.name != "undefined"){
        //     console.log(obj);
        //  }
        if(obj.name === "m'ogresh"){
            window.bossID = obj.id;
            if(typeof window.lastRespawned === "undefined" && typeof window.lastKilled !== "undefined"){
                window.lastRespawned = new Date();
            }
        }

        if (typeof window.bossID != "undefined" && obj.id == window.bossID && obj.destroyed){
            if(typeof window.lastKilled === "undefined" && typeof window.lastRespawned === "undefined"){
                window.lastKilled = new Date();
            }
            window.respawnTime = 143;

            if(typeof window.lastRespawned != "undefined" && typeof window.lastKilled != "undefined"){
                window.respawnTime2 = window.lastRespawned-window.lastKilled;
                window.respawnTime = ~~ (window.respawnTime2/1000);
            }

            if(typeof window.killCounter != "undefined"){
                window.killCounter++;
            } else{
                window.killCounter=1;
            }

        }
    }
});
var repeatEverySec = function(){
    if(typeof window.respawnTime === "undefined"){
        window.respawnTime = 0;
    }
    if(window.respawnTime > 0){
        window.respawnTime--;
        if(window.respawnTime == 0){
            var audioElement = document.createElement("audio");
            audioElement.type = "audio/wav";
            audioElement.src = "http://www.wavlist.com/soundfx/002/cat-meow3.wav";
            audioElement.play();
        }
    }
    var toHHMMSS = (secs) => {
        var sec_num = parseInt(secs, 10);
        var hours = Math.floor(sec_num / 3600) % 24;
        var minutes = Math.floor(sec_num / 60) % 60;
        var seconds = sec_num % 60;
        return [hours,minutes,seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v,i) => v !== "00" || i > 0)
            .join(":")
    }
    var kills = window.killCounter;
    if(typeof window.killCounter === "undefined"){
        kills = 0;
    }

    var txt = "Mogresh["+kills+"] respawns in "+ toHHMMSS(window.respawnTime);

    if(window.respawnTime == 0){txt = "Events: Mogresh kills: "+kills;}
    $(".ui-container .right .uiEvents .heading").text(txt);
};
setInterval(repeatEverySec, 1000);