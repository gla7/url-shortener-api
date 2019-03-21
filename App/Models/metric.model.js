const mongoose = require('mongoose')
const UrlInfo = require('./url.model.js')

const MetricSchema = mongoose.Schema({
  time:       String,
  referrer:   String,
  user_agent: String,
  url_info:   { type: mongoose.Schema.Types.ObjectId, ref: 'UrlInfos' }
}, {
  timestamps: true
})

// after save, update the url info so that it has one more visit
MetricSchema.post('save', (metric, next) => {
  UrlInfo.update({ _id: metric.url_info }, { '$push': { 'visits': metric } }, (updateError, urlInfo) => {
    if (updateError) { return next(updateError) }
    next()
  })
})

module.exports = mongoose.model('Metric', MetricSchema)
