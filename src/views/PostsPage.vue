<script>
	import axios from 'axios'
	import dayjs from 'dayjs'

	export default {
		methods: {
			goReg() {
				this.$router.push({
					name: 'registry'
				})
			},
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
					}).catch(e => {
						this.isLogined = false;
					});
				}

				this.getPosts();
				if (this.user.length == 0) {
					this.isLogined = false;
				}
				this.isReady = true;
			},
			async getPosts() {
				await axios.get(`/api/posts`).then((res) => {
					this.posts = res.data;
				}).catch((err) => {
					console.log(err);
				})
			},
			async deletePost (id) {
				await axios.post(`/api/deletepost`, {
					id: id
				}).then((res) => {
					this.getUser();
				}).catch((err) => {
					console.log(err);
				});
			}
		},
		mounted () {
			this.getUser();
		},
		data () {
			return {
				user: '',
				isLogined: true,
				posts: [],
				isReady: false,
			}
		}
	}
</script>

<template>
	<div class="container mt-5">
		<div class="d-sm-flex align-items-center justify-content-between mb-4">
            <div class="col-auto">
	    		<h1 class="h3 mb-0 text-gray-800">Статьи</h1>
	    	</div>
	    	<div class="col-auto" v-if="this.user.roles?.value == 'OWNER'">
            	<button data-bs-toggle="modal" data-bs-target="#addModal" @click="() => { this.$router.push({ name: 'newpost' }) }" class="btn btn-primary fw-bold">
	            	<i class="fas fa-plus me-1"></i>
	            	Добавить
	            </button>
            </div>
        </div>
        <div v-if="!isReady" class="text-center my-5">
			<img class="loading" style="opacity: 55%;" src="../../img/loading.gif" :width="62">
		</div>

        <div v-if="isReady">
        	<div class="card border-left-warning shadow h-100 py-2 mb-4" v-if="!isLogined">
	            <div class="card-body">
	                <div class="row no-gutters align-items-center">
	                    <div class="col ms-3 text-gray-800">
	                        Чтобы воспользоваться всеми возможностями панели управления AURORA REG, Вы должны быть авторизованы. Сделать это можно <span @click="() => { this.$router.push({ name: 'home' }) }" class="a-link">здесь</span>.
	                    </div>
	                    <div class="col-auto mx-4">
	                    	<i class="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
	                    </div>
	                </div>
	            </div>
	        </div>

	        <div class="cards mb-5">
	        	<div v-for="(item, index) in posts" class="card mb-3 mt-2">
    				<div class="py-2 px-4">
						<div class="row justify-content-between align-items-center g-sm-2 g-md-2 d-flex card-body">
							<div class="col-auto">
								<h4 class="fw-bold">{{ item.title }}</h4>
								<p class="pt-1">Автор статьи: <b>{{ item.author }}</b></p>
							</div>
							<div class="col-auto">
								<div class="d-flex flex-column flex-sm-row gap-1">
									<button @click="() => { this.$router.push({ name: 'readpost', params: { postid: item._id } }) }" class="btn btn-success fw-bold">
										<i class="fas fa-bookmark mr-2"></i>
										Открыть
									</button>
									<button v-if="user.roles?.value == 'OWNER'" class="btn btn-warning fw-bold text-light" disabled>
										<i class="fas fa-pen mr-2"></i>
										Редактировать
									</button>
									<button @click="deletePost(item._id)" v-if="user.roles?.value == 'OWNER'" class="btn btn-danger fw-bold">
										<i class="fas fa-trash-alt mr-2"></i>
										Удалить
									</button>
								</div>
							</div>
						</div>
    				</div>
    			</div>
	        </div>

	        <div class="text-center mb-5" v-if="posts.length == 0">
	        	<p class="fw-bold">На данный момент статьи отсутствуют.</p>
	        </div>
        </div>
	</div>
</template>

<style>
	.a-link {
		color: blue;
		text-decoration: underline;
		cursor: pointer;
	}

	p, h4 {
		margin: 0;
		padding: 0;
	}
</style>