const timer = 60000;
const { start } = require('./app.js')

function loopIt() {
    start();
    console.log("Waiting..", timer);
    setTimeout(loopIt, timer);
  }
  console.log("Scraping..");
  loopIt();