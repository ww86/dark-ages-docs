




// -----------------------------
// Document Data Definitions
// -----------------------------

glob.data.docs_data = {
  // Ensure this document is defined as it's used in the 'Documents' section categories
  "initial_declaration": {
    title: "Initial Declaration of Intent",
    doc_header_content: "Founding Principles",
    doc_footer_content: "End of Declaration",
    chapters: [
      { id: "declaration", title: "The Declaration", content_file: "pdf/000_initial_declaration.pdf" } // prettier-ignore
    ]
  }
};




// -----------------------------
// Main Menu Configuration
// -----------------------------

glob.data.main_menu_cfg = [
  { type: 'link', text: 'Home', href: '#home' }, // Example link
  { type: 'documents', text: 'Documents' },     // This will trigger the special handling
  { type: 'link', text: 'About', href: '#about' }  // Example link
  // Add other top-level menu items here if needed
];




// -----------------------------
// Document Categories for Main Menu
// -----------------------------

glob.data.doc_categories = [
  { title: 'Initial Declaration of Intent', doc_ids: ['initial_declaration'] },
  { title: 'Project Management', doc_ids: [] }, // Populate with relevant doc_ids later
  { title: 'General Documents', doc_ids: [] }  // Populate with relevant doc_ids later
];




// -----------------------------
// Site Navigation Links
// -----------------------------

glob.data.site_links = [
  { text: "The Grand Archives", href: "#archives" },
  { text: "Cartographer's Guild", href: "#maps" },
  { text: "Scribe's Repository", href: "#scribes" },
  { text: "Whispering Gallery", href: "#rumors" }
];

 


// -----------------------------
// Site Configuration Settings
// -----------------------------

// You can add more data structures here as needed.
// For example, settings for the site, user roles, etc.
glob.data.site_cfg = {
  default_document: "initial_declaration", // Updated default document
  default_chapter: "declaration" // Corrected to match the chapter ID in initial_declaration
};