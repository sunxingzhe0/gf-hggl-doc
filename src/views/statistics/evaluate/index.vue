<template>
  <section class="view__card view__statistics-comment">
    <el-row>
      <el-col :md="18">
        <el-date-picker
          style="margin-right: 10px;"
          type="daterange"
          :clearable="false"
          :picker-options="pickerOptions"
          value-format="yyyyMMdd"
          v-model="date"
          @change="handleDatePickerChange"
        ></el-date-picker>

        <el-button
          v-for="_ in [7, 30, 90]"
          :key="_"
          :type="active === _ ? 'primary' : ''"
          @click="changeDate(_)"
        >
          {{ _ === 7 ? '最近7天' : `最近${_}天` }}
        </el-button>
      </el-col>
      <el-col :md="4" class="is-right">
        <el-button type="primary" @click="fails">导出数据</el-button>
        <el-button
          type="info"
          style="border-color: #f4f4f5;"
          plain
          @click="Refresh"
          >刷新</el-button
        >
      </el-col>
    </el-row>
    <h3 class="view__title">评价均分TOP8</h3>
    <el-row class="view__content" v-loading="loading">
      <el-col :span="16">
        <span>业务类型</span>
        <el-radio-group v-model="arrayS" @change="meter">
          <el-radio-button
            v-for="_ in typeList"
            :key="_.value"
            :label="_.value"
            >{{ _.label }}</el-radio-button
          >
        </el-radio-group>
        <span style="margin-left: 20px;">排名方式</span>
        <el-radio-group v-model="groupType" @change="meter">
          <el-radio-button v-for="_ in branch" :key="_.id" :label="_.id">{{
            _.name
          }}</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="8" class="is-right">
        <el-radio-group v-model="typeDate" @change="meBts">
          <el-radio-button
            v-for="(_, index) in ['按日', '按周', '按月']"
            :key="_"
            :label="index + 1"
            >{{ _ }}</el-radio-button
          >
        </el-radio-group>
      </el-col>
      <el-col :span="24">
        <span>评价均分</span>
        <Echarts
          :options="options"
          :styles="{ height: '400px', border: '1px solid #e6e6e6' }"
        />
      </el-col>
      <el-col>
        <span>全部排名</span>
      </el-col>
      <el-col>
        <el-table
          :data="tableData"
          border
          style="width: 100%;"
          :header-cell-style="{ textAlign: 'center' }"
        >
          <el-table-column
            width="500"
            label="名次"
            prop="index"
            align="center"
          ></el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="{}">
              <el-select size="mini" v-model="btnWcno" @change="jend">
                <el-option
                  v-for="item in branch"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>

            <template v-slot:default="{ row }">
              <el-row>
                <el-col :span="24">
                  <template>
                    {{ btnWcno == 1 ? row.header : row.header }}
                  </template>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { isEqual } from 'lodash'
import { scoreSs, rankinglist, exportData } from '@/api/statistics'
import { formatDate } from '@/utils'
import Echarts from '@/components/Echarts'

export default {
  name: 'StatisticsComment',
  components: {
    Echarts,
  },
  data() {
    this.pickerOptions = {
      shortcuts: [
        {
          text: '昨天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 87)
            picker.$emit('pick', [start, end])
          },
        },
      ],
    }

    return {
      options: {}, //echarts 配置
      loading: false,
      active: 7,
      arrayS: '', //业务类型
      groupType: 1, //分组类型
      vbrSan: [], //总分
      bacBat: 0,
      btnWcno: 1,
      branch: [
        //科室 医生 护士 药师
        {
          name: '分组',
          id: 2,
        },
        {
          name: '个人',
          id: 1,
        },
      ],
      date: [
        formatDate(
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6),
          'yyyyMMdd',
        ),
        formatDate(new Date(), 'yyyyMMdd'),
      ],

      type: 0,
      typeDate: 1,

      tableData: [
        { index: 1, header: '分组一' },
        { index: 2, header: '分组二' },
        { index: 3, header: '分组三' },
        { index: 4, header: '分组四' },
      ], //机构端排名
      typeList: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '陪护',
          value: 2,
        },
        {
          label: '陪检',
          value: 1,
        },
        {
          label: '送标本',
          value: 0,
        },
      ],
    }
  },
  created() {
    this.meter()
    this.jend()
  },
  methods: {
    //按周期筛选
    meBts() {
      this.meter()
    },

    //刷新
    async Refresh() {
      this.loading = true
      this.active = 7
      await this.meter()
      await this.jend()
      this.loading = false
    },

    //时间选择
    handleDatePickerChange(val) {
      this.pickerOptions.shortcuts.some(({ text, onClick }) => {
        let dates = null
        onClick({
          $emit: (name, values) => {
            dates = values.map(_ => formatDate(_, 'yyyyMMdd'))
          },
        })

        if (isEqual(dates, val)) {
          this.active = { 最近一周: 7, 最近30天: 30, 最近90天: 90 }[text]
          return true
        }
        this.active = 0
        return false
      })
      this.meter()
      this.jend()
    },

    //请求图表数据
    async meter() {
      this.options = {
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        color: [
          '#B28850',
          '#8957A1',
          '#0068B7',
          '#0AB2C1',
          '#8FC31F',
          '#EA68A2',
        ],
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
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
            name: '分组1',
            type: 'line',
            stack: '总量',
            data: [300, 132, 555, 134, 555, 230, 210],
          },
          {
            name: '分组2',
            type: 'line',
            data: [400, 1200, 666, 777, 290, 666, 310],
          },
          {
            name: '分组3',
            type: 'line',
            data: [150, 232, 121, 999, 190, 330, 410],
          },
          {
            name: '分组4',
            type: 'line',
            data: [600, 332, 222, 888, 444, 330, 777],
          },
          {
            name: '分组5',
            type: 'line',
            data: [820, 932, 555, 934, 1290, 1330, 1320],
          },
          {
            name: '分组6',
            type: 'line',
            data: [666, 444, 777, 555, 1111, 1222, 444],
          },
        ],
      }

      let res = await scoreSs({
        startTime: this.date[0], //开始时间
        endTime: this.date[1], //结束时间
        typeId: this.arrayS, //业务类型
        type: this.typeDate, //日期显示 按周 按日 按月
        groupType: this.groupType, //1个人 2分组
      })
    },

    //请求排名数据
    async jend() {
      let res = await rankinglist({
        rankingTye: this.btnWcno, //科室 医生
      })
      this.tableData = res.list
    },

    //时间筛选  最近 xx天
    changeDate(days) {
      this.active = days
      switch (days) {
        case 7:
          this.pickerOptions.shortcuts[0].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
        case 30:
          this.pickerOptions.shortcuts[1].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
        case 90:
          this.pickerOptions.shortcuts[2].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
      }
      this.meter()
      this.jend()
    },

    //导出数据
    async fails() {
      await exportData({
        startTime: this.date[0], //开始时间
        endTime: this.date[1], //结束时间
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_modules-detail.scss';

.view__statistics-comment {
  .chart {
    height: 400px;
  }
}
.sortF {
  margin-left: 30px;
}
.el-col-12 {
  width: 100%;
}
.el-table td div {
  text-align: center;
}
</style>
