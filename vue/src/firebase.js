export function init() {
    const firebase = require("firebase");
    // Required for side-effects
    require("firebase/firestore");
    var config = {
      // Plz Fill
    };
    firebase.initializeApp(config);
    window.db = firebase.firestore();
    window.timestamp = firebase.firestore.FieldValue.serverTimestamp;
}

function addDB(col, doc) {
  window.db.collection(col).add(doc)
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}
export function addLog(doc) {
  let d = {...doc,
    "timestamp": window.timestamp(),
    "user": getUser()
  };
  addDB("log", d);
}
export function getLog() {
  return window.db.collection("log").orderBy("timestamp", "desc").get().then(log=>{
    return log.docs.map(d=>d.data());
  });
}
export function listenLog(f) {
  window.db.collection("log")
    .orderBy("timestamp")
    .onSnapshot(function(snapshot) {
      snapshot.docChanges.forEach(function(change) {
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
export function getUser() {
    return window.localStorage.getItem("user") || "anonymous";
}
export function setUser(u) {
    return window.localStorage.setItem("user", u);
}

export function listenTarget(f) {
  window.db.collection("target").doc("now").get().then((x)=>{
    f(x.data());});
  window.db.collection("target").doc("now")
    .onSnapshot(function(doc) {
      f(doc.data())
    });
}

export function updateTarget(name) {
  window.db.collection("target").doc("now").set({name})
  addLog({type: "update-goal", stop: name})
}

export function listenStatus(f) {
  listenLog(l => {
  window.db.collection("log")
    .orderBy("timestamp")
    .onSnapshot(function(snapshot) {
      snapshot.docChanges.forEach(function(change) {
        if (change.type === "added") {
          let d = change.doc.data();
          if (d.user && d.stop && (d.type=='enter' || d.type=='leave' || d.type=='walk')) {
            f(d.user, {"stop": d.stop});
          }
        }
      })
    });
  });
}

import * as moment from "moment"
export function stringifyLog(l) {
  const d = { ...l,
     time: moment(l.timestamp).format("hh:mm") };
  if (l.type=="enter") {
    return { ...d,
      icon: `mdi-login`,
      title: `${l.user} ${l.stop}発`,
      sub: `${l.way}乗り場から${l.dices.reduce((p,c)=>p+c)}進む`
    };
  } else if (l.type=="leave") {
    return { ...d,
      icon: `mdi-logout`,
      title: `${l.user} ${l.stop}着`,
      sub: `${l.keitou}系統`
    };
  } else if (l.type=="walk") {
    return { ...d,
      icon: `mdi-walk`,
      title: `${l.user} ${l.stop}に歩く`,
      sub: ``
    };
  } else if (l.type=="goal") {
    return { ...d,
      icon: `mdi-cake`,
      title: `${l.user} 目的地に到着`,
      sub: `${l.stop}に到着`
    };
  } else if (l.type=="update-goal") {
    return { ...d,
      icon: `mdi-bullhorn`,
      title: `目的地は${l.stop}に`,
      sub: ``
    };
  }
  return {...d, icon: ``, title: l.type, sub: l}


}