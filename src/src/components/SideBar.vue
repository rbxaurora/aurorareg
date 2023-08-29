<script>
	import axios from 'axios'

	export default {
		methods: {
			async getUser() {
                let token = this.$cookies.get('authToken');
                
				if (token) {
					await axios.get(`/api/getuser`, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					}).then((response) => {
						this.user = response.data;
                        this.renderRoles();
					}).catch(e => {
                        console.log(e);
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
			hideBar(){
				this.isHided = !this.isHided;
			},
            goUsersList() {
                this.$router.push({
                    name: 'userslist'
                })
            },
            goDashboard() {
                this.$router.push({
                    name: 'dashboard'
                })
            },
            goMembers() {
                this.$router.push({
                    name: 'members'
                })
            },
            goReg() {
                this.$router.push({
                    name: 'allreg'
                })
            },
            renderRoles () {
				if (this.user.roles?.value == "OWNER") {
					this.reg = true;
					this.userslist = true;
					this.pushes = true;
                    this.members = true;
                    this.posts = true;
                    this.chats = true;
				}

                if (this.user.roles?.value == 'DEPUTY') {
					this.reg = true;
                    this.userslist = true;
                    this.members = true;
                    this.posts = true;
                    this.chats = true;
				}

                if (this.user.roles?.value == 'SPECTATOR') {
                    this.reg = true;
                    this.userslist = true;
                    this.posts = true;
                    this.chats = true;
                    this.members = true;
                }

                if (this.user.roles?.value == 'USER') {
                    this.posts = true;
                }
			}
		},
		mounted() {
			this.getUser();
		},
		data () {
			return {
				user: '',
				isHided: false,
                reg: false,
				userslist: false,
				pushes: false,
                members: false,
                posts: false,
                chats: false,
			}
		}
	}
</script>

<template>
	<ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            <!-- Sidebar - Brand -->
            <a class="sidebar-brand d-flex align-items-center justify-content-center">
                <div class="sidebar-brand-icon">
                    <i class="fab fa-airbnb"></i>
                </div>
                <div style="user-select: none;" class="sidebar-brand-text mx-3">AURORA REG</div>
            </a>

            <!-- Divider -->
            <hr class="sidebar-divider my-0">

            <!-- Nav Item - Dashboard -->
            <li class="nav-item active">
                <button data-bs-dismiss="offcanvas" @click="goDashboard" class="nav-link">
                    <i class="fas fa-fw fa-tachometer-alt"></i>
                    <span>Панель управления</span></button>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider" v-if="reg">

            <!-- Heading -->
            <div class="sidebar-heading" v-if="reg">
                Утилиты
            </div>

            <!-- Nav Item - Pages Collapse Menu -->
            <li class="nav-item" v-if="reg">
                <button @click="goReg" data-bs-dismiss="offcanvas" class="nav-link collapsed">
                    <i class="fas fa-fw fa-list"></i>
                    <span>Реестр сьемок</span>
                </button>
            </li>

            <!-- Nav Item - Charts -->
            <li class="nav-item" v-if="userslist">
                <button data-bs-dismiss="offcanvas" class="nav-link" @click="goUsersList">
                    <i class="fas fa-fw fa-user-tie"></i>
                    <span>Список пользователей</span></button>
            </li>

            <!-- Nav Item - Tables -->
            <li class="nav-item" v-if="pushes">
                <button class="nav-link">
                    <i class="fas fa-fw fa-bell"></i>
                    <span>Центр уведомлений</span></button>
            </li>

            <li class="nav-item" v-if="members">
                <button data-bs-dismiss="offcanvas" @click="goMembers" class="nav-link">
                    <i class="fas fa-fw fa-user-friends"></i>
                    <span>База участников</span></button>
            </li>

            <li class="nav-item" v-if="posts">
                <button data-bs-dismiss="offcanvas" @click="() => { this.$router.push({ name: 'posts' }) }" class="nav-link">
                    <i class="fas fa-fw fa-paste"></i>
                    <span>Статьи</span></button>
            </li>

            <li class="nav-item" v-if="chats">
                <button data-bs-dismiss="offcanvas" @click="() => { this.$router.push({ name: 'chats' }) }" class="nav-link">
                    <i class="fas fa-fw fa-comment-alt"></i>
                    <span>Чат админист.</span></button>
            </li>
        </ul>
</template>

<style>
	@media screen and (max-midth: 425px) {
        .navbar-nav {
            display: none !important;
        }
    }
</style>