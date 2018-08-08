<template>
  <v-layout id="cont" fill-height>
    <svg id="map"
         version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
    <defs>
    <svg:style>
      .stop { fill: #666; }
      .target circle { fill: red; }
      .shadow { fill: white;
        font-weight: bold;
        text-shadow:
  black 2px 0px 2px, black -2px 0px 2px,
  black 0px -2px 2px, black -2px 0px 2px,
  black 2px 2px 2px, black -2px 2px 2px,
  black 2px -2px 2px, black -2px -2px 2px,
  black 1px 2px 2px, black -1px 2px 2px,
  black 1px -2px 2px, black -1px -2px 2px,
  black 2px 1px 2px, black -2px 1px 2px,
  black 2px -1px 2px, black -2px -1px 2px,
  black 1px 1px 2px, black -1px 1px 2px,
  black 1px -1px 2px, black -1px -1px 2px;}
    </svg:style>
    </defs>
    </svg>
  </v-layout>
</template>

<script>
import {getUser, listenStatus, listenTarget} from '@/firebase.js'
import * as d3 from 'd3';
import {bus, mainstop} from "../bus/bus.js"
const busdata = Object.keys(bus).map(name=>({...bus[name], name}));
/*
console.log(Math.max(...Object.keys(bus).map(k=>bus[k].lat)))
console.log(Math.min(...Object.keys(bus).map(k=>bus[k].lat)))
console.log(Math.max(...Object.keys(bus).map(k=>bus[k].lng)))
console.log(Math.min(...Object.keys(bus).map(k=>bus[k].lng)))
*/

function setupMap() {
  const d3obj = {};
  d3obj.svg = d3.select("#map");
  const cont = document.getElementById("cont");
  d3obj.width = cont.clientWidth;
  d3obj.height = cont.clientHeight;
  d3obj.svg.attr("width", d3obj.width)
           .attr("height", d3obj.height);
  d3obj.map = d3obj.svg.append("g");
  d3obj.xScale = d3.scaleLinear()
                 .domain([135.6559859239,135.7957962])
                 .range([10,d3obj.width-10]);
  d3obj.yScale = d3.scaleLinear()
                 .domain([34.90591912,35.07414387])
                 .range([d3obj.height-10,10]);
  d3obj.stops = d3obj.map.append("g").attr("class", "stops")
  d3obj.stops.selectAll(".stop")
     .data(busdata)
     .enter()
     .append("circle").attr("class", "stop")
     .attr("r", 2)
     .attr("cx", d=>d3obj.xScale(d.lng))
     .attr("cy", d=>d3obj.yScale(d.lat));
  d3obj.players = d3obj.map.append("g").attr("class", "players");
  d3obj.target = d3obj.map.append("g").attr("class", "target");
  d3obj.svg.call(d3.zoom().
    scaleExtent([1 / 2, 12]).
    on("zoom", () =>
    { 
      let t = d3.event.transform;
      d3obj.map.attr("transform", t);
      d3obj.players.selectAll(".player text").attr("transform", "scale(" + 1/t.k + ")");
      d3obj.target.selectAll(".target text").attr("transform", "scale(" + 1/t.k + ")");
    }));
  window.d3obj = d3obj;
}
function changeStatus(s) {
  const d3obj = window.d3obj;
  const userdata = Object.keys(s).map(user=>({...s[user], user}));
  const d = d3obj.players.selectAll(".player").data(userdata);
  let g = d.enter()
    .append("g").attr("class", "player")
  g.append("circle")
    .attr("r", 4)
  g.append("text")
    .attr("class", "shadow puser")
    .attr("text-anchor", "middle")
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("class", "shadow pstop")
    .attr("y", "1.1em");
  const upd = g.merge(d)
    .transition().duration(1000)
    .attr('transform', s=>
       (bus[s.stop])?`translate(${d3obj.xScale(bus[s.stop].lng)},${d3obj.yScale(bus[s.stop].lat)})`:``)
  upd.select('.pstop').text(s=>s.stop);
  upd.select('.puser').text(s=>s.user);
  d.exit().remove();
}
function changeTarget(t) {
  const d3obj = window.d3obj;
  const d = d3obj.target.selectAll(".target").data([t]);
  let g = d.enter()
    .append("g").attr("class", "target");
  g.append("circle")
     .attr("r", 2)
     .attr("cx", s=>d3obj.xScale(bus[s.name].lng))
     .attr("cy", s=>d3obj.yScale(bus[s.name].lat));
  g.append("text")
    .attr("class", "shadow")
    .attr("text-anchor", "middle")
    .text("目的地");
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("class", "shadow tstop")
    .attr("y", "1.1em");
  g.merge(d)
    .transition().duration(1000)
    .attr('transform', s=>
       `translate(${d3obj.xScale(bus[s.name].lng)},${d3obj.yScale(bus[s.name].lat)})`)
    .select(".tstop")
    .text(s=>s.name);
  d.exit().remove();
}
export default {
  name: 'Map',
  data () {
    return {
      status: {},
      target: ""
    }
  },
  created() {
    this.fetchStatus();
  },
  mounted() {
    setupMap();
  },
  methods: {
    fetchStatus() {
      listenStatus((p, o) => this.$set(this.status, p, o));
      listenTarget(d => this.target = d);
    }
  },
  computed: {
    user() {
      return getUser();
    }
  },
  watch: {
    status: {
      handler(s){
        changeStatus(s);
      },
      deep: true
    },
    target(t) {
      changeTarget(t);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
