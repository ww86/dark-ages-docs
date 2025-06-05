




// -----------------------------
// Utility Functions (Non-DOM)
// -----------------------------
// Purpose: Contains general-purpose helper functions that are not directly tied to DOM manipulation or specific UI components.

glob.util.pdf_ext_pge_txt_reg = async function (pdf_doc_obj, pge_num, header_rect, footer_rect) {
// Purpose: Extracts text from predefined header and footer regions of a given PDF page.
// Structure: Asynchronous. Takes a PDF.js document object ('pdf_doc_obj'), a page number ('pge_num'),
//            and optional 'header_rect'/'footer_rect' objects defining coordinates for text extraction.
//            If rects are not provided, it might use internal defaults or skip extraction for that region.
//            Uses PDF.js API to get page content and then text content within the specified rectangles.
//            Returns an object like { extracted_hdr_text: "...", extracted_ftr_text: "..." }.
//            This is a specialized utility for enhancing PDF display with actual PDF headers/footers.
    let page, text_content, extracted_hdr_text = "", extracted_ftr_text = "";

    if (!pdf_doc_obj || typeof pdfjsLib === 'undefined') {
        console.warn("[glob.util.pdf_ext_pge_txt_reg] PDF.js document object or library not available.");
        return { extracted_hdr_text, extracted_ftr_text };
    }

    try {
        page = await pdf_doc_obj.getPage(pge_num);
        text_content = await page.getTextContent();

        // Simplified extraction: assumes first few items for header, last few for footer.
        // A real implementation would use header_rect and footer_rect to filter text_content.items
        // based on their transform (position) and dimensions.
        // For example:
        // if (header_rect) {
        //   text_content.items.forEach(item => {
        //     // Check if item.transform[4] (x), item.transform[5] (y) fall within header_rect
        //     if (item.transform[5] > header_rect.y_start && item.transform[5] < header_rect.y_end) {
        //       extracted_hdr_text += item.str + " ";
        //     }
        //   });
        // }
        // This is a very basic placeholder for the concept.
        if (text_content.items.length > 0) {
            // Example: take the first item as a pseudo-header if it's high on the page
            if (text_content.items[0] && text_content.items[0].transform[5] > 700) { // Arbitrary Y threshold for header
                extracted_hdr_text = text_content.items[0].str;
            }
             // Example: take the last item as a pseudo-footer if it's low on the page
            if (text_content.items.length > 1 && text_content.items[text_content.items.length-1].transform[5] < 100) { // Arbitrary Y threshold for footer
                extracted_ftr_text = text_content.items[text_content.items.length-1].str;
            }
        }
    } catch (err) {
        console.error(`[glob.util.pdf_ext_pge_txt_reg] Error extracting text from PDF page ${pge_num}:`, err);
    }

    return {
        extracted_hdr_text: extracted_hdr_text.trim(),
        extracted_ftr_text: extracted_ftr_text.trim()
    };
    
};



//
// --- DOM Class Constraint Checker ---
// Verifies DOM elements against specified class usage rules.

glob.util.check_dom_classes = function() {
    // Only check the body and its descendants
    if (!document.body) {
        console.warn("[glob.util.check_dom_classes] Document body not found. Skipping checks.");
        return;
    }
    const elements_to_check = [document.body, ...Array.from(document.body.querySelectorAll('*'))];
    const class_to_parent_map = {};
    let all_constraints_met = true;

    console.log("Starting DOM class constraint check for " + elements_to_check.length + " elements within <body> (and <body> itself)...");

    elements_to_check.forEach(ele => {
        const element_id_info = ele.id ? ` (id: '${ele.id}')` : '';
        const element_tag_info = `<${ele.tagName.toLowerCase()}${element_id_info}>`;
        const is_script_tag = ele.tagName.toLowerCase() === 'script';

        // Constraint 3: Each DOM element must have a class (unless it's a script tag)
        if (ele.classList.length === 0) {
            if (!is_script_tag) { // If it's not a script tag and has no class, it's a violation.
                console.warn(`[CONSTRAINT VIOLATION] Element ${element_tag_info} has no class. (Rule: Each DOM element must have a class)`);
                all_constraints_met = false;
            }
            // For any element with no classes (script or not), C1 and C2 are irrelevant.
            // So, we skip further class-based checks for this element.
            return; // to next element in forEach
        }

        // If we reach here, ele.classList.length > 0.
        // The element has at least one class and is subject to C1 and C2.

        // Constraint 1: Each DOM element may have only 1 class
        if (ele.classList.length > 1) {
            console.warn(`[CONSTRAINT VIOLATION] Element ${element_tag_info} has multiple classes: [${Array.from(ele.classList).join(', ')}]. (Rule: Each DOM element may have only 1 class)`);
            all_constraints_met = false;
            // Even if it has multiple classes, we'll check the first class for constraint 2,
            // as the element *does* have "a given class" (the first one).
        }
        
        // Constraint 2: Each DOM element with a given class must have the same parent DOM element
        // We use the first class in classList for this check.
        // If C1 (only 1 class) was violated, this check still provides info about the first listed class.
        // This check is relevant because ele.classList.length > 0 at this point.
        const current_class = ele.classList[0];
        const current_parent = ele.parentElement;

        if (class_to_parent_map.hasOwnProperty(current_class)) {
            if (class_to_parent_map[current_class] !== current_parent) {
                const first_parent = class_to_parent_map[current_class];
                const first_parent_desc = first_parent ? `<${first_parent.tagName.toLowerCase()}${(first_parent.id ? ` id='${first_parent.id}'` : '')}>` : 'null (e.g., document fragment or detached)';
                const current_parent_desc = current_parent ? `<${current_parent.tagName.toLowerCase()}${(current_parent.id ? ` id='${current_parent.id}'` : '')}>` : 'null (e.g., document fragment or detached)';

                console.warn(`[CONSTRAINT VIOLATION] Element ${element_tag_info} with class "${current_class}" has parent ${current_parent_desc}. This class was first associated with parent ${first_parent_desc}. (Rule: Each DOM element with a given class must have the same parent)`);
                all_constraints_met = false;
            }
        } else {
            // Only map if current_class is defined (it should be, as classList.length > 0)
            // and current_parent is not null (i.e., not the <html> element, which has no parentElement)
            // For elements directly under <html>, parentElement is null.
            // However, since we start from document.body, current_parent for document.body will be <html>.
            // For children of body, parentElement will be body or other elements.
            class_to_parent_map[current_class] = current_parent;
        }
    });

    if (all_constraints_met) {
        console.log("DOM class constraints check (body content) passed successfully. All checked elements adhere to the defined class rules.");
    } else {
        console.warn("DOM class constraints check (body content) FAILED. Violations found. See warnings above.");
    }
};


//
// --- DOM Structure Printer ---
// Generates a commented string representation of the DOM structure.

glob.util.print_dom_to_string = function() {
    // Purpose: Generates a string representation of the DOM structure, formatted with comments and indentation.
    // Structure: Uses a recursive helper function to traverse the DOM tree starting from the body.
    //            For each element node, it includes the tag name, id, classes, and data attributes.
    //            Includes text nodes (with snippets) and comment nodes.
    //            Each line is prefixed with '// '.
    //            Returns the complete string.

    function traverse_and_print(node, indent = '') {
        let output = '';
        const nodeName = node.nodeName.toLowerCase();

        if (node.nodeType === Node.ELEMENT_NODE) {
            let elementInfo = `<${nodeName}`;
            if (node.id) elementInfo += ` id="${node.id}"`;
            if (node.classList.length > 0) elementInfo += ` class="${Array.from(node.classList).join(' ')}"`;
            
            // Add data attributes
            const dataAttributes = [];
            for (const attr of node.attributes) {
                if (attr.name.startsWith('data-')) {
                    dataAttributes.push(`${attr.name}="${attr.value}"`);
                }
            }
            if (dataAttributes.length > 0) elementInfo += ` ${dataAttributes.join(' ')}`;
            elementInfo += `>`;

            output += `//${indent} ${elementInfo}\n`;

            // Recurse for children
            Array.from(node.childNodes).forEach(child => {
                output += traverse_and_print(child, indent + '  '); // Increase indent
            });

        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            // Handle text nodes - show a snippet
            const textSnippet = node.textContent.trim().replace(/\s+/g, ' ').substring(0, 50) + (node.textContent.trim().length > 50 ? '...' : '');
            output += `//${indent}   #text: "${textSnippet}"\n`;
        } else if (node.nodeType === Node.COMMENT_NODE) {
             const commentSnippet = node.textContent.trim().replace(/\s+/g, ' ').substring(0, 50) + (node.textContent.trim().length > 50 ? '...' : '');
             output += `//${indent}   <!-- ${commentSnippet} -->\n`;
        }

        return output;
    }

    if (!document.body) {
        return "// Document body not found. Cannot print DOM structure.";
    }
    return traverse_and_print(document.body);
};