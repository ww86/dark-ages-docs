



// Helper function to create a category block for the main menu
function new_mainmenu_cat_block(cat_details, curr_cat_id, docs_data, handle_doc_btn_click) {
    const per_cat_block_div = glob.dom.new_div(null, { className: 'mainmenu-cat-block' });

    // Create category titles (e.g., "Primary Documents") as non-clickable spans
    const cat_hdr_defaults = { className: 'mainmenu-cat-title-spn', textContent: cat_details.title };
    const cat_hdr_ele = glob.dom.new_spn(null, cat_hdr_defaults);
    cat_hdr_ele.setAttribute('data-ms', 'mainmenu-cat-title');
    per_cat_block_div.appendChild(cat_hdr_ele);

    let has_docs_in_cat = false;
    let doc_btn; // Declare doc_btn locally within the helper

    // Filter docs_data array for documents matching the curr_cat_id
    docs_data.filter(doc => doc.cat === curr_cat_id).forEach(doc_data_item => {
        const doc_btn_defaults = { className: 'doc-button-' + doc_data_item.id, textContent: doc_data_item.title };
        doc_btn = glob.dom.new_btn(`doc-btn-${doc_data_item.id}`, doc_btn_defaults);
        doc_btn.setAttribute('data-ms', 'mainmenu-doc-btn');
        doc_btn.setAttribute('data-doc-id', doc_data_item.id);
        doc_btn.onclick = (event) => handle_doc_btn_click(doc_data_item.id, event.target);
        per_cat_block_div.appendChild(doc_btn);
        has_docs_in_cat = true;
    });

    return has_docs_in_cat ? per_cat_block_div : null; // Return null if no docs to avoid appending empty block
}

// -----------------------------
// UI Population: Main Menu
// -----------------------------
// Purpose: Generates the HTML structure for the main navigation menu.
// Structure: Accepts the target UL element, menu configuration data (from glob.data.mainmenu_cfg),
//            document categories (glob.data.doc_cat), all documents data (glob.data.docs_data),
//            and click handlers for document buttons and general navigation links.
//            It iterates through the menu configuration, creating list items. For 'documents' type,
//            it nests categories and their respective document links.
//            This approach separates data (menu structure, doc list) from presentation logic,
//            making this function primarily responsible for HTML generation based on input data.
glob.ui.pop_mainmenu = function(target_cntnr_ele, menu_cfg, doc_cat, docs_data, handle_doc_btn_click, handle_nav_link_click, handle_act_btn_click) {
    // Implementation will use glob.dom.new_lis, glob.dom.new_btn, glob.dom.new_anc to create the menu structure.
    // It purely generates the menu items (now divs) and attaches the provided click handlers.
    // Active state of buttons/links is managed by the respective click handlers in 006_script.js.
    let item_ele, act_btn; // Removed top_level_item_div

    if (!target_cntnr_ele) { console.error("[pop_mainmenu] Target container element not provided."); return; }
    target_cntnr_ele.innerHTML = ''; // Clear existing menu

    menu_cfg.forEach(item => {
        if (item.type === 'link') {
            item_ele = glob.dom.new_anc(null, { className: 'mainmenu-link-anc', textContent: item.text, href: item.href });
            if (handle_nav_link_click) {
                item_ele.onclick = (event) => {
                    event.preventDefault(); // Prevent default anchor navigation
                    handle_nav_link_click(item.href, item_ele);
                };
            }
            target_cntnr_ele.appendChild(item_ele); // Append directly to target container
        } else if (item.type === 'documents') {
            // Create the main "Documents" header as a non-clickable span
            const main_docs_hdr_ele = glob.dom.new_spn(null, { className: 'mainmenu-docs-hdr-spn', textContent: item.text });
            target_cntnr_ele.appendChild(main_docs_hdr_ele); // Append directly to target container

            // Sort categories by their 'order' property before iterating
            Object.values(doc_cat).sort((a, b) => a.order - b.order).forEach(cat_details => {
                const curr_cat_id = Object.keys(doc_cat).find(key => doc_cat[key] === cat_details);
                
                // Use the helper function to create and populate the category block
                const cat_block_div = new_mainmenu_cat_block(cat_details, curr_cat_id, docs_data, handle_doc_btn_click);

                if (cat_block_div) { // Only append if the helper returned a populated block
                    target_cntnr_ele.appendChild(cat_block_div); // Append directly to target container
                }
            });
        } else if (item.type === 'action') {
            const act_btn_defaults = { className: 'mainmenu-print-dom', textContent: item.text };
            act_btn = glob.dom.new_btn(null, act_btn_defaults);
            if (handle_act_btn_click && item.action_id) {
                act_btn.onclick = (event) => {
                    handle_act_btn_click(item.action_id, event.target);
                };
            }
            target_cntnr_ele.appendChild(act_btn); // Append directly to target container
        }
    });
};



// -----------------------------
// UI Population: Chapter Sub Menu
// -----------------------------
// Purpose: Generates the HTML for the submenu, typically listing chapters or sections of a selected document.
// Structure: Accepts the target UL element, an array of chapter objects (e.g., from glob.data.docs_data[doc_id].chapters),
//            and a click handler for chapter selection.
//            It iterates through the chapters, creating a list item and a button for each.
//            This function focuses solely on populating the list from the provided 'chapters' data and attaching handlers.
glob.ui.pop_chap_submenu = function(target_cntnr_ele, chapters, handle_chap_click) {
    // Implementation will use glob.dom.new_div, glob.dom.new_btn.
    // Buttons will have a 'data-chap-id' attribute for identification.
    let item_div, btn;

    if (!target_cntnr_ele) { console.error("[pop_chap_submenu] Target container element not provided."); return; }
    target_cntnr_ele.innerHTML = ''; // Clear existing items

    if (!chapters || chapters.length === 0) {
        item_div = glob.dom.new_div(null, { className: 'chap-menu-empty-item-div', textContent: 'No sections available.' }); // Changed from li to div
        target_cntnr_ele.appendChild(item_div);
        return;
    }

    chapters.forEach(chap => {
        const item_defaults = { className: 'chap-menu-item-div' }; // Changed from li to div
        item_div = glob.dom.new_div(`chap-item-${chap.id}`, item_defaults);
        item_div.setAttribute('data-ms', 'chap-menu-item');

        const btn_defaults = { className: 'chap-menu-item-btn', textContent: chap.title };
        btn = glob.dom.new_btn(`chap-btn-${chap.id}`, btn_defaults);
        btn.setAttribute('data-ms', 'chap-menu-item-btn');
        btn.setAttribute('data-chap-id', chap.id);
        btn.onclick = (event) => handle_chap_click(chap.id, event.target);
        item_div.appendChild(btn);
        target_cntnr_ele.appendChild(item_div);
    });
};



// -----------------------------
// UI Population: Ankh Symbol Sub Menu
// -----------------------------
// Purpose: Generates the HTML for the submenu listing "ankh" symbol references found in a document.
// Structure: Accepts the target UL element, an array of ankh reference objects,
//            and a click handler for ankh selection.
glob.ui.pop_ankh_submenu = function(target_cntnr_ele, ankh_refs, handle_ankh_click) {
    let item_div, btn;

    if (!target_cntnr_ele) { console.error("[pop_ankh_submenu] Target container element not provided."); return; }
    target_cntnr_ele.innerHTML = ''; // Clear existing items

    if (!ankh_refs || ankh_refs.length === 0) {
        item_div = glob.dom.new_div(null, { className: 'ankh-menu-empty-item-div', textContent: 'No ankh references found.' }); // Changed from li to div
        target_cntnr_ele.appendChild(item_div);
        return;
    }

    ankh_refs.forEach(ref => {
        // Use a generic class for submenu items if styling is identical, or specific if needed
        const item_defaults = { className: 'submenu-item-div ankh-menu-item-div' }; // Changed from li to div
        item_div = glob.dom.new_div(`ankh-item-${ref.id.replace(/[^a-zA-Z0-9-_]/g, '')}`, item_defaults); // Sanitize ref.id for HTML id
        item_div.setAttribute('data-ms', 'ankh-menu-item');

        const btn_defaults = { className: 'submenu-item-btn ankh-menu-item-btn', textContent: ref.text };
        btn = glob.dom.new_btn(`ankh-btn-${ref.id.replace(/[^a-zA-Z0-9-_]/g, '')}`, btn_defaults);
        btn.setAttribute('data-ms', 'ankh-menu-item-btn');
        btn.setAttribute('data-ankh-target-id', ref.id);
        btn.onclick = (event) => handle_ankh_click(ref.id, event.target);
        item_div.appendChild(btn);
        target_cntnr_ele.appendChild(item_div);
    });
};

// -----------------------------
// UI Population: PDF Page Navigation Menu
// -----------------------------
// Purpose: Generates navigation links (buttons) for each page of a PDF document.
// Structure: Accepts the target UL element, the total number of pages in the PDF,
//            and a click handler for page selection.
//            It loops from 1 to num_pges, creating a button for each page.
//            This function is essential for PDF viewing functionality, focusing on generating page links.
glob.ui.pop_pdf_pge_nav_menu = function(target_cntnr_ele, num_pges, handle_pge_click) {
    // Implementation will use glob.dom.new_div, glob.dom.new_btn.
    // Buttons will have a 'data-pge-num' attribute.
    let item_div, btn;

    if (!target_cntnr_ele) { console.error("[pop_pdf_pge_nav_menu] Target container element not provided."); return; }
    target_cntnr_ele.innerHTML = ''; // Clear existing items

    // Create an array from 1 to num_pges to use forEach
    Array.from({ length: num_pges }, (_, i) => i + 1).forEach(pge_num => {
        const item_defaults = { className: 'pdf-pge-nav-item-div' }; // Changed from li to div
        item_div = glob.dom.new_div(`pge-item-${pge_num}`, item_defaults);
        item_div.setAttribute('data-ms', 'pdf-pge-nav-item');

        const btn_defaults = { className: 'pdf-pge-nav-item-btn', textContent: `Page ${pge_num}` };
        btn = glob.dom.new_btn(`pge-btn-${pge_num}`, btn_defaults);
        btn.setAttribute('data-ms', 'pdf-pge-nav-item-btn');
        btn.setAttribute('data-pge-num', pge_num);
        btn.onclick = (event) => handle_pge_click(pge_num, event.target); // Pass page number and button element
        item_div.appendChild(btn);
        target_cntnr_ele.appendChild(item_div);
    });
};


// -----------------------------
// UI Population: Right Column Links
// -----------------------------
// Purpose: Generates the HTML for the links displayed in the right-hand column.
// Structure: Accepts the target UL element, an array of site link objects (from glob.data.site_links),
//            and a click handler for these links.
//            It iterates through the link data, creating list items and anchor tags.
glob.ui.pop_rht_col_links = function(target_cntnr_ele, site_links) {
    // Implementation will use glob.dom.new_div, glob.dom.new_anc.
    let item_div, anc;

    if (!target_cntnr_ele) { console.error("[pop_rht_col_links] Target container element not provided."); return; }
    target_cntnr_ele.innerHTML = ''; // Clear existing links

    const links_hdr_ele = glob.dom.new_spn('rht_col_ele', {
    tag:            'span', // or 'div'
    className:      'rht-col-links-hdr-spn',
    innerHTML:      'Links'
    });

    target_cntnr_ele.appendChild(links_hdr_ele);

    site_links.forEach(link_data => {
        item_div = glob.dom.new_div(null, { className: 'rht-col-link-item-div' }); // Changed from li to div
        const anc_defaults = { className: 'rht-col-link-anc', textContent: link_data.text, href: link_data.href };
        anc = glob.dom.new_anc(null, anc_defaults);
        anc.setAttribute('data-ms', 'rht-col-link');
        anc.target = "_blank"; // Open link in a new tab
        anc.rel = "noopener noreferrer"; // Recommended for security when using target="_blank"
        item_div.appendChild(anc);
        target_cntnr_ele.appendChild(item_div);
    });
};



// -----------------------------
// UI Setters: Document Header, Footer, Content
// -----------------------------
// Purpose: These functions directly set the content of the document-specific header, footer, and main content area.
// Structure: Each function takes the respective div element and the HTML content (or an HTMLElement for set_doc_con).
//            They provide a simple interface for updating these key display areas.
//            They are direct DOM manipulators, kept simple for clarity.
glob.ui.set_doc_hdr = function(hdr_div, con_html) {
    if (hdr_div) { hdr_div.innerHTML = con_html; }
    else { console.warn("[set_doc_hdr] Header div not provided or found."); }
};
glob.ui.set_doc_ftr = function(ftr_div, con_html) {
    if (ftr_div) { ftr_div.innerHTML = con_html; }
    else { console.warn("[set_doc_ftr] Footer div not provided or found."); }
};
glob.ui.set_doc_con = function(con_div, con_or_ele) { // Can accept HTML string or an element
    if (con_div) {
        con_div.innerHTML = ''; // Clear previous content
        if (typeof con_or_ele === 'string') { con_div.innerHTML = con_or_ele; }
        else if (con_or_ele instanceof HTMLElement) { con_div.appendChild(con_or_ele); }
    } else {
        console.warn("[set_doc_con] Content div not provided or found.");
    }
};
// -----------------------------
// UI Element Creation: PDF Viewer Iframe
// -----------------------------
// Purpose: Creates and configures an iframe element specifically for displaying PDF documents.
// Structure: Leverages glob.dom.new_ifr and sets appropriate attributes (src, title, styles) passed via 'defaults'.
//            This encapsulates PDF iframe creation logic, making it reusable.
glob.ui.create_pdf_view_ifr = function(id, defaults = {}) {
    // Implementation will call glob.dom.new_ifr and apply PDF-specific defaults.
    // Example defaults could include: frameBorder: '0', style: 'width:100%; height:100%;'
    return glob.dom.new_ifr(id, { ...defaults, className: 'pdf-view-ifr' });
};



// -----------------------------
// UI Helper: Display Error
// -----------------------------
// Purpose: Provides a standard way to display error messages within a specified UI element.
// Structure: Takes the target DOM element and the error message string. Sets the innerHTML of the element for simple error display.
glob.ui.display_err_in_ele = function(ele, message) {
    let err_p;
    if (ele) {
        err_p = document.createElement('p');
        err_p.className = 'err-msg-p'; // Added class for error paragraph
        err_p.style.color = 'red'; // Keep inline style for quick visual, can be moved to CSS
        err_p.innerHTML = `Error: ${message}`; // Use innerHTML for potential <br> in message
        ele.innerHTML = ''; // Clear previous content
        ele.appendChild(err_p);
    }
    else { console.error(`[display_err_in_ele] Target element not provided for message: ${message}`); }
};

// -----------------------------
// UI Trigger/Orchestration Functions
// -----------------------------
// Purpose: These functions act as higher-level interfaces to trigger the population or update of UI components.
//          They are responsible for fetching necessary data from `glob.data` or `glob.heap` and then
//          calling the lower-level `pop_` or `set_` functions, passing the data and handlers explicitly.
//          This separation keeps the `pop_` functions more pure and focused on rendering.

glob.ui.trg_mainmenu_pop = function(mainmenu_cntnr_ele, handle_doc_btn_click, handle_nav_link_click, handle_act_btn_click) {
    // Fetches mainmenu_cfg, doc_cat, and docs_data from glob.data.
    // Calls glob.ui.pop_mainmenu, passing the fetched data and provided handlers.
    if (!glob.data.mainmenu_cfg || !glob.data.doc_cat || !glob.data.docs_data) {
        console.error("[trg_mainmenu_pop] Required data (mainmenu_cfg, doc_cat, docs_data) is not defined in glob.data.");
        return;
    }
    glob.ui.pop_mainmenu(mainmenu_cntnr_ele, glob.data.mainmenu_cfg, glob.data.doc_cat, glob.data.docs_data, handle_doc_btn_click, handle_nav_link_click, handle_act_btn_click);
};

glob.ui.trg_pdf_pge_nav_pop = function(submenu_cntnr_ele, num_pges, base_src, handle_pge_btn_click, initial_pge = 1) {
    // Calls glob.ui.pop_pdf_pge_nav_menu to generate page links.
    // After population, this function is responsible for finding the button corresponding to 'initial_pge'
    // and setting its active state using glob.dom.clr_act and glob.dom.set_act_btn.
    let initial_btn;

    if (!submenu_cntnr_ele) { console.error("[trg_pdf_pge_nav_pop] submenu container element not provided."); return; }
    glob.heap.curr_pdf_basesrc = base_src; // Store for use in click handler if needed elsewhere
    glob.ui.pop_pdf_pge_nav_menu(submenu_cntnr_ele, num_pges, handle_pge_btn_click);

    // Use data-ms for selection
    initial_btn = submenu_cntnr_ele.querySelector(`[data-ms="pdf-pge-nav-item-btn"][data-pge-num="${initial_pge}"]`);
    if (initial_btn) {
        glob.dom.clr_act(submenu_cntnr_ele);
        glob.dom.set_act_btn(initial_btn);
    } else if (num_pges > 0) { // Fallback to first page if initial_pge button not found
        const first_btn = submenu_cntnr_ele.querySelector(`button[data-pge-num="1"]`);
        if (first_btn) {
            glob.dom.clr_act(submenu_cntnr_ele);
            glob.dom.set_act_btn(first_btn);
        }
    }
};

glob.ui.trg_chap_submenu_pop = function(submenu_cntnr_ele, doc_id, handle_chap_btn_click) {
    // Fetches the specific document's data (including chapters) for 'doc_id' from glob.data.docs_data.
    // Calls glob.ui.pop_chap_submenu, passing the chapters array and the click handler.
    const doc_data = glob.data.docs_data.find(doc => doc.id === doc_id);

    if (!doc_data) {
        console.error(`[trg_chap_submenu_pop] Document data not found for ID: ${doc_id}`);
        if (submenu_cntnr_ele) glob.ui.pop_chap_submenu(submenu_cntnr_ele, [], handle_chap_btn_click); // Show "No sections"
        return;
    }
    glob.ui.pop_chap_submenu(submenu_cntnr_ele, doc_data.chapters || [], handle_chap_btn_click); // Assuming HTML docs might still have chapters
};

glob.ui.trg_rht_col_pop = function(rht_col_cntnr_ele) {
    // Fetches site_links from glob.data.site_links.
    // Calls glob.ui.pop_rht_col_links, passing the fetched links.
    if (!glob.data.site_links) {
        console.error("[trg_rht_col_pop] Site links data not found in glob.data.");
        return;
    }
    glob.ui.pop_rht_col_links(rht_col_cntnr_ele, glob.data.site_links);
};

glob.ui.upd_doc_hdr_ftr = async function(pdf_doc_obj, pge_num, total_pges, doc_data_for_fallback, dom_eles_bndl) {
// Purpose: Updates document header/footer, especially for PDFs (e.g., page number, extracted text).
// Structure: If 'pdf_doc_obj' is provided, attempts to use glob.util.pdf_ext_pge_txt_reg for dynamic content.
//            Uses 'doc_data_for_fallback' (containing default header/footer text like doc_data.doc_hdr_con)
//            if PDF extraction fails or is not applicable.
//            Updates the DOM elements in 'dom_eles_bndl' (doc_hdr_div, doc_ftr_div).
    const { doc_hdr_div, doc_ftr_div } = dom_eles_bndl;
    let default_hdr = doc_data_for_fallback?.default_hdr_con || (doc_data_for_fallback?.title ? `<h2>${doc_data_for_fallback.title}</h2>` : 'Document Header');
    let default_ftr = doc_data_for_fallback?.default_ftr_con || 'Document Footer';
    let num_pges_display = total_pges || (pdf_doc_obj ? pdf_doc_obj.numPages : 'N/A');
    let extracted_hdr_text = '', extracted_ftr_text = '';

    if (pdf_doc_obj && pge_num) {
        try {
            // Pass null for rects to use default/simplified extraction in util function for now
            const extracted = await glob.util.pdf_ext_pge_txt_reg(pdf_doc_obj, pge_num, null, null);
            extracted_hdr_text = extracted.extracted_hdr_text;
            extracted_ftr_text = extracted.extracted_ftr_text;
        } catch (err) {
            console.error(`[upd_doc_hdr_ftr] Error extracting PDF text for page ${pge_num}:`, err);
        }
    }

    // DEBUG: Log the raw extracted header text to check its integrity
    console.log("[upd_doc_hdr_ftr] Raw extracted_hdr_text from PDF:", extracted_hdr_text);

    const final_hdr_html = extracted_hdr_text ? `<p>${extracted_hdr_text}</p>` : default_hdr;
    const final_ftr_base_html = extracted_ftr_text ? `<p>${extracted_ftr_text}</p>` : default_ftr;
    const final_ftr_html = `${final_ftr_base_html}<span> (Page ${pge_num || 'N/A'} of ${num_pges_display})</span>`;

    glob.ui.set_doc_hdr(doc_hdr_div, final_hdr_html);
    glob.ui.set_doc_ftr(doc_ftr_div, final_ftr_html);
};

glob.ui.load_doc_con = async function(doc_id, chap_id, dom_eles_bndl, evt_handlers_bndl) {
// Purpose: Main function to load and display content for a given document and chapter.
// Structure: Determines if content is HTML or PDF based on chap_data.con_file.
//            Fetches doc_data and chap_data from glob.data.
//            For HTML: fetches content, calls glob.ui.set_doc_con, set_doc_hdr, set_doc_ftr. Calls trg_chap_submenu_pop.
//            For PDF: (if PDF.js integrated) loads PDF, calls glob.ui.create_pdf_view_ifr, set_doc_con. Calls trg_pdf_pge_nav_pop.
//            Updates glob.heap with current doc/chap. Sets document header/footer.
//            Accepts bundles for DOM elements and event handlers to pass down.
//            Will contain local helper functions like _load_html_chap_con_impl and _load_pdf_chap_con_impl
//            which receive all necessary data (doc_data, chap_data, dom_eles, evt_handlers) as parameters.
    const { doc_hdr_div, doc_con_div, doc_ftr_div, submenu: submenu_cntnr_ele } = dom_eles_bndl;
    const doc_data = glob.data.docs_data.find(doc => doc.id === doc_id);
    let chap_data_obj, content_file_path; 

    if (!doc_data) {
        glob.ui.display_err_in_ele(doc_con_div, `Document data not found for ID: ${doc_id}`);
        return;
    }

    // Determine chapter data object
    // Otherwise, we infer a single "chapter" from the doc_data.path for PDFs/single HTML files.
    if (doc_data.chapters && doc_data.chapters.length > 0) {
        chap_data_obj = doc_data.chapters.find(ch => ch.id === chap_id);
        if (!chap_data_obj) {
            glob.ui.display_err_in_ele(doc_con_div, `Chapter ID '${chap_id}' not found in document '${doc_data.title}'.`);
            return;
        }
    } else if (doc_data.path) {
        // Infer a single chapter for documents with a direct 'path' (likely PDFs or single HTML)
        // The 'chap_id' passed might be a conventional one like "main_content" or the doc_id itself.
        chap_data_obj = { id: chap_id, title: doc_data.title, con_file: doc_data.path };
    } else {
        glob.ui.display_err_in_ele(doc_con_div, `No content (chapters or path) defined for document '${doc_data.title}'.`);
        return;
    }

    content_file_path = chap_data_obj.con_file; // Path is now relative (e.g., ./docs/file.pdf)

    glob.heap.curr_doc_id  = doc_id;
    glob.heap.curr_chap_id = chap_id;
    glob.heap.curr_pdf     = null; // Reset
    glob.heap.curr_pdf_basesrc = content_file_path; // Store relative base src for PDF page navigation

    // --- Local Helper: Load HTML Content ---
    async function _load_html_chap_con_impl(content_url) {
        let response, html_con;
        const ankh_references = [];
        // Regex to find "☥ num header_text"
        const ankh_regex = /(?:^|\s)☥\s+([\d.]+)\s+(.*)/gi; 

        try {
            response = await fetch(content_url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${content_url}`);
            html_con = await response.text();

            // Parse HTML to find ankhs and add IDs
            const temp_div = document.createElement('div');
            temp_div.innerHTML = html_con;
            let ankh_counter = 0;

            // Query for elements that might contain ankhs. Adjust selector as needed.
            temp_div.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, div').forEach(el => {
                let match;
                // Important: Execute regex multiple times if an element contains multiple ankhs (though typically one per line/element)
                while ((match = ankh_regex.exec(el.textContent)) !== null) {
                    // match[0] is the full matched string e.g., "☥ 1.01 Innate attribute"
                    const ankh_num = match[1]; // e.g., "1.01"
                    const ankh_hdr = match[2] ? match[2].trim() : ''; // e.g., "Innate attribute"
                    
                    // Generate a unique ID for the element if it doesn't have one
                    // Or, if it has one, ensure it's suitable or append to it.
                    // For simplicity, we'll generate a new one based on ankh details.
                    const target_id = `ankh-${doc_id}-${chap_id}-${ankh_num.replace(/\./g, '-')}-${ankh_counter++}`;
                    el.id = target_id; // Assign the ID to the element containing the ankh
                    ankh_references.push({
                        id: target_id,
                        text: `${ankh_num} ${ankh_hdr}` // Text for the submenu button
                    });
                }
            });
            
            // Get the modified HTML with IDs
            const modified_html_con = temp_div.innerHTML;

            glob.ui.set_doc_hdr(doc_hdr_div, chap_data_obj.title ? `<h2>${chap_data_obj.title}</h2>` : (doc_data.default_hdr_con || `<h2>${doc_data.title}</h2>`));
            glob.ui.set_doc_con(doc_con_div, modified_html_con);
            glob.ui.set_doc_ftr(doc_ftr_div, doc_data.default_ftr_con || "End of Section");

            // Populate ankh submenu if references were found
            glob.ui.pop_ankh_submenu(submenu_cntnr_ele, ankh_references, evt_handlers_bndl.handle_ankh_submenu_click);
            // If no ankhs, pop_ankh_submenu will show "No ankh references found."
            // You might want to fall back to glob.ui.trg_chap_submenu_pop if ankh_references is empty and chapters exist.
            // For now, ankh submenu takes precedence.

        } catch (err) {
            console.error("Error loading HTML chapter content:", err);
            glob.ui.display_err_in_ele(doc_con_div, `Failed to load content for '${chap_data_obj.title}'.<br>${err.message}`);
            if (submenu_cntnr_ele) submenu_cntnr_ele.innerHTML = ''; // Clear submenu on error
        }
    }

    // --- Local Helper: Load PDF Content ---
    async function _load_pdf_chap_con_impl(content_url) {
        let pdf_doc_obj, pdf_ifr;
        if (typeof pdfjsLib === 'undefined') {
            console.error("PDF.js library (pdfjsLib) is not loaded. Cannot display PDF.");
            glob.ui.display_err_in_ele(doc_con_div, "PDF viewer is not available. PDF.js library is missing.");
            glob.ui.set_doc_hdr(doc_hdr_div, chap_data_obj.title ? `<h2>${chap_data_obj.title}</h2>` : (doc_data.default_hdr_con || `<h2>${doc_data.title}</h2>`));
            glob.ui.set_doc_ftr(doc_ftr_div, doc_data.default_ftr_con || "PDF Document");
            if (submenu_cntnr_ele) submenu_cntnr_ele.innerHTML = ''; // Clear submenu
            return;
        }
        try {
            // pdfjsLib.GlobalWorkerOptions.workerSrc is already set in index.html
            const loadingTask = pdfjsLib.getDocument(content_url);
            pdf_doc_obj = await loadingTask.promise;
            glob.heap.curr_pdf = pdf_doc_obj; // Store PDF.js document object

            let pdf_src_url = content_url;
            const default_zoom = glob.data.site_cfg?.default_pdf_zoom;
            if (default_zoom) {
                pdf_src_url += `#zoom=${default_zoom}`;
            }

            pdf_ifr = glob.ui.create_pdf_view_ifr(null, {
                src: pdf_src_url,
                title: chap_data_obj.title || 'PDF Document',
                style: 'width: 100%; height: calc(100% - 0px); border: none;' // Ensure iframe takes full available height
            });
            glob.ui.set_doc_con(doc_con_div, pdf_ifr);

            await glob.ui.upd_doc_hdr_ftr(pdf_doc_obj, 1, pdf_doc_obj.numPages, doc_data, dom_eles_bndl);
            // Pass the base content_url without fragments for page navigation logic,
            // the handle_pdf_pge_link_click can then append page and zoom.
            // Or, trg_pdf_pge_nav_pop could be made aware of the base URL vs. URL with fragments.
            glob.ui.trg_pdf_pge_nav_pop(submenu_cntnr_ele, pdf_doc_obj.numPages, content_url /* base src */, evt_handlers_bndl.handle_pdf_pge_link_click, 1);

        } catch (err) {
            console.error("Error loading PDF chapter content:", err);
            glob.ui.display_err_in_ele(doc_con_div, `Failed to load PDF '${chap_data_obj.title}'.<br>${err.message}`);
            glob.heap.curr_pdf = null;
            if (submenu_cntnr_ele) submenu_cntnr_ele.innerHTML = ''; // Clear submenu on PDF load error
        }
    }

    // --- Determine content type and load ---
    if (content_file_path && content_file_path.toLowerCase().endsWith('.pdf')) {
        await _load_pdf_chap_con_impl(content_file_path);
    } else { // Assume HTML or text-based
        await _load_html_chap_con_impl(content_file_path);
    }
};