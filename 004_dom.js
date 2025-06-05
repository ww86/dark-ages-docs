




// -----------------------------
// UI Element Creation: List Item
// -----------------------------

glob.dom.new_lis = function(id, defaults = {}) {
    // id: string, optional. The ID for this element.
    // defaults: object, optional. Other properties to set on the element.
    const listItem = document.createElement('li');
    
    if (id)                              { listItem.id     = id;               }
    Object.keys(defaults).forEach(key => {
        listItem[key]   = defaults[key];
    });

    return listItem;
    
};



// -----------------------------
// UI Element Creation: Button
// -----------------------------

glob.dom.new_btn = function(id, defaults = {}) {
    // id: string, optional. The ID for this element.
    // defaults: object, optional. Other properties to set on the element.
    const button = document.createElement('button');

    if (id)                              { button.id     = id;               }
    Object.keys(defaults).forEach(key => {
        button[key]   = defaults[key];
    });
    return button;
    
};



// -----------------------------
// UI Element Creation: Anchor
// -----------------------------

glob.dom.new_anc = function(id, defaults = {}) {
    // id: string, optional. The ID for this element.
    // defaults: object, optional. Other properties to set on the element.
    const anchor = document.createElement('a');

    if (id)                              { anchor.id     = id;               }
    Object.keys(defaults).forEach(key => {
        anchor[key]   = defaults[key];
    });
    return anchor;
    
};




// -----------------------------
// UI Element Creation: Span
// -----------------------------

glob.dom.new_spn = function(id, defaults = {}) {
    // id: string, optional. The ID for this element.
    // defaults: object, optional. Other properties to set on the element.
    const span = document.createElement('span');

    if (id)                              { span.id     = id;               }
    Object.keys(defaults).forEach(key => {
        span[key]   = defaults[key];
    });
    return span;

};




// -----------------------------
// UI Element Creation: Div
// -----------------------------

glob.dom.new_div = function(id, defaults = {}) {
    // id: string, optional. The ID for this element.
    // defaults: object, optional. Other properties to set on the element.
    const div = document.createElement('div');

    if (id)                              { div.id     = id;               }
    Object.keys(defaults).forEach(key => {
        div[key]   = defaults[key];
    });
    return div;
    
};




// -----------------------------
// UI Element Creation: Iframe
// -----------------------------

glob.dom.new_ifr = function(id, defaults = {}) {
    // id: string, optional. The ID for this element.
    // defaults: object, optional. Other properties to set on the element.
    const iframe = document.createElement('iframe');

    if (id)                              { iframe.id     = id;               }
    Object.keys(defaults).forEach(key => {
        iframe[key]   = defaults[key];
    });
    return iframe;
    
};





// -----------------------------
// UI Helper: Clear Active States
// -----------------------------

glob.dom.clr_act = function(menu_ul) {
    if (menu_ul && typeof menu_ul.querySelectorAll === 'function') {
        menu_ul.querySelectorAll('[data-ms~="act"]').forEach(ele => {
            let current_ms_val = (ele.getAttribute('data-ms') || '');
            let new_ms_val = current_ms_val.replace(/\bact\b/g, '').trim().replace(/\s\s+/g, ' '); // Remove 'act' and extra spaces
            if (new_ms_val) {
                ele.setAttribute('data-ms', new_ms_val);
            } else {
                ele.removeAttribute('data-ms');
            }
        });
    }
};




// -----------------------------
// UI Helper: Set Act Button
// -----------------------------

glob.dom.set_act_btn = function(ele_to_set_act) {
    let current_ms_val, ms_tokens, new_ms_val;
    if (ele_to_set_act && typeof ele_to_set_act.setAttribute === 'function') {
        current_ms_val = ele_to_set_act.getAttribute('data-ms') || '';
        ms_tokens = current_ms_val.split(' ').filter(token => token !== '' && token !== 'act'); // Remove empty strings and existing 'act'
        ms_tokens.push('act'); // Add 'act'
        new_ms_val = ms_tokens.join(' ');
        ele_to_set_act.setAttribute('data-ms', new_ms_val);
    }
};