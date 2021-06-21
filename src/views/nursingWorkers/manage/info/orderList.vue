<template>
  <div v-loading="loading">
    <List v-model="query" :columns="columns" :tableData="tableData"> </List>
  </div>
</template>

<script>
import { workorderList } from '@/api/nursingWorkers'
import { List, mixin } from '@/components'
import orderHeader from './orderHeader.json'

export default {
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await workorderList(params)) || {}
          res.headers = orderHeader.headers
          return res
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
        patientSex: {
          formatter(row) {
            return row.patientSex ? (row.patientSex == 1 ? '男' : '女') : '未知'
          },
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped></style>
