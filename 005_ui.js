




// -----------------------------
// UI Population: Main Menu
// -----------------------------
// Purpose: Generates the HTML structure for the main navigation menu.
// Structure: Accepts the target UL element, menu configuration data (from glob.data.main_menu_cfg),
//            document categories (glob.data.doc_categories), all documents data (glob.data.docs_data),
//            and click handlers for document buttons and general navigation links.
//            It iterates through the menu configuration, creating list items. For 'documents' type,
//            it nests categories and their respective document links.
//            This approach separates data (menu structure, doc list) from presentation logic,
//            making this function primarily responsible for HTML generation based on input data.
glob.ui.pop_main_menu = function(ul_ele, menu_cfg, doc_categories, docs_data, handle_doc_btn_click, handle_nav_link_click) {
    // Implementation will use glob.dom.new_lis, glob.dom.new_btn, glob.dom.new_anc to create the menu structure.
    // It purely generates the menu items and attaches the provided click handlers.
    // Active state of buttons/links is managed by the respective click handlers in 006_script.js.
    let li, item_ele, category_ul, category_li, docs_in_category_ul, doc_li, doc_btn, category_header_btn;

    if (!ul_ele) { console.error("[pop_main_menu] Target UL element not provided."); return; }
    ul_ele.innerHTML = ''; // Clear existing menu

    menu_cfg.forEach(item => {
        li = glob.dom.new_lis(null, {});
        if (item.type === 'link') {
            item_ele = glob.dom.new_anc(null, { textContent: item.text, href: item.href });
            if (handle_nav_link_click) {
                item_ele.onclick = (event) => {
                    event.preventDefault(); // Prevent default anchor navigation
                    handle_nav_link_click(item.href, item_ele);
                };
            }
            li.appendChild(item_ele);
        } else if (item.type === 'documents') {
            item_ele = glob.dom.new_btn(null, { textContent: item.text, className: 'menu-header-btn' }); // Non-clickable header
            li.appendChild(item_ele);

            category_ul = document.createElement('ul'); // Use standard ul for categories
            category_ul.className = 'doc-categories-list';

            doc_categories.forEach(category => {
                category_li = glob.dom.new_lis(null, {});
                category_header_btn = glob.dom.new_btn(null, { textContent: category.title, className: 'category-header-btn' });
                category_li.appendChild(category_header_btn);

                docs_in_category_ul = document.createElement('ul');
                docs_in_category_ul.className = 'docs-list';
                category.doc_ids.forEach(doc_id => {
                    const doc_data = docs_data[doc_id];
                    if (doc_data) {
                        doc_li = glob.dom.new_lis(null, {});
                        doc_btn = glob.dom.new_btn(null, { textContent: doc_data.title });
                        doc_btn.onclick = (event) => handle_doc_btn_click(doc_id, event.target);
                        doc_li.appendChild(doc_btn);
                        docs_in_category_ul.appendChild(doc_li);
                    }
                });
                category_li.appendChild(docs_in_category_ul);
                category_ul.appendChild(category_li);
            });
            li.appendChild(category_ul);
        }
        ul_ele.appendChild(li);
    });
};



// -----------------------------
// UI Population: Chapter Sub Menu
// -----------------------------
// Purpose: Generates the HTML for the sub-menu, typically listing chapters or sections of a selected document.
// Structure: Accepts the target UL element, an array of chapter objects (e.g., from glob.data.docs_data[doc_id].chapters),
//            and a click handler for chapter selection.
//            It iterates through the chapters, creating a list item and a button for each.
//            This function focuses solely on populating the list from the provided 'chapters' data and attaching handlers.
glob.ui.pop_chap_sub_menu = function(ul_ele, chapters, handle_chap_click) {
    // Implementation will use glob.dom.new_lis, glob.dom.new_btn.
    // Buttons will have a 'data-chap-id' attribute for identification.
    let li, btn;

    if (!ul_ele) { console.error("[pop_chap_sub_menu] Target UL element not provided."); return; }
    ul_ele.innerHTML = ''; // Clear existing items

    if (!chapters || chapters.length === 0) {
        li = glob.dom.new_lis(null, { textContent: 'No sections available.' });
        ul_ele.appendChild(li);
        return;
    }

    chapters.forEach(chap => {
        li = glob.dom.new_lis(null, {});
        btn = glob.dom.new_btn(null, { textContent: chap.title });
        btn.setAttribute('data-chap-id', chap.id);
        btn.onclick = (event) => handle_chap_click(chap.id, event.target);
        li.appendChild(btn);
        ul_ele.appendChild(li);
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
glob.ui.pop_pdf_pge_nav_menu = function(ul_ele, num_pges, handle_pge_click) {
    // Implementation will use glob.dom.new_lis, glob.dom.new_btn.
    // Buttons will have a 'data-pge-num' attribute.
    let li, btn;

    if (!ul_ele) { console.error("[pop_pdf_pge_nav_menu] Target UL element not provided."); return; }
    ul_ele.innerHTML = ''; // Clear existing items

    // Create an array from 1 to num_pges to use forEach
    Array.from({ length: num_pges }, (_, i) => i + 1).forEach(pge_num => {
        li = glob.dom.new_lis(null, {});
        btn = glob.dom.new_btn(null, { textContent: `Page ${pge_num}` });
        btn.setAttribute('data-pge-num', pge_num);
        btn.onclick = (event) => handle_pge_click(pge_num, event.target); // Pass page number and button element
        li.appendChild(btn);
        ul_ele.appendChild(li);
    });
};


// -----------------------------
// UI Population: Right Column Links
// -----------------------------
// Purpose: Generates the HTML for the links displayed in the right-hand column.
// Structure: Accepts the target UL element, an array of site link objects (from glob.data.site_links),
//            and a click handler for these links.
//            It iterates through the link data, creating list items and anchor tags based purely on input.
glob.ui.pop_right_col_links = function(ul_ele, site_links, handle_link_click) {
    // Implementation will use glob.dom.new_lis, glob.dom.new_anc.
    let li, anc;

    if (!ul_ele) { console.error("[pop_right_col_links] Target UL element not provided."); return; }
    ul_ele.innerHTML = ''; // Clear existing links

    site_links.forEach(link_data => {
        li = glob.dom.new_lis(null, {});
        anc = glob.dom.new_anc(null, { textContent: link_data.text, href: link_data.href });
        if (handle_link_click) {
            anc.onclick = (event) => {
                event.preventDefault(); // Prevent default anchor navigation
                handle_link_click(link_data.href, anc);
            };
        }
        li.appendChild(anc);
        ul_ele.appendChild(li);
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
    return glob.dom.new_ifr(id, defaults);
};



// -----------------------------
// UI Helper: Display Error
// -----------------------------
// Purpose: Provides a standard way to display error messages within a specified UI element.
// Structure: Takes the target DOM element and the error message string. Sets the innerHTML of the element for simple error display.
glob.ui.display_err_in_ele = function(ele, message) {
    if (ele) { ele.innerHTML = `<p style="color: red;">Error: ${message}</p>`; }
    else { console.error(`[display_err_in_ele] Target element not provided for message: ${message}`); }
};

// -----------------------------
// UI Trigger/Orchestration Functions
// -----------------------------
// Purpose: These functions act as higher-level interfaces to trigger the population or update of UI components.
//          They are responsible for fetching necessary data from `glob.data` or `glob.heap` and then
//          calling the lower-level `pop_` or `set_` functions, passing the data and handlers explicitly.
//          This separation keeps the `pop_` functions more pure and focused on rendering.

glob.ui.trg_main_menu_pop = function(main_menu_ul_ele, handle_doc_btn_click, handle_nav_link_click) {
    // Fetches main_menu_cfg, doc_categories, and docs_data from glob.data.
    // Calls glob.ui.pop_main_menu, passing the fetched data and provided handlers.
    if (!glob.data.main_menu_cfg || !glob.data.doc_categories || !glob.data.docs_data) {
        console.error("[trg_main_menu_pop] Required data (main_menu_cfg, doc_categories, docs_data) is not defined in glob.data.");
        return;
    }
    glob.ui.pop_main_menu(main_menu_ul_ele, glob.data.main_menu_cfg, glob.data.doc_categories, glob.data.docs_data, handle_doc_btn_click, handle_nav_link_click);
};

glob.ui.trg_chap_sub_menu_pop = function(sub_menu_ul_ele, doc_id, handle_chap_btn_click) {
    // Fetches the specific document's data (including chapters) for 'doc_id' from glob.data.docs_data.
    // Calls glob.ui.pop_chap_sub_menu, passing the chapters array and the click handler.
    const doc_data = glob.data.docs_data[doc_id];
    if (!doc_data) {
        console.error(`[trg_chap_sub_menu_pop] Document data not found for ID: ${doc_id}`);
        if (sub_menu_ul_ele) {
            glob.ui.pop_chap_sub_menu(sub_menu_ul_ele, [], handle_chap_btn_click); // Show "No sections"
        }
        return;
    }
    glob.ui.pop_chap_sub_menu(sub_menu_ul_ele, doc_data.chapters || [], handle_chap_btn_click);
};

glob.ui.trg_pdf_pge_nav_pop = function(sub_menu_ul_ele, num_pges, base_src, handle_pge_btn_click, initial_pge = 1) {
    // Calls glob.ui.pop_pdf_pge_nav_menu to generate page links.
    // After population, this function is responsible for finding the button corresponding to 'initial_pge'
    // and setting its active state using glob.dom.clr_act and glob.dom.set_act_btn.
    let initial_btn;

    if (!sub_menu_ul_ele) { console.error("[trg_pdf_pge_nav_pop] Sub-menu UL element not provided."); return; }
    glob.heap.curr_pdf_basesrc = base_src; // Store for use in click handler if needed elsewhere
    glob.ui.pop_pdf_pge_nav_menu(sub_menu_ul_ele, num_pges, handle_pge_btn_click);

    initial_btn = sub_menu_ul_ele.querySelector(`button[data-pge-num="${initial_pge}"]`);
    if (initial_btn) {
        glob.dom.clr_act(sub_menu_ul_ele);
        glob.dom.set_act_btn(initial_btn);
    } else if (num_pges > 0) { // Fallback to first page if initial_pge button not found
        const first_btn = sub_menu_ul_ele.querySelector(`button[data-pge-num="1"]`);
        if (first_btn) {
            glob.dom.clr_act(sub_menu_ul_ele);
            glob.dom.set_act_btn(first_btn);
        }
    }
};

glob.ui.trg_chap_sub_menu_pop = function(sub_menu_ul_ele, doc_id, handle_chap_btn_click) {
    // Fetches the specific document's data (including chapters) for 'doc_id' from glob.data.docs_data.
    // Calls glob.ui.pop_chap_sub_menu, passing the chapters array and the click handler.
    const doc_data = glob.data.docs_data[doc_id];
    if (!doc_data) {
        console.error(`[trg_chap_sub_menu_pop] Document data not found for ID: ${doc_id}`);
        if (sub_menu_ul_ele) glob.ui.pop_chap_sub_menu(sub_menu_ul_ele, [], handle_chap_btn_click); // Show "No sections"
        return;
    }
    glob.ui.pop_chap_sub_menu(sub_menu_ul_ele, doc_data.chapters || [], handle_chap_btn_click);
};

glob.ui.trg_right_col_pop = function(right_col_ul_ele, handle_link_click) {
    // Fetches site_links from glob.data.site_links.
    // Calls glob.ui.pop_right_col_links, passing the fetched links and the click handler.
    if (!glob.data.site_links) {
        console.error("[trg_right_col_pop] Site links data not found in glob.data.");
        return;
    }
    glob.ui.pop_right_col_links(right_col_ul_ele, glob.data.site_links, handle_link_click);
};

glob.ui.upd_doc_hdr_ftr = async function(pdf_doc_obj, pge_num, total_pges, doc_data_for_fallback, dom_eles_bndl) {
// Purpose: Updates document header/footer, especially for PDFs (e.g., page number, extracted text).
// Structure: If 'pdf_doc_obj' is provided, attempts to use glob.util.pdf_ext_pge_txt_reg for dynamic content.
//            Uses 'doc_data_for_fallback' (containing default header/footer text like doc_data.doc_hdr_con)
//            if PDF extraction fails or is not applicable.
//            Updates the DOM elements in 'dom_eles_bndl' (doc_hdr_div, doc_ftr_div).
    const { doc_hdr_div, doc_ftr_div } = dom_eles_bndl;
    let default_hdr = doc_data_for_fallback?.doc_hdr_con || (doc_data_for_fallback?.title ? `<h2>${doc_data_for_fallback.title}</h2>` : 'Document Header');
    let default_ftr = doc_data_for_fallback?.doc_ftr_con || 'Document Footer';
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
//            For HTML: fetches content, calls glob.ui.set_doc_con, set_doc_hdr, set_doc_ftr. Calls trg_chap_sub_menu_pop.
//            For PDF: (if PDF.js integrated) loads PDF, calls glob.ui.create_pdf_view_ifr, set_doc_con. Calls trg_pdf_pge_nav_pop.
//            Updates glob.heap with current doc/chap. Sets document header/footer.
//            Accepts bundles for DOM elements and event handlers to pass down.
//            Will contain local helper functions like _load_html_chap_con_impl and _load_pdf_chap_con_impl
//            which receive all necessary data (doc_data, chap_data, dom_eles, evt_handlers) as parameters.
    const { doc_hdr_div, doc_con_div, doc_ftr_div, sub_menu_ul } = dom_eles_bndl;
    const doc_data = glob.data.docs_data[doc_id];
    let chap_data, response, html_con, pdf_doc_obj, pdf_ifr; // For PDF.js

    if (!doc_data) {
        glob.ui.display_err_in_ele(doc_con_div, `Document data not found for ID: ${doc_id}`);
        return;
    }
    chap_data = doc_data.chapters ? doc_data.chapters.find(ch => ch.id === chap_id) : null;

    if (!chap_data) {
        glob.ui.display_err_in_ele(doc_con_div, `Chapter data not found for ID: '${chap_id}' in document '${doc_data.title}'.`);
        glob.ui.set_doc_hdr(doc_hdr_div, doc_data.doc_hdr_con || `<h2>${doc_data.title}</h2>`);
        glob.ui.set_doc_ftr(doc_ftr_div, doc_data.doc_ftr_con || "End of Document");
        if (sub_menu_ul) sub_menu_ul.innerHTML = ''; // Clear sub-menu
        return;
    }

    glob.heap.curr_doc_id  = doc_id;
    glob.heap.curr_chap_id = chap_id;
    glob.heap.curr_pdf     = null; // Reset
    glob.heap.curr_pdf_basesrc = chap_data.con_file; // Store base src for PDF page navigation

    // --- Local Helper: Load HTML Content ---
    async function _load_html_chap_con_impl() {
        try {
            response = await fetch(chap_data.con_file);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${chap_data.con_file}`);
            html_con = await response.text();

            glob.ui.set_doc_hdr(doc_hdr_div, chap_data.title ? `<h2>${chap_data.title}</h2>` : (doc_data.doc_hdr_con || `<h2>${doc_data.title}</h2>`));
            glob.ui.set_doc_con(doc_con_div, html_con);
            glob.ui.set_doc_ftr(doc_ftr_div, doc_data.doc_ftr_con || "End of Section");
            glob.ui.trg_chap_sub_menu_pop(sub_menu_ul, doc_id, evt_handlers_bndl.handle_chap_sub_menu_click);
        } catch (err) {
            console.error("Error loading HTML chapter content:", err);
            glob.ui.display_err_in_ele(doc_con_div, `Failed to load content for '${chap_data.title}'.<br>${err.message}`);
        }
    }

    // --- Local Helper: Load PDF Content ---
    async function _load_pdf_chap_con_impl() {
        if (typeof pdfjsLib === 'undefined') {
            console.error("PDF.js library (pdfjsLib) is not loaded. Cannot display PDF.");
            glob.ui.display_err_in_ele(doc_con_div, "PDF viewer is not available. PDF.js library is missing.");
            glob.ui.set_doc_hdr(doc_hdr_div, chap_data.title ? `<h2>${chap_data.title}</h2>` : (doc_data.doc_hdr_con || `<h2>${doc_data.title}</h2>`));
            glob.ui.set_doc_ftr(doc_ftr_div, doc_data.doc_ftr_con || "PDF Document");
            if (sub_menu_ul) sub_menu_ul.innerHTML = ''; // Clear sub-menu
            return;
        }
        try {
            // pdfjsLib.GlobalWorkerOptions.workerSrc is already set in index.html
            const loadingTask = pdfjsLib.getDocument(chap_data.con_file);
            pdf_doc_obj = await loadingTask.promise;
            glob.heap.curr_pdf = pdf_doc_obj; // Store PDF.js document object

            pdf_ifr = glob.ui.create_pdf_view_ifr(null, {
                src: chap_data.con_file, // Direct link to PDF, browser's native viewer in iframe
                title: chap_data.title || 'PDF Document',
                style: 'width: 100%; height: calc(100% - 0px); border: none;' // Ensure iframe takes full available height
            });
            glob.ui.set_doc_con(doc_con_div, pdf_ifr);

            await glob.ui.upd_doc_hdr_ftr(pdf_doc_obj, 1, pdf_doc_obj.numPages, doc_data, dom_eles_bndl);
            glob.ui.trg_pdf_pge_nav_pop(sub_menu_ul, pdf_doc_obj.numPages, chap_data.con_file, evt_handlers_bndl.handle_pdf_pge_link_click, 1);

        } catch (err) {
            console.error("Error loading PDF chapter content:", err);
            glob.ui.display_err_in_ele(doc_con_div, `Failed to load PDF '${chap_data.title}'.<br>${err.message}`);
            glob.heap.curr_pdf = null;
        }
    }

    // --- Determine content type and load ---
    if (chap_data.con_file && chap_data.con_file.toLowerCase().endsWith('.pdf')) {
        await _load_pdf_chap_con_impl();
    } else { // Assume HTML or text-based
        await _load_html_chap_con_impl();
    }
};