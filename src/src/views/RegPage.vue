<script>
    import axios from 'axios'
    import dayjs from 'dayjs'

    import AppHeader from '../components/AppHeader.vue'
    import SideBar from '../components/SideBar.vue'

    export default {
        components: {
            AppHeader,
            SideBar
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
            goDashboard() {
                this.$router.push({
                    name: 'dashboard'
                })
            },
            putMember(index) {
                const member = this.members[index];

                let memberInfo = {
                    member,
                    memberTextForInput: `${member.name} [${member.id}] - ${member.roblox}`
                }

                this.membersReg.push(memberInfo);
            },
            async sendReport () {
                if (!this.date) {
                    return this.dateIsInvalid = true;
                }

                const token = this.$cookies.get('authToken');
                const date = dayjs(this.date).toISOString();

                if (!token) {
                    return this.leaveAccount();
                }

                await axios.post('/api/sendreport', {
                    date: date,
                    memberList: this.membersReg
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((response) => {
                    this.$router.push({
                        name: 'dashboard'
                    });
                }).catch((e) => {
                    console.log(e)
                })
            }
        },
        mounted() {
            this.getUser();
        },
        data () {
            return {
                user: '',
                date: '',
                dateIsInvalid: false,
                members: [],
                search: '',
                membersReg: [],
                isReady: false,
            }
        },
        watch: {
            async search() {
                const value = this.search;

                if (value.length != 0) {
                    await axios.get('/api/memberinfo', {
                        params: {
                            value: value
                        }
                    }).then(response => {
                        this.members = (response.data);
                    }).catch((e) => {
                        this.members = null;
                    });
                } else {
                    this.members = null;
                }

            },
            date () {
                this.dateIsInvalid = false;    
            }
        }
    }
</script>

<template>
    <div class="container">

        <!-- Page Heading -->
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Новая запись в Реестр съемок</h1>
        </div>

        <div v-if="!isReady" class="text-center my-5">
            <img style="opacity: 55%;" src="../../img/loading.gif" :width="62">
        </div>

        <!-- Content Row -->
        <div v-if="user.roles?.value != 'USER' && isReady" class="row">
            <form @submit.prevent="sendReport">
                <label class="form-label d-block w-100 mb-2">
                    Дата сьемки
                    <input type="date" class="form-control" :class="{
                        'is-invalid': this.dateIsInvalid
                    }" v-model="date">
                    <span v-if="dateIsInvalid" class="invalid-feedback">Вы не ввели дату сьемок</span>
                </label>
                <label style="height: 120px; overflow-y: auto;" class="form-label d-block w-100 mb-4">
                    Участники, присутствовавшие на сьемках
                    <input type="search" class="form-control" v-model="search">
                    <button type="button" @click="putMember(index)" v-for="(item, index) in members" v-if="search" class="btn btn-outline-secondary mt-1">{{ item.name }} [{{ item.id }}] - {{ item.roblox }}</button>
                </label>
                <label v-if="membersReg.length != 0" class="form-label w-100 mb-2">
                    Список участников
                    <input v-if="membersReg" type="text" class="form-control mt-1" v-for="(item, index) in membersReg" :value="item.memberTextForInput" readonly>
                </label>

                <button type="submit" class="btn btn-primary mt-3 mb-5">Отправить</button>
            </form>
        </div>

        <!-- Content Row -->

        <div class="row">

        </div>

        <!-- Content Row -->

        <div class="row mt-4" v-if="user.roles?.value == 'USER'">
            <div class="text-center">
                <b>Чтобы воспользоваться панелью, Вам нужно обладать правами Администратора. Пожалуйста, обратитесь к системному администратору для выдачи прав.</b>
            </div>
        </div>

    </div>
</template>

<style>

</style>