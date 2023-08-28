<script>
  import { RouterView, useRoute } from 'vue-router'
  import AppHeader from './components/AppHeader.vue'
  import FooterPage from './components/FooterPage.vue'

  export default {
    components: {
      RouterView,
      AppHeader,
      FooterPage
    },
    mounted() {
      window.addEventListener("resize", this.myEventHandler);
      this.width = window.innerWidth;
      this.checkName();
    },
    unmounted() {
      window.removeEventListener("resize", this.myEventHandler);
      this.width = window.innerWidth;
      this.checkName();
    },
    methods: {
      myEventHandler() {
        this.width = window.innerWidth;
      },
      checkName() {
        const routeName = this.$route.name;

        if (routeName == 'dashboard' || routeName == 'userslist' || routeName == 'edituser' || routeName == 'registry' || routeName == 'members' || routeName == 'allreg' || routeName == 'newpost' || routeName == 'chats' || routeName == 'chat') {
          this.show = true;
        } else {
          this.show = false;
        }
      }
    },
    data() {
      return {
        width: 0,
        show: false,
      }
    },
    watch: {
      $route () {
        this.checkName();
      }
    }
  }
</script>

<template>
  <div id="wrapper">
    <div id="pageTop"></div>

        <!-- Sidebar -->

        <!-- End of Sidebar -->

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">

                <!-- Topbar -->
                <app-header v-if="show"></app-header>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <router-view></router-view>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <!-- Footer -->
            <footer-page v-if="this.$route.name != 'home' && this.$route.name != 'registration'"></footer-page>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#pageTop">
        <i class="fas fa-angle-up"></i>
    </a>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  body {
    font-family: 'Montserrat', sans-serif !important;
  }
</style>