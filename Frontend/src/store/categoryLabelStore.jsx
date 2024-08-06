// src/store/categoryLabelStore.js

import { create } from 'zustand';

const useCategoryStore = create((set, get) => ({
  categories: [
    { label: "운동", value: "EXERCISE" },
    { label: "생활", value: "LIFE" },
    { label: "미용", value: "BEAUTY" },
    { label: "학습", value: "STUDY" },
    { label: "기타", value: "ETC" },
  ],
  getCategoryLabel: (value) => {
    const categories = get().categories;
    const category = categories.find((cat) => cat.value === value);
    return category ? category.label : value;
  },
}));

export default useCategoryStore;
