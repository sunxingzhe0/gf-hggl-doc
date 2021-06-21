<template>
  <div class="view__card isInfo" v-loading="loading">
    <List
      :filter="filter"
      v-model="query"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:footertool>
        <el-button type="primary" @click="toEdit(false)">新增排班</el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <span class="btns" v-if="row.state" @click="toInfo(row.code)"
          >查看</span
        >
        <span class="btns" v-if="!row.state" @click="release(row)">发布</span>
        <span class="btns" v-if="!row.state" @click="toEdit(row.code)"
          >编辑</span
        >
        <span class="btns" v-if="!row.state" @click="delList(row)">删除</span>
      </template>
    </List>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { scheduleList } from '@/api/nursingWorkers'
import { releaseSchedule, delSchedule } from '@/api/nursingWorkers'
import headers from './header.json'
export default {
  name: 'workface',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await scheduleList(params)) || {}
          res.headers = headers.headers
          return res
        },
      },
    ]),
  ],
  data() {
    return {
      filter: {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '标题', value: 0 },
              { label: '业务', value: 1 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '状态',
              options: [
                { label: '不限', value: '' },
                { label: '待发布', value: '0' },
                { label: '生效中', value: '1' },
                { label: '已过期', value: '2' },
              ],
            },
            keys: 'state',
          },
        ],
      },
      query: {
        timeType: 0,
        searchType: 0,
        size: 10,
        current: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 160,
        },
        state: {
          formatter(row) {
            return row.state
              ? row.state === 1
                ? '生效中'
                : '已过期'
              : '待发布'
          },
        },
        cycle: {
          formatter(row) {
            const types = {
              DAY: '每日',
              WEEK: '每周',
              MONTH: '每月',
            }
            return types[row.cycle]
          },
        },
      },
    }
  },
  created() {},
  methods: {
    handleClosed(formName) {
      this.$refs[formName].resetFields()
    },
    submit() {},
    openDialog(type) {
      this.dialogData.isVisible = true
      if (type === 'add') {
        this.dialogData.title = '新增护工'
        return
      }
      this.dialogData.title = '编辑护工'
    },
    //编辑新增
    toEdit(code) {
      if (code) {
        return this.$router.push({
          path: '/nursingWorkers/workface/edit',
          query: code,
        })
      }
      this.$router.push('/nursingWorkers/workface/add')
    },

    //查看详情
    toInfo(code) {
      this.$router.push({
        path: '/nursingWorkers/workface/info',
        query: code,
      })
    },

    //发布排班
    async release({ code }) {
      const confirm = await this.$confirm('是否确认发布？', '提示', {
        type: 'warning',
      }).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') return
      await releaseSchedule({ code })
      this.$message.success('发布成功')
    },

    //删除排班
    async delList({ code }) {
      const confirm = await this.$confirm('确认删除？', '提示', {
        type: 'warning',
      }).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') return
      await delSchedule({ code })
      this.$message.success('删除成功')
      this.$_fetchTableData()
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
