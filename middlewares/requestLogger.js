function requestLogger(req, res, next) {
  const timestamp = new Date().toLocaleString('ru-RU');
  const method = req.method;
  const url = req.url;
  
  console.log(`[${timestamp}] ${method} ${url}`);

  if (Object.keys(req.query).length > 0) {
    console.log('  Query параметры:', req.query);
  }

  if ((method === 'POST' || method === 'PUT') && req.body) {
    console.log('  Тело запроса:', req.body);
  }

  next();
}

module.exports = requestLogger;
