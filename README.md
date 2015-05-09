# json-compose-stream

Compose valid JSON output from any number of streams or values

[![build status](http://img.shields.io/travis/timhudson/json-compose-stream.svg?style=flat)](http://travis-ci.org/timhudson/json-compose-stream)

## Example

``` js
var jsonComposeStream = require('json-compose-stream')
var hyperquest = require('hyperquest')
var xmlNodes = require('xml-nodes')

var jsonStream = jsonComposeStream()

jsonStream.pipe(process.stdout)

hyperquest('http://en.wikipedia.org/wiki/Pug')
  .pipe(xmlNodes('title'))
  .pipe(jsonStream.createSetStream('title'))

jsonStream.set('3', 'Pug - Wikipedia, the free encyclopedia')

jsonStream.set({
  href: 'http://en.wikipedia.org/wiki/Pug',
  image: 'http://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Mops-duke-mopszucht-vom-maegdebrunnen.jpg/220px-Mops-duke-mopszucht-vom-maegdebrunnen.jpg'
})
```

## Usage

### `var s = jsonComposeStream()`

### `s.set(obj)`

Provide an object to set multiple values at once. Returns `s` to allow chaining.

``` js
s.set({one: 'fish', two: 'fish'})
```

### `s.set(key=string, value=string)`

Provide a key/value pair to set a single value. Returns `s` to allow chaining.

``` js
s.set('red', 'fish')
```

### `s.createSetStream(key=string)`

Returns a writeable stream that should be used to write the value of `key`.

``` js
descriptionStream
  .pipe(s.createSetStream('description'))
```

## License

MIT
