
import { useRef, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Command,
  FileSearch,
  Files,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import "./App.css";
import { useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import DocumentsPage from "./DocumentsPage";
import SmartSearchPage from "./SmartSearchPage";
import AskDocumentsPage from "./AskDocumentsPage";

type Page = "Overview" | "Documents" | "Smart Search" | "Ask Documents";

const navigation = [
  { label: "Overview" as const, icon: LayoutDashboard, number: "01" },
  { label: "Documents" as const, icon: Files, number: "02" },
  { label: "Smart Search" as const, icon: FileSearch, number: "03" },
  { label: "Ask Documents" as const, icon: MessageSquareText, number: "04" },
];

function WorkspaceApp() {
  const [activePage, setActivePage] = useState<Page>("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function navigate(page: Page) {
    setActivePage(page);
    setMobileMenuOpen(false);
  }

  function selectFile(file?: File) {
    if (file) setSelectedFile(file);
  }

  return (
    <div className="app-shell">
      {mobileMenuOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <button
          className="brand"
          onClick={() => navigate("Overview")}
          aria-label="Go to overview"
        >
          <span className="brand-mark">
            <Command size={21} strokeWidth={2.4} />
            <span />
          </span>
          <span className="brand-copy">
            <strong>INDEX</strong>
            <small>DOCUMENT INTELLIGENCE</small>
          </span>
        </button>

        <div className="workspace-label">
          <span>WORKSPACE</span>
          <ChevronDown size={14} />
        </div>

        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon, number }) => (
            <button
              key={label}
              className={`nav-link ${activePage === label ? "nav-link-active" : ""}`}
              onClick={() => navigate(label)}
              aria-current={activePage === label ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              <small>{number}</small>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="connection-status">
            <span className="status-dot" />
            <span>LOCAL WORKSPACE</span>
            <span className="status-live">READY</span>
          </div>

          <button className="nav-link settings-link" onClick={() => navigate("Overview")}>
            <Settings2 size={18} strokeWidth={1.8} />
            <span>Workspace settings</span>
          </button>

          <div className="sidebar-footer">
            <div className="footer-symbol">I</div>
            <div>
              <strong>Index Workspace</strong>
              <small>Personal environment</small>
            </div>
            <ShieldCheck size={16} />
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <span className="breadcrumb">WORKSPACE</span>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-current">{activePage.toUpperCase()}</span>
          </div>

          <div className="topbar-right">
            <span className="environment-label">
              <span className="status-dot" />
              LOCAL ENVIRONMENT
            </span>
            <span className="topbar-divider" />
            <span className="avatar">I</span>
          </div>
        </header>

        <div className="page-content" key={activePage}>
          {activePage === "Overview" ? (
            <Overview
              onNavigate={navigate}
              onUpload={() => fileInputRef.current?.click()}
              selectedFile={selectedFile}
              onClearFile={() => setSelectedFile(null)}
            />
          ) : activePage === "Documents" ? (
            <DocumentsPage onAsk={() => navigate("Ask Documents")} />
          ) : activePage === "Smart Search" ? (
            <SmartSearchPage />
          ) : activePage === "Ask Documents" ? (
                <AskDocumentsPage />
          )  : (
            <SecondaryPage
              page={activePage}
              onNavigate={navigate}
              onUpload={() => fileInputRef.current?.click()}
            />
          )}
        </div>

        <footer className="main-footer">
          <span>INDEX <span className="footer-separator">/</span> DOCUMENT INTELLIGENCE</span>
          <span>BUILT FOR CLARITY <span className="footer-dot">●</span></span>
        </footer>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        hidden
        onChange={(event) => selectFile(event.target.files?.[0])}
      />
    </div>
  );
}

function Overview({
  onNavigate,
  onUpload,
  selectedFile,
  onClearFile,
}: {
  onNavigate: (page: Page) => void;
  onUpload: () => void;
  selectedFile: File | null;
  onClearFile: () => void;
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <div className="eyebrow light-eyebrow">
            <span className="eyebrow-line" />
            YOUR DOCUMENT WORKSPACE
          </div>
          <h1>
            Information is there.
            <br />
            <span>Find the meaning.</span>
          </h1>
          <p>
            One workspace to organize your documents, discover relevant
            information, and get answers grounded in your files.
          </p>
          <div className="hero-actions">
            <button className="button button-lime" onClick={onUpload}>
              <Plus size={17} />
              Upload a document
              <ArrowUpRight size={16} />
            </button>
            <button
              className="button button-hero-secondary"
              onClick={() => onNavigate("Smart Search")}
            >
              Explore smart search
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-core">
            <Command size={48} strokeWidth={1} />
          </div>
          <div className="art-cross cross-one" />
          <div className="art-cross cross-two" />
          <div className="art-label">
            <span>01</span>
            DOCUMENT INTELLIGENCE
          </div>
          <div className="art-coordinate">DI / 001</div>
        </div>

        <div className="hero-index">01 — 04</div>
      </section>

      <section className="section-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            WORKSPACE OVERVIEW
          </div>
          <h2>Your work, at a glance.</h2>
          <p>Everything you need to get started, in one place.</p>
        </div>
        <span className="section-date">YOUR PRIVATE WORKSPACE</span>
      </section>

      <section className="workspace-grid">
        <article className="workspace-card document-card">
          <div className="card-topline">
            <span className="card-number">01 / LIBRARY</span>
            <Files size={19} strokeWidth={1.6} />
          </div>
          <div className="card-icon"><FileText size={23} /></div>
          <h3>Your documents</h3>
          <p>Keep your files in one place. Extract their text and prepare them for intelligent search.</p>
          <button className="text-action" onClick={() => onNavigate("Documents")}>
            Open document library <ArrowUpRight size={16} />
          </button>
          <div className="card-bottom-note">
            <span className="mini-square" />
            PDF DOCUMENTS
          </div>
        </article>

        <article className="workspace-card search-card">
          <div className="card-topline">
            <span className="card-number">02 / DISCOVERY</span>
            <Search size={19} strokeWidth={1.6} />
          </div>
          <div className="card-icon"><FileSearch size={23} /></div>
          <h3>Search by meaning</h3>
          <p>Look beyond exact keywords. Find documents that relate to what you are asking.</p>
          <button className="text-action" onClick={() => onNavigate("Smart Search")}>
            Explore smart search <ArrowUpRight size={16} />
          </button>
          <div className="card-bottom-note">
            <span className="mini-square lime-square" />
            SEMANTIC RETRIEVAL
          </div>
        </article>

        <article className="workspace-card answer-card">
          <div className="card-topline">
            <span className="card-number">03 / INTELLIGENCE</span>
            <Sparkles size={19} strokeWidth={1.6} />
          </div>
          <div className="card-icon"><MessageSquareText size={23} /></div>
          <h3>Ask your documents</h3>
          <p>Ask a question in plain language and receive an answer with source documents.</p>
          <button className="text-action" onClick={() => onNavigate("Ask Documents")}>
            Open AI workspace <ArrowUpRight size={16} />
          </button>
          <div className="card-bottom-note">
            <span className="mini-square" />
            SOURCE-GROUNDED ANSWERS
          </div>
        </article>
      </section>

      <section className="lower-grid">
        <div className="activity-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">WORKSPACE ACTIVITY</div>
              <h3>A clear starting point.</h3>
            </div>
            <Activity size={19} strokeWidth={1.6} />
          </div>
          <div className="empty-state">
            <div className="empty-icon"><Files size={22} strokeWidth={1.4} /></div>
            <div>
              <strong>Your document activity will appear here.</strong>
              <p>Upload a PDF to begin building your library.</p>
            </div>
            <button className="small-outline-button" onClick={onUpload}>
              <Upload size={15} /> Upload PDF
            </button>
          </div>
          {selectedFile && (
            <div className="selected-file">
              <FileText size={18} />
              <div>
                <strong>{selectedFile.name}</strong>
                <small>{(selectedFile.size / 1024).toFixed(1)} KB · Selected, not uploaded yet</small>
              </div>
              <button className="icon-button" onClick={onClearFile} aria-label="Remove selected file">
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <aside className="system-panel">
          <div className="eyebrow">SYSTEM STATUS</div>
          <h3>Ready when you are.</h3>
          <p>The interface is ready to connect to your document services.</p>
          <div className="system-row">
            <span>Frontend</span>
            <span className="status-pill"><Check size={12} /> RUNNING</span>
          </div>
          <div className="system-row">
            <span>Document API</span>
            <span className="status-pill status-pending">NOT CHECKED</span>
          </div>
          <div className="system-row">
            <span>AI services</span>
            <span className="status-pill status-pending">NOT CHECKED</span>
          </div>
          <div className="system-note">
            <ArrowDownRight size={15} />
            Live connection checks come next.
          </div>
        </aside>
      </section>
    </>
  );
}

function SecondaryPage({
  page,
  onNavigate,
  onUpload,
}: {
  page: Page;
  onNavigate: (page: Page) => void;
  onUpload: () => void;
}) {
  const config = {
    Documents: {
      number: "02",
      eyebrow: "DOCUMENT LIBRARY",
      title: "Every file, in its place.",
      description: "Upload and manage your PDFs, then extract their content for search and analysis.",
      icon: Files,
      action: "Upload a PDF",
    },
    "Smart Search": {
      number: "03",
      eyebrow: "SEMANTIC DISCOVERY",
      title: "Search beyond keywords.",
      description: "Find documents by meaning using natural language, powered by your saved document embeddings.",
      icon: FileSearch,
      action: "Go to documents",
    },
    "Ask Documents": {
      number: "04",
      eyebrow: "DOCUMENT QUESTION-ANSWERING",
      title: "Ask a better question.",
      description: "Ask questions about your documents and receive answers grounded in their extracted text.",
      icon: MessageSquareText,
      action: "Go to documents",
    },
    Overview: {
      number: "01",
      eyebrow: "WORKSPACE",
      title: "Your workspace.",
      description: "Explore your documents.",
      icon: LayoutDashboard,
      action: "Go to overview",
    },
  }[page];

  const Icon = config.icon;

  return (
    <section className="secondary-page">
      <div className="eyebrow">
        <span className="eyebrow-line" />
        {config.eyebrow}
      </div>
      <div className="secondary-title-row">
        <div>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <span className="secondary-number">{config.number} / 04</span>
      </div>

      <div className="secondary-empty">
        <div className="secondary-empty-icon"><Icon size={28} strokeWidth={1.4} /></div>
        <span className="eyebrow">READY FOR IMPLEMENTATION</span>
        <h2>This workspace is taking shape.</h2>
        <p>
          The page structure is in place. Next, we'll connect this view to your
          Spring Boot API and make its actions fully functional.
        </p>
        {page === "Documents" ? (
          <button className="button button-dark" onClick={onUpload}>
            <Upload size={16} /> Select a PDF
          </button>
        ) : (
          <button className="button button-dark" onClick={() => onNavigate("Documents")}>
            {config.action} <ArrowRight size={16} />
          </button>
        )}
      </div>

      <div className="secondary-footnote">
        <ShieldCheck size={16} />
        Your existing Java backend remains the source of document and AI operations.
      </div>
    </section>
  );
}

function App() {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return <LandingPage />;
  }

  return <WorkspaceApp />;
}

export default App;
