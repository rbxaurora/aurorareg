<script>
	import axios from 'axios'
	import dayjs from 'dayjs'
	import * as bootstrap from 'bootstrap'
	import { initializeApp } from "firebase/app";
	import { getMessaging, getToken, onMessage } from 'firebase/messaging';

	export default {
		methods: {
			async getUser() {
				this.isReady = false;
				let token = this.$cookies.get('authToken');

				if (token) {
					await axios.get(`/api/getuser`, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					}).then((response) => {
						this.user = response.data;
						this.date = dayjs().format('DD MMMM YYYY');
						this.timeReload();
						this.renderRoles();
						if (this.user.roles?.value != 'USER') {
							this.firebaseConnect();
							this.getReg();
						}
						this.isReady = true;
						this.checkCookies();
					}).catch((e) => {
						console.log(e)
						this.leaveAccount();
					});
				} else {
					this.leaveAccount();
				}
			},
			firebaseConnect() {
				const firebaseConfig = {
					apiKey: "AIzaSyD_BmQLQocC6DdFWjVHnKof5BJ4DjhHDqQ",
					authDomain: "aurorareg-b787f.firebaseapp.com",
					projectId: "aurorareg-b787f",
					storageBucket: "aurorareg-b787f.appspot.com",
					messagingSenderId: "1053648640246",
					appId: "1:1053648640246:web:6802b37a39d4ff5d9b34d7",
					measurementId: "G-CYNFWPLLSS"
				};

				const app = initializeApp(firebaseConfig);

				const messaging = getMessaging();
				onMessage(messaging, (payload) => {
				    console.log('Message received. ', payload);
				});
				getToken(messaging, { vapidKey: 'BJK8gnRfhlfQFyjAdpB6rH95__olxiy96f_zh3almEIQsuUsR21uUvphLA28Ea8P_Kmaj4zM3fdd_JqR9xECeF0' }).then(async (currentToken) => {
				  if (!currentToken) {
				  	this.firebaseErr = true;
				  	return console.error('Firebase Error: No registration token available. Request permission to generate one.');
				  }

				  await axios.post('/msg/regtoken', {
				  	token: currentToken,
				  	userid: this.user._id
				  });
				}).catch((err) => {
					this.firebaseErr = true;
				    console.log('An error occurred while retrieving token. ', err);
				});
			},
			goUsersPage () {
				this.$router.push({
					name: 'userslist'
				});
			},
			goReg() {
				this.$router.push({
					name: 'registry'
				})
			},
			leaveAccount() {
				this.$cookies.remove('authToken');

				this.$router.push({
					name: 'home'
				});
			},
			timeReload () {
				this.time = dayjs().format('HH:mm:ss');
			},
			newDate () {
				this.date = dayjs().format('DD MMMM YYYY')
			},
			renderRoles () {
				if (this.user.roles?.value == "OWNER") {
					this.reg = true;
					this.userslist = true;
					this.pushes = true;
					this.members = true;
					this.posts = true;
					this.chat = true;
				}

				if (this.user.roles?.value == 'DEPUTY') {
					this.reg = true;
                    this.userslist = true;
                    this.members = true;
                    this.posts = true;
                    this.chat = true;
				}

                if (this.user.roles?.value == 'SPECTATOR') {
                    this.reg = true;
                    this.userslist = true;
                    this.chat = true;
                    this.posts = true;
                    this.members = true;
                }

                if (this.user.roles?.value == 'USER') {
                	this.posts = true;
                }
			},
			async getReg() {
				const token = this.$cookies.get('authToken');

				if (!token) {
					return this.leaveAccount();
				}

				await axios.get('/api/getreg', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((response) => {
					this.regList = response.data;
					if (this.regList.length != 0) {
						this.regIsEmpty = false;
					}
					this.formatDate();
				}).catch((e) => {
					console.log(e);
				});
			},
			formatDate() {
				let regList = this.regList;

				for (let i = 0; i < regList.length; i++) {
					let createdAt = regList[i].createdAt;
					createdAt = dayjs(createdAt).format('MMMM DD, YYYY');

					regList[i].createdAt = createdAt;

					let date = regList[i].date;
					date = dayjs(date).format('DD MMMM YYYY');

					regList[i].date = date;
				}

				this.regList = regList;
			},
			goMembers() {
				this.$router.push({
					name: 'members'
				});
			},
			goAllReg() {
				this.$router.push({
					name: 'allreg'
				})
			},
			goPosts() {
				this.$router.push({
					name: 'posts'
				});
			},
			goChat () {
				this.$router.push({
					name: 'chats'
				});
			},
			checkCookies() {
				const allowCookies = this.$cookies.get('allowUser');

				if (allowCookies != 'allowed') {
					const cookiesCanvas = this.$refs['cookies-canvas'];
					const cookiesNotify = new bootstrap.Offcanvas(cookiesCanvas);

					cookiesNotify.show();
				}
			},
			acceptCookies() {
				this.$cookies.set('allowUser', 'allowed');
			}
		},
		mounted () {
			this.getUser();

			setInterval(() => {
				this.timeReload();
			}, 1000);

			this.newDate();
		},
		data () {
			return {
				user: '',
				date: '',
				time: '',
				regIsEmpty: true,
				regList: [],
				reg: false,
				userslist: false,
				pushes: false,
				members: false,
				isReady: false,
				posts: false,
				chat: false,
				firebaseErr: false,
			}
		}
	}
</script>

<template>
	<div style="min-height: 70vh !important;" class="container">

        <!-- Page Heading -->
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Панель управления</h1>
        </div>
		<div v-if="!isReady" class="text-center my-5">
			<img style="opacity: 55%;" src="../../img/loading.gif" :width="62">
		</div>
        <!-- Content Row -->
        <div v-if="isReady" class="row">

        	<div v-if="firebaseErr" class="card border-left-warning shadow w-100 py-2 mb-4 mx-2">
        		<div class="card-body">
        			<div class="row no-gutters align-items-center">
        				<div class="col-auto ms-2">
        					<i class="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
        				</div>
        				<div class="col me-2 ms-4">
        					<div class="text-xs font-weight-bold text-uppercase text-gray-600">Возникла проблема с разрешением на получение уведомлений. Для полноценного использования панели управления AURORA REG Вы должны разрешить получение уведомлений. Это необходимо для получения новых уведомлений из служебных чатов и новых входящих анкет.</div>
        				</div>
        			</div>
        		</div>
        	</div>
            <!-- Earnings (Monthly) Card Example -->
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col ms-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Сегодня</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ date }}</div>
                            </div>
                            <div class="col-auto me-2">
                                <i class="fas fa-calendar fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Earnings (Monthly) Card Example -->
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col ms-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Время</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ time }}</div>
                            </div>
                            <div class="col-auto me-2">
                                <i class="fas fa-clock fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Row -->

        <div class="row">

        </div>

        <!-- Content Row -->
        <div class="row mt-4">

            <div v-if="reg" class="col-lg-6 mb-4">

                <!-- Illustrations -->
                <div id="regVideos" class="card border-left-info shadow mb-4">
                    <div class="card-header py-3">
                      <div class="row d-sm-flex align-items-center justify-content-between">
                    		<div class="col">
                    			<h6 class="m-0 font-weight-bold text-primary">Реестр сьемок
                          <span class="badge badge-danger badge-counter">Новое</span></h6>
                    		</div>
                          <div class="col-auto">
                          	<button @click="goReg" class="btn btn-info font-weight-bold text-light shadow">
                            <i class="fas fa-list fa-fw"></i>
                            Создать отчет
                          </button>
                      	</div>
                      </div>
                        

                    </div>
                    <div class="card-body">
                        <div v-if="regIsEmpty" class="text-center" style="height: 250px;">
                            <b>Здесь будут появляться новые записи</b>
                        </div>
                        <div v-for="(item, index) in regList" v-if="!regIsEmpty">
                          <div class="d-flex align-items-center" href="#">
                            <div class="mx-3">
                                <div class="icon-circle bg-primary">
                                    <i class="fas fa-file-alt text-white"></i>
                                </div>
                            </div>
                            <div>
                                <div class="small text-gray-500">{{ item.createdAt }}</div>
                                <span :class="{
              'font-weight-bold': index == 0
            }">Доступна новая запись в реестре сьемок от {{ item.date }}</span>
                            </div>
                        </div>
        <hr class="divider">
                        </div>
                        <button @click="goAllReg" v-if="!regIsEmpty" class="dropdown-item text-center text-gray-500 mt-3">Показать все записи</button>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 mb-4">
              <div class="row">
                <div @click="goUsersPage" class="col-xl-6 col-md-6 mb-4" v-if="userslist">
                    <div style="cursor: pointer;" class="card border-left-danger shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col ms-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Список пользователей</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                                      Перейти
                                    </div>
                                </div>
                                <div class="col-auto me-2">
                                	<i class="fas fa-user-tie fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6 col-md-6 mb-4" v-if="pushes">
                    <div style="cursor: pointer;" class="card border-left-warning shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col ms-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Центр уведомлений</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                                      Перейти
                                    </div>
                                </div>
                                <div class="col-auto me-2">
                                	<i class="fas fa-bell fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div @click="goMembers" class="col-xl-6 col-md-6 mb-4" v-if="members">
                    <div style="cursor: pointer;" class="card border-left-primary shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col ms-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        База участников</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                                      Перейти
                                    </div>
                                </div>
                                <div class="col-auto me-2">
                                	<i class="fas fa-user-friends fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div @click="goPosts" class="col-xl-6 col-md-6 mb-4" v-if="posts">
                    <div style="cursor: pointer;" class="card border-left-info shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col ms-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Статьи</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                                      Перейти
                                    </div>
                                </div>
                                <div class="col-auto me-2">
                                	<i class="fas fa-paste fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div @click="goChat" class="col-xl-6 col-md-6 mb-4" v-if="chat">
                    <div style="cursor: pointer;" class="card border-left-success shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col ms-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Чат администраторов</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                                      Перейти
                                    </div>
                                </div>
                                <div class="col-auto me-2">
                                	<i class="fas fa-comment-alt fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
        </div>

        <div class="row my-5" v-if="user.roles?.value == 'USER'">
          <div class="text-center">
            <b>Чтобы полноценно воспользоваться панелью, Вам нужно обладать правами Администратора. Пожалуйста, обратитесь к системному администратору для выдачи прав.</b>
          </div>
        </div>

    </div>

	<div ref="cookies-canvas" class="offcanvas offcanvas-bottom" style="height: auto;" data-bs-backdrop="static" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
	  <div class="offcanvas-header">
	    <h5 class="fw-bold offcanvas-title" id="offcanvasBottomLabel">Уведомление об использовании файлов "cookie"</h5>
	  </div>
	  <div class="offcanvas-body small">
	    <p>Мы используем cookie-файлы с целью улучшения быстродействия работы сайта, а также для работы прочих функций в панели управления. Продолжая пользоваться сайтом, вы даёте своё согласие на использование Ваших cookie-файлов.</p>
	    <button @click="acceptCookies" data-bs-dismiss="offcanvas" class="btn btn-success fw-bold mt-3">Согласиться</button>
	  </div>
	</div>
</template>

<style>

</style>