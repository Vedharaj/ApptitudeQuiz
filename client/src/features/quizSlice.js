import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async (quizSettings, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/questions', quizSettings);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [],
    score: 0,
    quizCompleted: false,
    timeRemaining: Infinity,
    quizStartTime: null,
    status: 'idle',
    error: null,
    pastResults: JSON.parse(localStorage.getItem('pastResults')) || [],
  },
  reducers: {
    selectAnswer: (state, action) => {
      const { index, answerIndex } = action.payload;
      state.selectedAnswers[index] = answerIndex;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
      }
    },
    setTimeRemaining: (state, action) => {
      const value = action.payload;
      if (typeof value === 'number' && (value > 0 || value === Infinity)) {
        state.timeRemaining = value;
      }
    },
    decrementTimeRemaining: (state) => {
      if (state.timeRemaining > 0 && state.timeRemaining !== Infinity) {
        state.timeRemaining -= 1;
      }
    },
    completeQuiz: (state) => {
      let correctAnswers = 0;

      state.questions.forEach((q, index) => {
        const selectedIndex = state.selectedAnswers[index];
        if (selectedIndex !== null && selectedIndex !== undefined) {
          if (q.options[selectedIndex] === q.answer[0]) {
            correctAnswers++;
          }
        }
      });

      state.score = correctAnswers;
      state.quizCompleted = true;

      const percentage = state.questions.length > 0
        ? ((correctAnswers / state.questions.length) * 100).toFixed(2)
        : 0;

      let timeTaken;

      if (state.quizStartTime) {
        const elapsedTimeMs = Date.now() - state.quizStartTime;
        if (elapsedTimeMs < 60000) { // less than 1 minute
          timeTaken = Math.floor(elapsedTimeMs / 1000) + "s";
        } else if (elapsedTimeMs < 3600000) { // less than 1 hour
          timeTaken = Math.floor(elapsedTimeMs / 60000) + "m " + Math.floor((elapsedTimeMs % 60000) / 1000) + "s";
        } else { // 1 hour or more
          timeTaken = Math.floor(elapsedTimeMs / 3600000) + "h " + Math.floor((elapsedTimeMs % 3600000) / 60000) + "m " + Math.floor((elapsedTimeMs % 60000) / 1000) + "s";
        }
      }

      // console.log(timeTaken);
      

      const now = new Date();

      const dateStr = now.toDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newResult = {
        date: dateStr,
        score: correctAnswers,
        total: state.questions.length,
        percentage,
        timeTaken,
      };

      state.pastResults = [newResult, ...state.pastResults].slice(0, 10);
      // localStorage.setItem('pastResults', JSON.stringify(state.pastResults));
    },
    restartQuiz: (state, action) => {
      const { timerEnabled, timerDuration } = action.payload || {};
      state.currentQuestionIndex = 0;
      state.selectedAnswers = Array(state.questions.length).fill(null);
      state.score = 0;
      state.quizCompleted = false;
      state.timeRemaining = timerEnabled ? timerDuration : Infinity;
      state.quizStartTime = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
        state.selectedAnswers = Array(action.payload.length).fill(null);
        state.quizStartTime = Date.now();
        state.timeRemaining = Infinity;
        state.quizCompleted = false;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  selectAnswer,
  nextQuestion,
  prevQuestion,
  setTimeRemaining,
  decrementTimeRemaining,
  completeQuiz,
  restartQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;

