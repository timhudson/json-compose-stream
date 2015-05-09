var jsonComposeStream = require('./')
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
