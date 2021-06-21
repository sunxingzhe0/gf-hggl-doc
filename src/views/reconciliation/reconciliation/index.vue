<template>
  <div class="view__card">
    <!-- 筛选条件 -->
    <el-row>
      <el-col :span="7">
        <span class="label">账单类型</span>
        <el-select v-model="params.type" @change="changeType">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="13">
        <span class="label">日期选择</span>
        <el-date-picker
          style="margin-right: 10px;"
          v-model="params.dates"
          @change="changeDate"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button
          @click="handleTime(item)"
          v-for="item in dateBtns"
          :key="item.value"
          :type="active === item.value ? 'primary' : ''"
          >{{ item.label }}</el-button
        >
      </el-col>
      <el-col :span="4">
        <el-button type="primary">导出账单</el-button>
      </el-col>
    </el-row>
    <!-- echarts -->
    <el-row class="echarts">
      <el-col :span="12">
        <Echarts
          :options="oneOption"
          :styles="{
            height: '400px',
            border: '1px solid #e6e6e6',
            marginRight: '20px',
          }"
        />
      </el-col>
      <el-col :span="12">
        <Echarts
          :options="towOption"
          :styles="{ height: '400px', border: '1px solid #e6e6e6' }"
        />
      </el-col>
    </el-row>
    <!-- table -->
    <div v-loading="loading">
      <List v-model="query" :columns="columns" :tableData="tableData"> </List>
    </div>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import Echarts from '@/components/Echarts'
import echarts from 'echarts'
import { billList, priceSs, payPricePp } from '@/api/reconciliation'
import headers from './header.json'
export default {
  name: 'reconciliation',
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await billList(params)) || {}
          res.headers = headers.headers //Cannot set property 'headers' of null  list的body为null
          return res
        },
      },
    ]),
  ],
  components: {
    Echarts,
    List,
  },
  data() {
    return {
      params: {
        type: 'DAY', //类型
        dates: [], //日期组
      },

      //类型列表
      typeList: [
        {
          label: '日账单',
          value: 'DAY',
        },
        {
          label: '周账单',
          value: 'WEEK',
        },
        {
          label: '月账单',
          value: 'MONTH',
        },
      ],

      //时间按钮
      dateBtns: [
        { label: '今日', value: 'today' },
        { label: '昨日', value: 'yesterday' },
      ],

      //btn选中项
      active: '',
      oneOption: {},
      towOption: {},
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
  created() {
    this.initOneChartData()
    this.initTowChartData()
  },
  methods: {
    //初始化图表数据(柱)
    async initOneChartData() {
      const res = await priceSs()
      console.log(res, '柱状图数据')
      this.oneOption = {
        color: ['#0AB2C1'],
        xAxis: {
          type: 'category',
          data: [
            '2021-01',
            '2021-02',
            '2021-03',
            '2021-04',
            '2021-05',
            '2021-06',
            '2021-07',
          ],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [60, 110, 70, 200, 140, 280, 600],
            type: 'bar',
            barWidth: '20%',
          },
        ],
      }
    },
    //初始化图表数据（饼）
    async initTowChartData() {
      const res = await payPricePp()
      console.log(res, '饼状图数据')

      this.towOption = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          bottom: '50%',
          data: ['线上支付', '线下支付'],
        },
        color: ['#0AB2C1', '#0778CF'],
        series: [
          {
            name: '金额',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '线上支付' },
              { value: 200, name: '线下支付' },
            ],
            label: {
              normal: {
                position: 'inner',
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
    },

    //类型选择
    changeType(e) {
      console.log(e)
      const btns = {
        DAY: [
          { label: '今日', value: 'today' },
          { label: '昨日', value: 'yesterday' },
        ],
        WEEK: [
          { label: '本周', value: 'today' },
          { label: '上周', value: 'yesterday' },
        ],
        MONTH: [
          { label: '本月', value: 'today' },
          { label: '上月', value: 'yesterday' },
        ],
      }
      this.dateBtns = btns[e]
    },
    //时间选择
    changeDate(e) {
      console.log(this.params.dates)
    },
    //时间按钮触发
    handleTime(e) {
      console.log(e)
    },
  },
}
</script>

<style lang="scss" scoped>
.label {
  margin-right: 10px;
}
.echarts {
  margin-top: 20px;
}
</style>
