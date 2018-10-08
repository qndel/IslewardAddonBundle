// ==UserScript==
// @name         Isleward - Addon Bundle Loader
// @namespace    Isleward.Addon
// @version      0.1
// @description  Loads Addon Bundle
// @author       Qndel
// @match        play.isleward.com*
// @grant        none
// ==/UserScript==
var addonBundle = [{addonName: "Timestamp", shortName:"timestamp", url:"timestamp.js", hoverText: "shows time next to messages"},
                   {addonName: "EasySalvage", shortName:"easy salvage", url:"easysalvage.js", hoverText: "press B to salvage item under cursor"},
                   {addonName: "StashSearch", shortName:"search stash", url:"searchstash.js", hoverText: "adds a search tab in stash and highlights items that meet search requirements"},
                   {addonName: "BetterRuneDescriptions", shortName:"better rune info", url:"expandedrunedescriptions.js", hoverText: "shows the min/max stat range for runes"},
                   {addonName: "QuickReply", shortName:"quick reply", url:"quickreply.js", hoverText: "allows to reply to last whisper by writing /r"},
                   {addonName: "Minimap", shortName:"minimap", url:"minimap.js", hoverText: "Press N to see minimap."},
                   {addonName: "BossRespawn", shortName:"mogresh respawn", url:"respawntimer.js", hoverText: "Shows time to next Mogresh respawn in the events section."}
                  ];
var tooltipStyle =
    `<style>
/* Tooltip container */
.tooltip {
position: relative;
display: inline-block;
border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
visibility: hidden;
width: 120px;
background-color: black;
color: #fff;
text-align: center;
padding: 5px 0;
border-radius: 6px;

/* Position the tooltip text - see examples below! */
position: absolute;
z-index: 1;
width: 120px;
top: -5px;
right: 105%;
}

.tooltip:hover .tooltiptext {
visibility: visible;
}
</style>
`;
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
function defer(method) {
    if (window.jQuery) {
        method();
    } else {
        setTimeout(function() { defer(method) }, 50);
    }
}
defer(
    (function () {
        addons.register({
            init: function(events) {
                events.on('onResourcesLoaded', this.onResourcesLoaded.bind(this));
                events.on('onEnterGame', this.onEnterGame.bind(this));
            },
            onResourcesLoaded: function(obj) {
                window.AddonBundleChangeState = function(addonName,addonState){
                    var myData = localStorage.getObject('islewardAddonBundle');
                    if(myData !== undefined && myData !== null && myData[addonName]){
                        myData[addonName].shouldLoad=addonState;
                    }
                    localStorage.setObject('islewardAddonBundle',myData);
                }
                var localStorageAddonData = localStorage.getObject('islewardAddonBundle');
                window.addonLoader = jQuery('<div class="addon-loader" style="position:absolute;left:200px;"></div>').appendTo(jQuery('.ui-container'));
                var src = tooltipStyle+'<table bgcolor="rgb(25,25,25)">';
                for(var i=0;i<addonBundle.length;++i){
                    var onClick =
                        `if(jQuery('#'+this.id).text() == 'On'){
jQuery('#'+this.id).text('Off');
jQuery('#'+this.id).css('background','rgb(255,0,0)');
window.AddonBundleChangeState(this.id.substr(6),false);
}
else{
jQuery('#'+this.id).text('On');
jQuery('#'+this.id).css('background','rgb(0,255,0)');
window.AddonBundleChangeState(this.id.substr(6),true);
}`
                    var drawButton = '<button id="Button'+addonBundle[i].addonName+'" style="color:rgb(0,0,0); width:40px; background:rgb(255,0,0);" onclick="'+onClick+'" type="button">Off</button>';
                    if(localStorageAddonData && localStorageAddonData[addonBundle[i].addonName] && localStorageAddonData[addonBundle[i].addonName].shouldLoad === true){
                        drawButton = '<button id="Button'+addonBundle[i].addonName+'" style="color:rgb(0,0,0); width:40px; background:rgb(0,255,0);" onclick="'+onClick+'" type="button">On</button>';
                    } else{
                        if(localStorageAddonData === undefined || localStorageAddonData === null){
                            localStorageAddonData = {};
                        }
                        if(localStorageAddonData && localStorageAddonData[addonBundle[i].addonName] === undefined){
                            localStorageAddonData[addonBundle[i].addonName] = {shouldLoad:false, version:"0.0"};
                            localStorage.setObject('islewardAddonBundle',localStorageAddonData);
                        }
                    }
                    src += '<tr><td><div class="tooltip"><font color="orange">'+addonBundle[i].shortName+'</font><span class="tooltiptext">'+addonBundle[i].hoverText+'</span></div></td><td>'+drawButton+'</td>';
                }
                src += "</table>";
                window.addonLoader.html(src);
            },

            onEnterGame: function(obj) {
                jQuery(".addon-loader").css("display","none");
                var data = localStorage.getObject('islewardAddonBundle');
                function deferTillChat(method) {
                    if (jQuery(".uiMessages .list")[0] !== undefined) {
                        method();
                    } else {
                        setTimeout(function() { deferTillChat(method) }, 50);
                    }
                }
                for(var i = 0;i<addonBundle.length;++i){
                    if(data !== undefined && data !== null && data[addonBundle[i].addonName] && data[addonBundle[i].addonName].shouldLoad === true){
                        $.getScript("https://qndel.github.io/IslewardAddonBundle/"+addonBundle[i].url)
                            .done(function( script, textStatus ) {
                            var msg = "Addon " +window.AddonBundleScriptName+ " loaded";
                            var color = "yellowB";
                            if(window.AddonBundleScriptVersion != data[window.AddonBundleScriptName].version){
                                msg += " [updated to v."+window.AddonBundleScriptVersion+"]";
                                data[window.AddonBundleScriptName].version = window.AddonBundleScriptVersion;
                                localStorage.setObject('islewardAddonBundle',data);

                            }
                            deferTillChat(function(){jQuery('<div class="list-message color-'+color+' chat">' + msg + '</div>').appendTo(jQuery(".uiMessages .list"))});
                        })
                            .fail(function( jqxhr, settings, exception ) {
                            var msg = "Addon " +window.AddonBundleScriptName+ " failed to load!";
                            var color = "redA";
                            deferTillChat(function(){jQuery('<div class="list-message color-'+color+' chat">' + msg + '</div>').appendTo(jQuery(".uiMessages .list"))});
                        });

                    }
                }
            }
        });
    }));