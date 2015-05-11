var passthrough = require('readable-stream/passthrough')
var through = require('through2')
var isStream = require('isstream')
var eos = require('end-of-stream')

module.exports = function (options) {
  options = options || {}

  var stream = through()
  var queue = []
  var hasSet = false
  var processing = false

  stream.end = stream.end.bind(stream, '}')

  stream.set = function (key, value) {
    var obj = key

    if (typeof key === 'string') {
      obj = {}
      obj[key] = value
    }

    Object.keys(obj).forEach(function (key) {
      queue.push([key, obj[key]])
    })

    if (!processing) processQueue()

    return stream
  }

  stream.createSetStream = function (key) {
    var writeStream = passthrough()

    writeStream.cork()

    queue.push([key, writeStream])

    if (!processing) processQueue()

    return writeStream
  }

  function processQueue () {
    processing = true

    var item = queue.shift()
    var key = item[0]
    var value = item[1]

    if (hasSet) {
      stream.push(',')
    } else {
      stream.push('{')
      hasSet = true
    }

    stream.push('"' + key + '":')

    if (isStream(value)) {
      stream.push('"')

      eos(value, function (err) {
        if (err) stream.emit('error', err)
        stream.push('"')
        done()
      })

      value.pipe(through(function (chunk, end, callback) {
        stream.push(chunk)
        callback()
      }))

      value.uncork()
    } else {
      stream.push(JSON.stringify(value))
      done()
    }

    function done () {
      if (queue.length) {
        processQueue()
      } else {
        processing = false
        if (options.end !== false) stream.end()
      }
    }
  }

  return stream
}
