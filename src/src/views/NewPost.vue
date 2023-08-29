<script>
	import Editor from '@tinymce/tinymce-vue'
	import axios from 'axios'

	export default {
		components: {
			Editor,
		},
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
					}).catch((e) => {
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
			async savePost () {
				const token = this.$cookies.get(`authToken`);

				if (!token) {
					return this.leaveAccount();
				}

				await axios.post(`/api/savepost`, {
					postName: this.postName,
					content: this.content
				}, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((res) => {
					return this.$router.push({ name: 'posts' });
				}).catch((err) => {
					console.log(err);
				})
			}
		},
		mounted () {
			this.getUser();
		},
		data () {
			return {
				isReady: false,
				user: '',
				content: '',
				postName: '',
			}
		}
	}
</script>

<template>
	<div class="container">
		<div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Новая статья</h1>
        </div>
        <div v-if="!isReady" class="text-center my-5">
			<img style="opacity: 55%;" src="../../img/loading.gif" :width="62">
			<h4 class="small mt-2 text-gray-800">Загрузка редактора TinyMCE</h4>
		</div>

		<form :class="{ 'd-none': !this.isReady }" @submit.prevent="savePost">
			<label class="form-label w-100 mb-3">
				Введите название статьи
				<input type="text" class="form-control" v-model="postName" required>
			</label>

			<editor v-model="content" api-key="b3by60o2hmr8e0et3y6t2w1k1la1cnfgwbh4y7yy4ivpiw26" :init="{
				language: 'ru',
				plugins: 'preview searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor advlist lists wordcount help linkchecker emoticons',
				init_instance_callback: () => {
					this.isReady = true;
				}
			}"></editor>
			<button type="submit" class="btn btn-success fw-bold my-3">Отправить</button>
		</form>
	</div>
</template>

<style>
	
</style>