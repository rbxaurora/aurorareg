<script>
	import axios from 'axios';

	export default {
		data () {
			return {
				username: '',
				password: '',
				errStatus: false,
				isLoading: false,
			}
		},
		methods: {
			async authLogin() {
				this.isLoading = true;
				let token;

				await axios.post(`/auth/login`, {
					username: this.username,
					password: this.password
				}).then((response) => {
					token = response.data.token;
					this.isLoading = false;
				}).catch(e => {
					console.log(e);
					this.errStatus = true;
					this.isLoading = false;
				});

				if (token) {
					this.$cookies.set('authToken', token)
					this.$router.push({
						name: 'dashboard'
					});
				}
			},
			checkLogin() {
				let cookie = document.cookie;
				let token;

				if (cookie.includes(`authToken=`)) {
					token = cookie.split(`=`)[1];
				}

				if (token) {
					this.$router.push({
						name: 'dashboard'
					})
				}
			},
			goRegister() {
				this.$router.push({
					name: 'registration'
				});
			},
			loadCycle() {
				this.isLoading = true;
			}
		},
		mounted () {
			this.checkLogin();
		}
	}
</script>

<template>
	<div class="bg-gradient-primary" style="height: 100vh;">
		<div class="container">

        <!-- Outer Row -->
        <div class="row justify-content-center">

            <div class="col-xl-10 col-lg-12 col-md-9">

                <div class="card o-hidden border-0 shadow-lg my-5">
                    <div class="card-body p-0">
                        <!-- Nested Row within Card Body -->
                        <div class="row">
                            <div class="col-lg-6 d-none d-lg-block"></div>
                            <div class="col-lg-6">
                                <div class="p-5">
                                    <div class="text-center">
                                        <h1 class="h4 text-gray-900 mb-4">С возвращением!</h1>
                                    </div>
                                    <form class="user" @submit.prevent="authLogin">
                                        <div class="form-group">
                                            <input type="text" v-model="username" class="form-control form-control-user" placeholder="Логин...">
                                        </div>
                                        <div class="form-group">
                                            <input v-model="password" type="password" class="form-control form-control-user" placeholder="Пароль..." :class="{
                                                	'is-invalid': this.errStatus
                                                }">
                                        </div>
                                        <div class="text-danger mb-2" style="font-weight: 600;" v-if="errStatus">
                                        	Неверно введен логин или пароль.
                                        </div>
                                        <button type="submit" class="btn btn-primary btn-user btn-block">
                                            <span v-if="!isLoading">Войти</span>
                							<img v-if="isLoading" :width="24" src="../../img/loading.gif" style="filter: brightness(10);" alt="">
                                        </button>
                                        <button @click="goRegister" type="button" class="btn btn-outline-secondary btn-user btn-block">
                                            Зарегистрироваться
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
	</div>
</template>

<style>
	h1 {
		font-size: 2em !important;
		text-align: center;
		font-weight: 800 !important;
	}

	h3 {
		text-align: center;
	}
</style>