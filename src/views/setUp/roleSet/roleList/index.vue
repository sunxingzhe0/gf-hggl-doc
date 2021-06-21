<template>
  <div class="view__card" v-loading="loading">
    <List v-model="query" :columns="columns" :tableData="tableData">
      <template v-slot:footertool>
        <el-button type="primary" @click="editRole('add')">新增角色</el-button>
      </template>
      <template v-slot:fixed="{ row, $index }">
        <span v-if="!row.internal" class="btns" @click="editRole('edit', row)"
          >编辑</span
        >
        <span
          v-if="!row.internal"
          class="btns"
          @click="changeStatus(row, $index)"
          >{{ row.status ? '禁用' : '启用' }}</span
        >
        <span
          v-if="!row.internal && row.useAccountNumber == '0'"
          class="btns"
          @click="delList(row)"
          >删除</span
        >
      </template>
    </List>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { roleList, changeStatus, delRole } from '@/api/setUp'
import headers from './headers.json'
// import roleList from '@/store/mockState/roleList'
export default {
  name: 'roleList',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await roleList(params)) || {}
          res.headers = headers.headers
          return res
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
      },
      columns: {
        index: {
          hidden: true,
        },
        status: {
          formatter(row) {
            return row.status ? '启用' : '禁用'
          },
        },
      },
    }
  },
  methods: {
    editRole(type, row) {
      if (type === 'add') {
        this.$router.push({
          path: '/setUp/roleSet/addRole',
          query: '',
        })
        return
      }
      this.$router.push({
        path: '/setUp/roleSet/editRole',
        query: row,
      })
    },
    //状态变更
    async changeStatus(row, index) {
      const status = Number(!row.status)
      await changeStatus({ id: row.id, status })
      this.tableData.list[index].status = status
      this.$message({
        type: 'success',
        message: status ? '启用成功' : '禁用成功',
        showClose: true,
      })
    },
    async delList(row) {
      const confirm = await this.$confirm('是否确认删除？', '提示', {
        type: 'warning',
      }).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') return
      await delRole({ id: row.id })
      this.$message.success('删除成功！')
      this.$_fetchTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
.el-dialog__body {
  padding: 30px 20px !important;
  .el-form {
    width: 100%;
    .el-select {
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
