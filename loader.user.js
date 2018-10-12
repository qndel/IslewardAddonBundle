// ==UserScript==
// @name         Isleward - Addon Bundle Loader
// @namespace    Isleward.Addon
// @version      0.3
// @description  Loads Addon Bundle
// @author       Qndel
// @match        play.isleward.com*
// @grant        none
// ==/UserScript==
var d=a=>window.$?$.getScript`https://qndel.github.io/IslewardAddonBundle/core.js`:setTimeout(d,50);d()

//version to paste in console if not using tampermonkey:
/*
$.getScript`https://qndel.github.io/IslewardAddonBundle/core.js`;
wait for a second then
window.loadAddonBundlePanel();
*/