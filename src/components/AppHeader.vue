<script>
	import axios from 'axios'
	import dayjs from 'dayjs'
    import * as bootstrap from 'bootstrap'

    import SideBar from './SideBar.vue'

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
						this.date = dayjs().format('DD MMMM YYYY');
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
            showLeaveModal() {
                const leaveModal = new bootstrap.Modal(this.$refs['leavemodal']);
                leaveModal.show();
            }
		},
		mounted () {
			this.getUser();
		},
		data () {
			return {
				user: ''
			}
		},
        components: {
            SideBar
        }
	}
</script>

<template>
	<!-- Topbar -->
    <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 shadow">
        <!-- Topbar Navbar -->
        <ul class="navbar-nav ml-auto w-100">
            <div class="row d-sm-flex justify-content-between align-items-center w-100">
                <div class="col-auto ms-3">
                    <li class="nav-item mx-1 my-3">
                        <img style="opacity: 55%; cursor: pointer;" src="https://i.ibb.co/2Nz3s21/Hamburger-icon-svg.png" :width="32" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    </li>
                </div>
                <div class="col-auto">
                    <li class="nav-item dropdown no-arrow mx-1">
                        <div class="btn-group">
                            <button class="nav-link dropdown-toggle" aria-expanded="false">
                                <i class="fas fa-bell fa-fw"></i>
                                <!-- Counter - Alerts -->
                                <span class="badge badge-danger badge-counter"></span>
                            </button>
                            <!-- Dropdown - Alerts -->
                            <div class="dropdown-list dropdown-menu shadow animated--grow-in">
                                <h6 class="dropdown-header">
                                    Центр уведомлений
                                </h6>
                                <a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="mr-3">
                                        <div class="icon-circle bg-primary">
                                            <i class="fas fa-file-alt text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="small text-gray-500">Июль 07, 2023</div>
                                        <span class="font-weight-bold">Эта функция находится в разработке, скоро она станет доступна!</span>
                                    </div>
                                </a>
                                <a class="dropdown-item d-none text-center small text-gray-500" href="#">Показать все уведомления</a>
                            </div>
                        </div>
                    </li>
                </div>
            </div>
            
            <!-- Nav Item - Центр уведомлений -->
            

            <div class="topbar-divider d-none d-sm-block"></div>

            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow col-auto">
                <div class="btn-group">
                    <button type="button" class="nav-link dropdown-toggle text-right" data-bs-toggle="dropdown" aria-expanded="false">
                        <b class="mr-2 fw-bold d-lg-inline text-gray-600 small">{{ user.usernick }} <br>
                            <span class="badge badge-pill" :class="{
                                'badge-primary': user.roles?.color == 'primary',
                                'badge-danger': user.roles?.color == 'danger',
                                'badge-secondary': user.roles?.color == 'secondary',
                                'badge-info': user.roles?.color == 'info'
                            }">{{ user.roles?.rolename }}</span>
                        </b>
                        <img class="img-profile rounded-circle"
                            src="https://i.ibb.co/M1n3Q59/undraw-profile.jpg">
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right animated--grow-in me-5">
                        <li style="cursor:  pointer;" class="dropdown-item">
                            <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Профиль
                        </li>
                        <li style="cursor:  pointer;" class="dropdown-item">
                            <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                            Настройки
                        </li>
                        <div class="dropdown-divider"></div>
                        <li style="cursor:  pointer;" @click="showLeaveModal" class="dropdown-item text-danger" data-toggle="modal" data-target="#logoutModal">
                            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Выйти
                        </li>
                    </ul>
                </div>
            </li>

        </ul>

    </nav>
    <!-- End of Topbar -->

    <div ref="leavemodal" class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 style="font-weight: 600;" class="modal-title" id="exampleModalLabel">Вы точно хотите выйти?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">Нажмите на кнопку <b>"Выйти"</b>, если Вы действительно хотите завершить сеанс на данном аккаунте.</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Отмена</button>
                    <button @click="leaveAccount" data-bs-dismiss="modal" class="btn btn-primary">Выйти</button>
                </div>
            </div>
        </div>
    </div>

    <div class="offcanvas offcanvas-start" style="width: 15%;" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
      <side-bar></side-bar>
    </div>
</template>

<style>
	
</style>