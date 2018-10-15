window.AddonBundleScriptVersion = "1.1";
window.AddonBundleScriptName = "LevelsOnChat";
window.namesToLevels = {};
addons.register({
    init: function(events) {
        events.on('onGetMessages', this.onGetMessages.bind(this));
        events.on('onGetConnectedPlayer', this.onGetConnectedPlayer.bind(this));
    },
    onGetMessages: function(obj) {
        if(obj.messages){
            if(!obj.messages[0]){
                obj.messages = [obj.messages];
            }
            if(obj.messages[0].message){
                var myReg,matched;
                if(obj.messages[0].type && obj.messages[0].type == "chat"){
                    if(obj.messages[0].class && obj.messages[0].class == "color-yellowB"){
                        myReg = /\((\b[a-zA-Z]*)(\[\d{1,2}\])? to you\): \b.*/g;
                        matched = myReg.exec(obj.messages[0].message);
                        if(matched != undefined && matched.length >= 2){
                            obj.messages[0].message = obj.messages[0].message.replace(" to you):", "["+window.namesToLevels[matched[1]]+"] to you):");
                        }
                    } else if(obj.messages[0].class && obj.messages[0].class == "color-grayB"){
                        myReg = /([a-zA-Z]*):/g;
                        matched = myReg.exec(obj.messages[0].message);
                        if(matched != undefined && matched.length == 2){
                            obj.messages[0].message = obj.messages[0].message.replace(matched[1], matched[1]+"["+namesToLevels[matched[1]]+"]");
                        }
                    }
                } else{
                    if(obj.messages[0].class && obj.messages[0].class == "color-blueB"){
                        myReg = /([a-zA-Z]*) has reached level/g;
                        matched = myReg.exec(obj.messages[0].message);
                        if(matched != undefined && matched.length == 2){
                            window.namesToLevels[matched[1]]++;
                        }
                    }
                }
            }
        }
    },
    onGetConnectedPlayer: function(obj) {
		console.log(obj);
		console.log("CONNECETD PLAYER FROM ADDON!");
        for(var i=0;i<obj.length;++i){
            window.namesToLevels[obj[i].name] = obj[i].level;
        }
    }
});