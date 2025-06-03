




// -----------------------------
// Global Variable Namespace
// -----------------------------

var glob = {
    heap: {
        // Variables intended to be modified during execution
        curr_doc_id             : null,
        curr_chap_id            : null,
        curr_pdf                : null, // Holds the currently loaded PDF.js document object
        curr_pdf_basesrc        : '',   // Holds the base src/path
    },

    data: {
        // Static data, populated by other scripts, not intended for runtime modification
        docs_data               : [],
        doc_categories          : [], // For structuring documents in the main menu
        main_menu_cfg           : [], // New: Configuration for the main menu structure
        site_links              : [],
        site_cfg                : {},
    },

    util: {
        pdf_ext_pge_txt_reg       : async function () { },
        // Non-DOM related utility functions will be initialized here
    },

    dom:  {
        new_div                 : function () { },
        new_lis                 : function () { }, // For <li> elements (list item ele)
        new_btn                 : function () { }, // For <button> elements
        new_anc                 : function () { }, // For <a> elements (anchor)
        new_spn                 : function () { }, // For <span> elements
        new_ifr                 : function () { }, // For <iframe> elements
        clr_act                 : function () { },
        set_act_btn             : function () { }
    },

    ui:   {
        // UI creation and manipulation functions
        pop_main_menu           : function () { },
        pop_chap_sub_menu       : function () { },
        pop_pdf_pge_nav_menu    : function () { },
        pop_right_col_links     : function () { },
        set_doc_hdr             : function () { },
        set_doc_ftr             : function () { },
        set_doc_con             : function () { }, // Clears and sets innerHTML or appends an ele
        create_pdf_view_ifr     : function () { },
        display_err_in_ele      : function () { },
        // Higher-level UI orchestration/trigger functions
        trg_main_menu_pop       : function () { }, // Triggers population of the main menu
        trg_chap_sub_menu_pop   : function () { }, // Triggers population of the chapter sub-menu
        trg_pdf_pge_nav_pop     : function () { }, // Triggers population of PDF page navigation menu
        trg_right_col_pop       : function () { }, // Triggers population of the right column links
        upd_doc_hdr_ftr         : async function () { }, // Updates document header/footer (e.g., for PDF page changes)
        load_doc_con            : async function () { }, // Loads main document content (HTML or PDF)
    },
};