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
						this.getChats();
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
			async getChats () {
				const token = this.$cookies.get(`authToken`);

				if (!token) {
					return this.leaveAccount();
				}

				await axios.get(`/api/getchats`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((res) => {
					this.chats = res.data;
				}).catch((err) => {
					console.log(err);
				});
			},
			async addChat () {
				if (this.name.length == 0) {
					this.isError = true;
					return
				}

				const token = this.$cookies.get(`authToken`);

				if (!token) {
					return this.leaveAccount();
				}

				await axios.post(`/api/addchat`, {
					name: this.name
				}, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((res) => {
					this.name = '';
					return this.getChats();
				}).catch((err) => {
					console.log(err);
				})
			}
		},
		mounted () {
			this.getUser();

			Notification.requestPermission();
		},
		data () {
			return {
				user: '',
				isReady: false,
				name: '',
				isError: false,
				chats: [],
			}
		},
		watch: {
			name () {
				this.isError = false;
			}
		}
	}
</script>

<template>
	<div class="container">
		<div class="d-sm-flex align-items-center justify-content-between mb-4">
            <div class="col-auto">
	    		<h1 class="h3 mb-0 text-gray-800">Чаты администраторов</h1>
	    	</div>
	    	<div class="col-auto" v-if="this.user.roles?.value == 'OWNER'">
            	<button data-bs-toggle="modal" data-bs-target="#addModal" class="btn btn-primary fw-bold">
	            	<i class="fas fa-plus me-1"></i>
	            	Добавить
	            </button>
            </div>
        </div>
        <div v-if="!isReady" class="text-center my-5">
			<img class="loading" style="opacity: 55%;" src="../../img/loading.gif" :width="62">
		</div>

		<div v-if="isReady">
			<div class="cards mb-5">
	        	<div v-for="(item, index) in chats" class="card mb-3 mt-2">
    				<div class="py-2 px-4">
						<div class="row justify-content-between align-items-center g-sm-2 g-md-2 d-flex card-body">
							<div class="col-auto">
								<h4 class="fw-bold">{{ item.chatTitle }}</h4>
							</div>
							<div class="col-auto">
								<div class="d-flex flex-column flex-sm-row gap-1">
									<button @click="() => {
										this.$router.push({
											name: 'chat',
											params: {
												chatid: item.chatId
											}
										})
									}" class="btn btn-success fw-bold">
										<i class="fas fa-comment mr-2"></i>
										Открыть
									</button>
								</div>
							</div>
						</div>
    				</div>
    			</div>
	        </div>

	        <div class="text-center mb-5" v-if="chats.length == 0">
	        	<p class="fw-bold">На данный момент чаты отсутствуют.</p>
	        </div>
		</div>

		<div ref="addmodal" class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
	        <div class="modal-dialog" role="document">
	            <div class="modal-content">
	                <div class="modal-header">
	                    <h5 style="font-weight: 600;" class="modal-title" id="exampleModalLabel">Добавить новый чат</h5>
	                    <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
	                        <span aria-hidden="true">×</span>
	                    </button>
	                </div>
	                <div class="modal-body">
	                	<form @submit.prevent="addChat">
	                		<label class="form-label w-100 mb-4">
	                			Название чата
	                			<input type="text" class="form-control" :class="{
	                				'is-invalid': isError
	                			}" v-model="name">
	                			<span class="text-danger fw-bold" v-if="isError">Не заполнены все поля</span>
	                		</label>
	                		
	                		<div class="modal-footer">
			                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Отмена</button>
			                    <button type="submit" data-bs-dismiss="modal" class="btn btn-success fw-bold">Сохранить</button>
		                	</div>
	                	</form>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
</template>

<style>
	
</style>