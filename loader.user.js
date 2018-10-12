// ==UserScript==
// @name         Isleward - Addon Bundle Loader
// @namespace    Isleward.Addon
// @version      0.3
// @description  Loads Addon Bundle
// @author       Qndel
// @match        play.isleward.com*
// @grant        none
// ==/UserScript==
var d=m=>(window.$?m():setTimeout(()=>d(m),50));d(()=>$.getScript("https://qndel.github.io/IslewardAddonBundle/core.js"))