<template>
  <div class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
    </List>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
// import achievement from '@/store/mockState/achievement'
import headers from './headers.json'
import { saleList } from '@/api/statistics'
export default {
  name: 'achievement',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await saleList(params)) || {}
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
            options: [{ label: '统计时段', value: 0 }],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        /*  search: {
          props: {
            options: [
              { label: '账号', value: 0 },
              { label: '姓名', value: 1 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        }, */
        popover: [
          {
            props: {
              label: '售后笔数',
              is: 'InputRange',
            },
            keys: ['startMoney', 'endMoney'],
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
      },
    }
  },
  created() {},
  methods: {},
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
</style>
