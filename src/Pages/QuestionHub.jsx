import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import "./QuestionHub.css";
import Navbar from "../components/Navbar";

const mockQuestions = [
  {
    id: 1,
    title: "Question 1",
    topic: "Problem",
    status: "available",
  },
  {
    id: 2,
    title: "Question 2",
    topic: "Problem",
    status: "available",
  },
  {
    id: 3,
    title: "Question 3",
    topic: "Problem",
    status: "available",
  },
  {
    id: 4,
    title: "Question 4",
    topic: "Problem",
    status: "available",
  },
];

function QuestionHub() {
  const navigate = useNavigate();

  const handleQuestionClick = (question) => {
    navigate("/code-editor", {
      state: {
        questionId: question.id,
      },
    });
  };

  return (
    <div className="question-hub-page">

      <Navbar />

      {/* Main */}
      <main className="hub-main">

        {/* Heading */}
        <div className="hub-heading">

          <div className="trophy-icon">
            <Trophy size={48} strokeWidth={1.8} />
          </div>

          <div>
            <h1>QUESTION HUB</h1>

            <p>
              Choose a question to start coding
            </p>
          </div>

        </div>

        {/* Question Cards */}
        <div className="question-grid">

          {mockQuestions.map((question, index) => (
            <div
              className="question-card"
              key={question.id}
              onClick={() => handleQuestionClick(question)}
            >

              <div className="question-number">
                Q{index + 1}
              </div>

              <div className="question-topic">
                {question.topic}
              </div>

              <button
                className="solve-button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleQuestionClick(question);
                }}
              >
                Solve
              </button>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}

export default QuestionHub;