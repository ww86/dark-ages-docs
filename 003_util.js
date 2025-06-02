




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