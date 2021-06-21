<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="navbar-center"></div>

    <div class="right-menu">
      <template>
        <div class="right-menu-item account-wrapper">
          <el-image :src="FILE_URL(userInfo.avatar)" class="avatar_round">
            <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
          </el-image>
          <el-popover
            placement="top-start"
            trigger="hover"
            :content="roleListNames"
          >
            <span slot="reference"
              ><b>{{ userInfo.username }} </b></span
            >
          </el-popover>

          <span>({{ userInfo.account }} )</span>
        </div>
      </template>

      <el-popconfirm
        class="right-menu-item hover-effect"
        title="是否退出登录？"
        @confirm="logout"
      >
        <svg-icon slot="reference" icon-class="navbar-logout" />
      </el-popconfirm>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { mapGetters, mapState, mapMutations } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { removeToken } from '@/utils/auth'
export default {
  inject: ['reload'],
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      message: 0,
      roleListNames: '',
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name']),
    ...mapState('user', [
      'account',
      'roleList',
      'avatar',
      'username',
      'userInfo',
    ]),
    updateListFlagNavNotice() {
      return this.$store.state.updateList.updateListFlagNavNotice
    },
  },
  created() {
    this.roleListNames = this.roleList.map(({ name }) => name).join(',')
  },
  mounted() {
    this.checkPhone()
  },
  watch: {
    'store.id': {
      handler() {
        this.reload()
      },
    },
    updateListFlagNavNotice() {},
  },
  methods: {
    ...mapMutations('user', ['SET_DEFAULT_DEPT', 'SET_DEFAULT_STORE']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 检查是不是绑定了手机号 没有则跳过去
    checkPhone() {
      const userPhone = this.$store.state.user.phone
      if (!userPhone) {
        if (checkPermission(['ORG_WEB'])) {
          this.$confirm('您还未绑定手机号，是否去绑定？', '提示', {
            confirmButtonText: '去绑定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              this.$router.push({ path: '/set-up/account' })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '为保证您的权益，请尽快绑定手机号！',
              })
            })
        }
      }
    },
    logout() {
      removeToken()
      this.$router.push(`/login`)
    },
    toMyMessage() {
      if (checkPermission(['DRUG_DOC_NEWS_SYSTEM_MESSAGE'])) {
        this.$router.push('/message/systemMsg/list')
      } else {
        this.$router.push('/set-up/systemMsg/list')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar_round {
  width: 30px;
  height: 30px;
  font-size: 0px;
}
.navbar {
  display: flex;
  justify-content: space-between;
  height: 40px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 40px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .navbar-center {
    flex: auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .org-name {
      margin: 0;
      font-size: 16px;
    }

    > * + * {
      margin-left: 10px;
    }
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 40px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      &.el-badge {
        ::v-deep .el-badge__content {
          min-width: 20px;
          /* border-radius: 50%; */
          display: flex;
          padding: 2px;
          height: 18px;
          font-size: 8px;
          /* line-height: 16px; */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        ::v-deep .el-badge__content.is-fixed {
          top: 11px;
          right: 17px;
        }
      }

      &:last-child {
        margin-right: 20px;
      }
    }

    .account-wrapper {
      display: inline-flex;
      justify-content: space-around;
      align-items: center;
      margin: 0 30px;
      font-size: 16px;

      .el-avatar {
        margin-right: 10px;
      }

      > * + * {
        margin-left: 6px;
      }
    }
  }
}
.el-dropdown {
  cursor: pointer;
}
</style>
