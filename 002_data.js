




// -----------------------------
// Document Definitions
// -----------------------------
glob.data.docs_data = [

  // Primary documents
  { 
    id          :     "initial_declaration",
    title       :     "Initial Declaration",
    category    :     "primary_docs",     
    path        :     "/docs/000_initial_declaration.pdf"
  },

  // Project management documents
  { 
    id          :     "ic001",
    title       :     "IC 001 Status of Propositions",
    category    :     "project_mgmt",
    path        :     "/docs/IC_001_status_of_propositions.pdf"
  },

  // General documents
  { 
    id          :     "am001",
    title       :     "AM 001 Mechanics: Locations",
    category    :     "general_docs",
    path        :     "/docs/AM_001_mechanics_locations.pdf"
  },

];



// -----------------------------
// Main Menu Configuration
// -----------------------------

glob.data.main_menu_cfg = [
  { type: 'documents', text: 'Documents' },     // This will trigger the special handling
];



// -----------------------------
// Document Category Definitions
// -----------------------------
glob.data.doc_categories = { // Changed to an object for easier lookup by ID
  "primary_docs": {
    title: "Primary Documents", // Renamed for clarity
    order: 1 // Optional: for controlling display order in the menu
  },
  "project_mgmt": {
    title: "Project Management",
    order: 2
  },
  "general_docs": {
    title: "General Documents",
    order: 3
  }
};



// -----------------------------
// Site Navigation Links
// -----------------------------

glob.data.site_links = [
  { text: "The Grand Archives",     href: "#archives" },
  { text: "Cartographer's Guild",   href: "#maps" },
  { text: "Scribe's Repository",    href: "#scribes" },
  { text: "Whispering Gallery",     href: "#rumors" }
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