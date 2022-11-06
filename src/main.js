import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import {User} from './network/user'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/dist/ScrollSmoother.min";
import {eventBus} from "./eventBus";


const user = Vue.observable({ user: new User() })

Object.defineProperty(Vue.prototype, '$user', {
  get () {
    return user.user
  },

  set (value) {
    user.user = value
  }
})

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);


let smoother = ScrollSmoother.create({
  smooth: 1.5,
  effects: true,
  wrapper: '.wrapper',
  content: '.content',
  onStop: () => {
    eventBus.$emit('scroll-stop');
  }
})
const vueSmoother = Vue.observable({ smoother: smoother })

Object.defineProperty(Vue.prototype, '$smoother', {
  get () {
    return vueSmoother.smoother
  },

  set (value) {
    vueSmoother.smoother = value
  }
})

