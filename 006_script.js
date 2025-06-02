



  
document.addEventListener('DOMContentLoaded', () => {



   // -----------------------------
    // DOM Element References
    // -----------------------------
    // Purpose: To cache references to frequently used DOM elements once the DOM is loaded.
    //          This improves performance by avoiding repeated querySelector calls and centralizes element selection.
    // Structure: Constants are declared for each main UI panel and content area.

    const main_menu_ul      = document.querySelector('.main-menu ul');
    const sub_menu_ul       = document.querySelector('.sub-menu ul');
    const right_col_ul      = document.querySelector('.right-column ul');
    const doc_hdr_div       = document.querySelector('.doc-hdr');
    const doc_con_div       = document.querySelector('.doc-content'); // Corrected class from CSS
    const doc_ftr_div       = document.querySelector('.doc-footer'); // Corrected class from CSS
 

    // -----------------------------
    // Bundles for Passing to UI Functions
    // -----------------------------
    // Purpose: To group related DOM elements or event handlers into single objects (bundles).
    //          This simplifies the parameter lists of glob.ui functions, making calls cleaner and more manageable.
    // Structure: `dom_eles_bndl` will hold common DOM elements.
    //            `evt_handlers_bndl` will hold references to the event handler functions defined below.

    const dom_eles_bndl = {
        main_menu_ul, sub_menu_ul, right_col_ul, // Though main_menu_ul and right_col_ul are often passed directly
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
    // Structure: Each function (e.g., handle_main_menu_doc_btn_click, handle_chap_sub_menu_click)
    //            receives event-specific parameters (like item ID, the clicked DOM element).
    //            They use glob.dom.clr_act and glob.dom.set_act_btn for visual feedback.

    function handle_main_menu_doc_btn_click(doc_id, clicked_btn_ele) {
        const doc_data = glob.data.docs_data[doc_id];

        if (main_menu_ul) glob.dom.clr_act(main_menu_ul); // Clear active from all main menu buttons
        if (clicked_btn_ele) glob.dom.set_act_btn(clicked_btn_ele); // Set current one active

        if (doc_data && doc_data.chapters && doc_data.chapters.length > 0) {
            glob.ui.load_doc_con(doc_id, doc_data.chapters[0].id, dom_eles_bndl, evt_handlers_bndl);
        } else if (doc_data) {
            glob.ui.set_doc_con(doc_con_div, `<p>Content for '${doc_data.title}' is not available or has no chapters.</p>`);
            glob.ui.set_doc_hdr(doc_hdr_div, doc_data.doc_hdr_con || `<h2>${doc_data.title}</h2>`);
            glob.ui.set_doc_ftr(doc_ftr_div, doc_data.doc_ftr_con || "End of Document");
            if (sub_menu_ul) sub_menu_ul.innerHTML = ''; // Clear sub-menu
        } else {
            glob.ui.display_err_in_ele(doc_con_div, `Document with ID '${doc_id}' not found.`);
        }
    }

    function handle_chap_sub_menu_click(chap_id, clicked_btn_ele) {
        if (glob.heap.curr_doc_id) {
            if (sub_menu_ul) glob.dom.clr_act(sub_menu_ul);
            if (clicked_btn_ele) glob.dom.set_act_btn(clicked_btn_ele);
            glob.ui.load_doc_con(glob.heap.curr_doc_id, chap_id, dom_eles_bndl, evt_handlers_bndl);
        } else {
            console.error("[handle_chap_sub_menu_click] Current document ID is not set in glob.heap.");
        }
    }

    function handle_pdf_pge_link_click(pge_num, clicked_btn_ele) {
        const pdf_frame = doc_con_div.querySelector('iframe'); // Assuming PDF is in an iframe

        if (sub_menu_ul) glob.dom.clr_act(sub_menu_ul);
        if (clicked_btn_ele) glob.dom.set_act_btn(clicked_btn_ele);

        if (pdf_frame && glob.heap.curr_pdf_basesrc) {
            // For basic iframe PDF viewing, changing src might be enough.
            pdf_frame.src = `${glob.heap.curr_pdf_basesrc}#page=${pge_num}`;
        }
        // Update header/footer with new page number
        if (glob.heap.curr_pdf) { // Check if a PDF.js object is loaded
            const current_doc_data = glob.data.docs_data[glob.heap.curr_doc_id];
            glob.ui.upd_doc_hdr_ftr(glob.heap.curr_pdf, pge_num, glob.heap.curr_pdf.numPages, current_doc_data, dom_eles_bndl);
        } else {
            // Fallback if glob.heap.curr_pdf is not set (e.g. if PDF failed to load initially but nav is still there)
            const current_doc_data = glob.data.docs_data[glob.heap.curr_doc_id];
            glob.ui.upd_doc_hdr_ftr(null, pge_num, 'N/A', current_doc_data, dom_eles_bndl);
        }
    }

    function handle_main_menu_nav_link_click(href, clicked_anc_ele) {
        if (main_menu_ul) main_menu_ul.querySelectorAll('a.act').forEach(anc => glob.dom.clr_act(anc.parentElement)); // Assuming clr_act works on parent li
        if (clicked_anc_ele) glob.dom.set_act_btn(clicked_anc_ele); // Assuming set_act_btn works on anchor or its parent
        glob.ui.set_doc_con(doc_con_div, `<p>Navigating to: ${href}. Content to be loaded.</p>`);
    }

    function handle_right_col_link_click(href, clicked_anc_ele) {
        if (right_col_ul) right_col_ul.querySelectorAll('a.act').forEach(anc => glob.dom.clr_act(anc.parentElement));
        if (clicked_anc_ele) glob.dom.set_act_btn(clicked_anc_ele);
        glob.ui.set_doc_con(doc_con_div, `<p>External link: ${href}. Content to be loaded.</p>`);   
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
        handle_main_menu_doc_btn_click,
        handle_chap_sub_menu_click,
        handle_pdf_pge_link_click,
        handle_main_menu_nav_link_click,
        handle_right_col_link_click
    };

    glob.ui.trg_main_menu_pop(main_menu_ul, evt_handlers_bndl.handle_main_menu_doc_btn_click, evt_handlers_bndl.handle_main_menu_nav_link_click);
    glob.ui.trg_right_col_pop(right_col_ul, evt_handlers_bndl.handle_right_col_link_click);

    if (glob.data.site_cfg && glob.data.site_cfg.default_doc && glob.data.site_cfg.default_chap) {
        glob.ui.load_doc_con(glob.data.site_cfg.default_doc, glob.data.site_cfg.default_chap, dom_eles_bndl, evt_handlers_bndl);
        // Attempt to set active state for the default document button in the main menu
        setTimeout(() => { // Allow menu to populate
            const all_doc_btns = main_menu_ul ? main_menu_ul.querySelectorAll('.docs-list button') : [];
            const default_doc_title = glob.data.docs_data[glob.data.site_cfg.default_doc]?.title;
            all_doc_btns.forEach(btn => {
                if (btn.textContent === default_doc_title) {
                    if (main_menu_ul) glob.dom.clr_act(main_menu_ul);
                    glob.dom.set_act_btn(btn);
                }
            });
        }, 100);
    } else {
        glob.ui.set_doc_con(doc_con_div, "<p>Welcome to the Dark Ages Archives. Please select a document from the main menu.</p>");
    }    

});