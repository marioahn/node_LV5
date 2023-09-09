export default function (err, req, res, next) {
  console.error(err);
  if (err.name === 'ValidationError') { // joi의 validationError
    return res.status(412).json({ errorMessage: err.details[0].message })
  };

  if (err.message === '댓글이 존재하지 않습니다') {
    return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다.' })
  }
  
  if (err.message === '댓글의 수정 권한이 없습니다') {
    return res.status(403).json({ errorMessage: '댓글의 수정 권한이 없습니다' })
  }

  res.status(500).json({ errorMessage: '서버 내부 에러가 발생했습니다.' });
}
