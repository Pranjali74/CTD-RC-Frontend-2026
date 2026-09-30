import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Play,
  Send,
  ArrowLeft,
  XCircle,
  CheckCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";

import "./CodeEditor.css";

function CodeEditor() {
  const navigate = useNavigate();
  const location = useLocation();

  const questionId = location.state?.questionId || "Q1";

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [activeTab, setActiveTab] = useState("Description");

  const [showResults, setShowResults] = useState(false);
  const [testsPassed, setTestsPassed] = useState(false);
  const [output, setOutput] = useState("");
  const [runMessage, setRunMessage] = useState("");

  const [submissions, setSubmissions] = useState([]);

  /*
   * Temporary question data.
   * Later this will come from the backend/database.
   */
  const question = {
    id: questionId,
    title: "The Mysterious Number",
    points: 50,

    description:
      "In the ancient city of Numera, a mysterious machine transforms a given number into another number. Nobody knows exactly what happens inside the machine, but a few examples have been recorded. Your task is to study the examples, uncover the hidden pattern, and determine the mysterious output for any given number.",

    inputFormat: "A single integer N.",

    outputFormat:
      "A single integer representing the mysterious output produced by the machine.",

    constraints: "1 ≤ N ≤ 10⁹",

    sampleInput: "100",

    sampleOutput: "10000",

    sampleCases: [
      {
        input: "100",
        output: "10000",
      },
      {
        input: "25",
        output: "625",
      },
      {
        input: "10",
        output: "100",
      },
    ],
  };

  /*
   * Temporary frontend-only output preview.
   *
   * This is NOT real Python execution.
   * It supports simple print("...") / print('...')
   * statements so the UI can show output while
   * the backend execution service is not connected.
   */
  const getPreviewOutput = () => {
    if (!code.trim()) {
      return "";
    }

    if (language !== "Python") {
      return `Run ${language} code will be handled by the backend.`;
    }

    const printMatches = [
      ...code.matchAll(
        /print\s*\(\s*(?:"([^"]*)"|'([^']*)')\s*\)/g
      ),
    ];

    if (printMatches.length > 0) {
      return printMatches
        .map((match) => match[1] ?? match[2])
        .join("\n");
    }

    return "No printable output detected.";
  };

  const handleRun = () => {
    const currentOutput = getPreviewOutput();

    setOutput(currentOutput);
    setShowResults(true);

    /*
     * Temporary UI result.
     * Actual test execution will come from backend.
     */
    if (!code.trim()) {
      setTestsPassed(false);
      setRunMessage("Please write your code first.");
      return;
    }

    if (language === "Python") {
      setTestsPassed(true);
      setRunMessage("Preview execution completed.");
    } else {
      setTestsPassed(false);
      setRunMessage(
        `${language} execution will be connected to the backend.`
      );
    }
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      setShowResults(true);
      setTestsPassed(false);
      setRunMessage("Please write your code before submitting.");
      return;
    }

    const newSubmission = {
      id: Date.now(),
      question: question.title,
      language,
      status: "Pending",
      score: "--",
      code,
      submittedAt: new Date().toLocaleTimeString(),
    };

    setSubmissions((prev) => [newSubmission, ...prev]);

    /*
     * For now we stay on the editor so the
     * Submissions tab can display the new submission.
     *
     * Later this will POST to the backend and
     * then navigate to /submissions.
     */
    setActiveTab("Submissions");
  };

  const handleBack = () => {
    navigate("/question-hub");
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);

    // Clear previous run result when language changes.
    setShowResults(false);
    setOutput("");
    setRunMessage("");
  };

  const renderDescription = () => (
    <>
      <div className="problem-section">
        <h3>Description</h3>

        <p>{question.description}</p>
      </div>

      <div className="problem-section">
        <h3>Input Format</h3>

        <p>{question.inputFormat}</p>
      </div>

      <div className="problem-section">
        <h3>Output Format</h3>

        <p>{question.outputFormat}</p>
      </div>

      <div className="problem-section">
        <h3>Constraints</h3>

        <p>{question.constraints}</p>
      </div>
    </>
  );

  const renderSampleCases = () => (
    <div className="sample-cases-panel">
      <div className="sample-cases-heading">
        <h3>Sample Cases</h3>
        <span>{question.sampleCases.length} examples</span>
      </div>

      {question.sampleCases.map((sample, index) => (
        <div className="sample-case-card" key={index}>
          <div className="sample-case-title">
            Sample Case {index + 1}
          </div>

          <div className="sample-case-grid">
            <div>
              <label>Input</label>
              <pre>{sample.input}</pre>
            </div>

            <div>
              <label>Expected Output</label>
              <pre>{sample.output}</pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSubmissions = () => (
    <div className="submissions-panel">
      <div className="submissions-heading">
        <h3>Your Submissions</h3>

        <span>
          {submissions.length} submission
          {submissions.length === 1 ? "" : "s"}
        </span>
      </div>

      {submissions.length === 0 ? (
        <div className="empty-submissions">
          <p>No submissions yet.</p>
          <span>
            Submit your solution and your submissions will appear here.
          </span>
        </div>
      ) : (
        <div className="submission-list">
          {submissions.map((submission) => (
            <div
              className="submission-item"
              key={submission.id}
            >
              <div>
                <strong>{submission.language}</strong>

                <span>
                  {submission.submittedAt}
                </span>
              </div>

              <div className="submission-result">
                <span
                  className={
                    submission.status === "Accepted"
                      ? "accepted"
                      : "pending"
                  }
                >
                  {submission.status}
                </span>

                <span>
                  {submission.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <PageBackground className="code-page">
      <Navbar />

      <main className="code-main">

        {/* BACK */}
        <button
          className="back-question"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
          Back to Questions
        </button>

        {/* =====================================================
            TOP BAR
        ====================================================== */}
        <div className="editor-topbar">

          <div className="editor-tabs">

            <button
              className={
                activeTab === "Description"
                  ? "editor-tab active"
                  : "editor-tab"
              }
              onClick={() => setActiveTab("Description")}
            >
              Description
            </button>

            <button
              className={
                activeTab === "Sample Case"
                  ? "editor-tab active"
                  : "editor-tab"
              }
              onClick={() => setActiveTab("Sample Case")}
            >
              Sample Case
            </button>

            <button
              className={
                activeTab === "Submissions"
                  ? "editor-tab active"
                  : "editor-tab"
              }
              onClick={() => setActiveTab("Submissions")}
            >
              Submissions
            </button>

          </div>

          {/* REAL LANGUAGE SELECTOR */}
          <div className="language-wrapper">

            <select
              value={language}
              onChange={handleLanguageChange}
              className="language-selector"
            >
              <option value="Python">
                Python
              </option>

              <option value="Java">
                Java
              </option>

              <option value="C++">
                C++
              </option>
            </select>

            <ChevronDown
              className="language-chevron"
              size={15}
            />

          </div>

        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <div className="editor-layout">

          {/* ===================================================
              LEFT PANEL
          ==================================================== */}
          <section className="problem-panel">

            <div className="problem-header">

              <h1>
                {question.title}
              </h1>

              <p className="problem-points">
                Points: {question.points}
              </p>

            </div>

            {/* TAB CONTENT */}
            {activeTab === "Description" &&
              renderDescription()}

            {activeTab === "Sample Case" &&
              renderSampleCases()}

            {activeTab === "Submissions" &&
              renderSubmissions()}

            {/* TEST CASE ONLY ON DESCRIPTION TAB */}
            {activeTab === "Description" && (
              <div className="test-case-panel">

                <div className="test-case-title">
                  Test Case
                </div>

                <div className="test-case-inputs">

                  <div className="test-case-field">
                    <label>Input</label>

                    <div className="test-case-box">
                      {question.sampleInput}
                    </div>
                  </div>

                  <div className="test-case-field">
                    <label>Expected Output</label>

                    <div className="test-case-box">
                      {question.sampleOutput}
                    </div>
                  </div>

                </div>

                <button
                  className="machine-run-button"
                  onClick={handleRun}
                >
                  Machine Run
                </button>

              </div>
            )}

          </section>

          {/* ===================================================
              RIGHT CODE PANEL
          ==================================================== */}
          <section className="editor-panel">

            {/* CODE EDITOR */}
            <div className="editor-container">

              <div className="line-numbers">
                {code.split("\n").map((_, index) => (
                  <span key={index}>
                    {index + 1}
                  </span>
                ))}
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                className="code-textarea"
                placeholder={
                  language === "Python"
                    ? 'print("Hello, World!")'
                    : language === "Java"
                    ? 'System.out.println("Hello, World!");'
                    : '#include <iostream>\nusing namespace std;'
                }
              />

            </div>

            {/* =================================================
                OUTPUT / TEST RESULT
            ================================================== */}
            <div className="test-results-panel">

              <div className="test-result-header">

                <div className="result-status">

                  {showResults && !testsPassed && (
                    <XCircle size={15} />
                  )}

                  {showResults && testsPassed && (
                    <CheckCircle size={15} />
                  )}

                  <span>
                    Status:{" "}
                    <strong
                      className={
                        testsPassed
                          ? "status-success"
                          : "status-error"
                      }
                    >
                      {showResults
                        ? testsPassed
                          ? "accepted"
                          : "wrong"
                        : "not run"}
                    </strong>
                  </span>

                  <span>
                    Score:{" "}
                    <strong>
                      {showResults && testsPassed
                        ? question.points
                        : 0}
                    </strong>
                  </span>

                </div>

                <button
                  className="close-results"
                  onClick={() => setShowResults(false)}
                >
                  Close
                </button>

              </div>

              {/* CURRENT OUTPUT */}
              {showResults && (
                <div className="output-area">

                  <div className="output-heading">
                    Current Output
                  </div>

                  <pre>
                    {output || "No output"}
                  </pre>

                  {runMessage && (
                    <div className="run-message">
                      {runMessage}
                    </div>
                  )}

                  <div className="test-result failed">
                    <span>
                      Test Case 1
                    </span>

                    <span>
                      {testsPassed
                        ? "PASSED"
                        : "FAILED"}
                    </span>
                  </div>

                  <div className="test-result">
                    <span>
                      Test Case 2
                    </span>

                    <span>
                      Not Run
                    </span>
                  </div>

                </div>
              )}

            </div>

            {/* ACTIONS */}
            <div className="editor-actions">

              <button
                className="run-code-button"
                onClick={handleRun}
              >
                <Play
                  size={15}
                  fill="currentColor"
                />
                Run
              </button>

              <button
                className="submit-code-button"
                onClick={handleSubmit}
              >
                <Send size={15} />
                Submit
              </button>

            </div>

          </section>

        </div>

      </main>
    </PageBackground>
  );
}

export default CodeEditor;