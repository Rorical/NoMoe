import Vue from "vue";
import App from "@/App.vue";

import Buefy from "buefy";
import "buefy/dist/buefy.css";

import router from "@/router";
import i18n from "@/locales/i18n"

Vue.config.productionTip = false;

Vue.use(Buefy);

new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
