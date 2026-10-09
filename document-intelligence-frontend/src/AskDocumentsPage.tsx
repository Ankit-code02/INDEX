
import { useState } from "react";
import {
  ArrowUpRight,
  Bot,
  FileText,
  LoaderCircle,
  MessageSquareText,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { api, type QaResponse } from "./services/api";

const suggestedQuestions = [
  "Summarize the key information in my resume.",
  "What technologies are mentioned in my documents?",
  "What information can I find across my uploaded files?",
];

interface Conversation {
  id: number;
  question: string;
  response?: QaResponse;
  error?: string;
}

export default function AskDocumentsPage() {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  async function askQuestion(value = question) {
    const cleaned = value.trim();
    if (!cleaned || loading) return;

    const id = Date.now();

    setQuestion("");
    setLoading(true);
    setConversation((previous) => [
      ...previous,
      { id, question: cleaned },
    ]);

    try {
      const response = await api.askDocuments(cleaned);

      setConversation((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, response } : item,
        ),
      );
    } catch (err) {
      setConversation((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                error:
                  err instanceof Error
                    ? err.message
                    : "The question could not be answered.",
              }
            : item,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="secondary-page ask-documents-page">
      <div className="eyebrow">
        <span className="eyebrow-line" />
        DOCUMENT INTELLIGENCE
      </div>

      <div className="secondary-title-row ask-heading">
        <div>
          <h1>Ask your documents.</h1>
          <p>
            Ask in plain language. Get answers grounded in relevant content
            retrieved from your uploaded documents.
          </p>
        </div>

        <div className="ask-heading-mark">
          <MessageSquareText size={26} strokeWidth={1.4} />
        </div>
      </div>

      <div className="ask-workspace">
        <aside className="ask-context-panel">
          <span className="eyebrow">YOUR ASSISTANT</span>

          <div className="ask-assistant-mark">
            <Sparkles size={24} />
          </div>

          <h2>Information, in context.</h2>
          <p>
            Ask a question about your uploaded files. INDEX retrieves relevant
            document content and uses it to generate an answer.
          </p>

          <div className="ask-context-divider" />

          <span className="eyebrow">HOW TO GET BETTER ANSWERS</span>

          <ul className="ask-tips">
            <li>Ask a specific question.</li>
            <li>Use natural, everyday language.</li>
            <li>Check the source documents for context.</li>
          </ul>

          <div className="ask-context-note">
            <Bot size={17} />
            <span>
              Answers depend on the content available in your document library.
            </span>
          </div>
        </aside>

        <div className="ask-conversation-panel">
          <div className="ask-conversation-header">
            <div>
              <span className="eyebrow">QUESTION & ANSWER</span>
              <strong>Document assistant</strong>
            </div>
            <span className="ask-status">
              <span />
              READY
            </span>
          </div>

          <div className="ask-messages" aria-live="polite">
            {conversation.length === 0 ? (
              <div className="ask-welcome">
                <div className="ask-welcome-icon">
                  <MessageSquareText size={26} />
                </div>
                <h2>What would you like to know?</h2>
                <p>
                  Start with one of these questions, or write your own below.
                </p>

                <div className="ask-suggestions">
                  {suggestedQuestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void askQuestion(suggestion)}
                      disabled={loading}
                    >
                      <span>{suggestion}</span>
                      <ArrowUpRight size={15} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              conversation.map((item) => (
                <article className="ask-exchange" key={item.id}>
                  <div className="ask-user-message">
                    <div className="ask-avatar ask-user-avatar">
                      <UserRound size={17} />
                    </div>
                    <div className="ask-message-content">
                      <span className="ask-message-label">YOUR QUESTION</span>
                      <p>{item.question}</p>
                    </div>
                  </div>

                  <div className="ask-answer-message">
                    <div className="ask-avatar ask-ai-avatar">
                      <Sparkles size={17} />
                    </div>
                    <div className="ask-message-content">
                      <span className="ask-message-label">INDEX ANSWER</span>

                      {item.response ? (
                        <>
                          <div className="ask-answer-text">
                            {item.response.answer}
                          </div>

                          {item.response.sources?.length > 0 && (
                            <div className="ask-sources">
                              <span className="ask-sources-heading">
                                <FileText size={14} />
                                SOURCE DOCUMENTS
                              </span>

                              {item.response.sources.map((source, index) => (
                                <div
                                  className="ask-source"
                                  key={`${source.documentId}-${index}`}
                                >
                                  <FileText size={16} />
                                  <div>
                                    <strong>{source.fileName}</strong>
                                    <span>
                                      Document ID: {source.documentId}
                                    </span>
                                  </div>
                                  {typeof source.similarity === "number" && (
                                    <span className="ask-source-score">
                                      {(
                                        source.similarity * 100
                                      ).toFixed(1)}
                                      %
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="ask-answer-disclaimer">
                            Review the source documents to verify details
                            and understand their full context.
                          </p>
                        </>
                      ) : item.error ? (
                        <div
                          className="api-message api-message-error"
                          role="alert"
                        >
                          {item.error}
                          <button
                            type="button"
                            className="ask-retry"
                            onClick={() => void askQuestion(item.question)}
                            disabled={loading}
                          >
                            Try again
                          </button>
                        </div>
                      ) : (
                        <div className="ask-thinking">
                          <LoaderCircle
                            size={16}
                            className="spin-icon"
                          />
                          Searching documents and preparing an answer...
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <form
            className="ask-composer"
            onSubmit={(event) => {
              event.preventDefault();
              void askQuestion();
            }}
          >
            <label htmlFor="document-question">YOUR QUESTION</label>
            <div className="ask-composer-input">
              <textarea
                id="document-question"
                rows={2}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask something about your documents..."
                disabled={loading}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    void askQuestion();
                  }
                }}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                aria-label="Send question"
                title="Send question"
              >
                {loading ? (
                  <LoaderCircle size={18} className="spin-icon" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <span className="ask-composer-hint">
              Enter to send · Shift + Enter for a new line
            </span>
          </form>
        </div>
      </div>
    </section>
  );
}
