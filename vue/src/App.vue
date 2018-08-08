<template>
<v-app>
  <!--
  <v-navigation-drawer app></v-navigation-drawer>
  -->
  <v-toolbar app>
    <v-toolbar-title @click="$router.push('/')">
      Bus
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn fab small flat
      @click="$route.name=='Log' ? $router.push('/') : $router.push('log')">
      <v-icon>mdi-bus-side</v-icon>
    </v-btn>
    <v-btn fab small flat
      @click="$route.name=='Target' ? $router.push('/') : $router.push('target')">
      <v-icon>mdi-target</v-icon>
    </v-btn>
    <v-btn fab small flat
      @click="$route.name=='Map' ? $router.push('/') : $router.push('map')">
      <v-icon>mdi-map</v-icon>
    </v-btn>
    <v-chip @click="$router.push('/user')">
      <v-avatar>
        <v-icon>mdi-account</v-icon>
      </v-avatar>
      {{user}}
    </v-chip>
  </v-toolbar>
  <v-content>
    <v-container fluid fill-height>
      <router-view @updateUser="updateUser"></router-view>
    </v-container>
  </v-content>
  <v-footer app></v-footer>
</v-app>
</template>

<script>
import {getUser, setUser} from '@/firebase.js'

export default {
  name: 'App',
  data() {
    return {
      user: getUser()
    }
  },
  methods: {
    updateUser(u) {
      this.user = u;
      setUser(u);
    }
  }
}
</script>

<style>
</style>
