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
						this.getUsersList(token);
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
			async getUsersList(token) {
				await axios.get(`/api/getuserslist`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((response) => {
					this.usersList = response.data;
				}).catch(e => {
					console.log(e);
					this.errStatus = true;
				});
			},
            leaveAccount() {
                this.$cookies.remove('authToken');

                this.$router.push({
                    name: 'home'
                });
            },
			goEditUser(id) {
				this.$router.push({
					name: 'edituser',
					params: {
						username: id
					}
				})
			}
		},
		data () {
			return {
				user: '',
				usersList: [],
				errStatus: false,
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
            <h1 class="h3 mb-0 text-gray-800">Список пользователей</h1>
        </div>

        <div v-if="!isReady" class="text-center my-5">
			<img style="opacity: 55%;" src="../../img/loading.gif" :width="62">
		</div>

        <!-- Content Row -->
        <div v-if="isReady" class="row mt-4 mb-5 me-1 ms-1">
            <div class="card shadow border-left-primary">
            	<div class="card-body">
            		<div>
            			<div class="card mb-3 mt-2" v-for="(item, index) in usersList">
            				<div class="row g-0 d-flex align-items-center">
            					<div class="col-auto ps-4 pt-2 pb-2">
            						<img src="https://i.ibb.co/M1n3Q59/undraw-profile.jpg" alt="" width="64">
            					</div>
            					<div class="col">
            						<div class="card-body d-flex justify-content-between align-items-center">
            							<div class="row row-cols-1 row-cols-sm-1 g-md-2 g-sm-2 row-cols-md-2 row-cols-lg-4 w-100 d-sm-flex align-items-center justify-content-between">
            								<div class="col">
            									<h5 class="card-title fw-bold mb-1">{{ item.username }} <span v-if="item.usernick" class="text-secondary">({{ item.usernick }})</span> </h5>
		            								<span class="bagde badge-pill fs-6" :class="{
		                                                'badge-primary': item.roles?.color == 'primary',
		                                                'badge-danger': item.roles?.color == 'danger',
		                                                'badge-secondary': item.roles?.color == 'secondary',
		                                                'badge-info': item.roles?.color == 'info'
		                                            }">{{ item.roles.rolename }}</span>
            								</div>
            								<div v-if="this.user.roles?.value == 'OWNER'" class="col-auto">
	            								<button @click="goEditUser(item._id)" type="button" class="btn btn-primary fw-bold">
            										<i class="fas fa-pen mr-2"></i>
            										Редактировать
            									</button>
            								</div>
            							</div>
            						</div>
            					</div>
            				</div>
            			</div>
            		</div>
            	</div>
            </div>
        </div>

        <div class="row mt-4" v-if="user.roles == 'USER'">
        	<div class="text-center">
        		<b>Чтобы воспользоваться панелью, Вам нужно обладать правами Администратора. Пожалуйста, обратитесь к системному администратору для выдачи прав.</b>
        	</div>
        </div>

    </div>
</template>

<style>
	
</style>