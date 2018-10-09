window.AddonBundleScriptVersion = "1.0";
window.AddonBundleScriptName = "CombatLog";
var idToName = {};
var inCombatWith = {};

function addCombatMessage(txt){
    var msg = "*"+txt+"*";
    var color = "redA";
    jQuery('<div class="list-message color-'+color+' rep">' + msg + '</div>').appendTo(jQuery(".uiMessages .list"));
    jQuery(".uiMessages .list").scrollTop(9999999);
}
addons.register({
    init: function(events) {
        events.on('onGetDamage',this.onGetDamage.bind(this));
        events.on('onGetObject',this.onGetObject.bind(this));
    },
    onGetDamage: function(dmg) {
        if(dmg.crit !== undefined){
            if(dmg.id !== undefined && dmg.source !== undefined){
                var enemyName;
                if(dmg.source == player.id){
                    inCombatWith[dmg.id] = true;
                    enemyName = idToName[dmg.id];
                    addCombatMessage("You "+(dmg.crit == true ? "critically ":"")+"hit "+enemyName+" for "+ (~~dmg.amount) +" damage.");
                } else if(dmg.id == player.id){
                    enemyName = idToName[dmg.source];
                    inCombatWith[dmg.source] = true;
                    addCombatMessage(enemyName+(dmg.crit == true ? " critically":"")+" hits you for "+ (~~dmg.amount) +" damage.");
                }
            }
        } else{
            if(dmg.event !== undefined){
                if(dmg.id == player.id && dmg.text.indexOf(" xp") != -1){
                    addCombatMessage("You gained "+dmg.text+".");
                }
            }
        }
    },
    onGetObject: function(obj) {
        if(obj.name !== undefined){
            idToName[obj.id]=obj.name;
        }
        if(obj.destroyed !== undefined && obj.destroyed == true){
            //delete idToName[obj.id];
            if(obj.id in inCombatWith){
                addCombatMessage(idToName[obj.id] + " has been killed.");
                delete inCombatWith[obj.id];
            }
        }
    }
});