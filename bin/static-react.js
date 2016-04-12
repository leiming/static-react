#!/usr/bin/env node

var babelConfig = {
  presets: [
    'es2015',
    'stage-0',
    'react'
  ]
}

var React = require('react')
var ReactDOMServer = require('react-dom/server')
var path = require('path')
var program = require('commander')
var dir = process.cwd()
var version = '3.2.1'

program
  .version(version)
  .option('[component]', 'Root React component')
  .option('-p, --props [props]', 'Props')
  .option('-b, --babel [babel]', 'BabelConfig')
  .option('--no-doctype', 'Remove <!DOCTYPE html> from beginning of string')
  .parse(process.argv)

if (program.babel) {
  Object.assign(babelConfig, require(path.join(dir, program.babel)))
}

require('babel-register')(babelConfig)

if (program.args.length) {
  var html
  var props = {}
  var file = path.join(dir, program.args[0])
  var Component = require(file)

  if (!Component) {
    console.error('No component found at', file)
    return false
  }

  if (Component.default) {
    Component = Component.default
  }

  if (program.props) {
    props = require(path.join(dir, program.props))
  }

  html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Component, props)
  )

  if (program.doctype) {
    html = '<!DOCTYPE html>' + html
  }

  process.stdout.write(html)
}

