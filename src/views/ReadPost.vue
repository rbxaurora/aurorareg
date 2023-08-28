<script>
	import axios from 'axios'

	export default {
		methods: {
			async getPost () {
				this.isReady = false;
				let id = this.$route.params.postid;

				await axios.get(`/api/getpost`, {
					params: {
						id: id
					}
				}).then((res) => {
					this.post = res.data;
					this.isReady = true;
				}).catch((err) => {
					console.log(err);
				});
			}
		},
		data () {
			return {
				isReady: false,
				post: '',
			}
		},
		mounted () {
			this.getPost();
		}
	}
</script>

<template>
	<div class="container container-post mt-5">
		<span class="postlink" @click="() => { this.$router.push({ name: 'posts' }) }">Статьи</span> <span class="text-gray-600">/</span> <span class="text-gray-600">{{ post.title }}</span>
		<br>

		<div id="preview" class="mt-4">
			<div v-html="post.content"></div>
		</div>
	</div>
</template>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

	.container-post {
		max-width: 750px !important;
	}

	.postlink {
		color: blue;
		text-decoration: underline;
		cursor: pointer;
	}

	blockquote {
		border-left: 3px solid gray;
		padding-left: 15px;
	}

	img[alt="post"] {
		width: 100%;
		height: auto;
	}

	#preview {
		font-family: 'Inter', sans-serif;
		font-size: 1.2em;
		margin-bottom: 50px;
	}

	#preview h1 {
		text-align: left;
	}

	#preview h2, h3 {
		text-align: left;
		font-weight: bold;
	}

	#preview em {
		font-size: 0.6em !important;
	}
</style>