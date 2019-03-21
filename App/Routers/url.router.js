module.exports = app => {
  const urlsInfo = require('../Controllers/url.controller.js')

  app.post('/short_link', urlsInfo.findOrCreate)
  app.get('/:short_link', urlsInfo.redirectOrAnalyze)
}
