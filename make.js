// Node JS

const fs = require('fs');
const minify = require("babel-minify");
const minifed = minify(fs.readFileSync('./rng-tool.js', 'utf8')).code

fs.writeFileSync("rng-tool.min.js", minifed);
fs.writeFileSync("bookmarklet.html", `<a href="javascript:${encodeURIComponent(minifed)}">Blooket RNG Tool</a>`);