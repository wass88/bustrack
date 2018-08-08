<template>
  <v-container>
    <p>
      目的地: {{target}}
    </p>
    <v-btn block color="success" @click="goal" :disabled="arrived">
      {{target}}に到着した
    </v-btn>
    <v-btn block color="success" @click="$router.push('/')">
      戻る
    </v-btn>

    <v-divider></v-divider>

    <v-text-field
      v-model="uptarget"
      label="目的地"
      single-line
      clearable
      append-icon="mdi-shuffle-variant"
      @click:append="shuffle"
      ></v-text-field>
    <v-btn block color="success" @click="update" :disabled="!uptarget || uptarget==''">
      目的地を更新する
    </v-btn>
  </v-container>
</template>

<script>
import {getUser, addLog, listenTarget, updateTarget} from '@/firebase.js'
import {bus} from "../bus/bus.js"

export default {
  name: 'Target',
  data () {
    return {
      target: "",
      uptarget: "",
      arrived: false,
    }
  },
  created() {
    this.fetchTarget();
  },
  methods: {
    fetchTarget() {
      listenTarget(l=>{ this.target = l.name; });
    },
    goal() {
      this.arrived = true;
      addLog({type: "goal", stop: this.target});
    },
    shuffle() {
      const b = Object.keys(bus);
      this.uptarget = b[0|Math.random()*b.length];
    },
    update() {
      updateTarget(this.uptarget);
      this.uptarget = null;
      this.arrived = false;
    }
  },
  computed: {
    user() {
      return getUser();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
