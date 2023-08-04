<script>
	import axios from 'axios'
	import * as bootstrap from 'bootstrap'

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
						this.getList();
						this.isReady = true;
					}).catch(e => {
						console.log(e)
						this.leaveAccount();
					});
				} else {
					this.leaveAccount();
				}
			},
			leaveAccount() {
				this.$cookies.remove('authToken');

				this.$router.push({
					name: 'home'
				});
			},
			async getList() {
				const token = this.$cookies.get('authToken');

				if (!token) {
					return this.leaveAccount();
				}

				await axios.get('/api/getmemberslist', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((response) => {
					this.membersList = response.data;
				}).catch((e) => {
					console.log(e);
					this.errStatus = e;
				});
			},
			async saveMember() {
				const token = this.$cookies.get('authToken');

				if (!token) {
					return this.leaveAccount();
				}

				if (!this.name || !this.id || !this.roblox) {
					return this.error = true;
				}

				await axios.post('/api/savemember', {
					name: this.name,
					id: this.id,
					roblox: this.roblox
				}, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((response) => {
					this.getUser();
				}).catch((e) => {
					console.log(e);
				});
			},
			async deleteMember(id) {
				const token = this.$cookies.get('authToken');

				if (!token) {
					return this.leaveAccount();
				}

				await axios.post('/api/deletemember', {
					id: id
				}, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((response) => {
					this.getUser();
				}).catch((e) => {
					console.log(e);
				});
			}
		},
		data () {
			return {
				user: '',
				isReady: false,
				membersList: [],
				errStatus: '',
				name: '',
				id: '',
				roblox: '',
				error: false
			}
		},
		mounted() {
			this.getUser();
		},
		watch: {
			name() {
				this.error = false;
			},
			id () {
				this.error = false;
			},
			roblox() {
				this.error = false;
			}
		}
	}
</script>

<template>
	<div class="container">

        <!-- Page Heading -->
        <div class="row g-3 align-items-center justify-content-between mb-4">
        	<div class="col-auto">
        		<h1 class="h3 mb-0 text-gray-800">База участников Хауса</h1>
        	</div>
            <div class="col-auto">
            	<button data-bs-toggle="modal" data-bs-target="#addModal" @click="showAddModal" class="btn btn-primary fw-bold">
            	<i class="fas fa-list"></i>
            	Добавить
            </button>
            </div>
        </div>

        <div v-if="!isReady" class="text-center my-5">
			<img style="opacity: 55%;" src="../../img/loading.gif" :width="62">
		</div>

		<div v-if="isReady && membersList.length != 0" class="row mt-4 mb-5 me-1 ms-1">
            <div class="card shadow border-left-primary">
            	<div class="card-body">
            		<div>
            			<div v-for="(item, index) in membersList" class="card mb-3 mt-2">
            				<div class="row g-0 d-flex align-items-center">
            					<div class="col-auto ps-4 pt-2 pb-2">
            						<img src="https://i.ibb.co/M1n3Q59/undraw-profile.jpg" alt="" width="64">
            					</div>
            					<div class="col">
            						<div class="card-body d-flex justify-content-between align-items-center">
            							<div class="row row-cols-1 row-cols-sm-1 g-md-2 g-sm-2 row-cols-md-2 row-cols-lg-4 w-100 d-sm-flex align-items-center justify-content-between">
            								<div class="col">
            									<h5 class="card-title fw-bold mb-1">{{ item.name }}</h5>
            									<span class="text-secondary">[{{ item.id }}] - <b>{{ item.roblox }}</b></span>
            								</div>
            								<div class="col-auto">
	            								<button @click="deleteMember(item._id)" type="button" class="btn btn-danger fw-bold">
            										<i class="fas fa-cogs mr-2"></i>
            										Удалить
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
            <div v-if="membersList.length == 0" class="text-center fw-bold mb-5">
	        	Список участников AURORA TEAM пуст.
	        </div>
        </div>

        

        <!-- Content Row -->
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
    </div>

    <div ref="addmodal" class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 style="font-weight: 600;" class="modal-title" id="exampleModalLabel">Добавить нового участника</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                	<form @submit.prevent="saveMember">
                		<label class="form-label w-100 mb-2">
                			Имя участника
                			<input type="text" class="form-control" v-model="name">
                		</label>
                		<label class="form-label w-100 mb-2">
                			Telegram ID
                			<input type="number" v-model="id" class="form-control">
                		</label>
                		<label class="form-label w-100 mb-2">
                			Roblox
                			<input type="text" v-model="roblox" class="form-control">
                		</label>
                		<span class="text-danger fw-bold" v-if="error">Не заполнены все поля</span>
                		<div class="modal-footer">
		                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Отмена</button>
		                    <button type="submit" data-bs-dismiss="modal" class="btn btn-success fw-bold">Сохранить</button>
	                	</div>
                	</form>
                </div>
                
            </div>
        </div>
    </div>
</template>

<style>
	
</style>