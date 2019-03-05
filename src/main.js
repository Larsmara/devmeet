import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import * as firebase from 'firebase'
import router from './router/router'
import Vuetify from 'vuetify';
import {store} from './store'
import AlertCmp from './components/Shared/Alert'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.component('app-alert', AlertCmp)


new Vue({
  router,
  store,
  render: h => h(App),
  created(){
      firebase.initializeApp({
        apiKey: "AIzaSyC9qmh-JdcASPDe_FLFYfyJvpleJ_syAXA",
        authDomain: "devmeetup-aad23.firebaseapp.com",
        databaseURL: "https://devmeetup-aad23.firebaseio.com",
        projectId: "devmeetup-aad23",
        storageBucket: "devmeetup-aad23.appspot.com",
        messagingSenderId: "87430345911"
      })
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.$store.dispatch('autoSignIn', user)
      }
    })
    this.$store.dispatch('loadMeetups')
  }
}).$mount('#app')
