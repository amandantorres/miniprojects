"use strict"

var hh = 0;
var mm = 0;
var ss = 0;
var ms = 0;


// var temp = 1000;  // quantos milesimos vale um segundo
var temp = 10;  // quantos milesimos vale um segundo

var cron;


function start() {
  cron = setInterval(() => { timer() }, temp);
}

function pause() {
  clearInterval(cron)
}

function stop() {
  document.getElementById('counter').innerText = '00:00:00:00';
  clearInterval(cron);
  hh = 0;
  mm = 0;
  ss = 0;
  ms = 0;
}

function timer() {
  ms++
  if (ms == 100) {
    ms = 0
    ss++;
    if (ss == 60) {
      ss = 0;
      mm++;
      if (mm == 60) {
        mm = 0;
        hh++;
        if (hh > 24) {
          hh = 0;
        }
      }
    }
    // ss++;

    // if (ss == 60) {
    //   ss = 0;
    //   mm++;
    //   if (mm == 60) {
    //     mm = 0;
    //     hh++;
    //     if (hh > 24) {
    //       hh = 0;
    //     }
    //   }
  }
  var format = (hh < 10 ? '0' + hh : hh) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (ss < 10 ? '0' + ss : ss) + ':' + (ms < 10 ? '0' + ms : ms);
  document.getElementById('counter').innerText = format;
}