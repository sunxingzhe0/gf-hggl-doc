<template>
  <div class="view__card isInfo" v-loading="loading">
    <List
      :filter="filter"
      v-model="query"
      :columns="columns"
      :tableData="tableData"
    >
    </List>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { workCountList } from '@/api/nursingWorkers'
import headers from './header.json'
export default {
  name: 'workCensus',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await workCountList(params)) || {}
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
            options: [{ label: '工单日期', value: 0 }],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '护工姓名', value: 0 },
              { label: '服务对象', value: 1 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '状态',
              options: [
                { label: '全部', value: '' },
                { label: '空闲', value: '0' },
                { label: '忙碌', value: '1' },
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
        patientInfos: {
          formatter(row) {
            let arr = row.patientInfos.map(item => {
              item.name
            })
            return arr.join('、')
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
</style>
