import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setQuestionCount,
  toggleTimer,
  toggleCategory,
  toggleSubcategory,
} from '../features/quizConfigSlice.js';

import {
  setTimeRemaining
} from '../features/quizSlice.js';

import {
  categories,
  subcategories,
} from '../data.js';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const quizConfig = useSelector((state) => state.quizConfig);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleStartQuiz = () => {
    if (quizConfig.categories.length === 0) {
      alert('Please select at least one category.');
      return;
    }
    // console.log('Starting quiz with config:', quizConfig);
    
    navigate('/quiz')
  };

  const handleToggleAllSubcategories = (category) => {
    dispatch(toggleAllSubcategories(category));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Quiz Configuration</h1>
          <p className="text-indigo-100">Customize your quiz settings</p>
        </div>

        <div className="p-6">
          {/* Question Count */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">Number of Questions</label>
            <div className="flex items-center">
              <select
                value={quizConfig.questionCount}
                onChange={(e) => dispatch(setQuestionCount(e.target.value))}
                className="block w-32 px-4 py-2 border border-gray-300 rounded-lg"
              >
                {[10, 20, 30, 40, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Timer */}
          {/* <div className="mb-8">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={quizConfig.enableTimer}
                onChange={() => dispatch(toggleTimer())}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2 text-gray-700 font-medium">Enable Timer</span>
            </label>
            {quizConfig.enableTimer && (
              <input
                type="number"
                className="ml-7 w-32 px-4 py-2 border border-gray-300 rounded-lg"
                value={30}
                onChange={(e) => dispatch(setTimeRemaining(e.target.value))}
              />
            )}
          </div> */}

          {/* Categories */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Select Categories</label>
            <div className="relative select-container" ref={dropdownRef}>
              <div
                className="flex justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{quizConfig.categories.length > 0 ? quizConfig.categories.map(capitalize).join(', ') : 'Select categories...'}</span>
                <i className={`fas ${dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-400`} />
              </div>
              {dropdownOpen && (
                <div className="absolute mt-1 bg-white w-full border rounded shadow-md z-10 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => dispatch(toggleCategory(cat))}
                    >
                      <input
                        type="checkbox"
                        checked={quizConfig.categories.includes(cat)}
                        onChange={() => {}}
                        className="form-checkbox h-5 w-5 text-indigo-600 mr-2"
                      />
                      <span>{capitalize(cat)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subcategories */}
          {quizConfig.categories.length > 0 && (
            <div className="space-y-6">
              {quizConfig.categories.map((cat) => (
                <div key={cat} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">{capitalize(cat)} Subcategories</h3>
                    <button
                      onClick={() => handleToggleAllSubcategories(cat)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subcategories[cat].map((sub) => (
                      <label key={sub} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(quizConfig.subcategories[cat] || []).includes(sub)}
                          onChange={() => dispatch(toggleSubcategory({ category: cat, sub }))}
                          className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2 text-gray-600">{sub}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleStartQuiz}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;