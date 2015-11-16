#!/usr/bin/env node

var fs = require('fs');
var pager = require('default-pager');
var markedMan = require('marked-man');

fs.createReadStream(__dirname + '/README.md').pipe(pager());
