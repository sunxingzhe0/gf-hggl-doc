<template>
  <div class="view__card">
    <el-row>
      <el-col v-for="val in fieldList" :key="val.value" :span="val.rowSize">
        <span class="title">{{ val.label }}：</span>
        <div v-if="val.value === 'timeNum'">
          <div>{{ infoData.nums }}</div>
          <div
            class="time-list"
            v-for="(val, index) in infoData.times"
            :key="index"
          >
            <span>{{ index + 1 }}. </span>
            <span class="name">{{ val.name }}</span>
            <span class="time">{{ val.beginTime }}</span>
            <span class="time">~</span>
            <span class="time">{{ val.endTime }}</span>
          </div>
        </div>
        <div v-else-if="val.value === 'usage'">
          <span class="btns" @click="seeList">查看</span>
          <span class="btns">/</span>
          <span class="btns" @click="updateList">刷新</span>
        </div>
        <div v-else-if="val.value === 'status'">
          {{
            infoData.state == 1 ? '启用' : infoData.state == 0 ? '禁用' : '--'
          }}
        </div>
        <div v-else>{{ infoData[val.value] || '--' }}</div>
      </el-col>
    </el-row>
    <div v-show="isList" v-loading="loading">
      <List
        :filter="filter"
        v-model="query"
        :columns="columns"
        :tableData="tableData"
      >
        <template v-slot:footertool> </template>
        <!-- <template v-slot:fixed="{ row }">
        <router-link class="el-button el-button--text" :to="`detail/${row.id}`">
          查看
        </router-link>
      </template> -->
      </List>
    </div>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { getRuleInfoById, ruleUsedList } from '@/api/nursingWorkers'
import headers from './header.json'
export default {
  name: 'seeRule',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await ruleUsedList(params)) || {}
          res.headers = headers.headers
          return res
        },
      },
    ]),
  ],
  data() {
    return {
      isList: false,
      id: '',
      infoData: {
        ruleName: '规则1xx',
        createUser: '赵游',
        createTime: '2020-12-22 04：12：11',
        state: '启用',
        nums: '',
      },
      fieldList: [
        { label: '规则名称', value: 'ruleName', rowSize: 6 },
        { label: '创建人', value: 'createUser', rowSize: 6 },
        { label: '创建时间', value: 'createTime', rowSize: 6 },
        { label: '状态', value: 'status', rowSize: 6 },
        { label: '时段数量', value: 'timeNum', rowSize: 24 },
        { label: '当前使用情况', value: 'usage', rowSize: 24 },
      ],
      filter: {
        date: {
          props: {
            options: [
              { label: '排班开始日期', value: 0 },
              { label: '排班结束日期', value: 1 },
            ],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '护工姓名', value: 0 },
              { label: '手机号', value: 1 },
            ],
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
      },
    }
  },
  created() {
    this.id = Object.values(this.$route.query).join('') || ''
    this.getRuleInfoById()
  },
  methods: {
    async getRuleInfoById() {
      const res = await getRuleInfoById({ id: this.id })
      this.infoData = res
    },
    seeList() {
      this.isList = true
    },
    updateList() {
      this.$_fetchTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 40px;
  .el-col {
    margin-top: 20px;
    display: flex;
    .title {
      color: #666;
    }
  }
}
.btns {
  color: #0ab2c1;
  cursor: pointer;
}
.time-list {
  color: #666;
  margin-top: 10px;
  .name {
    display: inline-block;
    min-width: 50px;
  }
}
</style>
