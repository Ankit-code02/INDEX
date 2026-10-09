
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  FileSearch,
  FileText,
  LoaderCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { api, type SearchResult } from "./services/api";

const examples = [
  "What does the document say about experience?",
  "Find information about Java and Spring Boot",
  "Which documents mention authentication?",
];

export default function SmartSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(value = query) {
    const cleaned = value.trim();
    if (!cleaned || loading) return;

    setQuery(cleaned);
    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const data = await api.searchDocuments(cleaned);
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Search could not be completed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="secondary-page smart-search-page">
      <div className="eyebrow">
        <span className="eyebrow-line" />
        SEMANTIC DISCOVERY
      </div>

      <div className="secondary-title-row">
        <div>
          <h1>Search beyond words.</h1>
          <p>
            Describe what you want to find. INDEX searches document meaning,
            not just exact keyword matches.
          </p>
        </div>
        <div className="search-page-mark">
          <FileSearch size={27} strokeWidth={1.4} />
        </div>
      </div>

      <form
        className="semantic-search-form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSearch();
        }}
      >
        <Search size={21} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask a question or describe information..."
          aria-label="Semantic search query"
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? (
            <LoaderCircle size={17} className="spin-icon" />
          ) : (
            <Search size={17} />
          )}
          <span>{loading ? "Searching" : "Search"}</span>
        </button>
      </form>

      <div className="search-examples">
        <span>TRY A SEARCH</span>
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setQuery(example);
              void handleSearch(example);
            }}
            disabled={loading}
          >
            {example}
            <ArrowUpRight size={13} />
          </button>
        ))}
      </div>

      <div className="search-results-heading">
        <div>
          <span className="eyebrow">SEARCH RESULTS</span>
          <h2>
            {loading
              ? "Finding relevant documents..."
              : searched
                ? `${results.length} relevant document(s)`
                : "Discover what's inside your files."}
          </h2>
        </div>
        <span className="search-method">
          <Sparkles size={14} />
          MEANING-BASED RETRIEVAL
        </span>
      </div>

      {error && (
        <div className="api-message api-message-error" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <div className="search-state">
          <LoaderCircle size={25} className="spin-icon" />
          <p>Comparing your query with document content...</p>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="search-state">
          <FileSearch size={28} />
          <h3>No matching documents found.</h3>
          <p>
            Try different wording or upload and extract text from more PDFs.
          </p>
        </div>
      )}

      {!loading && !searched && !error && (
        <div className="search-state search-state-intro">
          <div className="search-state-icon">
            <Sparkles size={22} />
          </div>
          <h3>Ask for meaning, not exact wording.</h3>
          <p>
            Search your extracted document content using a natural-language
            description of the information you need.
          </p>
        </div>
      )}

      {!loading && searched && results.length > 0 && (
        <div className="semantic-results">
          {results.map((result, index) => {
            const score = result.similarity;
            const percentage =
              typeof score === "number"
                ? Math.max(0, Math.min(100, score * 100))
                : null;

            return (
              <article
                className="semantic-result"
                key={`${result.documentId}-${index}`}
              >
                <div className="result-file-icon">
                  <FileText size={22} />
                </div>

                <div className="result-main">
                  <span className="result-index">
                    MATCH {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{result.fileName}</h3>
                  <p>Document ID: {result.documentId}</p>
                </div>

                <div className="result-relevance">
                  <span>SIMILARITY SCORE</span>
                  <strong>
                    {percentage === null
                      ? "—"
                      : `${percentage.toFixed(1)}%`}
                  </strong>
                  {percentage !== null && (
                    <div
                      className="relevance-track"
                      role="progressbar"
                      aria-label="Semantic similarity score"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(percentage)}
                    >
                      <div style={{ width: `${percentage}%` }} />
                    </div>
                  )}
                </div>

                <ArrowDownRight
                  className="result-indicator"
                  size={18}
                  aria-hidden="true"
                />
              </article>
            );
          })}
          <p className="results-disclaimer">
            Similarity scores indicate how closely the indexed content matches
            your query. They are not confidence scores or guarantees of
            correctness.
          </p>
        </div>
      )}
    </section>
  );
}
