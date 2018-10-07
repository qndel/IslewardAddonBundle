window.AddonBundleScriptVersion = "1.0";
addons.register({
    init: function(events) {
        events.on('onGetMessages', this.onGetMessages.bind(this));
    },
    onGetMessages: function(obj) {
        if(obj.messages){
            if(!obj.messages[0]){
                obj.messages = [obj.messages];
            }
            if(obj.messages[0].message){
                obj.messages[0].message = "["+(new Date().toLocaleTimeString()).split(":").join("&#58;")+"] "+obj.messages[0].message;
            }
        }
    }
});