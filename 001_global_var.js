




// -----------------------------
// Global Variable Namespace
// -----------------------------

var glob = {
    heap : {
        // Variables intended to be modified during execution
        curr_doc_id         : null,
        curr_chap_id        : null,
    },

    data : {
        // Static data, populated by other scripts, not intended for runtime modification
        docs_data           : {},
        doc_categories      : [], // For structuring documents in the main menu
        main_menu_cfg       : [], // New: Configuration for the main menu structure
        site_links          : [],
        site_cfg            : {},
    },

    util : {
        // Non-DOM related utility functions will be initialized here
    },
 
    ui   : {
        // UI creation and manipulation functions
        new_div             : function (){},
        new_lis             : function (){}, // For <li> elements (list item element)
        new_btn             : function (){}, // For <button> elements
        new_anc             : function (){}, // For <a> elements (anchor)
        new_ifr             : function (){}, // For <iframe> elements
        clear_active        : function (){},
        set_active_btn      : function (){}
    },
};