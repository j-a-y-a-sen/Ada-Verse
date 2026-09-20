import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";

// ============================================================
// VISUALIZER ALGORITHM ID
// ============================================================

function getVisualizerAlgorithmId(name) {
  if (!name) {
    return null;
  }

  const normalized = String(name)
    .toLowerCase()
    .trim()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");

  const aliases = {
    "bubble-sort": "bubble-sort",
    bubblesort: "bubble-sort",

    "selection-sort": "selection-sort",
    selectionsort: "selection-sort",

    "insertion-sort": "insertion-sort",
    insertionsort: "insertion-sort",

    "merge-sort": "merge-sort",
    mergesort: "merge-sort",

    "quick-sort": "quick-sort",
    quicksort: "quick-sort",

    "heap-sort": "heap-sort",
    heapsort: "heap-sort",

    "binary-search": "binary-search",
    binarysearch: "binary-search",

    "linear-search": "linear-search",
    linearsearch: "linear-search",

    "optimal-merge": "optimal-merge",

    "prim-mst": "prim-mst",
    prim: "prim-mst",
    "prims-algorithm": "prim-mst",

    knapsack: "knapsack",
    "0-1-knapsack": "knapsack",

    multistage: "multistage",
    "multi-stage": "multistage",

    "graph-coloring": "graph-coloring",
    graphcoloring: "graph-coloring",

    tsp: "tsp",
    "travelling-salesman": "tsp",
    "traveling-salesman": "tsp",

    bfs: "bfs",
    "breadth-first-search": "bfs",

    dfs: "dfs",
    "depth-first-search": "dfs",

    bst: "bst",
    "binary-search-tree": "bst",
  };

  return aliases[normalized] || null;
}

// ============================================================
// DISPLAY NAME
// ============================================================

function formatAlgorithmName(name) {
  if (!name) {
    return "Algorithm";
  }

  return String(name)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// ============================================================
// COMPACT HISTORY TEXT
// ============================================================

function responseToHistoryText(response) {
  if (!response) {
    return "";
  }

  if (typeof response === "string") {
    return response;
  }

  const parts = [];

  if (response.title) {
    parts.push(`Title: ${response.title}`);
  }

  if (response.intro) {
    parts.push(response.intro);
  }

  if (Array.isArray(response.blocks)) {
    response.blocks.forEach((block) => {
      if (!block) {
        return;
      }

      if (block.title) {
        parts.push(block.title);
      }

      if (block.content) {
        parts.push(block.content);
      }

      if (block.question) {
        parts.push(`Question: ${block.question}`);
      }

      if (Array.isArray(block.items)) {
        parts.push(block.items.join(" | "));
      }

      if (Array.isArray(block.rows)) {
        block.rows.forEach((row) => {
          if (Array.isArray(row)) {
            parts.push(row.join(" | "));
          }
        });
      }

      if (block.algorithm) {
        parts.push(`Algorithm: ${block.algorithm}`);
      }
    });
  }

  return parts.join("\n");
}

// ============================================================
// QUIZ BLOCK
// ============================================================

function QuizBlock({ block }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const options = Array.isArray(block.options)
    ? block.options
    : [];

  const correctAnswer = block.answer || "";

  const submitAnswer = () => {
    if (selected !== null) {
      setSubmitted(true);
    }
  };

  return (
    <div className="ai-quiz-block">
      <div className="ai-block-heading">
        <span>🧠</span>
        <span>{block.title || "Quick Quiz"}</span>
      </div>

      <div className="ai-quiz-question">
        {block.question || "Choose the correct answer."}
      </div>

      <div className="ai-quiz-options">
        {options.map((option, index) => {
          const isSelected = selected === index;

          const isCorrect =
            submitted &&
            option.trim().toLowerCase() ===
              correctAnswer.trim().toLowerCase();

          const isWrong =
            submitted &&
            isSelected &&
            !isCorrect;

          let className = "ai-quiz-option";

          if (isSelected) {
            className += " selected";
          }

          if (isCorrect) {
            className += " correct";
          }

          if (isWrong) {
            className += " wrong";
          }

          return (
            <button
              key={index}
              type="button"
              className={className}
              onClick={() => {
                if (!submitted) {
                  setSelected(index);
                }
              }}
            >
              <span className="ai-quiz-letter">
                {String.fromCharCode(65 + index)}
              </span>

              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          type="button"
          className="ai-quiz-submit"
          onClick={submitAnswer}
          disabled={selected === null}
        >
          Check Answer
        </button>
      )}

      {submitted && (
        <div className="ai-quiz-feedback">
          {selected !== null &&
          options[selected]?.trim().toLowerCase() ===
            correctAnswer.trim().toLowerCase() ? (
            <>
              <strong>✅ Correct!</strong>

              {block.explanation && (
                <p>{block.explanation}</p>
              )}
            </>
          ) : (
            <>
              <strong>❌ Not quite.</strong>

              <p>
                Correct answer:{" "}
                <strong>{correctAnswer}</strong>
              </p>

              {block.explanation && (
                <p>{block.explanation}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// AI BLOCK
// ============================================================

function AIBlock({ block, navigate }) {
  if (!block) {
    return null;
  }

  const type = block.type || "text";

  // ----------------------------------------------------------
  // TEXT
  // ----------------------------------------------------------

  if (type === "text") {
    return (
      <div className="ai-text-block">
        {block.title && (
          <div className="ai-block-heading">
            <span>💡</span>
            <span>{block.title}</span>
          </div>
        )}

        {block.content && (
          <p>{block.content}</p>
        )}

        {Array.isArray(block.items) &&
          block.items.length > 0 && (
            <ul>
              {block.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
      </div>
    );
  }

  // ----------------------------------------------------------
  // CODE
  // ----------------------------------------------------------

  if (type === "code") {
    return (
      <div className="ai-code-block">
        {block.title && (
          <div className="ai-block-heading">
            <span>💻</span>
            <span>{block.title}</span>
          </div>
        )}

        <pre>
          <code>{block.content || ""}</code>
        </pre>
      </div>
    );
  }

  // ----------------------------------------------------------
  // DIAGRAM
  // ----------------------------------------------------------

  if (type === "diagram") {
    return (
      <div className="ai-diagram-block">
        {block.title && (
          <div className="ai-block-heading">
            <span>🔷</span>
            <span>{block.title}</span>
          </div>
        )}

        <pre className="ai-diagram">
          {block.content || ""}
        </pre>
      </div>
    );
  }

  // ----------------------------------------------------------
  // FLOWCHART
  // ----------------------------------------------------------

  if (type === "flowchart") {
    return (
      <div className="ai-flowchart-block">
        {block.title && (
          <div className="ai-block-heading">
            <span>🔀</span>
            <span>{block.title}</span>
          </div>
        )}

        <pre className="ai-flowchart">
          {block.content || ""}
        </pre>
      </div>
    );
  }

  // ----------------------------------------------------------
  // TABLE
  // ----------------------------------------------------------

  if (type === "table") {
    const columns = Array.isArray(block.columns)
      ? block.columns
      : [];

    const rows = Array.isArray(block.rows)
      ? block.rows
      : [];

    return (
      <div className="ai-table-block">
        {block.title && (
          <div className="ai-block-heading">
            <span>📊</span>
            <span>{block.title}</span>
          </div>
        )}

        <div className="ai-table-wrapper">
          <table>
            {columns.length > 0 && (
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.isArray(row) &&
                    row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                        {cell}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // COMPLEXITY
  // ----------------------------------------------------------

  if (type === "complexity") {
    return (
      <div className="ai-complexity-block">
        {block.title && (
          <div className="ai-block-heading">
            <span>📈</span>
            <span>{block.title}</span>
          </div>
        )}

        <div className="ai-complexity-grid">
          <div className="ai-complexity-card">
            <span>Best</span>
            <strong>
              {block.best || "—"}
            </strong>
          </div>

          <div className="ai-complexity-card">
            <span>Average</span>
            <strong>
              {block.average || "—"}
            </strong>
          </div>

          <div className="ai-complexity-card">
            <span>Worst</span>
            <strong>
              {block.worst || "—"}
            </strong>
          </div>

          <div className="ai-complexity-card">
            <span>Space</span>
            <strong>
              {block.space || "—"}
            </strong>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // QUIZ
  // ----------------------------------------------------------

  if (type === "quiz") {
    return <QuizBlock block={block} />;
  }

  // ----------------------------------------------------------
  // ANIMATION / VISUALIZER
  // ----------------------------------------------------------

  if (type === "animation") {
    const algorithmId =
      getVisualizerAlgorithmId(
        block.algorithm
      );

    const algorithmName =
      formatAlgorithmName(
        block.algorithm || block.title
      );

    const openVisualizer = () => {
      if (!algorithmId) {
        navigate("/visualizer");
        return;
      }

      navigate(
        `/visualizer?algo=${encodeURIComponent(
          algorithmId
        )}`
      );
    };

    return (
      <div className="ai-animation-block">
        {block.title && (
          <div className="ai-block-heading">
            <span>🎬</span>
            <span>{block.title}</span>
          </div>
        )}

        {block.content && (
          <p className="ai-animation-description">
            {block.content}
          </p>
        )}

        <button
          type="button"
          className="ai-visualizer-button"
          onClick={openVisualizer}
        >
          <span className="visualizer-play-icon">
            ▶
          </span>

          <span className="visualizer-button-text">
            <strong>
              Visualize {algorithmName}
            </strong>

            <small>
              Open interactive algorithm visualization
            </small>
          </span>

          <span className="visualizer-arrow">
            →
          </span>
        </button>
      </div>
    );
  }

  return null;
}

// ============================================================
// COMPLETE AI RESPONSE
// ============================================================

function AIResponse({ response, navigate }) {
  if (!response) {
    return null;
  }

  if (typeof response === "string") {
    return (
      <div className="ai-response-text">
        {response}
      </div>
    );
  }

  return (
    <div className="ai-response">
      {response.title && (
        <h2 className="ai-response-title">
          {response.title}
        </h2>
      )}

      {response.intro && (
        <p className="ai-response-intro">
          {response.intro}
        </p>
      )}

      {Array.isArray(response.blocks) &&
        response.blocks.map(
          (block, index) => (
            <AIBlock
              key={index}
              block={block}
              navigate={navigate}
            />
          )
        )}
    </div>
  );
}

// ============================================================
// CHATBOT
// ============================================================

function Chatbot() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // SEND MESSAGE
  // ----------------------------------------------------------

  const sendMessage = async () => {
    const trimmed = input.trim();

    if (!trimmed || loading) {
      return;
    }

    setError("");

    const userMessage = {
      type: "user",
      content: trimmed,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      // ------------------------------------------------------
      // COMPACT HISTORY
      // ------------------------------------------------------

      const history = messages
        .slice(-4)
        .map((message) => {
          if (message.type === "user") {
            return {
              role: "user",
              content: message.content,
            };
          }

          return {
            role: "assistant",
            content:
              responseToHistoryText(
                message.response
              ),
          };
        });

      // ------------------------------------------------------
      // CURRENT PAGE CONTEXT
      // ------------------------------------------------------

      const context = {
        page: window.location.pathname,
        query: window.location.search,
      };

      // ------------------------------------------------------
      // API REQUEST
      // ------------------------------------------------------

      const response = await fetch(
        "http://localhost:8000/api/chat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmed,
            history,
            context,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Something went wrong while contacting the AI."
        );
      }

      if (!data.response) {
        throw new Error(
          "The AI returned an empty response."
        );
      }

      // ------------------------------------------------------
      // ADD AI MESSAGE
      // ------------------------------------------------------

      setMessages((previous) => [
        ...previous,
        {
          type: "bot",
          response: data.response,
        },
      ]);
    } catch (err) {
      console.error("AI ERROR:", err);

      setError(
        err.message ||
          "Unable to connect to ADAverse AI."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // ENTER KEY
  // ----------------------------------------------------------

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // ----------------------------------------------------------
  // SUGGESTIONS
  // ----------------------------------------------------------

  const suggestions = useMemo(
    () => [
      "What is bubble sort?",
      "Explain binary search simply",
      "What is Big O notation?",
      "Explain recursion with an example",
    ],
    []
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="chatbot-page">
      <div className="chatbot-shell">

        {/* HEADER */}

        <div className="chatbot-header">
          <div>
            <div className="chatbot-badge">
              ✦ ADAverse AI
            </div>

            <h1>
              Your AI Learning Assistant
            </h1>

            <p>
              Ask anything about ADA,
              programming, data structures,
              data analytics and more.
            </p>
          </div>
        </div>

        {/* SUGGESTIONS */}

        {messages.length === 0 && (
          <div className="chatbot-suggestions">
            {suggestions.map(
              (suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setInput(suggestion)
                  }
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        )}

        {/* MESSAGES */}

        <div className="chatbot-messages">
          {messages.map(
            (message, index) => {
              if (
                message.type === "user"
              ) {
                return (
                  <div
                    key={index}
                    className="message message-user"
                  >
                    <div className="message-bubble">
                      {message.content}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className="message message-bot"
                >
                  <div className="message-avatar">
                    AI
                  </div>

                  <div className="message-bubble bot-bubble">
                    <AIResponse
                      response={
                        message.response
                      }
                      navigate={navigate}
                    />
                  </div>
                </div>
              );
            }
          )}

          {/* LOADING */}

          {loading && (
            <div className="message message-bot">
              <div className="message-avatar">
                AI
              </div>

              <div className="message-bubble bot-bubble">
                <div className="ai-loading">
                  <span></span>
                  <span></span>
                  <span></span>

                  <span className="ai-loading-text">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="ai-error">
              <strong>
                AI connection problem
              </strong>

              <span>{error}</span>
            </div>
          )}
        </div>

        {/* INPUT */}

        <div className="chatbot-input-area">
          <textarea
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask ADAverse AI anything..."
            rows={1}
            disabled={loading}
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={
              loading ||
              !input.trim()
            }
            className="chatbot-send-button"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        {/* FOOTER */}

        <div className="chatbot-footer">
          ADAverse AI can make mistakes.
          Verify important information.
        </div>
      </div>
    </div>
  );
}

export default Chatbot;