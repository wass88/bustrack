<template>
  <v-text-field
    :value="value"
    :label="label"
    single-line
    clearable
    :append-icon="loading ? 'mdi-timer-sand' : 'mdi-map-marker'"
    :disabled="loading"
    @input="$emit('input', $event)"
    @click:append="entermap"
    ></v-text-field>
</template>

<script>
import {bus} from "../bus/bus.js"

function getNear(x) {
  return new Promise((ok, ng)=>{
    let px = (p) => {
      let mlen = 1000;
      let s = null;
      Object.keys(bus).forEach(k => {
        let x = bus[k].lat - p.coords.latitude;
        let y = bus[k].lng - p.coords.longitude;
        let len = Math.hypot(x, y);
        if(len < mlen) {
          mlen = len;
          s = k;
        }
      });
      ok(s);
    };
    navigator.geolocation.getCurrentPosition(px, ng);
  });
}

export default {
  name: 'BusPicker',
  props: ['value', 'label'],
  data () {
    return {
      loading: false
    };
  },
  computed: {
  },
  methods: {
    entermap() {
      if(this.loading) return;
      this.loading = true;
      getNear().then((b)=>{
        this.$emit("input", b); this.loading = false;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
