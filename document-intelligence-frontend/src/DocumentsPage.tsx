
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  FileText,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Upload,
} from "lucide-react";
import { api, type DocumentRecord } from "./services/api";

interface DocumentsPageProps {
  onAsk: (question: string) => void;
}

export default function DocumentsPage({ onAsk }: DocumentsPageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api.listDocuments();
      setDocuments(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load documents. Check the backend connection.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchDocuments() {
      setError("");

      try {
        const result = await api.listDocuments();

        if (!cancelled) {
          setDocuments(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load documents. Check the backend connection.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchDocuments();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload(file?: File) {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    try {
      await api.uploadDocument(file);
      setNotice(`${file.name} uploaded successfully.`);
      await loadDocuments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The upload failed.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleExtract(id: number) {
    setBusyId(id);
    setError("");
    setNotice("");

    try {
      await api.extractDocument(id);
      setNotice("Text extraction and embedding generation completed.");
      await loadDocuments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Text extraction failed.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleSummarize(id: number) {
    setBusyId(id);
    setError("");
    setNotice("");

    try {
      const result = await api.summarizeDocument(id);
      const summary =
        typeof result.summary === "string" ? result.summary : "";

      setNotice(
        summary
          ? `Summary: ${summary}`
          : "Summarization completed. Refresh the document list to see saved details.",
      );

      await loadDocuments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Summarization failed.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="secondary-page">
      <div className="eyebrow">
        <span className="eyebrow-line" />
        DOCUMENT LIBRARY
      </div>

      <div className="secondary-title-row">
        <div>
          <h1>Every file, in its place.</h1>
          <p>
            Upload PDFs, extract their content, and prepare them for
            intelligent search and question-answering.
          </p>
        </div>

        <button
          className="button button-dark"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <LoaderCircle size={16} className="spin-icon" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        hidden
        onChange={(event) => {
          void handleUpload(event.target.files?.[0]);
        }}
      />

      <div className="document-toolbar">
        <div>
          <span className="eyebrow">YOUR FILES</span>
          <strong>{documents.length} document(s)</strong>
        </div>
        <button
          className="small-outline-button"
          onClick={() => void loadDocuments()}
          disabled={loading}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="api-message api-message-error" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div className="api-message api-message-success" role="status">
          {notice}
        </div>
      )}

      <div className="document-list">
        {loading ? (
          <div className="document-empty">
            <LoaderCircle size={24} className="spin-icon" />
            <strong>Loading your documents...</strong>
          </div>
        ) : documents.length === 0 ? (
          <div className="document-empty">
            <div className="secondary-empty-icon">
              <FileText size={25} />
            </div>
            <h2>Your library starts here.</h2>
            <p>
              Upload a PDF to extract its text, generate a summary,
              and search its contents.
            </p>
            <button
              className="button button-dark"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={16} /> Choose a PDF
            </button>
          </div>
        ) : (
          documents.map((document) => (
            <article className="document-row" key={document.id}>
              <div className="document-file-icon">
                <FileText size={22} />
              </div>

              <div className="document-row-main">
                <strong>{document.fileName}</strong>
                <span>
                  ID {document.id} ·{" "}
                  {document.extractedText?.trim()
                    ? "Text extracted"
                    : "Awaiting extraction"}
                </span>
              </div>

              <div className="document-row-actions">
                <button
                  className="small-outline-button"
                  disabled={busyId === document.id}
                  onClick={() => void handleExtract(document.id)}
                >
                  {busyId === document.id ? (
                    <LoaderCircle size={14} className="spin-icon" />
                  ) : (
                    <FileText size={14} />
                  )}
                  Extract
                </button>

                <button
                  className="small-outline-button"
                  disabled={busyId === document.id}
                  onClick={() => void handleSummarize(document.id)}
                >
                  <Sparkles size={14} />
                  Summarize
                </button>

                <button
                  className="icon-button"
                  title="Ask a question about this document"
                  aria-label={`Ask about ${document.fileName}`}
                  onClick={() =>
                    onAsk(`Summarize the key information in ${document.fileName}.`)
                  }
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
