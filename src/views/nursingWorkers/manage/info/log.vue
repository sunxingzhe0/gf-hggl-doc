<template>
  <div v-loading="loading">
    <List v-model="query" :columns="columns" :tableData="tableData"> </List>
  </div>
</template>

<script>
import { commentList } from '@/api/nursingWorkers'
import { List, mixin } from '@/components'
import logHeaders from './logHeader.json'

export default {
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await commentList(params)) || {}
          res.headers = logHeaders.headers
          console.log(res, '----------')
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
      },
    }
  },
}
</script>

<style lang="scss" scoped></style>
