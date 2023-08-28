<script>
	import axios from 'axios';
	import dayjs from 'dayjs';

	import AppHeader from '../components/AppHeader.vue'
    import SideBar from '../components/SideBar.vue'

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
						this.getUserInfo(token);
						this.isReady = true;
					}).catch(e => {
						console.log(e)
						this.leaveAccount();
					});
				} else {
					this.leaveAccount();
				}
			},
			goDashboard() {
				if (this.$route.name != 'dashboard') {
					this.$router.push({
						name: 'dashboard'
					})
				}
			},
			async getUserInfo(token) {
				if (this.user.roles.value == 'OWNER') {

					await axios.get(`/api/getuserinfo`, {
						headers: {
							Authorization: `Bearer ${token}`
						},
						params: {
							userId: this.$route.params.username
						}
					}).then((response) => {
						this.userInfo = response.data[0];
						this.userRole = response.data[0].roles[0];
						this.roles = response.data[1];
					}).catch(e => {
						this.errStatus = e;
					});
				}
			},
            leaveAccount() {
                this.$cookies.remove('authToken');

                this.$router.push({
                    name: 'home'
                });
            },
			async saveUser() {
                const token = this.$cookies.get('authToken');

				if (this.userPasssEdit == this.userPassEdit) {
					await axios.post(`/api/saveuser`, {
						id: this.$route.params.username,
                        userName: this.userNameEdit,
                        userNick: this.userNickEdit,
                        userRole: this.userRoleEdit,
                        userPass: this.userPassEdit
					}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then((response) => {
						this.$router.push({
							name: 'userslist'
						});
					}).catch(e => {
						console.log(e);
					})
				} else {
					this.passNotVerify = true;
				}
			},
			async deleteUser() {
				const token = this.$cookies.get('authToken');

				if (!token) {
					return this.leaveAccount();
				}

				await axios.post('/api/deleteuser', {
					id: this.$route.params.username
				}, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((response) => {
					this.$router.push({
						name: 'userslist'
					});
				}).catch((e) => {
					console.log(e);
				})
			}
		},
		data () {
			return {
				user: '',
				userInfo: '',
				roles: '',
				errStatus: false,
				userNameEdit: '',
				userNickEdit: '',
				userRoleEdit: '',
				userPassEdit: '',
				userPasssEdit: '',
				passNotVerify: false,
				isReady: false
			}
		},
		mounted () {
			this.getUser();
		},
		components: {
			AppHeader,
            SideBar
		}
	}
</script>

<template>
	<div class="container">

        <!-- Page Heading -->
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Редактирование профиля</h1>
        </div>

        <div v-if="!isReady" class="text-center my-5">
			<img style="opacity: 55%;" src="../../img/loading.gif" :width="62">
		</div>

        <div v-if="!errStatus && isReady" class="row mt-4">
        	<div class="col-lg-2">
        		<img src="https://i.ibb.co/M1n3Q59/undraw-profile.jpg" width="128" alt="">
        	</div>
        	<div class="col-lg-10">
        		<form @submit.prevent="saveUser">
        			<label class="form-label w-100 mb-2">
        				Имя пользователя
        				<input type="text" v-model="userNickEdit" class="form-control" :placeholder="userInfo.usernick">
        			</label>
        			<label class="form-label w-100 mb-2">
        				Логин
        				<input type="text" v-model="userNameEdit" :placeholder="userInfo.username" class="form-control">
        			</label>
        			<label class="form-label w-100 mb-2">
        				Роли
        				<select v-model="userRoleEdit" class="form-select">
        					<option value="" selected>Выберите роль пользователя</option>
        					<option v-for="(item, index) in roles" :value="item.value">{{ item.value }}</option>
        				</select>
        			</label>
        			<label class="form-label w-100 mb-2">
        				Пароль
        				<input type="password" v-model="userPassEdit" class="form-control">
        			</label>
        			<label class="form-label w-100 mb-2">
        				Повторите пароль
        				<input type="password" class="form-control" :class="{
        					'is-invalid': this.passNotVerify
        				}" v-model="userPasssEdit">
        				<span class="invalid-feedback" v-if="passNotVerify">Пароли не совпадают</span>
        			</label>
        			<div class="row g-3 mt-3 mb-5">
        				<div class="col-auto">
        					<button type="submit" class="btn btn-primary">Сохранить</button>
        				</div>
        				<div class="col-auto">
        					<button @click="deleteUser" type="button" class="btn btn-danger">Удалить аккаунт</button>
        				</div>
        			</div>
        		</form>
        	</div>
        </div>

        <!-- Content Row -->
        <div class="row mt-4" v-if="user.roles == 'USER'">
        	<div class="text-center">
        		<b>Чтобы воспользоваться панелью, Вам нужно обладать правами Администратора. Пожалуйста, обратитесь к системному администратору для выдачи прав.</b>
        	</div>
        </div>

    </div>

    <div v-if="errStatus" class="container-fluid">

        <!-- Error Text -->
        <div class="text-center">
            <div class="error mx-auto" :data-text="errStatus.response.status">{{ errStatus.response.status }}</div>
            <p v-if="errStatus.response.statusText == 'Not Found'" class="lead text-gray-800 mb-5">Страница не найдена</p>
            <p v-if="errStatus.response.statusText == 'Bad Request'" class="lead text-gray-800 mb-5">Ошибка запроса</p>
            <!-- <p class="lead text-gray-800 mb-5">Страница не найдена</p> -->
            <p class="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
            <a href="index.html">&larr; Back to Dashboard</a>
        </div>

    </div>
</template>

<style>
	
</style>