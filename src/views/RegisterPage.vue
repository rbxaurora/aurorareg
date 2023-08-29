<script>
	import axios from 'axios';

	export default {
		data () {
			return {
				username: '',
				password: '',
				usernick: '',
				errStatus: false
			}
		},
		methods: {
			async registration() {
				if (!this.password) {
					return this.errStatus = true;
				}

				await axios.post('/auth/registration', {
					username: this.username,
					usernick: this.usernick,
					password: this.password
				}).then((response) => {
					let status = response.status;

					if (status == 200) {
						this.$router.push({
							name: 'home'
						});
					}
				}).catch((e) => {
					console.log(e);
				});
			},
			async getUser() {
				const token = this.$cookies.get('authToken');

				if (token) {
					await axios.get('/api/getuser', {
						headers: {
							Authorization: `Bearer ${token}`
						}
					}).then((response) => {
						this.$router.push({
							name: 'dashboard'
						});
					});
				}
			}
		},
		mounted () {
			this.getUser();
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
								<h1 class="h4 text-gray-900 mb-4">Регистрация</h1>
							</div>
							<form class="user" @submit.prevent="registration">
								<div class="form-group">
									<input type="text" v-model="usernick" class="form-control form-control-user"
										id="exampleInputEmail" aria-describedby="emailHelp"
										placeholder="Имя...">
								</div>
								<div class="form-group">
									<input type="text" v-model="username" class="form-control form-control-user"
										id="exampleInputEmail" aria-describedby="emailHelp"
										placeholder="Логин...">
								</div>
								<div class="form-group">
									<input v-model="password" type="password" class="form-control form-control-user"
										id="exampleInputPassword" placeholder="Пароль..." :class="{
											'is-invalid': this.errStatus
										}">
								</div>
								<div class="text-danger mb-2" style="font-weight: 600;" v-if="errStatus">
									Неверно введен логин или пароль.
								</div>
								<button type="submit" class="btn btn-primary btn-user btn-block">
									Зарегистрироваться
								</button>
								<hr>
								<div class="text-center">
									<a class="small" href="/">Уже есть аккаунт? Войдите!</a>
								</div>
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