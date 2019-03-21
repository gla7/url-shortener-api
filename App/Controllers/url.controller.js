const mongoose = require('mongoose')
const shortid  = require('js-shortid')
const UrlInfo  = require('../Models/url.model.js')
const Metric   = require('../Models/metric.model.js')

exports.findOrCreate = (req, res) => {
  if (!req.body.long_url) { // long url not provided
    res.json({code: 401, message: "Failed to create URL. Field long_url (string) required."})
  }
  else { // long url provided
    const url = req.body.long_url.replace(/(^\w+:|^)\/\//, '')
    UrlInfo.find({ long_url: url }, (errorInFind, foundData) => {
      if (errorInFind) {
        res.send({code: 500, message: "Some error ocuured while finding the URL short link."})
      } else if (foundData.length === 0) {
        handleCreateUrlInfo(url, req, res)
      } else {
        sendFoundUrlInfo(res, foundData[0], req.headers.host)
      }
    })
  }
}

exports.redirectOrAnalyze = (req, res) => {
  if (req.params.short_link.slice(-1) === '+') { // return analytics
    const short_link = req.params.short_link.substring(0, req.params.short_link.length - 1)
    UrlInfo.find({ short_link }, (errorInFind, foundData) => {
      if (errorInFind) {
        res.send({code: 500, message: "Some error ocuured while finding the URL short link."})
      } else if (foundData.length === 0) {
        res.send({code: 404, message: "No such URL is registered under that short link."})
      } else {
        sendMetricsForUrl(res, foundData[0])
      }
    })
  } else { // redirect to url
    UrlInfo.find({ short_link: req.params.short_link }, (errorInFind, foundData) => {
      if (errorInFind) {
        res.send({code: 500, message: "Some error ocuured while finding the URL short link."})
      } else if (foundData.length === 0) {
        res.send({code: 404, message: "No such URL is registered under that short link."})
      } else {
        newMetric(req.headers, foundData[0]).save((errorInCreate, createdMetric) => {
          handleMetricSave(res, errorInCreate, foundData[0])
        })
      }
    })
  }
}

// helper functions

function handleCreateUrlInfo (url, req, res) {
  const info = new UrlInfo({ long_url: url, short_link: shortid.gen() })
  info.save((errorInCreate, createdData) => {
    if (errorInCreate) {
      console.log(errorInCreate);
      res.send({ code: 500, message: 'Some error ocuured while creating the URL short link.' })
    } else {
      sendCreatedUrlInfo(res, createdData, req.headers.host)
    }
  })
}

function sendCreatedUrlInfo (res, createdData, host) {
  res.json({
    code: 200,
    urlInfo: {
      long_url:   createdData.long_url,
      short_link: `${host}/${createdData.short_link}`
    }
  })
}

function sendFoundUrlInfo (res, foundData, host) {
  res.json({
    code: 200,
    urlInfo: {
      long_url:   foundData.long_url,
      short_link: `${host}/${foundData.short_link}`
    }
  })
}

function sendMetricsForUrl (res, foundData) {
  Metric.find({
    '_id': { $in: foundData.visits.map(item => mongoose.Types.ObjectId(item)) }
  }, (errorInList, metrics) => {
    if (errorInList) { res.send({code: 500, message: "Some error ocuured while finding the metrics."}) }
    res.send({
      response: metrics.map(metric => { return { time: metric.time, referrer: metric.referrer, user_agent: metric.user_agent } })
    })
  })
}

function newMetric (headers, foundData) {
  return new Metric({
    time: (new Date()).toISOString(),
    referrer: headers['referrer'] ? headers['referrer'] : 'none',
    user_agent: headers['user-agent'],
    url_info: foundData
  })
}

function handleMetricSave (res, errorInCreate, foundData) {
  if (errorInCreate) {
    console.log(errorInCreate);
    res.send({code: 500, message: 'Some error ocuured while creating the metric.'})
  } else {
    res.redirect(301, `https://${foundData.long_url}`)
  }
}
