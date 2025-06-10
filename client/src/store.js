import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './features/quizSlice.js';
import quizConfigReducer  from './features/quizConfigSlice.js';

const store = configureStore({
  reducer: {
    quiz: quizReducer,
    quizConfig: quizConfigReducer,
  },
});

export default store;
