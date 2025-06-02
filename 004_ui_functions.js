




// -----------------------------
// UI Element Creation: List Item
// -----------------------------

glob.ui.new_lis = function(id, defaults = {}) {

    const listItem = document.createElement('li');
    
    if (id)                              {  listItem.id     = id;               }
    Object.keys(defaults).forEach(key => {  listItem[key]   = defaults[key];    });

    return listItem;
    
};



// -----------------------------
// UI Element Creation: Button
// -----------------------------

glob.ui.new_btn = function(id, defaults = {}) {
    const button = document.createElement('button');

    if (id)                              {  button.id     = id;               }
    Object.keys(defaults).forEach(key => {  button[key]   = defaults[key];    });

    return button;
    
};



// -----------------------------
// UI Element Creation: Anchor
// -----------------------------

glob.ui.new_anc = function(id, defaults = {}) {
    const anchor = document.createElement('a');

    if (id)                              {  anchor.id     = id;               }
    Object.keys(defaults).forEach(key => {  anchor[key]   = defaults[key];    });

    return anchor;
    
};




// -----------------------------
// UI Element Creation: Div
// -----------------------------

glob.ui.new_div = function(id, defaults = {}) {
    const div = document.createElement('div');

    if (id)                              {  div.id     = id;               }
    Object.keys(defaults).forEach(key => {  div[key]   = defaults[key];    });

    return div;
    
};




// -----------------------------
// UI Element Creation: Iframe
// -----------------------------

glob.ui.new_ifr = function(id, defaults = {}) {
    const iframe = document.createElement('iframe');

    if (id)                              {  iframe.id     = id;               }
    Object.keys(defaults).forEach(key => {  iframe[key]   = defaults[key];    });

    return iframe;
    
};





// -----------------------------
// UI Helper: Clear Active States
// -----------------------------

glob.ui.clear_active = function(menu_ul) {
    if (menu_ul && typeof menu_ul.querySelectorAll === 'function') {
        menu_ul.querySelectorAll('button.active').forEach(btn => btn.classList.remove('active'));
    }
};




// -----------------------------
// UI Helper: Set Active Button
// -----------------------------

glob.ui.set_active_btn = function(button) {
    if (button && typeof button.classList === 'object') {
        button.classList.add('active');
    }
};