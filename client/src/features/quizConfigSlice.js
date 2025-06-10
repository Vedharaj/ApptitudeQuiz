import { createSlice } from '@reduxjs/toolkit';
import { subcategories } from '../data.js'; // Add this import

const initialState = {
  questionCount: '10',
  enableTimer: false,
  categories: [],
  subcategories: {},
};

const quizConfigSlice = createSlice({
  name: 'quizConfig',
  initialState,
  reducers: {
    setQuestionCount: (state, action) => {
      state.questionCount = action.payload;
    },
    toggleTimer: (state) => {
      state.enableTimer = !state.enableTimer;
    },
    toggleCategory: (state, action) => {
      const cat = action.payload;
      if (state.categories.includes(cat)) {
        state.categories = state.categories.filter((c) => c !== cat);
        delete state.subcategories[cat];
      } else {
        state.categories.push(cat);
      }
    },
    toggleSubcategory: (state, action) => {
      const { category, sub } = action.payload;
      const current = new Set(state.subcategories[category] || []);
      if (current.has(sub)) current.delete(sub);
      else current.add(sub);
      state.subcategories[category] = Array.from(current);
    },
    resetConfig: () => initialState,
  },
});

export const {
  setQuestionCount,
  toggleTimer,
  toggleCategory,
  toggleSubcategory,
  toggleAllSubcategories,
  resetConfig,
} = quizConfigSlice.actions;


export default quizConfigSlice.reducer;