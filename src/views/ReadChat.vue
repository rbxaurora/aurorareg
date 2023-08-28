<script>
	import axios from 'axios'
	import dayjs from 'dayjs'
	import Socket from '@/socket'

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
						this.getChat();
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
			async getChat () {
				const token = this.$cookies.get(`authToken`);

				if (!token) {
					return this.leaveAccount();
				}

				await axios.get(`/api/getchat`, {
					params: {
						id: this.$route.params.chatid
					},
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((res) => {
					this.chat = res.data;
					this.chatMessages = this.chat.chatMessages;
					this.$nextTick(() => {
						this.scrollChat();
					})
					Socket.connect(this.user.username, this.chat.chatId);
					Socket.checkMsg((err, data) => {
						if (data.chatId == this.chat.chatId) {
							this.chat.chatMessages.push({
								type: 'message',
								from: data.from,
								date: data.date,
								message: data.message
							});
							this.chatMessages = this.chat.chatMessages;
							const shortMessage = data.message.slice(0, 61);
						}
					});
					Socket.checkOnline((err, data) => {
						if (data.chatid == this.chat.chatId) this.chat.chatMembers.push(data.username);
					});
					Socket.checkLeave((err, data) => {
						const index = this.chat.chatMembers.indexOf(data.index);

						this.chat.chatMembers.splice(index, 1);
					});
				}).catch((err) => {
					console.log(err);
				})
			},
			sendMessage() {
				const msg = this.message;
				const from = this.user.username;
				const chatid = this.$route.params.chatid;
				const date = dayjs().format('DD.MM HH:mm');

				this.message = '';

				return Socket.sendMessage(msg, chatid, from, date);
			},
			scrollChat () {
				setTimeout(() => {
					this.$nextTick(() => {
						let chatCard = this.$refs.trigger;
						chatCard.scrollIntoView({
							block: 'center'
						});
					});
				}, 500);
			}
		},
		mounted () {
			this.getUser();
		},
		data () {
			return {
				user: '',
				isReady: false,
				chat: '',
				message: '',
				chatCard: '',
				chatMessages: [],
			}
		},
		beforeUnmount() {
			const index = this.chat.chatMembers.indexOf(this.user.username);
			Socket.disconnect(index, this.chat.chatId);
		},
		watch: {
			chatMessages () {
				this.scrollChat();
			}
		}
	}
</script>

<template>
	<div class="container">
		<div v-if="!isReady" class="text-center my-5">
			<img class="loading" style="opacity: 55%;" src="../../img/loading.gif" :width="62">
			<p class="small text-gray-800 mt-1">Загрузка чата</p>
		</div>

		<div v-if="isReady" class="card shadow border-left-primary">
			<div class="p-4 card-body">
				<div class="row justify-content-between align-items-center g-sm-2 g-md-2 d-flex">
					<div class="col-auto">
						<i class="fas fa-comment-alt mr-3 fa-2x text-gray-400"></i>
						<h4 class="fw-bold mt-1">{{ chat.chatTitle }}</h4>
					</div>
				</div>
				<hr>
				<div class="card">
					<section style="background-color: #eee;">
						  <div class="container">

						    <div class="row d-flex justify-content-center">
						        <div class="card" id="chat2">					          
						          <div class="card-body" style="position: relative; height: 400px; overflow-y: auto; ">

						            <div v-for="(item, index) in chat.chatMessages" class="d-flex flex-row" :class="{
						            	'justify-content-end': item.from == user.username,
						            	'justify-content-start': item.from != user.username,
						            	'mb-4': item.from == user.username,
						            	'pt-1': item.from == user.username
						            }">
						            	<img v-if="item.from != user.username" src="https://i.ibb.co/M1n3Q59/undraw-profile.jpg"
						                alt="avatar 1" style="width: 45px; height: 100%;">
						              <div>
						              	<div class="d-flex">
						              		<p v-if="item.from != user.username" class="small ms-3 fw-bold">{{ item.from }}</p>
						              		<span v-if="item.from != user.username && chat.chatMembers.indexOf(item.from) != -1" class="ms-1 mb-1 px-1 bagde rounded-1 badge-success small">online</span>
						              	</div>
						                <p class="small p-2 mb-1 rounded-3" :class="{
						                	'text-white': item.from == user.username,
						                	'me-3': item.from == user.username,
						                	'bg-primary': item.from == user.username,
						                	'ms-3': item.from != user.username
						                }" :style="{
						                	'backgroundColor': item.from != user.username ? '#f5f6f7' : 'none'
						                }">{{ item.message }}</p>
						                <p class="small mb-3 rounded-3 text-muted d-flex justify-content-end" :class="{
						                	'ms-3': item.from != user.username,
						                	'me-3': item.from == user.username
						                }">{{ item.date }}</p>
						              </div>
						            </div>
						            <div ref="trigger"></div>
						          </div>
						          <div class="card-footer text-muted bg-light d-flex justify-content-start align-items-center p-3">
						            <img src="https://i.ibb.co/tpp2jSJ/undraw-profile-1.png"
						              alt="avatar 3" style="width: 50px; height: 100%;">
						            <input type="text" v-model="message" class="form-control ms-3 form-control-lg" id="exampleFormControlInput1"
						              placeholder="Сообщение">
						            <a class="ms-4 text-muted" href="#!"><i class="fas fa-paperclip"></i></a>
						            <button type="button" @click="sendMessage" class="mx-3 btn btn-primary" :disabled="!message"><i class="fas fa-paper-plane"></i></button>
						          </div>
						        </div>
						    </div>
  						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
	#chat2 .form-control {
		border-color: transparent;
	}

	#chat2 .form-control:focus {
		border-color: transparent;
		box-shadow: inset 0px 0px 0px 1px transparent;
	}

	.divider:after,
	.divider:before {
		content: "";
		flex: 1;
		height: 1px;
		background: #eee;
	}
</style>