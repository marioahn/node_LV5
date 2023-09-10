// __tests__/unit/controllers/posts.controller.unit.spec.js에서 사용
export const isJoiData = (title,content) => {
  
  if (!title || !content) {
    return false
  };

  if (typeof(title) !== String || typeof(content) !== String) {
    return false
  };

  if (title.length === 0 || content.length === 0) {
    return false
  };
  
  return true;

};

