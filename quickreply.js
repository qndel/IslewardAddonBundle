window.AddonBundleScriptVersion = "1.1";
window.AddonBundleScriptName = "QuickReply";
var fun = function(){
    if(jQuery(".el.textbox.message")[0] != undefined && jQuery(".el.textbox.message").val().substring(0, 2) == "/r" && window.lastReply != undefined){
        jQuery(".el.textbox.message").val(jQuery(".el.textbox.message").val().replace("/r", "@"+window.lastReply+" "));
    }
}
setInterval(fun,100);
addons.register({
    init: function(events) {
        events.on('onGetMessages', this.onGetMessages.bind(this));
    },
    onGetMessages: function(msg) {
        if(msg.messages && msg.messages[0] != undefined && msg.messages[0].type != undefined && msg.messages[0].type == "chat" && msg.messages[0].message != undefined){
            var myReg =   /\((\b[a-zA-Z]*)(\[\d{1,2}\])? to you\): \b.*/g;
            var matched = myReg.exec(msg.messages[0].message);
            if(matched != undefined && matched.length == 2){
                window.lastReply = matched[1];
            }
        }
    }
});