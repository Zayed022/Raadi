// utils/session.js
export const getSessionId = () => {
    let sessionId = localStorage.getItem("sessionId");
  
    if (!sessionId) {
      sessionId = crypto.randomUUID(); // 🔥 unique per user
      localStorage.setItem("sessionId", sessionId);
    }
  
    return sessionId;
  };