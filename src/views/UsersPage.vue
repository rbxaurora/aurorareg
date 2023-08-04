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
						this.goAllReg();
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
			async goAllReg() {
				const token = this.$cookies.get('authToken');

				if (!token) {
					return this.leaveAccount();
				}

				await axios.get('/api/getallreg', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((response) => {
					this.regList = response.data;
					this.changeData();
				}).catch((e) => {
					console.log(e);
				})
			},
			changeData() {
				const regList = this.regList;

				for (let i = 0; i < regList.length; i++) {
					let reg = regList[i];
					let date = reg.date;
					date = dayjs(date).format('MMMM DD, YYYY');

					reg.date = date;

					let createdAt = reg.createdAt;
					createdAt = dayjs(createdAt).format('MMMM DD, YYYY');

					reg.createdAt = createdAt;
					regList[i] = reg;
				}

				this.regList = regList;
			},
			itemReg(index) {
				this.isRegReady = false;
				const regList = this.regList;

				const reg = regList[index];

				this.regInfo = reg;
				this.isRegReady = true;
			},
			async deleteReg(index) {
				this.isReady = false;

				const regList = this.regList;
				const reg = regList[index];

				const token = this.$cookies.get('authToken');

				if (!token) {
					return this.leaveAccount();
				}

				await axios.post('/api/deletereg', {
					id: reg._id
				}, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((response) => {
					if (response.status == 200) {
						this.goAllReg();
						this.isReady = true;
					}
				}).catch((e) => {
					console.log(e);
				})
			}
		},
		data () {
			return {
				isReady: false,
				isRegReady: false,
				user: '',
				regList: [],
				regInfo: '',
			}
		},
		mounted () {
			this.getUser();
		},
	}
</script>

<template>
	<div class="container">
		<div class="row g-3 align-items-center justify-content-between mb-4">
	    	<div class="col-auto">
	    		<h1 class="h3 mb-0 text-gray-800">Записи Реестра сьемок</h1>
	    	</div>
	        <div class="col-auto">
	        	<button data-bs-toggle="modal" data-bs-target="#addModal" @click="goReg" class="btn btn-primary fw-bold">
	        	<i class="fas fa-list"></i>
	        	Добавить
	        </button>
	        </div>
	    </div>

	    <div v-if="!isReady" class="text-center my-5">
			<img style="opacity: 55%;" src="../../img/loading.gif" :width="62">
		</div>

		<div v-if="isReady && regList.length != 0" class="row mt-4 mb-5 me-1 ms-1">
            <div class="card shadow border-left-primary">
            	<div class="card-body">
            		<div>
            			<div v-for="(item, index) in regList" class="card mb-3 mt-2">
            				<div class="row g-0 d-flex align-items-center">
            					<div class="col-auto ps-4 pe-2 pt-2 pb-2">
            						<i class="fas fa-calendar fa-2x text-gray-300"></i>
            					</div>
            					<div class="col">
            						<div class="card-body d-flex justify-content-between align-items-center">
            							<div class="row row-cols-1 row-cols-sm-1 g-md-2 g-sm-2 row-cols-md-2 row-cols-lg-4 w-100 d-sm-flex align-items-center justify-content-between">
            								<div class="col">
            									<h5 class="card-title fw-bold mb-1">{{ item.date }}</h5>
            									<span class="text-secondary">
            										Количество участников: {{ item.memberList.length }}
            									</span>
            									<span class="text-secondary">
            										Администратор, составивший отчет: <b>{{ item.adminLogin }}</b>
            									</span>
            								</div>
            								<div class="col-auto">
            									<button @click="itemReg(index)" data-bs-toggle="modal" data-bs-target="#regModal" class="btn btn-success fw-bold mb-2">
            										<i class="fas fa-file-alt mr-2"></i>
            										Открыть
            									</button>
	            								<button @click="deleteReg(index)" type="button" class="btn btn-danger fw-bold">
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
        </div>
        <div v-if="this.regList.length == 0 && isReady" class="text-center fw-bold mb-5">
        	Записи сьемок в Реестре отсутствуют.
        </div>
	</div>

	<div class="modal fade" id="regModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 style="font-weight: 600;" class="modal-title" id="exampleModalLabel">Информация о сьемках <br> #{{ regInfo._id }}</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body" :class="{
                	'text-center': !this.isRegReady
                }">
                	<img class="my-5" v-if="!isRegReady" src="../../img/loading.gif" :width="46" alt="">

                	<span>Дата отчета: <b>{{ regInfo.createdAt }}</b></span>
                	<br>
                	<span>Дата сьемок: <b>{{ regInfo.date }}</b></span>
                	<br>
                	<span>Администратор, составивший отчет: <b>{{ regInfo.adminLogin }}</b></span>
                	<div class="mt-3"></div>
                	<span>Участники сьемок:</span>
                	<br>
                	<span class="fw-bold" v-for="(item, index) in regInfo.memberList">{{item.memberTextForInput}}<br></span>
                </div>
                <div v-if="isRegReady" class="modal-footer">
                	<button class="btn btn-success" data-bs-dismiss="modal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
	
</style>