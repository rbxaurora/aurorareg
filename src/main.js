import axios from 'axios';
axios.defaults.baseURL = 'https://api-aurorareg.vercel.app';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';
dayjs.locale('ru');
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import '../css/sb-admin-2.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import $ from 'jquery'
window.$ = window.jQuery = $;

import { createApp } from 'vue'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router.js'


createApp(App)
	.use(router)
	.use(VueCookies)
	.mount('#app')
