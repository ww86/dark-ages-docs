




// -----------------------------
// UI Element Creation: List Item
// -----------------------------

glob.dom.new_lis = function(id, defaults = {}) {

    const listItem = document.createElement('li');
    
    if (id)                              {  listItem.id     = id;               }
    Object.keys(defaults).forEach(key => {  listItem[key]   = defaults[key];    });

    return listItem;
    
};



// -----------------------------
// UI Element Creation: Button
// -----------------------------

glob.dom.new_btn = function(id, defaults = {}) {
    const button = document.createElement('button');

    if (id)                              {  button.id     = id;               }
    Object.keys(defaults).forEach(key => {  button[key]   = defaults[key];    });

    return button;
    
};



// -----------------------------
// UI Element Creation: Anchor
// -----------------------------

glob.dom.new_anc = function(id, defaults = {}) {
    const anchor = document.createElement('a');

    if (id)                              {  anchor.id     = id;               }
    Object.keys(defaults).forEach(key => {  anchor[key]   = defaults[key];    });

    return anchor;
    
};




// -----------------------------
// UI Element Creation: Span
// -----------------------------

glob.dom.new_spn = function(id, defaults = {}) {
    const span = document.createElement('span');

    if (id)                              {  span.id     = id;               }
    Object.keys(defaults).forEach(key => {  span[key]   = defaults[key];    });

    return span;

};




// -----------------------------
// UI Element Creation: Div
// -----------------------------

glob.dom.new_div = function(id, defaults = {}) {
    const div = document.createElement('div');

    if (id)                              {  div.id     = id;               }
    Object.keys(defaults).forEach(key => {  div[key]   = defaults[key];    });

    return div;
    
};




// -----------------------------
// UI Element Creation: Iframe
// -----------------------------

glob.dom.new_ifr = function(id, defaults = {}) {
    const iframe = document.createElement('iframe');

    if (id)                              {  iframe.id     = id;               }
    Object.keys(defaults).forEach(key => {  iframe[key]   = defaults[key];    });

    return iframe;
    
};





// -----------------------------
// UI Helper: Clear Active States
// -----------------------------

glob.dom.clr_act = function(menu_ul) {
    if (menu_ul && typeof menu_ul.querySelectorAll === 'function') {
        menu_ul.querySelectorAll('.act').forEach(ele => ele.classList.remove('act'));
    }
};




// -----------------------------
// UI Helper: Set Act Button
// -----------------------------

glob.dom.set_act_btn = function(btn) {
    if (btn && typeof btn.classList === 'object') {
        btn.classList.add('act');
    }
};