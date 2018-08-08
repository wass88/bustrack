<template>
  <v-form>
    <v-text-field
      v-model="user"
      label="名前"
      single-line
      clearable
      ></v-text-field>
    <v-btn block color="success" @click="$router.push('/')">
      戻る
    </v-btn>
  </v-form>
</template>

<script>
import {getUser} from '@/firebase.js'
export default {
  name: 'User',
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    user: {
      get() {
        return getUser();
      },
      set(u) {
        this.$emit("updateUser", u);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
