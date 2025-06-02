




// -----------------------------
// Document Data Definitions
// -----------------------------

glob.data.docs_data = {
  // Ensure this document is defined as it's used in the 'Documents' section categories
  "initial_declaration": {
    title: "Initial Declaration of Intent",
    doc_hdr_con: "Founding Principles",
    doc_ftr_con: "End of Declaration",
    chapters: [
      { id: "declaration", title: "The Declaration", con_file: "docs/000_initial_declaration.pdf" } // prettier-ignore
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
  default_doc: "initial_declaration", // Updated default document
  default_chap: "declaration" // Corrected to match the chap ID in initial_declaration
};