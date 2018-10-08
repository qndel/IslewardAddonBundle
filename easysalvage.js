window.AddonBundleScriptVersion = "1.0";
window.easySalvageData = {};
window.easySalvageData.itemPos = -1;
addons.register({
    init: function(events) {
        events.on('onShowItemTooltip', this.onShowItemTooltip.bind(this));
        events.on('onHideItemTooltip', this.onHideItemTooltip.bind(this));
        events.on('onKeyDown', this.onKeyDown.bind(this));
    },
    onShowItemTooltip: function(obj) {
        if(obj.material === true || obj.noSalvage === true){
            window.easySalvageData.itemPos = -1;
        } else{
            window.easySalvageData.itemPos = obj.pos;
        }
    },
    onHideItemTooltip: function(obj) {
        window.easySalvageData.itemPos = -1;
    },
    onKeyDown: function(key) {
        if (!key) {
            return;
        } else if (key == "b") {
            if(jQuery(".ui-container .uiInventory").css("display") == "block" && window.easySalvageData.itemPos != -1 && typeof jQuery(".uiMessages .active .typing")[0] === "undefined"){
                jQuery(".ui-container .uiInventory .grid .item").eq(window.easySalvageData.itemPos).find(".icon").contextmenu();
                for(var i=0;i< $(".uiContext .list .option").length;++i){
                    if(jQuery(".uiContext .list .option").eq(i).text() == "salvage"){
                        jQuery(".uiContext .list .option").eq(i).click();
                        break;
                    }
                }
            }
        }
    },
});