




// -----------------------------
// Document Definitions
// -----------------------------
glob.data.docs_data = [

  // Primary documents
  { 
    id          :     "initial_declaration",
    title       :     "Initial Declaration",
    cat         :     "primary_docs",     
    path        :     "./docs/000_initial_declaration.pdf",
    pdf_regions : {
      // Assuming US Letter (11 inches high), 0.5 inch / 11 inch = ~0.0455
      // These regions define the 0.5-inch band at the top/bottom, full width.
      // Adjust x and width if your header/footer text has side margins.
      header: { x: 0, y: 0,      width: 1, height: 0.0455 }, // Top 0.5 inch of the page
      footer: { x: 0, y: 0.9545, width: 1, height: 0.0455 }  // Bottom 0.5 inch of the page
    }
  },

  // Project management documents
  { 
    id          :     "ic001",
    title       :     "IC 001 Status of Propositions",
    cat         :     "project_mgmt",
    path        :     "./docs/IC_001_status_of_propositions.pdf"
  },

  { 
    id          :     "ic002",
    title       :     "IC 002 Project Status",
    cat         :     "project_mgmt",
    path        :     "./docs/IC_002_project_status.pdf"
  },

  { 
    id          :     "ic003",
    title       :     "IC 003 Responsibilities",
    cat         :     "project_mgmt",
    path        :     "./docs/IC_003_responsibilities.pdf"
  },

  { 
    id          :     "ic004",
    title       :     "IC 004 Bureaucracy",
    cat         :     "project_mgmt",
    path        :     "./docs/IC_004_bureaucracy.pdf"
  },


  // General documents
  { 
    id          :     "aa000",
    title       :     "AA 001 Rulebook",
    cat         :     "general_docs",
    path        :     "./docs/AA_001_rulebook.pdf"
  },

  { 
    id          :     "am001",
    title       :     "AM 001 Mechanics: Locations",
    cat         :     "general_docs",
    path        :     "./docs/AM_001_mechanics_locations.pdf"
  },

  { 
    id          :     "am002",
    title       :     "AM 002 Mechanics: Damage and Soak",
    cat         :     "general_docs",
    path        :     "./docs/AM_002_mechanics_damage_and_soak.pdf"
  },  

  { 
    id          :     "am003",
    title       :     "AM 003 Mechanics: Disciplines",
    cat         :     "general_docs",
    path        :     "./docs/AM_003_mechanics_disciplines.pdf"
  },  

  { 
    id          :     "am004",
    title       :     "AM 004 Mechanics: Masquerade",
    cat         :     "general_docs",
    path        :     "./docs/AM_004_mechanics_masquerade.pdf"
  },    

];



// -----------------------------
// Main Menu Configuration
// -----------------------------

glob.data.mainmenu_cfg = [
  { type: 'documents', text: 'Documents' },     // This will trigger the special handling
  { type: 'action', text: 'Print DOM to Display', action_id: 'print_dom_to_display' } // New action button
];



// -----------------------------
// Document Category Definitions
// -----------------------------
glob.data.doc_cat = { // Changed to an object for easier lookup by ID
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
  { text: "VTES discord",                     href: "https://discord.com/invite/vampire-the-eternal-struggle-official-887471681277399091" },
  { text: "Custom Card Tool",                 href: "https://ww86.github.io/card-tool/" },
];



// -----------------------------
// Site Configuration Settings
// -----------------------------
// You can add more data structures here as needed.
// For example, settings for the site, user roles, etc.
glob.data.site_cfg = {
  default_doc: "initial_declaration", // Updated default document
  default_chap: "initial_declaration", // For single file PDFs, chap_id often matches doc_id
  default_pdf_zoom: "page-width", // Example: "page-width", "100" (for 100%), "page-fit"
  // repo_path_prefix: '' // This would no longer be strictly necessary for content paths if using ./
};