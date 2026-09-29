import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Play, Send } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";
import Timer from "../components/Timer";
import "./CodeEditor.css";

const languages = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const starterCode = {
  python: 'print("Hello, World!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
};

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

function CodeEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeId } = useParams();
  const questionId = location.state?.problem_id || location.state?.questionId || routeId || 1;
  const [question, setQuestion] = useState(null);
  const [questionError, setQuestionError] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [runResult, setRunResult] = useState("");
  const [submitResult, setSubmitResult] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMachineRun, setIsMachineRun] = useState(false);
  const activeStreamRef = useRef(null);
  const languageRef = useRef(language);

  useEffect(() => {
    let active = true;

    api.get(`/problems/${questionId}`)
      .then((response) => {
        if (!active) return;
        setQuestion(response.data);
        const currentQuestionId = response.data.id ?? response.data.problem_id ?? questionId;
        const savedCode = localStorage.getItem(`code_q${currentQuestionId}_${languageRef.current}`);
        setCode(savedCode ?? starterCode[languageRef.current]);
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.response?.status === 403) {
          navigate("/results");
          return;
        }
        setQuestionError("Unable to load this question.");
      });

    return () => {
      active = false;
      activeStreamRef.current?.close();
    };
  }, [questionId, navigate]);

  useEffect(() => {
    const currentQuestionId = question?.id ?? question?.problem_id;
    if (!currentQuestionId) return undefined;

    const timer = setTimeout(() => {
      localStorage.setItem(`code_q${currentQuestionId}_${language}`, code);
    }, 800);
    return () => clearTimeout(timer);
  }, [code, question, language]);

  useEffect(() => {
    let active = true;

    api.get("/user/gethistory")
      .then((response) => {
        if (!active || !Array.isArray(response.data)) return;
        setUserSubmissions(response.data.filter(
          (submission) => String(submission.problem_id) === String(questionId),
        ));
      })
      .catch(() => {
        if (active) setUserSubmissions([]);
      });

    return () => {
      active = false;
    };
  }, [questionId]);

  const subscribeToSubmission = (submissionId, onResult, onError) => {
    activeStreamRef.current?.close();
    const baseURL = (api.defaults.baseURL || "").replace(/\/$/, "");
    const eventSource = new EventSource(
      `${baseURL}/submission/sse/${submissionId}`,
      { withCredentials: true },
    );
    activeStreamRef.current = eventSource;

    eventSource.addEventListener("result", (event) => {
      eventSource.close();
      activeStreamRef.current = null;
      try {
        onResult(JSON.parse(event.data));
      } catch {
        onError(new Error("The server returned an invalid result."));
      }
    });

    eventSource.onerror = () => {
      eventSource.close();
      activeStreamRef.current = null;
      onError(new Error("Lost connection while waiting for the result."));
    };
  };

  const handleMachineRun = async () => {
    setIsMachineRun(true);
    setOutput("Running test input...");

    try {
      const response = await api.post("/submission/run-system", {
        customTestcase: encodeBase64(customInput),
        problem_id: question?.id ?? questionId,
        event_id: 2,
      });

      subscribeToSubmission(response.data.submission_id, (data) => {
        setOutput(data.user_output || `${data.status || "Error"} : ${data.message || ""}`);
        setIsMachineRun(false);
      }, (error) => {
        setOutput(`Error: ${error.message}`);
        setIsMachineRun(false);
      });
    } catch (requestError) {
      if (requestError.response?.status === 403) {
        navigate("/results");
        return;
      }
      setOutput(`Error: ${requestError.response?.data?.message || requestError.message}`);
      setIsMachineRun(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult("Running your code...");
    setSubmitResult(null);

    try {
      const response = await api.post("/submission/run", {
        code: encodeBase64(code),
        customTestcase: encodeBase64(customInput),
        language,
        problem_id: question?.id ?? questionId,
        event_id: 2,
      });

      subscribeToSubmission(response.data.submission_id, (data) => {
        setRunResult(data.user_output || `${data.status || "Error"} : ${data.message || ""}`);
        setIsRunning(false);
      }, (error) => {
        setRunResult(`Error: ${error.message}`);
        setIsRunning(false);
      });
    } catch (requestError) {
      if (requestError.response?.status === 403) {
        navigate("/results");
        return;
      }
      setRunResult(`Error: ${requestError.response?.data?.message || requestError.message}`);
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await api.post("/submission/submit", {
        code: encodeBase64(code),
        language,
        problem_id: question?.id ?? questionId,
        event_id: 2,
      });

      subscribeToSubmission(response.data.submission_id, (data) => {
        const result = {
          status: data.status || "unknown",
          message: data.message || "",
          failedTestCase: Number.parseInt(data.failed_test_case ?? "0", 10) || 0,
          totalTestCase: Number.parseInt(data.total_test_case ?? "0", 10) || 0,
          score: Number.parseInt(data.score ?? "0", 10) || 0,
        };
        setSubmitResult(result);

        if (result.status.toLowerCase() === "accepted") {
          localStorage.setItem(`solved_${questionId}`, "solved");
        }
        setIsSubmitting(false);
      }, (error) => {
        setSubmitResult({ status: "error", message: error.message, score: 0 });
        setIsSubmitting(false);
      });
    } catch (requestError) {
      if (requestError.response?.status === 403) {
        navigate("/results");
        return;
      }
      setSubmitResult({
        status: "error",
        message: requestError.response?.data?.message || requestError.message,
        score: 0,
      });
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate("/question-hub");
  const title = question?.title || (questionError ? "Question unavailable" : "Loading question...");

  return (
    <PageBackground className="code-page">
      <Navbar />
      <main className="code-main">
        <div className="editor-toolbar">
          <button className="back-question" onClick={handleBack}>
            <ArrowLeft size={15} />
            Back to Questions
          </button>
          <Timer />
        </div>

        <div className="editor-layout">
          <section className="problem-panel">
            <div className="problem-header">
              <div className="problem-title-row">
                <h1>{title}</h1>
                <span className="points-badge">{question?.score ?? question?.points ?? 0} pts</span>
              </div>
            </div>

            <div className="problem-description">
              <p>{question?.description || questionError || "Question details will appear here."}</p>
              {question?.input_format && <p><strong>Input:</strong> {question.input_format}</p>}
              {question?.output_format && <p><strong>Output:</strong> {question.output_format}</p>}
              {question?.constraints && <p><strong>Constraints:</strong> {question.constraints}</p>}
            </div>

            <div className="io-box">
              <div className="io-header">
                <label htmlFor="custom-input">Input</label>
                <button className="run-input-button" onClick={handleMachineRun} disabled={isMachineRun}>
                  <Play size={11} fill="currentColor" />
                  {isMachineRun ? "Running" : "Run"}
                </button>
              </div>
              <textarea
                id="custom-input"
                className="io-content io-input"
                value={customInput}
                onChange={(event) => setCustomInput(event.target.value)}
                placeholder="Enter your input here..."
              />
            </div>

            <div className="io-box output-box">
              <div className="io-header"><span>Output</span></div>
              <pre className="io-content io-output">{output || "Output will be displayed here..."}</pre>
            </div>
          </section>

          <section className="editor-panel">
            <div className="language-tabs">
              {languages.map((item) => (
                <button
                  key={item.value}
                  className={language === item.value ? "language-tab active" : "language-tab"}
                  onClick={() => {
                    languageRef.current = item.value;
                    setLanguage(item.value);
                    const currentQuestionId = question?.id ?? question?.problem_id ?? questionId;
                    setCode(localStorage.getItem(`code_q${currentQuestionId}_${item.value}`) ?? starterCode[item.value]);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="editor-container">
              <div className="line-numbers">
                {code.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}
              </div>
              <textarea
                value={code}
                onChange={(event) => setCode(event.target.value)}
                spellCheck="false"
                placeholder={`Write your ${languages.find((item) => item.value === language)?.label} code here...`}
                className="code-textarea"
              />
            </div>

            <div className="test-status" aria-live="polite">
              {submitResult?.status?.toLowerCase() === "accepted" && <CheckCircle size={17} strokeWidth={2.2} />}
              <span>
                {isRunning
                  ? runResult
                  : submitResult
                    ? `${submitResult.status}${submitResult.score !== undefined ? ` | Score: ${submitResult.score}` : ""}${submitResult.message ? ` | ${submitResult.message}` : ""}`
                    : runResult || "Run your code to test your solution"}
              </span>
            </div>

            {submitResult?.totalTestCase > 0 && (
              <p className="test-summary">
                {submitResult.failedTestCase === 0
                  ? `${submitResult.totalTestCase} / ${submitResult.totalTestCase} test cases passed`
                  : `${Math.max(0, submitResult.failedTestCase - 1)} / ${submitResult.totalTestCase} test cases passed`}
              </p>
            )}

            <div className="editor-actions">
              <button className="run-code-button" onClick={handleRun} disabled={isRunning || isSubmitting}>
                <Play size={14} fill="currentColor" />
                {isRunning ? "Running..." : "Run Code"}
              </button>
              <button className="submit-code-button" onClick={handleSubmit} disabled={isSubmitting || isRunning}>
                <Send size={14} />
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            {userSubmissions.length > 0 && (
              <details className="submission-history">
                <summary>Previous submissions ({userSubmissions.length})</summary>
                {userSubmissions.slice(0, 3).map((submission, index) => (
                  <p key={submission.id ?? `${submission.submitted_at}-${index}`}>
                    {submission.language} · {submission.result} · {submission.submitted_at
                      ? new Date(submission.submitted_at).toLocaleString()
                      : ""}
                  </p>
                ))}
              </details>
            )}
          </section>
        </div>
      </main>
    </PageBackground>
  );
}

export default CodeEditor;