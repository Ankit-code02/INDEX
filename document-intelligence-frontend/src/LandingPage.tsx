
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  Files,
  FileText,
  Layers3,
  MessageSquareText,
  ScanText,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const features = [
  {
    number: "01",
    icon: ScanText,
    title: "Extract the information",
    description:
      "Extract readable text from PDF documents so their contents can be searched and analyzed.",
    tag: "PDF TEXT EXTRACTION",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Understand the context",
    description:
      "Generate concise summaries and use semantic search to discover information related to your question.",
    tag: "AI-ASSISTED ANALYSIS",
  },
  {
    number: "03",
    icon: MessageSquareText,
    title: "Ask your documents",
    description:
      "Ask questions in everyday language and receive answers based on relevant document content.",
    tag: "DOCUMENT Q&A",
  },
];

const workflow = [
  {
    number: "01",
    title: "Upload",
    description: "Add a PDF to your document library.",
  },
  {
    number: "02",
    title: "Extract",
    description: "Turn the document into searchable text.",
  },
  {
    number: "03",
    title: "Index",
    description: "Generate embeddings to find related content.",
  },
  {
    number: "04",
    title: "Discover",
    description: "Search by meaning or ask a question.",
  },
];

const problems = [
  {
    number: "01",
    title: "Too much to read",
    description:
      "Long documents take time to review when you only need a few important details.",
  },
  {
    number: "02",
    title: "Search misses context",
    description:
      "Exact keyword searches can miss relevant information expressed in different words.",
  },
  {
    number: "03",
    title: "Answers are hard to find",
    description:
      "Finding an answer often means opening files, scanning pages and connecting information manually.",
  },
];

function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link to="/" className="landing-brand" aria-label="Index home">
          <span className="landing-brand-mark">
            <Layers3 size={23} strokeWidth={2.1} />
          </span>
          <span className="landing-brand-copy">
            <strong>INDEX</strong>
            <small>DOCUMENT INTELLIGENCE</small>
          </span>
        </Link>

        <nav className="landing-nav" aria-label="Landing page navigation">
          <a href="#solutions">What it solves</a>
          <a href="#features">Capabilities</a>
          <a href="#workflow">How it works</a>
        </nav>

        <Link to="/app" className="landing-header-cta">
          Open workspace <ArrowUpRight size={16} />
        </Link>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-grid" aria-hidden="true" />
        <div className="landing-hero-copy">
          <div className="landing-eyebrow">
            <span />
            A CLEARER WAY TO WORK WITH DOCUMENTS
          </div>

          <h1>
            Your documents
            <br />
            hold answers.
            <br />
            <span>Find them.</span>
          </h1>

          <p className="landing-hero-description">
            Turn static PDFs into searchable knowledge. Extract information,
            discover related content, and ask questions about your documents
            from one workspace.
          </p>

          <div className="landing-hero-actions">
            <Link to="/app" className="landing-button landing-button-lime">
              Explore the workspace <ArrowUpRight size={17} />
            </Link>
            <a href="#features" className="landing-button landing-button-outline">
              Discover capabilities <ArrowDown size={16} />
            </a>
          </div>

          <div className="landing-hero-footnote">
            <ShieldCheck size={15} />
            <span>DOCUMENT-BASED ANSWERS, NOT JUST KEYWORD MATCHES</span>
          </div>
        </div>

        <div className="landing-visual" aria-label="Illustration of document analysis">
          <div className="visual-topline">
            <span>DOCUMENT / ANALYSIS</span>
            <span>FIG. 001</span>
          </div>

          <div className="visual-document">
            <div className="visual-document-header">
              <FileText size={21} />
              <span>DOCUMENT_001.PDF</span>
              <span className="visual-file-type">PDF</span>
            </div>
            <div className="visual-document-body">
              <div className="visual-document-title" />
              <div className="visual-line visual-line-long" />
              <div className="visual-line" />
              <div className="visual-line visual-line-short" />
              <div className="visual-highlight">
                <span />
                <div>
                  <div />
                  <div />
                </div>
              </div>
              <div className="visual-line visual-line-long" />
              <div className="visual-line visual-line-short" />
            </div>
            <div className="visual-document-footer">
              <span>TEXT EXTRACTED</span>
              <Check size={13} />
            </div>
          </div>

          <div className="visual-connector connector-one" />
          <div className="visual-connector connector-two" />

          <div className="visual-intelligence">
            <div className="visual-intelligence-icon">
              <Sparkles size={22} />
            </div>
            <span>SEMANTIC ANALYSIS</span>
            <strong>Meaning found.</strong>
            <div className="visual-confidence">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="visual-coordinate coordinate-top">01 / EXTRACT</div>
          <div className="visual-coordinate coordinate-bottom">02 / UNDERSTAND</div>
          <span className="visual-marker marker-one" />
          <span className="visual-marker marker-two" />
        </div>

        <a href="#intro" className="landing-scroll">
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown size={15} />
        </a>
      </section>

      <section className="landing-intro landing-section" id="intro">
        <div className="landing-section-label">
          <span>01</span>
          THE IDEA
        </div>

        <div className="landing-intro-content">
          <h2>
            Less time searching.
            <br />
            <span>More time understanding.</span>
          </h2>
          <p>
            Documents contain policies, reports, records and useful insights.
            But that information is only valuable when you can find it.
            INDEX brings document extraction, semantic discovery, summarization
            and question-answering into a single workflow.
          </p>
          <Link to="/app" className="landing-inline-link">
            See the workspace <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="landing-intro-stamp">
          <Layers3 size={35} strokeWidth={1.1} />
          <span>INFORMATION</span>
          <span>IN CONTEXT.</span>
        </div>
      </section>

      <section className="landing-problems landing-section" id="solutions">
        <div className="landing-section-label">
          <span>02</span>
          THE PROBLEM
        </div>

        <div className="landing-section-heading">
          <div>
            <h2>Documents aren't the problem.</h2>
            <h2 className="muted-heading">Finding what matters is.</h2>
          </div>
          <p>
            When information is scattered across files, even simple questions
            can require unnecessary manual work.
          </p>
        </div>

        <div className="landing-problem-grid">
          {problems.map((problem) => (
            <article className="landing-problem" key={problem.number}>
              <span className="landing-card-number">{problem.number} / 03</span>
              <div className="problem-rule" />
              <h3>{problem.title}</h3>
              <p>{problem.description}</p>
            </article>
          ))}
        </div>

        <div className="landing-solution-strip">
          <div className="solution-strip-icon">
            <Sparkles size={22} />
          </div>
          <div>
            <span>THE APPROACH</span>
            <strong>Make document information easier to discover and use.</strong>
          </div>
          <ArrowRight size={20} />
        </div>
      </section>

      <section className="landing-features landing-section" id="features">
        <div className="landing-section-label">
          <span>03</span>
          THE CAPABILITIES
        </div>

        <div className="landing-section-heading">
          <div>
            <h2>One workspace.</h2>
            <h2 className="muted-heading">Multiple ways to understand.</h2>
          </div>
          <p>
            A practical set of tools for moving from an uploaded PDF to useful
            information.
          </p>
        </div>

        <div className="landing-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="landing-feature" key={feature.number}>
                <div className="landing-feature-top">
                  <span>{feature.number} / CAPABILITY</span>
                  <Icon size={23} strokeWidth={1.5} />
                </div>
                <div className="landing-feature-icon">
                  <Icon size={25} strokeWidth={1.6} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="landing-feature-tag">
                  <span />
                  {feature.tag}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-workflow landing-section" id="workflow">
        <div className="landing-section-label">
          <span>04</span>
          THE WORKFLOW
        </div>

        <div className="workflow-heading">
          <h2>From file to finding.</h2>
          <p>
            Each step prepares your documents for the next. You stay in one
            workspace throughout the process.
          </p>
        </div>

        <div className="workflow-track">
          {workflow.map((step, index) => (
            <article className="workflow-step" key={step.number}>
              <div className="workflow-step-top">
                <span>{step.number}</span>
                {index < workflow.length - 1 && <ArrowRight size={16} />}
              </div>
              <div className="workflow-node">
                {index === 0 && <UploadIcon />}
                {index === 1 && <FileText size={22} />}
                {index === 2 && <Workflow size={22} />}
                {index === 3 && <Search size={22} />}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>

        <div className="workflow-note">
          <div className="workflow-note-icon">
            <BrainCircuit size={20} />
          </div>
          <p>
            <strong>Behind the scenes:</strong> text extraction and embeddings
            prepare your documents for semantic retrieval. The language model
            then uses retrieved content to help answer your question.
          </p>
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta-grid" aria-hidden="true" />
        <div className="landing-section-label">
          <span>05</span>
          GET STARTED
        </div>
        <h2>
          Your next answer
          <br />
          could be <span>in a document.</span>
        </h2>
        <p>
          Bring your PDFs into one workspace and start exploring what they
          contain.
        </p>
        <Link to="/app" className="landing-button landing-button-lime">
          Open your workspace <ArrowUpRight size={17} />
        </Link>
        <div className="landing-cta-index">INDEX / DOCUMENT INTELLIGENCE</div>
      </section>

      <footer className="landing-footer">
        <Link to="/" className="landing-footer-brand">
          <Layers3 size={19} />
          <strong>INDEX</strong>
        </Link>
        <span>DOCUMENT INTELLIGENCE WORKSPACE</span>
        <a href="#top" onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}>
          BACK TO TOP ↑
        </a>
      </footer>
    </main>
  );
}

function UploadIcon() {
  return <Files size={22} />;
}

export default LandingPage;
