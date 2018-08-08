<template>
  <v-form style="width:100%">
    <bus-picker label="乗車駅"
      v-model="enterstop"
      @input="entermod = true"
      ></bus-picker>
    <v-select label="方向"
      v-model="way"
      :items="ways"
      single-line
      @change="entermod = true; wayCustom()"
      ></v-select>
    <p>
      {{enterstop|hatena}}の{{way|hatena}}乗り場から
      <i :class="'mdi mdi-24px mdi-dice-' + dices[0]"></i>
      <i :class="'mdi mdi-24px mdi-dice-' + dices[1]"></i>
      <b>{{dice|hatena}}</b>進む
    </p>
    <v-btn block color="success" @click="enter" :disabled="!enterok">
      サイコロを振って乗る→
    </v-btn>

    <v-divider></v-divider>

    <v-text-field
      v-model="keitou"
      label="系統"
      single-line
      :append-icon="keitounum ? 'mdi-numeric' : 'mdi-alphabetical'"
      :type="keitounum ? 'number' : 'text'"
      @click:append="keitounum = !keitounum"
      clearable
      @input="leavemod = true"
      ></v-text-field>
    <bus-picker
      v-model="leavestop"
      label="降車駅"
      @input="leavemod = true"
      ></bus-picker>
    <p>
      {{keitou|hatena}}に乗って{{leavestop|hatena}}で降りる
    </p>
    <v-btn block color="success" v-on:click="leave" :disabled="!leaveok || empty(keitou)">
      →降りる</v-btn>
    <v-btn block color="info" v-on:click="reinput" :disabled="leavestop == ''">
      降りた駅から乗る</v-btn>
    <v-divider></v-divider>
    <v-btn block color="success" v-on:click="walk" :disabled="!leaveok">
      {{leavestop|hatena}}へ歩く</v-btn>
    <v-dialog
      v-model="waydialog"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">乗り場を入力</span>
        </v-card-title>
        <v-card-text>
        <v-text-field
          v-model="way"
          label="乗り場(A, C1など)"
          single-line
          @input="entermod = true"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
        <v-btn
          color="green darken-1"
          @click="waydialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import BusPicker from '@/components/BusPicker'
import {addLog} from '@/firebase.js'
import {getUser} from '@/firebase.js'

function roll(x) {
  return (0|(Math.random() * x)) + 1
}
function empty(s) {
  return !s || s === "";
}
const etc = "他..."
export default {
  name: 'Tracker',
  components: {
    "bus-picker": BusPicker
  },
  data () {
    return {
      entermod: false,
      enterstop: '',
      way: '',
      ways: ['東行', '西行', '南行', '北行', etc],
      waydialog: false,
      leavemod: false,
      leavestop: '',
      keitou: '',
      keitounum: true,
      dice: null,
      dices: [],
    }
  },
  methods: {
    enter() {
      this.diceroll();
      this.entermod = false;
      addLog({type:"enter", stop:this.enterstop, way:this.way, dices:this.dices});
    },
    leave() {
      this.leavemod = false;
      addLog({type:"leave", stop:this.leavestop, keitou:this.keitou});
    },
    walk() {
      this.leavemod = false;
      addLog({type:"walk", stop:this.leavestop});
    },
    diceroll() {
      let d1 = roll(6);
      let d2 = roll(6);
      this.dice = d1 + d2;
      this.dices = [d1, d2];
    },
    reinput() {
      this.enterstop = this.leavestop;
      this.entermod = true;
    },
    wayCustom() {
      if (this.way == etc){
        this.waydialog = true;
        this.way = "";
      }
    },
    empty(x) {
      return empty(x);
    }
  },
  computed: {
    enterok() {
      return this.entermod && !empty(this.enterstop) && !empty(this.way);
    },
    leaveok() {
      return this.leavemod && !empty(this.leavestop);
    },
    user(){
      return getUser()
    }
  },
  filters: {
    hatena(x) {
      return (x && x != "") ? x : "？";
    }
  },
  created() {
    if(getUser() == "anonymous"){
      this.$router.push("user");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
