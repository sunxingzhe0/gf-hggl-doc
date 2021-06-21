<template>
  <div class="view__card isInfo" v-loading="false">
    <List v-model="query" :columns="columns" :tableData="tableData">
      <template v-slot:footertool>
        <el-button type="primary" @click="addTask">新增任务</el-button>
      </template>

      <template v-slot:fixed="{ row }">
        <span class="btns" @click="goInfo(row.orderId)">查看</span>
        <span class="btns" @click="edit">编辑</span>
      </template>
    </List>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { taskList } from '@/api/nursing'
import header from './header.json'
export default {
  name: 'taskList',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function () {
          return Object.assign(await taskList(), {
            headers: header.headers,
          })
        },
      },
    ]),
  ],
  data() {
    return {
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        field: 'create_time',
        sorted: 'DESC',
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
    goInfo(orderId) {
      this.$router.push(`/nursing/task/taskInfo?orderId=${orderId}`)
    },

    edit() {
      this.$router.push('/nursing/task/add')
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
