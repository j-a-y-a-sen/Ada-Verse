import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

/* ============================================================
   AI RESPONSE RENDERER
   ============================================================ */

const AIResponse = ({ response }) => {
  if (!response) return null;

  // Safety fallback if backend ever returns plain text
  if (typeof response === "string") {
    return (
      <div className="ai-text-block">
        {response}
      </div>
    );
  }

  const blocks = response.blocks || [];

  return (
    <div className="ai-response">

      {/* Title */}
      {response.title && (
        <h2 className="ai-response-title">
          {response.title}
        </h2>
      )}

      {/* Intro */}
      {response.intro && (
        <div className="ai-intro">
          {response.intro}
        </div>
      )}

      {/* Blocks */}
      {blocks.map((block, index) => (
        <AIBlock
          key={index}
          block={block}
        />
      ))}
    </div>
  );
};


/* ============================================================
   INDIVIDUAL AI BLOCK
   ============================================================ */

const AIBlock = ({ block }) => {

  if (!block) return null;

  switch (block.type) {

    /* --------------------------------------------------------
       TEXT
       -------------------------------------------------------- */

    case "text":
      return (
        <div className="ai-block ai-text-block">

          {block.title && (
            <h3>{block.title}</h3>
          )}

          {block.content && (
            <p>{block.content}</p>
          )}

        </div>
      );


    /* --------------------------------------------------------
       CODE
       -------------------------------------------------------- */

    case "code":
      return (
        <div className="ai-block ai-code-block">

          {block.title && (
            <div className="ai-block-header">
              <span>{block.title}</span>

              {block.language && (
                <span className="code-language">
                  {block.language}
                </span>
              )}
            </div>
          )}

          <pre>
            <code>
              {block.content || ""}
            </code>
          </pre>

        </div>
      );


    /* --------------------------------------------------------
       DIAGRAM
       -------------------------------------------------------- */

    case "diagram":
      return (
        <div className="ai-block ai-diagram-block">

          {block.title && (
            <h3>{block.title}</h3>
          )}

          {block.content && (
            <p className="diagram-description">
              {block.content}
            </p>
          )}

          {block.items && block.items.length > 0 && (
            <div className="diagram-container">

              {block.items.map((item, index) => (
                <React.Fragment key={index}>

                  <div className="diagram-item">
                    {item}
                  </div>

                  {index < block.items.length - 1 && (
                    <div className="diagram-arrow">
                      →
                    </div>
                  )}

                </React.Fragment>
              ))}

            </div>
          )}

        </div>
      );


    /* --------------------------------------------------------
       FLOWCHART
       -------------------------------------------------------- */

    case "flowchart":
      return (
        <div className="ai-block ai-flowchart-block">

          {block.title && (
            <h3>{block.title}</h3>
          )}

          {block.items && block.items.length > 0 && (
            <div className="flowchart-container">

              {block.items.map((item, index) => (
                <React.Fragment key={index}>

                  <div className="flowchart-node">
                    {item}
                  </div>

                  {index < block.items.length - 1 && (
                    <div className="flowchart-arrow">
                      ↓
                    </div>
                  )}

                </React.Fragment>
              ))}

            </div>
          )}

        </div>
      );


    /* --------------------------------------------------------
       TABLE
       -------------------------------------------------------- */

    case "table":
      return (
        <div className="ai-block ai-table-block">

          {block.title && (
            <h3>{block.title}</h3>
          )}

          {block.columns && block.rows && (
            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>

                    {block.columns.map((column, index) => (
                      <th key={index}>
                        {column}
                      </th>
                    ))}

                  </tr>
                </thead>

                <tbody>

                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>

                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>
                          {cell}
                        </td>
                      ))}

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      );


    /* --------------------------------------------------------
       COMPLEXITY
       -------------------------------------------------------- */

    case "complexity":
      return (
        <div className="ai-block ai-complexity-block">

          {block.title && (
            <h3>{block.title}</h3>
          )}

          <div className="complexity-grid">

            <div className="complexity-card">
              <span>Best</span>
              <strong>
                {block.best || "—"}
              </strong>
            </div>

            <div className="complexity-card">
              <span>Average</span>
              <strong>
                {block.average || "—"}
              </strong>
            </div>

            <div className="complexity-card">
              <span>Worst</span>
              <strong>
                {block.worst || "—"}
              </strong>
            </div>

            <div className="complexity-card">
              <span>Space</span>
              <strong>
                {block.space || "—"}
              </strong>
            </div>

          </div>

        </div>
      );


    /* --------------------------------------------------------
       QUIZ
       -------------------------------------------------------- */

    case "quiz":
      return (
        <QuizBlock block={block} />
      );


    /* --------------------------------------------------------
       ANIMATION
       -------------------------------------------------------- */

    case "animation":
      return (
        <div className="ai-block ai-animation-block">

          {block.title && (
            <h3>{block.title}</h3>
          )}

          <div className="animation-placeholder">

            <div className="animation-icon">
              ▶
            </div>

            <strong>
              Interactive Visualization
            </strong>

            <span>
              {block.algorithm
                ? formatAlgorithmName(block.algorithm)
                : "Algorithm"}
            </span>

            <p>
              This algorithm will be connected to the
              ADAverse visualizer.
            </p>

          </div>

        </div>
      );


    /* --------------------------------------------------------
       UNKNOWN BLOCK
       -------------------------------------------------------- */

    default:
      return null;
  }
};


/* ============================================================
   QUIZ COMPONENT
   ============================================================ */

const QuizBlock = ({ block }) => {

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionClick = (option) => {

    if (submitted) return;

    setSelected(option);
  };


  const handleSubmit = () => {

    if (!selected) return;

    setSubmitted(true);
  };


  const isCorrect =
    selected &&
    block.answer &&
    selected === block.answer;


  return (
    <div className="ai-block ai-quiz-block">

      {block.title && (
        <h3>{block.title}</h3>
      )}

      <div className="quiz-question">
        {block.question}
      </div>


      <div className="quiz-options">

        {(block.options || []).map((option, index) => {

          let optionClass = "quiz-option";

          if (selected === option) {
            optionClass += " selected";
          }

          if (submitted && option === block.answer) {
            optionClass += " correct";
          }

          if (
            submitted &&
            selected === option &&
            option !== block.answer
          ) {
            optionClass += " incorrect";
          }

          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => handleOptionClick(option)}
              disabled={submitted}
            >
              <span className="quiz-letter">
                {String.fromCharCode(65 + index)}
              </span>

              <span>
                {option}
              </span>
            </button>
          );
        })}

      </div>


      {!submitted && (
        <button
          className="quiz-submit"
          onClick={handleSubmit}
          disabled={!selected}
        >
          Check Answer
        </button>
      )}


      {submitted && (
        <div
          className={
            isCorrect
              ? "quiz-result correct-result"
              : "quiz-result incorrect-result"
          }
        >

          <strong>
            {isCorrect
              ? "✓ Correct!"
              : "✗ Not quite"}
          </strong>

          {!isCorrect && block.answer && (
            <p>
              Correct answer: <strong>{block.answer}</strong>
            </p>
          )}

          {block.explanation && (
            <p>
              {block.explanation}
            </p>
          )}

        </div>
      )}

    </div>
  );
};


/* ============================================================
   HELPER
   ============================================================ */

const formatAlgorithmName = (name) => {

  if (!name) return "";

  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};


/* ============================================================
   MAIN CHATBOT
   ============================================================ */

const Chatbot = () => {

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      response: {
        response_type: "conversation",
        title: "ADAverse AI",
        intro:
          "Hey! 👋 I'm your ADAverse AI tutor. Ask me anything about algorithms, programming, data analytics, or computer science.",
        blocks: []
      }
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);


  /* ==========================================================
     SCROLL TO BOTTOM
     ========================================================== */

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  };


  useEffect(() => {

    scrollToBottom();

  }, [messages]);


  /* ==========================================================
     SEND MESSAGE
     ========================================================== */

  const handleSendMessage = async () => {

    const userText = input.trim();

    if (!userText || loading) {
      return;
    }


    /* --------------------------------------------------------
       Add user message immediately
       -------------------------------------------------------- */

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: userText
    };


    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    setInput("");
    setLoading(true);


    try {

      /* ------------------------------------------------------
         Build conversation history
         ------------------------------------------------------ */

      const history = messages
        .slice(-10)
        .map((message) => {

          if (message.type === "user") {

            return {
              role: "user",
              content: message.text
            };

          }

          if (message.type === "bot") {

            return {
              role: "assistant",
              content: JSON.stringify(
                message.response
              )
            };

          }

          return null;

        })
        .filter(Boolean);


      /* ------------------------------------------------------
         Send to Django
         ------------------------------------------------------ */

      const response = await fetch(
        "http://localhost:8000/api/chat/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: userText,
            history: history
          })
        }
      );


      const data = await response.json();


      /* ------------------------------------------------------
         Backend error
         ------------------------------------------------------ */

      if (!response.ok) {

        throw new Error(
          data.error ||
          "Something went wrong."
        );

      }


      /* ------------------------------------------------------
         Structured AI response
         ------------------------------------------------------ */

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        response: data.response
      };


      setMessages((prev) => [
        ...prev,
        botMessage
      ]);

    }

    catch (error) {

      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        response: {
          response_type: "conversation",
          title: "Something went wrong",
          intro: error.message,
          blocks: []
        }
      };


      setMessages((prev) => [
        ...prev,
        errorMessage
      ]);

    }

    finally {

      setLoading(false);

    }
  };


  /* ==========================================================
     ENTER KEY
     ========================================================== */

  const handleKeyPress = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      handleSendMessage();
    }
  };


  /* ==========================================================
     UI
     ========================================================== */

  return (

    <div className="chatbot-container">


      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="chatbot-header">

        <div>

          <h2>
            ADAverse AI
          </h2>

          <span className="ai-status">
            ● Online
          </span>

        </div>

      </div>


      {/* ======================================================
          MESSAGES
          ====================================================== */}

      <div className="chatbot-messages">

        {messages.map((message) => (

          <div
            key={message.id}
            className={`message ${message.type}`}
          >

            <div className="message-content">

              {message.type === "user" ? (

                <div className="user-message-text">
                  {message.text}
                </div>

              ) : (

                <AIResponse
                  response={message.response}
                />

              )}

            </div>

          </div>

        ))}


        {/* ====================================================
            TYPING INDICATOR
            ==================================================== */}

        {loading && (

          <div className="message bot">

            <div className="message-content">

              <div className="ai-thinking">

                <span></span>
                <span></span>
                <span></span>

                <label>
                  ADAverse AI is thinking...
                </label>

              </div>

            </div>

          </div>

        )}


        <div ref={messagesEndRef} />

      </div>


      {/* ======================================================
          INPUT
          ====================================================== */}

      <div className="chatbot-input-area">

        <textarea
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyPress}
          placeholder="Ask ADAverse AI anything..."
          disabled={loading}
          rows="3"
        />

        <button
          onClick={handleSendMessage}
          disabled={
            loading ||
            !input.trim()
          }
        >

          {loading
            ? "Thinking..."
            : "Send"}

        </button>

      </div>

    </div>

  );
};


export default Chatbot;