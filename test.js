var test = require('tape')
var jsonComposeStream = require('./')
var from = require('from2')
var concat = require('concat-stream')

test('json-compose-stream', function (t) {
  t.plan(1)

  var stream = jsonComposeStream()

  stream.pipe(concat(function (results) {
    t.deepEqual(JSON.parse(results.toString()), {
      one: 'fish',
      two: 'fish',
      red: 'fish',
      blue: 'fish'
    }, 'outputs valid JSON')
  }))

  from(['fish'])
    .pipe(stream.createSetStream('one'))

  stream.set('two', 'fish')

  stream.set({
    red: 'fish',
    blue: 'fish'
  })
})

test('streams and values', function (t) {
  t.plan(1)

  var stream = jsonComposeStream()

  stream.pipe(concat(function (results) {
    t.deepEqual(JSON.parse(results), {
      alpha: 'abcdefghijklmnopqrstuvwxyz',
      numeric: '0123456789',
      el: 'duderino'
    }, 'queues streams and values properly to ensure valid JSON output')
  }))

  fromString('abcdefghijklmnopqrstuvwxyz').pipe(stream.createSetStream('alpha'))
  fromString('0123456789').pipe(stream.createSetStream('numeric'))
  stream.set({el: 'duderino'})
})

test('do not end if options.end equals false', function (t) {
  t.plan(1)

  var stream = jsonComposeStream({end: false})

  stream.on('finish', t.ok.bind(t, true))
  stream.set('test', 'end')
  stream.end()
})

function fromString (string) {
  return from(function (size, next) {
    if (string.length <= 0) return this.push(null)

    var chunk = string.slice(0, 1)
    string = string.slice(1)

    next(null, chunk)
  })
}
