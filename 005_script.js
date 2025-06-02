




document.addEventListener('DOMContentLoaded', () => {



    // -----------------------------
    // DOM Element References
    // -----------------------------

    const main_menu_ul    = document.querySelector('.main-menu ul');
    const sub_menu_ul     = document.querySelector('.sub-menu ul');
    const right_column_ul = document.querySelector('.right-column ul');
    const doc_header_div  = document.querySelector('.doc-header');
    const doc_content_div = document.querySelector('.doc-content');
    const doc_footer_div  = document.querySelector('.doc-footer');
    
    // Extend glob.heap for PDF state
    glob.heap = glob.heap || {};
    glob.heap.currentPdfDoc = null;
    glob.heap.currentPdfBaseSrc = '';



    // -----------------------------
    // Main Menu Population
    // -----------------------------
    
    // Local helper to create a document button
    function create_document_button(doc_id) {
        const doc = glob.data.docs_data[doc_id];
        if (!doc) {
            console.warn(`Document data not found for ID: ${doc_id}`);
            return null;
        }
        return glob.ui.new_btn(null, {
            textContent: doc.title,
            'data-doc-id': doc_id,
            onclick: () => {
                glob.heap.curr_doc_id = doc_id;
                populate_sub_menu(doc_id);
                // Load the first chapter by default when a new document is selected
                if (doc.chapters && doc.chapters.length > 0) {
                    load_document_content(doc_id, doc.chapters[0].id);
                } else {
                    // Handle case with no chapters (though data structure implies chapters)
                    if (doc_content_div) doc_content_div.innerHTML = '<p>This document has no chapters.</p>';
                    if (doc_header_div) doc_header_div.innerHTML = doc.doc_header_content || 'Document Header';
                    if (doc_footer_div) doc_footer_div.innerHTML = doc.doc_footer_content || 'Document Footer';
                    glob.heap.curr_chap_id = null;
                }
                // Active state handled by populate_sub_menu/load_document_content
            }
        });
    }

    // Function to add specific behavior to the "Documents" menu item
    function add_documents_section_behavior(list_item) {
        const section_button = list_item.querySelector('button'); // Assumes the button is directly inside the li
        if (!section_button) return;

        const collapsible_content = glob.ui.new_div(null, {
            className: 'collapsible-content',
            style: 'display: none; padding-left: 15px;' // Initially hidden and indented
        });
        list_item.appendChild(collapsible_content);

        section_button.onclick = () => {
            collapsible_content.style.display = collapsible_content.style.display === 'none' ? 'block' : 'none';
        };

        // Read document categories from glob.data
        const document_categories = glob.data.doc_categories || [];

        document_categories.forEach((category, index) => {
            console.log("[add_documents_section_behavior] Processing category:", category.title);
            const category_heading = glob.ui.new_div(null, { 
                textContent: category.title, 
                style: 'font-weight: bold; margin-top: 5px;' 
            });
            collapsible_content.appendChild(category_heading);
            
            category.doc_ids.forEach(doc_id => {
                console.log("[add_documents_section_behavior] Creating button for doc_id:", doc_id);
                const doc_button = create_document_button(doc_id);
                if (doc_button) {
                    collapsible_content.appendChild(doc_button);
                }
            });

            // Add a horizontal ruler if there are documents in this category and it's not the last category
            if (category.doc_ids.length > 0 && index < document_categories.length - 1) {
                const hr = document.createElement('hr');
                console.log("[add_documents_section_behavior] Adding HR after category:", category.title);
                collapsible_content.appendChild(hr);
            }
        });

        // Initial setup: Ensure the section is initially closed
        collapsible_content.style.display = 'none';
    }

    function populate_main_menu() {
        console.log("[populate_main_menu] Starting.");
        if (!main_menu_ul) {
            console.error("[populate_main_menu] main_menu_ul element not found.");
            return;
        }
        if (!glob.data.main_menu_cfg) {
            console.error("[populate_main_menu] glob.data.main_menu_cfg is not defined.");
            return;
        }
        console.log("[populate_main_menu] Main menu config:", JSON.parse(JSON.stringify(glob.data.main_menu_cfg)));

        main_menu_ul.innerHTML = ''; // Clear existing items

        glob.data.main_menu_cfg.forEach(menu_item => {
            console.log("[populate_main_menu] Processing menu item:", menu_item);
            const li = glob.ui.new_lis(null, {});

            if (menu_item.type === 'link') {
                console.log("[populate_main_menu] Item type: link. Text:", menu_item.text);
                const anchor = glob.ui.new_anc(null, {
                    textContent: menu_item.text,
                    href: menu_item.href
                });
                li.appendChild(anchor);
            } else if (menu_item.type === 'documents') {
                console.log("[populate_main_menu] Item type: documents. Text:", menu_item.text);
                // Create a simple button for the "Documents" item for now
                const documents_button = glob.ui.new_btn(null, {
                    textContent: menu_item.text,
                    className: 'collapsible-header' // Add back the class for styling and behavior
                });
                li.appendChild(documents_button);
                console.log("[populate_main_menu] Calling add_documents_section_behavior for:", menu_item.text);
                add_documents_section_behavior(li); // Re-enable the collapsible functionality
                console.log("[populate_main_menu] Returned from add_documents_section_behavior for:", menu_item.text);
            }
            // Add other menu item types here if needed
            console.log("[populate_main_menu] Appending <li> to main_menu_ul for item:", menu_item.text, li);
            main_menu_ul.appendChild(li);
        });
    }
    // -----------------------------
    // Sub Menu Population
    // -----------------------------

    function populate_sub_menu(doc_id) { // This function is called when a document is selected from *any* menu
        const doc_data = glob.data.docs_data[doc_id];
        if (!sub_menu_ul || !doc_data) {
            if (sub_menu_ul) sub_menu_ul.innerHTML = '<li>No sections available.</li>';
            return;
        }

        sub_menu_ul.innerHTML = ''; // Clear existing items
        // If the current document is primarily a PDF collection, its chapters might be individual PDFs
        // This function will now primarily list chapters. PDF page navigation will be handled separately.
        if (!doc_data.chapters) return;

        const chapters = glob.data.docs_data[doc_id].chapters; // Use chapters from the selected doc_id

        chapters.forEach(chapter => {
            const button = glob.ui.new_btn(null, {
                textContent: chapter.title,
                'data-chapter-id': chapter.id,
                onclick: () => {
                    load_document_content(doc_id, chapter.id); 
                    glob.ui.clear_active(sub_menu_ul); // Clear active state in sub-menu
                    glob.ui.set_active_btn(button); // Set active state on the clicked sub-menu button
                }
            });

            const li = glob.ui.new_lis(null, {});
            li.appendChild(button);
            sub_menu_ul.appendChild(li);
        });
    }

    function populate_pdf_page_navigation(num_pages, base_src, initial_page = 1) {
        if (!sub_menu_ul) return;
        sub_menu_ul.innerHTML = ''; // Clear existing chapter links

        for (let i = 1; i <= num_pages; i++) {
            const page_num = i;
            const button = glob.ui.new_btn(null, {
                textContent: `Page ${page_num}`,
                'data-page-num': page_num,
                onclick: () => {
                    const pdf_frame = doc_content_div.querySelector('iframe');
                    if (pdf_frame) {
                        pdf_frame.src = `${base_src}#page=${page_num}`;
                    }
                    if (doc_footer_div) {
                        const pdf_title = glob.heap.currentPdfDoc ? (glob.heap.currentPdfDoc.metadata && glob.heap.currentPdfDoc.metadata.info ? glob.heap.currentPdfDoc.metadata.info.Title || base_src.split('/').pop() : base_src.split('/').pop()) : "PDF";
                        doc_footer_div.innerHTML = `<span>${pdf_title} - Page ${page_num} of ${num_pages}</span>`;
                    }
                    glob.ui.clear_active(sub_menu_ul);
                    glob.ui.set_active_btn(button);
                }
            });
            if (page_num === initial_page) {
                glob.ui.set_active_btn(button); // Set initial active page
            }
            const li = glob.ui.new_lis(null, {});
            li.appendChild(button);
            sub_menu_ul.appendChild(li);
        }
    }




    // -----------------------------
    // Document Content Loading
    // -----------------------------

    function load_document_content (doc_id, chapter_id) {
        if (!glob.data.docs_data[doc_id]) return;

        const doc = glob.data.docs_data[doc_id];
        const chapter = doc.chapters.find(ch => ch.id === chapter_id);

        if (!chapter || !chapter.content_file) { // Check if chapter or content_file is missing
            if (doc_header_div) doc_header_div.innerHTML = doc.doc_header_content || `Header for ${doc.title}`;
            if (doc_footer_div) doc_footer_div.innerHTML = doc.doc_footer_content || `Footer for ${doc.title}`;
            if (doc_content_div) doc_content_div.innerHTML = '<p>Chapter data or content file not specified.</p>';
            glob.heap.curr_chap_id = null;
            glob.heap.currentPdfDoc = null;
            if (doc_content_div) doc_content_div.scrollTop = 0;
            populate_sub_menu(doc_id); // Revert to chapter list if PDF fails early
            return;
        }

        if (doc_content_div) {
            doc_content_div.innerHTML = ''; // Clear previous content
            glob.heap.currentPdfDoc = null; // Reset current PDF doc

            if (chapter.content_file.toLowerCase().endsWith('.pdf')) { // Check for PDF extension
                // Fetch and parse PDF
                fetch(chapter.content_file)
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${chapter.content_file}`);
                        return response.arrayBuffer();
                    })
                    .then(arrayBuffer => pdfjsLib.getDocument({ data: arrayBuffer }).promise)
                    .then(pdfDoc => {
                        glob.heap.currentPdfDoc = pdfDoc;
                        glob.heap.currentPdfBaseSrc = chapter.content_file;
                        glob.heap.curr_chap_id = chapter_id;

                        // Populate doc header with PDF title or first page text
                        pdfDoc.getMetadata().then(metadata => {
                            const title = metadata.info && metadata.info.Title ? metadata.info.Title : chapter.title || "PDF Document";
                            if (doc_header_div) doc_header_div.innerHTML = `<h2>${title}</h2>`;
                        }).catch(() => { // Fallback if metadata fails
                            if (doc_header_div) doc_header_div.innerHTML = `<h2>${chapter.title || "PDF Document"}</h2>`;
                        });
                        
                        // Attempt to get first page text for header (can be more elaborate)
                        // pdfDoc.getPage(1).then(page => page.getTextContent()).then(textContent => {
                        //     let firstPageText = textContent.items.slice(0, 5).map(item => item.str).join(' '); // First few text items
                        //     if (doc_header_div && !doc_header_div.querySelector('h2')) { // Only if title wasn't set
                        //          doc_header_div.innerHTML = `<p>${firstPageText}...</p>`;
                        //     }
                        // });

                        // Populate doc footer
                        if (doc_footer_div) {
                             const pdf_title_for_footer = glob.heap.currentPdfDoc.metadata && glob.heap.currentPdfDoc.metadata.info ? glob.heap.currentPdfDoc.metadata.info.Title || chapter.content_file.split('/').pop() : chapter.content_file.split('/').pop();
                            doc_footer_div.innerHTML = `<span>${pdf_title_for_footer} - Page 1 of ${pdfDoc.numPages}</span>`;
                        }

                        // Populate sub-menu with page numbers
                        populate_pdf_page_navigation(pdfDoc.numPages, chapter.content_file, 1);

                        // Embed PDF in iframe
                        const pdf_frame = glob.ui.new_ifr(null, {
                            src: `${chapter.content_file}#page=1`, // Start at page 1
                            title: chapter.title || 'PDF Document',
                            style: 'width: 100%; height: calc(100vh - 132px); border: none;',
                        });
                        doc_content_div.appendChild(pdf_frame);
                        doc_content_div.scrollTop = 0;

                    }).catch(error => {
                        console.error("Error loading or parsing PDF:", error);
                        if (doc_header_div) doc_header_div.innerHTML = doc.doc_header_content || `Header for ${doc.title}`;
                        if (doc_footer_div) doc_footer_div.innerHTML = doc.doc_footer_content || `Footer for ${doc.title}`;
                        doc_content_div.innerHTML = `<p style="color: red;">Error loading PDF: ${chapter.content_file}.<br>${error.message}</p>`;
                        glob.heap.curr_chap_id = null;
                        populate_sub_menu(doc_id); // Revert to chapter list
                    });

            } else { // Assume HTML for other extensions or non-PDF content
                if (doc_header_div) doc_header_div.innerHTML = doc.doc_header_content || `Header for ${doc.title}`;
                if (doc_footer_div) doc_footer_div.innerHTML = doc.doc_footer_content || `Footer for ${doc.title}`;
                populate_sub_menu(doc_id); // Ensure chapter list is shown for HTML

                fetch(chapter.content_file)
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${chapter.content_file}`);
                        return response.text();
                    })
                    .then(html_content => {
                        doc_content_div.innerHTML = html_content;
                        glob.heap.curr_chap_id = chapter_id;
                        doc_content_div.scrollTop = 0;
                    }).catch(error => {
                        console.error("Error loading chapter content:", error);
                        doc_content_div.innerHTML = `<p style="color: red;">Error loading content for '${chapter.title}'.<br>Please check the file path and ensure the file exists: ${chapter.content_file}</p>`;
                        glob.heap.curr_chap_id = null;
                    });
            }
        } else {
            doc_content_div.innerHTML = '<p>Chapter data or content file not specified.</p>';
            if (doc_header_div) doc_header_div.innerHTML = doc.doc_header_content || `Header for ${doc.title}`;
            if (doc_footer_div) doc_footer_div.innerHTML = doc.doc_footer_content || `Footer for ${doc.title}`;
            glob.heap.curr_chap_id = null;
        }
    }




    // -----------------------------
    // Right Column Population
    // -----------------------------

    function populate_right_column() {
        if (!right_column_ul || !glob.data.site_links) return; // Use site_links for right column
        right_column_ul.innerHTML = ''; // Clear existing items

        glob.data.site_links.forEach(link_data => {
            const anchor = glob.ui.new_anc(null, {
                textContent: link_data.text,
                href: link_data.href
            }); // Use new_anc for anchor creation
            // If these are internal site links that should trigger JS,
            // you might want to add event listeners instead of direct href navigation.
            // For now, they are standard links.
            const li = glob.ui.new_lis(null, {});
            li.appendChild(anchor);
            right_column_ul.appendChild(li);
        });
    }




    // -----------------------------
    // Application Initialization
    // -----------------------------

    // Initial setup
    populate_main_menu();
    populate_right_column();
    // Load a default document and chapter if specified
    if (glob.data.site_cfg && glob.data.site_cfg.default_document && glob.data.docs_data[glob.data.site_cfg.default_document]) { // Use site_cfg for default settings
        glob.heap.curr_doc_id = glob.data.site_cfg.default_document;
        const default_doc_data = glob.data.docs_data[glob.heap.curr_doc_id];
        
        // Activate the main menu button for the default document
        // Note: Activating the main menu button for the default document is tricky with the new collapsible structure.
        // We'll skip setting the 'active' class on the main 'Documents' button itself,
        // and instead focus on activating the correct document button *inside* the collapsible section
        // and populating the sub-menu and content.

        const default_chapter_id = glob.data.site_cfg.default_chapter || (default_doc_data.chapters.length > 0 ? default_doc_data.chapters[0].id : null);
        if (default_chapter_id) {
            load_document_content(glob.heap.curr_doc_id, default_chapter_id);
            // If it's an HTML doc, populate_sub_menu will be called inside load_document_content
            // If it's a PDF, populate_pdf_page_navigation will be called.
            // We need to ensure the correct sub-menu button (chapter or page) is active.
            // This is now handled within populate_pdf_page_navigation or by the chapter button's onclick.
        } else {
            populate_sub_menu(glob.heap.curr_doc_id); // Populate with chapters if no specific chapter to load
        }

    } else {
        // Fallback if no default is set or found
        if (doc_content_div) doc_content_div.innerHTML = "<p>Welcome to the Dark Ages Archives. Please select a document from the main menu.</p>";
        if (sub_menu_ul) sub_menu_ul.innerHTML = '';
    }

});