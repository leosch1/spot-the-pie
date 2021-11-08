import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import LandingPage from '../views/LandingPage.vue';
import MatchSuccessful from '../views/MatchSuccessful.vue';
import Result from '../views/Result.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/matchSuccessful',
    name: 'MatchSuccessful',
    component: MatchSuccessful,
    beforeEnter: (to, from, next) => {
      if (sessionStorage.getItem('myMatchingCode') && sessionStorage.getItem('matched')) next();
      else next('/');
    },
  },
  {
    path: '/result',
    name: 'Result',
    props: true,
    component: Result,
    beforeEnter: (to, from, next) => {
      const resultMusicApi = to.fullPath.match(/musicApi=([\w]+)/);
      const resultMusicApiToken = to.fullPath.match(/access_token=([%-\w]+)/);
      if (sessionStorage.getItem('myMatchingCode') && sessionStorage.getItem('matched') && resultMusicApi && resultMusicApiToken) {
        const [, musicApi] = resultMusicApi;
        const [, musicApiToken] = resultMusicApiToken;
        // eslint-disable-next-line no-param-reassign
        to.params.musicApi = musicApi;
        // eslint-disable-next-line no-param-reassign
        to.params.musicApiToken = decodeURIComponent(musicApiToken);
        next();
      } else next('/');
    },
  },
  {
    path: '*',
    beforeEnter: (to, from, next) => {
      next('/');
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
