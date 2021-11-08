import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#1DB954',
        secondary: 'AD47DD',
        accent: '5028F0',
      },
    },
  },
});
