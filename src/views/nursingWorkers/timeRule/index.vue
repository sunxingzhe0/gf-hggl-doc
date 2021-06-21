<template>
  <div class="view__card isInfo" v-loading="loading">
    <List
      :filter="filter"
      v-model="query"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_state="{ row, $index }">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="row.state"
          @change="handleChange($event, row, $index)"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" @click="addRule">新增规则</el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <span @click="seeRule(row)" class="btns">查看</span>
        <span v-if="!row.state" @click="delList(row)" class="btns">删除</span>
      </template>
    </List>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { timeRuleList, editState, delTimeRule } from '@/api/nursingWorkers'
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
          const res = (await timeRuleList(params)) || {}
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
            options: [{ label: '规则名称', value: 0 }],
          },
          keys: ['searchType', 'searchKeywords'],
        },
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
        state: {
          label: '状态',
          prop: 'slot_state',
        },
      },
    }
  },
  created() {},
  methods: {
    addRule() {
      this.$router.push('/nursingWorkers/timeRule/addRule')
    },
    seeRule({ id }) {
      this.$router.push({
        path: '/nursingWorkers/timeRule/seeRule',
        query: id,
      })
    },

    //状态禁用 启用
    async handleChange(state, { id }, index) {
      if (state == 1) {
        const confirm = await this.$confirm(
          '启用当前规则将会自动停用其他规则，是否继续操作？',
          '提示',
          { type: 'warning' },
        ).catch(err => {
          this.tableData.list[index].state = 0
          console.log(err)
        })
        if (confirm !== 'confirm') return
      }
      await editState({ id, state }).catch(err => {
        this.tableData.list[index].state = !state
        throw Error(err)
      })
      this.tableData.list[index].state = state
      this.$message({
        type: 'success',
        message: state ? '启用成功' : '禁用成功',
        showClose: true,
      })
      this.$_fetchTableData()
    },

    //删除规则
    async delList({ id }) {
      const confirm = await this.$confirm('是否确认删除？', '提示', {
        type: 'warning',
      }).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') return
      await delTimeRule(id)
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
