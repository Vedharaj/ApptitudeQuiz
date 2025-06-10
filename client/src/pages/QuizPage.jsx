import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuestions,
  selectAnswer,
  nextQuestion,
  prevQuestion,
  completeQuiz,
  setTimeRemaining,
  restartQuiz,
} from '../features/quizSlice.js';
import ResultPage from './ResultPage.jsx';


const QuizPage = () => {
  const dispatch = useDispatch();
  const quizConfig = useSelector((state) => state.quizConfig);

  const {
    questions,
    currentQuestionIndex,
    selectedAnswers,
    quizCompleted,
    score,
    timeRemaining,
    quizStartTime,
    status,
  } = useSelector((state) => state.quiz);

  // Fetch questions
  useEffect(() => {
    dispatch(fetchQuestions(quizConfig));
  }, [dispatch, quizConfig]);

  // Timer logic
  useEffect(() => {
  if (quizConfig.enableTimer) {
    const interval = setInterval(() => {
      dispatch(setTimeRemaining()); // no payload
    }, 1000);
    return () => clearInterval(interval);
  }
  }, [dispatch, quizConfig.enableTimer]);


  useEffect(() => {
    if (timeRemaining <= 0) {
      dispatch(completeQuiz());
    }
  }, [timeRemaining, dispatch]);

  const handleSelectAnswer = (index) => {
    if (quizCompleted) return;
    dispatch(selectAnswer({ index: currentQuestionIndex, answerIndex: index }));
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestionIndex] === null) {
      alert('Please select an answer before proceeding.');
      return;
    }
    if (currentQuestionIndex === questions.length - 1) {
      dispatch(completeQuiz());
    } else {
      dispatch(nextQuestion());
    }
  };

  const handlePrev = () => {
    dispatch(prevQuestion());
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error loading questions</p>;

  if (quizCompleted) {
    let timeTaken; 
    if (quizStartTime) {
      const elapsedTime = Date.now() - quizStartTime; // milliseconds
      if (elapsedTime < 60000) { // less than 60 seconds
        timeTaken = Math.floor(elapsedTime / 1000) + "s";
      } else if (elapsedTime < 3600000) { // less than 60 minutes
        timeTaken = Math.floor(elapsedTime / 60000) + "m " + Math.floor((elapsedTime % 60000) / 1000) + "s";
      } else { // 1 hour or more
        timeTaken = Math.floor(elapsedTime / 3600000) + "h " + Math.floor((elapsedTime % 3600000) / 60000) + "m " + Math.floor((elapsedTime % 60000) / 1000) + "s";
      }
    }
    return (
      <ResultPage
        score={score}
        total={questions.length}
        timeTaken={timeTaken}
        restartQuiz={() => dispatch(restartQuiz({ timerEnabled: quizConfig.enableTimer, timerDuration: quizConfig.totalTime }))}
      />
    );
  }

  const question = questions[currentQuestionIndex];
  const percentage = (currentQuestionIndex / questions.length) * 100;
  const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
  const seconds = String(timeRemaining % 60).padStart(2, '0');


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center bg-indigo-600 text-white px-4 py-3 rounded-t-xl">
        <h1 className="font-bold text-xl">Quiz App</h1>
        {quizConfig.enableTimer && (
          <div className={`px-3 py-1 rounded-full font-semibold ${timeRemaining <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-white text-indigo-600'}`}>
            <i className="fas fa-clock mr-2"></i>{minutes}:{seconds}
          </div>
        )}
      </div>

      <div className="h-1.5 bg-gray-200">
        <div className="bg-indigo-500 h-full" style={{ width: `${percentage}%` }}></div>
      </div>

      <div className="p-4">
        <div className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</div>
        <h2 className="text-xl font-semibold mb-6">{question?.question}</h2>

        <div className="space-y-3">
          {question?.options?.map((option, index) => {
            let optionClasses = "option border-2 rounded-lg p-4 cursor-pointer transition-all duration-200";
            if (selectedAnswers[currentQuestionIndex] === index) optionClasses += " border-blue-500 bg-blue-50";
            return (
              <div key={index} className={optionClasses} onClick={() => handleSelectAnswer(index)}>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center">
                    <span className="text-xs font-medium">{String.fromCharCode(65 + index)}</span>
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-8">
          <button className={`px-4 py-2 rounded-lg font-medium ${currentQuestionIndex === 0 ? 'bg-gray-200 text-gray-700 opacity-50' : 'bg-gray-200 text-gray-700'}`} onClick={handlePrev} disabled={currentQuestionIndex === 0}>
            <i className="fas fa-arrow-left mr-2"></i>Previous
          </button>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700" onClick={handleNext}>
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'} <i className={`fas ${currentQuestionIndex === questions.length - 1 ? 'fa-paper-plane' : 'fa-arrow-right'} ml-2`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
