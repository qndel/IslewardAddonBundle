window.AddonBundleScriptVersion = "1.0";
let spells = {
    melee: {
        auto: true,
        cdMax: 10,
        castTimeMax: 0,
        useWeaponRange: true,
        random: {
            damage: [3, 11.4]
        }
    },
    projectile: {
        auto: true,
        cdMax: 10,
        castTimeMax: 0,
        manaCost: 0,
        range: 9,
        random: {
            damage: [2, 7.6]
        }
    },

    'magic missile': {
        statType: 'int',
        statMult: 1,
        element: 'arcane',
        cdMax: 6,
        castTimeMax: 8,
        manaCost: 4,
        range: 9,
        random: {
            damage: [4, 15]
        }
    },
    'ice spear': {
        statType: 'int',
        statMult: 1,
        element: 'frost',
        cdMax: 10,
        castTimeMax: 2,
        manaCost: 4,
        range: 9,
        random: {
            damage: [2, 8],
            i_freezeDuration: [6, 10]
        }
    },
    fireblast: {
        statType: 'int',
        statMult: 1,
        element: 'fire',
        cdMax: 4,
        castTimeMax: 2,
        manaCost: 5,
        random: {
            damage: [2, 5],
            i_radius: [1, 2.2],
            i_pushback: [2, 5]
        }
    },
    smite: {
        statType: 'int',
        statMult: 1,
        cdMax: 4,
        castTimeMax: 6,
        range: 9,
        manaCost: 7,
        random: {
            damage: [4, 14],
            i_stunDuration: [6, 10]
        }
    },
    consecrate: {
        statType: 'int',
        statMult: 1,
        element: 'holy',
        cdMax: 5,
        castTimeMax: 5,
        manaCost: 8,
        range: 9,
        radius: 3,
        random: {
            healing: [0.3, 0.5],
            i_duration: [7, 13]
        }
    },

    slash: {
        statType: 'str',
        statMult: 1,
        threatMult: 4,
        cdMax: 9,
        castTimeMax: 1,
        manaCost: 4,
        useWeaponRange: true,
        random: {
            damage: [6, 23]
        }
    },
    charge: {
        statType: 'str',
        statMult: 1,
        threatMult: 3,
        cdMax: 14,
        castTimeMax: 1,
        range: 10,
        manaCost: 3,
        random: {
            damage: [2, 8],
            i_stunDuration: [6, 10]
        }
    },
    flurry: {
        statType: 'dex',
        statMult: 1,
        cdMax: 20,
        castTimeMax: 0,
        manaCost: 12,
        random: {
            i_duration: [4, 9]
        }
    },
    smokebomb: {
        statType: 'dex',
        statMult: 1,
        element: 'poison',
        cdMax: 5,
        castTimeMax: 0,
        manaCost: 6,
        random: {
            damage: [0.25, 1.45],
            i_radius: [1, 3],
            i_duration: [7, 13]
        }
    },
    'crystal spikes': {
        statType: ['dex', 'int'],
        statMult: 1,
        manaCost: 22,
        needLos: true,
        cdMax: 20,
        castTimeMax: 0,
        range: 9,
        random: {
            damage: [3, 14],
            i_delay: [1, 4]
        },
        negativeStats: [
            'i_delay'
        ]
    },
    innervation: {
        statType: ['str'],
        statMult: 1,
        manaReserve: {
            percentage: 0.25
        },
        cdMax: 10,
        castTimeMax: 0,
        auraRange: 9,
        effect: 'regenHp',
        random: {
            regenPercentage: [0.3, 1.5]
        }
    },
    tranquility: {
        statType: ['int'],
        statMult: 1,
        element: 'holy',
        manaReserve: {
            percentage: 0.25
        },
        cdMax: 10,
        castTimeMax: 0,
        auraRange: 9,
        effect: 'regenMana',
        random: {
            regenPercentage: [4, 10]
        }
    },
    swiftness: {
        statType: ['dex'],
        statMult: 1,
        element: 'fire',
        manaReserve: {
            percentage: 0.4
        },
        cdMax: 10,
        castTimeMax: 0,
        auraRange: 9,
        effect: 'swiftness',
        random: {
            chance: [5, 10]
        }
    }

};


spells['harvest life'] = {
    statType: ['str', 'int'],
    statMult: 1,
    cdMax: 12,
    manaCost: 5,
    range: 1,
    random: {
        damage: [4, 14],
        healPercent: [10, 30]
    }
};

spells['summon skeleton'] = {
    statType: ['str', 'int'],
    statMult: 0.27,
    cdMax: 7,
    manaCost: 5,
    range: 9,
    random: {
        damagePercent: [20, 76],
        hpPercent: [40, 60]
    }
};

spells['blood barrier'] = {
    statType: ['str', 'int'],
    statMult: 0.1,
    cdMax: 20,
    manaCost: 5,
    range: 9,
    random: {
        i_drainPercentage: [10, 50],
        shieldMultiplier: [2, 5],
        i_frenzyDuration: [5, 15]
    }
};

window.expandSpellTooltip = function(obj){
    if(obj.ability === true){
        var name = obj.spell.name.toLowerCase();
        var txt;
        if(Array.isArray(spells[name].statType) == true){
            txt = spells[name].statType.map(x => "<font color='orange'>"+x+"</font>");
        } else{
            txt = "<font color='orange'>"+spells[name].statType+"</font>";
        }
        var newText = "Benefits from stats: ["+txt+"]<br>";
        Object.keys(obj.spell.values).forEach(function(key) {
            var minmax;
            if(key in spells[name].random){
                minmax = spells[name].random[key];
            } else{
                minmax = spells[name].random["i_"+key];
            }
            //50-205-50
            var maxrange = minmax[1]-minmax[0];
            var currange = obj.spell.values[key]-minmax[0];
            var startcolor = {r:255,g:0,b:0};
            var endcolor = {r:0,g:255,b:0};
            var r = startcolor.r + (endcolor.r-startcolor.r)*currange/maxrange;
            var g = startcolor.g + (endcolor.g-startcolor.g)*currange/maxrange;
            var b = startcolor.b + (endcolor.b-startcolor.b)*currange/maxrange;
            var mycolor = "rgb("+r+","+g+","+b+")";
            newText += key + ": <font style='color:"+mycolor+";'>" + obj.spell.values[key] + "</font>  [<font style='color:rgb("+startcolor.r+","+startcolor.g+","+startcolor.b+");'>"+minmax[0] +"</font>-<font style='color:rgb("+endcolor.r+","+endcolor.g+","+endcolor.b+");'>"+minmax[1]+"</font>]<br>";
        });
        $(".uiTooltipItem .tooltip .damage").eq(0).html(newText);
    }
}
addons.register({
    init: function(events) {
        events.on('onShowItemTooltip', this.onShowItemTooltip.bind(this));
        events.on('onBuiltItemTooltip', this.onBuiltItemTooltip.bind(this));
    },
    onShowItemTooltip: function(obj) {
        window.spellObj = obj;
    },
    onBuiltItemTooltip: function(obj) {
        window.expandSpellTooltip(window.spellObj);
    },
});