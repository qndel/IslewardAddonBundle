// ==UserScript==
// @name         Isleward - Addon Bundle Loader
// @namespace    Isleward.Addon
// @version      0.3
// @description  Loads Addon Bundle
// @author       Qndel
// @match        play.isleward.com*
// @grant        none
// ==/UserScript==
function defer(method) {
    if (window.jQuery) {
		method();
    } else {
        setTimeout(function() { defer(method) }, 50);
    }
}
defer(function(){$.getScript( "https://qndel.github.io/IslewardAddonBundle/core.js", function( data, textStatus, jqxhr ) {})});
