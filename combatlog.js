window.AddonBundleScriptVersion = "1.3";
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
		events.on('onGetSpellCooldowns', this.onGetSpellCooldowns.bind(this));
    },
    onGetDamage: function(dmg) {
        if(dmg.crit !== undefined){
            if(dmg.id !== undefined && dmg.source !== undefined){
                var enemyName;
				var action="hit";
				if(dmg.heal !== undefined && dmg.heal == true){
					action="heal";
				}
                if(player !== undefined && dmg.source == player.id){
                    inCombatWith[dmg.id] = true;
                    enemyName = idToName[dmg.id];
                    addCombatMessage("You "+(dmg.crit == true ? "critically ":"")+action+" "+enemyName+" for "+ (~~dmg.amount) +" damage.");
                } else if(player !== undefined && dmg.id == player.id){
                    enemyName = idToName[dmg.source];
                    inCombatWith[dmg.source] = true;
                    addCombatMessage(enemyName+(dmg.crit == true ? " critically":"")+" "+action+"s you for "+ (~~dmg.amount) +" damage.");
                }
            }
        } else{
            if(dmg.event !== undefined){
                if(player !== undefined && dmg.id == player.id && dmg.text.indexOf(" xp") != -1){
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
    },
	onGetSpellCooldowns: function(spell) {
        if(spell.id !== undefined && player !== undefined && spell.id == player.id && spell.spell !== undefined){
			addCombatMessage("You cast "+player.spellbook.getSpell(spell.spell).name);
		}
    }
});