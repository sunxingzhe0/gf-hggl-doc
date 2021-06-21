<template functional>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <router-link class="sidebar-logo-link" to="/">
      <slot></slot>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: $sideBarWidth;
  line-height: $sideBarWidth;
  text-align: center;
  overflow: hidden;
  border-bottom: 2px solid $--color-info-lighter;
  box-sizing: content-box;
  transition: all 0.2s;

  & .sidebar-logo-link {
    vertical-align: top;
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      height: 50%;
      vertical-align: middle;
      background: $--color-primary;
      border-radius: 50%;
      color: $--color-white;

      > svg {
        margin-right: 0 !important;
        width: 60%;
        height: 60%;
      }
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    height: 54px;
    line-height: 54px;

    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
