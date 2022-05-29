<template>
  <div class="contentier">
    <div class="left">
      <LeftHome></LeftHome>
    </div>
    <div class="right">
      <div class="top">
        <TopRight></TopRight>
      </div>
      <transition name="fade">
        <router-view v-if="isRouterAlive"></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
import LeftHome from "./LeftHome";
import TopRight from "./TopRight";
export default {
  name: "",
  provide () {
    return {
      reload: this.reload
    }
  },
  props: {},
  components: {
    LeftHome,
    TopRight,
  },
  data () {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>
<style scoped>
* {
  border: 0;
  padding: 0;
}
.fade-enter {
  visibility: hidden;
  opacity: 0;
}
.fade-leave-to {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}
.fade-enter-to,
.fade-leave {
  visibility: visible;
  opacity: 1;
}
.contentier {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.left {
  float: left;
  height: 100%;
  background-color: #8076a3;
}

.right {
  flex: 1;
  background-color: #fff;
}

.right .top {
  width: 100%;
  height: 60px;
  background-color: #8076a3;
}

.right .top-left {
  float: left;
}

.top-left {
  width: 50px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 30px;
  background-color: #8076a3;
}
</style>