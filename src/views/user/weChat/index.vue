<template>
  <section class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_name="{ row }">
        <!-- <el-avatar :size="60" :src="FILE_URL(row.avatar)"></el-avatar> -->
        <div style="line-height: 30px;">
          <el-image style="float: left;" :src="FILE_URL(row.avatar)">
            <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
          </el-image>
          <span>{{ row.name }}</span>
        </div>

        <!-- <img :src="FILE_URL(row.avatar)" alt=""> -->
      </template>
    </List>
  </section>
</template>
<script>
import { List, mixin } from '@/components'
// import { getorgUserList } from '@/api/list'
// import weixin from '@/store/mockState/weixin'
import { wechatList } from '@/api/wechat'
import headers from './headers.json'
export default {
  components: {
    List,
  },
  mixins: [
    mixin({
      fetchListFunction: async function (params) {
        if (params.searchType && params.searchKeywords) {
          const key = params.searchType
          const val = params.searchKeywords
          Object.assign(params, { [key]: val })
          key === 'userId' && params.name && delete params.name
          key === 'name' && params.userId && delete params.userId
        }
        if (!params.searchKeywords) {
          delete params.name
          delete params.userId
        }
        const res = (await wechatList(params)) || {}
        res.headers = headers.headers
        return res
      },
    }),
  ],
  data() {
    return {
      query: {
        size: 10,
        current: 1,
        timeType: 1,
        searchType: 'name',
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '创建时间', value: 1 }],
          },
          keys: ['timeType', 'startCreateTime', 'endCreateTime'],
        },
        search: {
          props: {
            options: [
              { label: '微信昵称', value: 'name' },
              { label: '用户ID', value: 'userId' },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '性别',
              options: [
                { label: '不限', value: '' },
                { label: '男', value: '1' },
                { label: '女', value: '2' },
              ],
            },
            keys: 'sex',
          },
        ],
      }
    },

    columns() {
      return {
        index: {
          hidden: true,
        },
        //最近一次登录时间
        lastLoginTime: {
          minWidth: 120,
        },
        //第一次登录时间
        firstLoginTime: {
          minWidth: 120,
        },
        payFee: {
          formatter(row) {
            if (row.payFee) {
              return '¥' + row.payFee
            } else {
              return '-'
            }
          },
        },
        //头像
        name: {
          prop: 'slot_name',
          minWidth: 90,
        },
        sex: {
          formatter(row) {
            return row.sex == 1 ? '男' : '女'
          },
        },
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.el-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
span {
  margin-left: 15px;
}
::v-deep .c__filter .prepend-select {
  width: 210px;
}
::v-deep .c__filter .prepend-select-date .el-input__inner {
  // width: calc(100px +51px);
  width: 100%;
}
::v-deep .table-wrap .cell {
  font-size: 16px;
}
::v-deep .el-table .cell.el-tooltip {
  font-size: 14px;
  padding-left: 6px;
}
</style>
