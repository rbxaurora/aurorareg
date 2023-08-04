import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from './views/LoginPage.vue';
import DashboardPage from './views/DashboardPage.vue'
import UsersPage from './views/UsersPage.vue'
import EditUser from './views/EditUser.vue'
import RegPage from './views/RegPage.vue'
import RegisterPage from './views/RegisterPage.vue'
import MembersPage from './views/MembersPage.vue'
import RegistryPage from './views/RegistryPage.vue'

export default createRouter({
	history: createWebHistory(),

	routes: [
		{
			path: '/',
			name: 'home',
			component: LoginPage
		},
		{
			path: '/dashboard',
			name: 'dashboard',
			component: DashboardPage
		},
		{
			path: '/dashboard/userslist',
			name: 'userslist',
			component: UsersPage
		},
		{
			path: '/dashboard/edituser/:username',
			name: 'edituser',
			component: EditUser
		},
		{
			path: '/dashboard/registry/new',
			name: 'registry',
			component: RegPage
		},
		{
			path: '/registration',
			name: 'registration',
			component: RegisterPage
		},
		{
			path: '/dashboard/members-base',
			name: 'members',
			component: MembersPage
		},
		{
			path: '/dashboard/registry',
			name: 'allreg',
			component: RegistryPage
		}
	]
});