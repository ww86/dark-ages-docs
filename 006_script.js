



  
document.addEventListener('DOMContentLoaded', () => {



   // -----------------------------
    // DOM Element References
    // -----------------------------
    // Purpose: To cache references to frequently used DOM elements once the DOM is loaded.
    //          This improves performance by avoiding repeated querySelector calls and centralizes element selection.
    // Structure: Constants are declared for each main UI panel and content area.

    const mainmenu_ul      = document.querySelector('.mainmenu ul');
    const submenu_ul       = document.querySelector('.submenu ul');
    const rht_col_ul      = document.querySelector('.rht-col ul');
    const doc_hdr_div       = document.querySelector('.doc-hdr');
    const doc_con_div       = document.querySelector('.doc-content'); // Corrected class from CSS
    const doc_ftr_div       = document.querySelector('.doc-ftr');
 

    // -----------------------------
    // Bundles for Passing to UI Functions
    // -----------------------------
    // Purpose: To group related DOM elements or event handlers into single objects (bundles).
    //          This simplifies the parameter lists of glob.ui functions, making calls cleaner and more manageable.
    // Structure: `dom_eles_bndl` will hold common DOM elements.
    //            `evt_handlers_bndl` will hold references to the event handler functions defined below.

    const dom_eles_bndl = {
        mainmenu_ul, submenu_ul, rht_col_ul, // Though mainmenu_ul and rht_col_ul are often passed directly
        doc_hdr_div, doc_con_div, doc_ftr_div
    };

    // Forward declare evt_handlers_bndl, define after handlers
    let evt_handlers_bndl;    


    // -----------------------------
    // Event Handlers
    // -----------------------------
    // Purpose: Defines functions executed in response to user interactions (e.g., clicks).
    //          These handlers orchestrate UI changes by:
    //          1. Calling appropriate glob.ui functions (e.g., load_doc_con, upd_doc_hdr_ftr).
    //          2. Managing UI state not directly handled by population functions (e.g., setting 'active' class on clicked menu items).
    // Structure: Each function (e.g., handle_mainmenu_doc_btn_click, handle_chap_submenu_click)
    //            receives event-specific parameters (like item ID, the clicked DOM element).
    //            They use glob.dom.clr_act and glob.dom.set_act_btn for visual feedback.

    function handle_mainmenu_doc_btn_click(doc_id, clicked_btn_ele) {
        const doc_data = glob.data.docs_data.find(doc => doc.id === doc_id);
        let first_chap_id;

        if (mainmenu_ul) glob.dom.clr_act(mainmenu_ul); // Clear active from all main menu buttons
        if (clicked_btn_ele) glob.dom.set_act_btn(clicked_btn_ele); // Set current one active

        if (doc_data && doc_data.chapters && doc_data.chapters.length > 0) {
            first_chap_id = doc_data.chapters[0].id;
            glob.ui.load_doc_con(doc_id, first_chap_id, dom_eles_bndl, evt_handlers_bndl);
        } else if (doc_data && doc_data.path) { // For single PDFs/HTML files with a 'path'
            // Use a conventional chapter ID, or the doc_id itself, to load the main path
            first_chap_id = doc_data.id; // Or a conventional ID like "main_content"
            glob.ui.load_doc_con(doc_id, first_chap_id, dom_eles_bndl, evt_handlers_bndl);
        } else if (doc_data) {
            glob.ui.set_doc_con(doc_con_div, `<p>Content for '${doc_data.title}' is not available or has no chapters.</p>`);
            glob.ui.set_doc_hdr(doc_hdr_div, doc_data.default_hdr_con || `<h2>${doc_data.title}</h2>`);
            glob.ui.set_doc_ftr(doc_ftr_div, doc_data.default_ftr_con || "End of Document");
            if (submenu_ul) submenu_ul.innerHTML = ''; // Clear sub-menu
        } else {
            glob.ui.display_err_in_ele(doc_con_div, `Document with ID '${doc_id}' not found.`);
        }
    }

    function handle_chap_submenu_click(chap_id, clicked_btn_ele) {
        if (glob.heap.curr_doc_id) {
            if (submenu_ul) glob.dom.clr_act(submenu_ul);
            if (clicked_btn_ele) glob.dom.set_act_btn(clicked_btn_ele);
            glob.ui.load_doc_con(glob.heap.curr_doc_id, chap_id, dom_eles_bndl, evt_handlers_bndl);
        } else {
            console.error("[handle_chap_submenu_click] Current document ID is not set in glob.heap.");
        }
    }

    function handle_pdf_pge_link_click(pge_num, clicked_btn_ele) {
        const pdf_frame = doc_con_div.querySelector('iframe'); // Assuming PDF is in an iframe

        if (submenu_ul) glob.dom.clr_act(submenu_ul);
        if (clicked_btn_ele) glob.dom.set_act_btn(clicked_btn_ele);

        if (pdf_frame && glob.heap.curr_pdf_basesrc) {
            let new_src = `${glob.heap.curr_pdf_basesrc}#page=${pge_num}`;
            const default_zoom = glob.data.site_cfg?.default_pdf_zoom; // Get default zoom

            // Append zoom parameter
            if (default_zoom) {
                new_src += `&zoom=${default_zoom}`; // Use '&' as page is the first param
        }

            // For basic iframe PDF viewing, changing src might be enough.
            pdf_frame.src = new_src; // Use the new_src which includes zoom
        }
        // Update header/footer with new page number
        if (glob.heap.curr_pdf) { // Check if a PDF.js object is loaded
            const current_doc_data = glob.data.docs_data.find(doc => doc.id === glob.heap.curr_doc_id);
            glob.ui.upd_doc_hdr_ftr(glob.heap.curr_pdf, pge_num, glob.heap.curr_pdf.numPages, current_doc_data, dom_eles_bndl);
        } else {
            // Fallback if glob.heap.curr_pdf is not set (e.g. if PDF failed to load initially but nav is still there)
            const current_doc_data = glob.data.docs_data.find(doc => doc.id === glob.heap.curr_doc_id);
            glob.ui.upd_doc_hdr_ftr(null, pge_num, 'N/A', current_doc_data, dom_eles_bndl);
        }
    }

    function handle_mainmenu_nav_link_click(href, clicked_anc_ele) {
        if (mainmenu_ul) glob.dom.clr_act(mainmenu_ul); // Clear active from all items in this menu
        if (clicked_anc_ele) glob.dom.set_act_btn(clicked_anc_ele); // Set current anchor active
        glob.ui.set_doc_con(doc_con_div, `<p>Navigating to: ${href}. Content to be loaded.</p>`);
    }

    function handle_rht_col_link_click(href, clicked_anc_ele) {
        if (rht_col_ul) glob.dom.clr_act(rht_col_ul); // Clear active from all items in this menu
        if (clicked_anc_ele) glob.dom.set_act_btn(clicked_anc_ele); // Set current anchor active
        glob.ui.set_doc_con(doc_con_div, `<p>External link: ${href}. Content to be loaded.</p>`);   
    }

    function handle_mainmenu_action_btn_click(action_id, clicked_btn_ele) {
        if (mainmenu_ul) glob.dom.clr_act(mainmenu_ul); // Clear active from all main menu buttons
        if (clicked_btn_ele) glob.dom.set_act_btn(clicked_btn_ele); // Set current one active

        if (action_id === 'print_dom_to_display') {
            const domStructureString = glob.util.print_dom_to_string();
            const preElement = document.createElement('pre');
            preElement.textContent = domStructureString; // textContent handles escaping HTML
            preElement.style.whiteSpace = 'pre-wrap'; // Preserve formatting and wrap lines
            preElement.style.wordWrap = 'break-word'; // Break long words
            preElement.style.fontFamily = 'monospace'; // Use a monospace font
            glob.ui.set_doc_con(doc_con_div, preElement);
        } else {
            console.warn(`[handle_mainmenu_action_btn_click] Unknown action_id: ${action_id}`);
        }
    }

    // -----------------------------
    // Initial Page Setup
    // -----------------------------
    // Purpose: Executes once the DOM is fully loaded to initialize the application's UI.
    //          This includes populating menus and loading any default document or view.
    // Structure: Calls to glob.ui.trg_... functions to populate the main menu, right column, etc.
    //            Loads a default document and chapter if specified in glob.data.site_cfg.
    //            Sets up an initial welcome message if no default content is loaded.

    evt_handlers_bndl = {
        handle_mainmenu_doc_btn_click,
        handle_chap_submenu_click,
        handle_pdf_pge_link_click,
        handle_mainmenu_nav_link_click,
        handle_rht_col_link_click,
        handle_mainmenu_action_btn_click // Add new handler to the bundle
    };

    glob.ui.trg_mainmenu_pop(mainmenu_ul, evt_handlers_bndl.handle_mainmenu_doc_btn_click, evt_handlers_bndl.handle_mainmenu_nav_link_click, evt_handlers_bndl.handle_mainmenu_action_btn_click);
    glob.ui.trg_rht_col_pop(rht_col_ul); // rht_col_ul links don't need active state management via this handler bundle currently

    if (glob.data.site_cfg && glob.data.site_cfg.default_doc && glob.data.site_cfg.default_chap) {
        const default_doc_id = glob.data.site_cfg.default_doc;
        let default_chap_id_to_load = glob.data.site_cfg.default_chap;
        const default_doc_data = glob.data.docs_data.find(doc => doc.id === default_doc_id);

        // If the default chapter is a convention for single-file docs, adjust if necessary
        if (default_doc_data && !default_doc_data.chapters && default_doc_data.path) {
            default_chap_id_to_load = default_doc_id; // Use doc_id as chap_id for single file docs
        }

        glob.ui.load_doc_con(default_doc_id, default_chap_id_to_load, dom_eles_bndl, evt_handlers_bndl);
        // Attempt to set active state for the default document button in the main menu
        setTimeout(() => { // Allow menu to populate
            const default_doc_btn = mainmenu_ul ? mainmenu_ul.querySelector(`[data-ms="mainmenu-doc-btn"][data-doc-id="${default_doc_id}"]`) : null; // Use data-ms for selection
            if (default_doc_btn) {
                if (mainmenu_ul) glob.dom.clr_act(mainmenu_ul); // Clear active from other doc buttons if any
                glob.dom.set_act_btn(default_doc_btn);
            }
        }, 100);
    } else {
        glob.ui.set_doc_con(doc_con_div, "");
    }    

    glob.util.check_dom_classes();

});