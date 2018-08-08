require('dotenv').config();

const request = require('request');
const inc = process.env.NODE_ENV;

function init() {
  const firebase = require("firebase");
  // Required for side-effects
  require("firebase/firestore");
  var config = {
    // Plz Fill
  };
  firebase.initializeApp(config);
  return firebase;
}

const firebase = init();
const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

function getLog() {
  return db.collection("log").orderBy("timestamp", "desc").get().then(log=>{
    return log.docs.map(d=>d.data());
  });
}
getLog().then(d=>console.log(JSON.stringify(d)));

/*
function listenLog(f) {
  let first = true;
  db.collection("log")
    .orderBy("timestamp")
    .onSnapshot(function(snapshot) {
      if (first) {
        first = false;
        return;
      }
      snapshot.docChanges().forEach(function(change) {
        if (change.type === "added") {
          f(change.doc.data());
        }
        if (change.type === "modified") {
        }
        if (change.type === "removed") {
        }
      });
    });
}

function post(text){
  request({
    url: inc,
    method: "POST",
    headers: {'Content-Type':'application/json'},
    json: {
      text,
      username: "BusTracker",
      icon_emoji: ":bus:",
      link_names:	true
    }
  }, (err, res, body) => {
    console.log(err + body);
  });
}

let players = "@wass80 @nonylene @tron @utgwkk";
players = "@wass80";

listenLog(l=>{
  console.log(l);
  if (l.type=="goal") {
    post(`${l.user}が目的地に到着\n${players}`);
  } else if (l.type=="update-goal") {
    post(`${l.stop}が新たな目的地に\n${players}`);
  }
})

var schedule = require('node-schedule');

schedule.scheduleJob('0 0 12 * * *', function(){
    post(`ランチタイム。12:30までゲームを中断する。
移動ルールに則り、訪れたことのない店でランチを食べよ。
12:30以降、ランチを食べ終えたら再開できる。
${players}`);
});
schedule.scheduleJob('0 0 15 * * *', function(){
    post(`休憩タイム。15:30までゲームを中断する。\n
移動ルールに則り、好きな神社または仏閣を1つ訪れよ。
15:30以降、観光を終えたら再開できる。
${players}`);
});
*/