window.AddonBundleScriptVersion = "1.0";
window.AddonBundleScriptName = "StashSearch";
var variableList = [];
function recursiveDictUnpack(obj){
    var ret="";
    var prefix = "";
    Object.keys(obj).forEach(function(key) {
        if (obj[key].constructor == Object) {
            ret+=recursiveDictUnpack(obj[key]);
        }else if (typeof obj[key] === 'string' || obj[key] instanceof String){
            ret += prefix+key+"='"+obj[key]+"';";
            variableList.push(key);
        }else if (obj[key].constructor == Array){
            if(obj[key][0].stat === undefined){
                ret += prefix+key+"=["+obj[key]+"];";
                variableList.push(key);
            } else{
                for(var d=0;d<obj[key].length;++d){
                    ret += prefix+obj[key][d].stat+"="+obj[key][d].value+";";
                    variableList.push(obj[key][d].stat);
                }
            }
        }else{
            ret += prefix+key+"="+obj[key]+";";
            variableList.push(key);
        }
    });
    return ret;
}
addons.register({
    init: function(events) {
        events.on('onGetStashItems', this.onGetStashItems.bind(this));
    },
    onGetStashItems: function(obj) {
        window.stashItems = obj;
        if(jQuery(".stashAddon")[0] !== undefined){return;}
        jQuery('<div class="stashAddon"><input class="searchStash" type="text" style="width:100%; color: rgba(255,133,0,1); background-color: rgba(0,255,0,0.2);",name="searchStash" value="" placeholder="enter search"></div>').appendTo('.uiStash.modal');
        jQuery('.stashAddon .searchStash').on('input', function() {
            jQuery(".uiStash.modal .grid .item .icon").css("background-color","rgba(200,100,0,0)");
            if(jQuery(this).val().slice(-1) == ';'){
                for(var j=0;j<window.stashItems.length;++j){
                    var i = window.stashItems[j];
                    var highlight=false;
                    var deleteOld = "";
                    for(var c=0;c<variableList.length;++c){
                        deleteOld+= variableList[c]+"=undefined;";
                    }
                    variableList = [];
                    try {
                        var stuffToEval = deleteOld+recursiveDictUnpack(i)+jQuery(this).val();
                        highlight=eval(stuffToEval);
                    } catch (e) {
                        highlight=false;
                    }
                    if(highlight === true){
                        jQuery(".uiStash.modal .grid .item .icon").eq(j).css("background-color","rgba(200,100,0,0.5)");
                    }
                }
            }
        });
    }
});