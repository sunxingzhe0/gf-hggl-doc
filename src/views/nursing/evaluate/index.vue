<template>
  <div class="view__card isInfo" v-loading="false">
    <List v-model="query" :columns="columns" :tableData="tableData">
      <!-- <template v-slot:fixed="{}">
        <span class="btns" @click="goInfo">查看</span>
        <span class="btns" @click="edit">编辑</span>
      </template> -->
    </List>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { commentList } from '@/api/nursing'
import header from './header.json'
export default {
  name: 'commentList',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          return Object.assign(await commentList(params), {
            header: header.headers,
          })
        },
      },
    ]),
  ],
  data() {
    return {
      query: {
        size: 10,
        current: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
      },
    }
  },
  created() {},
  methods: {
    goInfo() {
      this.$router.push('/nursing/task/taskInfo')
    },

    edit() {
      this.$router.push('/nursing/task/edit')
    },
    addTask() {
      this.$router.push('/nursing/task/add')
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .component__dialog {
  max-width: 1200px;
  width: 1200px !important;
}
.el-select {
  width: 280px;
}
.el-input {
  width: 280px;
}
.view__card {
  .el-dialog__body {
    padding: 30px 20px !important;
    .el-form {
      width: 100%;
    }
  }
}
.btns {
  color: #0ab2c1;
  font-size: 14px;
  cursor: pointer;
}
</style>
