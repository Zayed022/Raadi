// utils/storage.js

export const getLocalData = (key, defaultValue) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  };
  
  export const setLocalData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };