<template>
    <div>
    <v-btn block color="success" @click="$router.push('/')">
      戻る
    </v-btn>
      <v-list>
      <v-list-tile
        avatar
        v-for="log in logs"
        :key="log.timestamp.valueOf()">
        <v-list-tile-avatar>
          <v-icon>{{log.icon}}</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>
            {{log.title}}
          </v-list-tile-title>
          <v-list-tile-sub-title>
            <span class="caption">{{log.time}}</span>
            {{log.sub}}
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import {getUser, getLog, listenLog, stringifyLog} from '@/firebase.js'

export default {
  name: 'Map',
  data () {
    return {
      logs: []
    }
  },
  created() {
    this.fetchLog();
  },
  methods: {
    fetchLog() {
      listenLog(l=>{ this.logs.unshift(stringifyLog(l)) });
    }
  },
  computed: {
    user() {
      return getUser();
    }
  },
  filters: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
