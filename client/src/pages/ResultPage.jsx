import React from 'react';
import { useSelector } from 'react-redux';

const ResultPage = ({ score, total, timeTaken, restartQuiz }) => {
  const percentage = Math.round((score / total) * 100);
  const pastResults = useSelector((state) => state.quiz.pastResults);

  // console.log(timeTaken);
  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
      <div className="mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-trophy text-4xl text-green-500"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
        <p className="text-gray-600">Here's how you performed</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-bold text-2xl">{score}</div>
          <div className="text-blue-500 text-sm">Score</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-purple-600 font-bold text-2xl">{score}</div>
          <div className="text-purple-500 text-sm">Correct</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="text-amber-600 font-bold text-2xl">{pastResults[0].timeTaken}</div>
          <div className="text-amber-500 text-sm">Time</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="text-sm text-gray-500 mt-2">{percentage}% Correct</div>
      </div>

      <button
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 mb-8"
        onClick={restartQuiz}
      >
        <i className="fas fa-redo mr-2"></i> Take Another Quiz
      </button>

      <div className="bg-gray-50 p-4 rounded-lg text-left">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Past Results</h3>
        {pastResults.length === 0 ? (
          <p className="text-sm text-gray-500">No past results yet.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {pastResults.map((result, index) => (
              <li key={index} className="p-3 bg-white rounded-md shadow border border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">{result.date}</span>
                  <span className="text-indigo-600 font-semibold">{result.percentage}%</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Score: {result.score}/{result.total}</span>
                  <span>Time: {result.timeTaken}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
