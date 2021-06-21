<template>
  <div class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_title="{ row }">
        <div :class="['title', !row.readed ? 'unread' : '']">
          {{ row.title }}
        </div>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" @click="batchRead"> 一键已读 </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="info(row)">查看</el-button>
      </template>
    </List>
  </div>
</template>
<script>
// import { formatDate } from '@/utils'
import { List, mixin } from '@/components'
import { msgList, changeReadedAll } from '@/api/setUp'
import headers from './headers.json'
// import msgList from '@/store/mockState/msgList'
export default {
  name: 'systemMsg',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          if (params.searchType && params.searchKeywords) {
            const key = params.searchType
            const val = params.searchKeywords
            Object.assign(params, { [key]: val })
          }
          if (!params.searchKeywords) {
            delete params.title
          }
          const res = (await msgList(params)) || {}
          res && (res.headers = headers.headers)
          return res
        },
      },
    ]),
  ],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '推送时间', value: 0 }],
        },
        keys: ['timeType', 'startSendTime', 'endSendTime'],
      },
      search: {
        props: {
          options: [{ label: '消息标题', value: 'title' }],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: '' },
              { label: '未读', value: 0 },
              { label: '已读', value: 1 },
            ],
          },
          keys: 'readed',
        },
      ],
    }
    return {
      batchRead_: '',
      query: {
        timeType: 0,
        searchType: 'title',
        size: 10,
        current: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        title: {
          prop: 'slot_title',
          minWidth: 300,
        },
        readed: {
          formatter(row) {
            return row.readed ? '已读' : '未读'
          },
        },
      },
    }
  },
  methods: {
    //一键已读
    async batchRead() {
      const confirm = await this.$confirm('确定一键已读吗？', '提示', {
        type: 'warning',
      }).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') return

      let list = this.tableData.list
      const ids = list.map(item => {
        return item.id
      })
      await changeReadedAll({ ids })
      this.$_fetchTableData()
      this.$message.success('操作成功')
    },

    //查看详情
    info(row) {
      this.$router.push({
        path: '/setUp/systemMsg/msgDetail',
        query: row,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.title {
  &::before {
    content: '•';
    color: #333;
  }
  &.unread {
    &::before {
      color: #ef5757;
    }
  }
}
</style>
