const mongoose = require('mongoose')

const UrlInfoSchema = mongoose.Schema({
  long_url:   String,
  short_link: String,
  visits:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Metrics' }]
}, {
  timestamps: true
})

// make url info unique per short link and long link and index these items for quicker search
UrlInfoSchema.index({
  short_link: 1,
  long_url: 1
}, {
  unique: true,
})

module.exports = mongoose.model('UrlInfo', UrlInfoSchema)
