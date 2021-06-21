<template>
  <div class="view__card">
    <el-form>
      <!-- header -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="编号：">
            <span>{{ formData.code || '--' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标题：">
            <el-input
              v-model="formData.title"
              type="text"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务：">
            <el-select v-model="formData.busId">
              <el-option
                v-for="val in bizList"
                :key="val.id"
                :label="val.busName"
                :value="val.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- table -->
      <div class="table">
        <div class="left" v-loading="groupLoading">
          <div class="title">护工分组（{{ groupList.length || 0 }}）</div>
          <el-checkbox-group v-model="formData.groupIds" @change="changGroup">
            <el-checkbox
              :disabled="!val.state"
              v-for="val in groupList"
              :key="val.id"
              :label="val.id"
              >{{ val.groupName }}（{{ val.nspNum }}）</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <div class="right" v-loading="loading">
          <List
            v-model="query"
            :columns="columns"
            :tableData="tableData"
          ></List>
        </div>
      </div>
      <!-- bt -->
      <el-row style="margin-top: 30px;">
        <!--  <el-col :span="8">
          <el-form-item label="服务范围：">
            <el-select v-model="slectRange">
              <el-option label="范围一" value="1"></el-option>
              <el-option label="范围二" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="时段：">
            <el-date-picker
              v-model="formData.times"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="changeTime"
            >
            </el-date-picker>

            <!-- 时段规则 -->
            <div
              class="time-price"
              v-for="(val, index) in timeList"
              :key="val.id"
            >
              <el-checkbox v-model="formData.timeInfo[index].isCheck"
                >{{ formData.timeInfo[index].name }}（{{
                  formData.timeInfo[index].beginTime +
                  '-' +
                  formData.timeInfo[index].endTime
                }}）</el-checkbox
              >
              <div class="price">
                <span>￥</span>
                <el-input
                  size="mini"
                  v-model="formData.timeInfo[index].price"
                  type="text"
                ></el-input>
                <span>/次</span>
              </div>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="周期：">
            <el-select v-model="formData.cycleType" @change="changeCycleType">
              <el-option
                v-for="val in cycleTypeList"
                :key="val.value"
                :label="val.label"
                :value="val.value"
              ></el-option>
            </el-select>
            <div class="check-list">
              <el-checkbox-group
                v-model="formData.cycleDays"
                v-if="formData.cycleType === 'WEEK'"
              >
                <el-checkbox
                  v-for="val in week"
                  :key="val.value"
                  :label="val.value"
                  >{{ val.label }}</el-checkbox
                >
              </el-checkbox-group>
              <el-checkbox-group
                v-model="formData.cycleDays"
                v-if="formData.cycleType === 'MONTH'"
              >
                <el-checkbox
                  style="width: 56px;"
                  v-for="(val, index) in 31"
                  :key="index"
                  :label="val"
                  >{{ val }}号</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="btns">
            <el-button @click="submit(0)">保存</el-button>
            <el-button type="primary" @click="submit(1)">发布</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { bizList } from '@/api/setUp'
import {
  chooseNurseGroup,
  workerList,
  getTimeInfo,
  addSchedule,
  backScheduleInfo,
} from '@/api/nursingWorkers'
import headers from './header.json'
export default {
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await workerList(params)) || {}
          res.headers = headers.headers
          return res
        },
      },
    ]),
  ],
  data() {
    return {
      groupLoading: false,
      selectTime: '2',
      bizList: [],
      groupList: [],
      cycleTypeList: [
        { label: '每天', value: 'DAY' },
        { label: '每周', value: 'WEEK' },
        { label: '每月', value: 'MONTH' },
      ],
      week: [
        { label: '周一', value: '2' },
        { label: '周二', value: '3' },
        { label: '周三', value: '4' },
        { label: '周四', value: '5' },
        { label: '周五', value: '6' },
        { label: '周六', value: '7' },
        { label: '周日', value: '1' },
      ],
      month: 31,
      timeList: [], //时段规则
      formData: {
        code: null, //编号
        title: '',
        busId: '', //业务id
        groupIds: [], //分组ids
        times: [], //日期数组
        beginDate: '', //开始日期
        endDate: '', //结束日期
        cycleType: '', //周期类型
        cycleDays: [], //周期天数
        timeInfo: [],
      },

      query: {
        size: 10,
        current: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        bizList: {
          formatter(row) {
            let arr = row.bizList.map(item => {
              return item.name
            })
            return arr.join('、')
          },
        },
        sex: {
          formatter(row) {
            return row.sex ? (row.sex === 1 ? '男' : '女') : '未知'
          },
        },
        status: {
          formatter(row) {
            return row.status ? '启用' : '禁用'
          },
        },
      },
    }
  },
  async created() {
    this.formData.code = Object.values(this.$route.query).join('') || ''
    //编辑状态请求回显信息
    await this.getBizAndGroup()
    this.formData.code && this.backScheduleInfo()
    this.getTimeInfo()
  },
  methods: {
    //编辑状态获取回显排班详情
    async backScheduleInfo() {
      console.log(1111111111)
      const res = await backScheduleInfo({ code: this.formData.code })
      //重新拉取列表
      this.$set(this.query, 'groupIds', res.groupIds)
      //分组id选中赋值
      res.groupIds = res.groupIds.split(',')
      //时间段选中赋值
      res.times = [res.beginDate, res.endDate]
      //周期天数选中赋值
      res.cycleDays = res.cycleDays.split(',')

      const times = JSON.parse(JSON.stringify(res.timeInfo))

      this.formData = res
      this.formData.timeInfo = this.timeList //全部时段规则重新赋值

      //时段规则选中项赋值
      for (let val of this.formData.timeInfo) {
        for (let item of times) {
          val.id === item.id && ((val.price = item.price), (val.isCheck = true))
        }
      }
      console.log(this.formData, '回显信息')
    },

    //获取全局业务类型和分组列表
    async getBizAndGroup() {
      this.bizList = await bizList()
      this.groupLoading = true
      this.groupList = await chooseNurseGroup()
      this.groupLoading = false
    },

    //获取时段规则
    async getTimeInfo() {
      this.timeList = await getTimeInfo()
      this.formData.timeInfo = this.timeList
      console.log(this.timeList)
    },
    //选择分组筛选护工列表
    changGroup(e) {
      this.$set(this.query, 'groupIds', e.join(','))
    },
    //选择时间段
    changeTime(e) {
      this.formData.beginDate = e[0]
      this.formData.endDate = e[1]
    },
    //选择周期类型
    changeCycleType(e) {
      console.log(this.cycleType)
      this.formData.cycleDays = [] //类型变化-清空值
    },
    //保存
    async submit(type) {
      //参数处理
      const params = JSON.parse(JSON.stringify(this.formData))
      params.cycleDays = params.cycleDays.join(',') //周期天数转字符串
      params.state = type //state  0保存 1发布
      params.groupIds = params.groupIds.join(',') //分组id 转字符串
      !params.code && delete params.code //code不存在 删除

      //筛选勾选的时段规则
      params.timeInfo = params.timeInfo.filter(item => {
        return item.isCheck
      })

      //匹配填入业务名
      this.bizList.forEach(item => {
        item.id == params.busId && (params.busName = item.busName)
      })

      //筛选赋值选择的组名
      const selectGroup = this.groupList.filter(item => {
        return params.groupIds.split(',').includes(item.id)
      })
      params.groupNames = selectGroup
        .map(item => {
          return item.groupName
        })
        .join(',')

      console.log(params, '参数-------')
      await addSchedule(params)
      this.$message.success('操作成功')
      this.$router.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: -webkit-box !important;
}
.el-form {
  .el-form-item {
    display: flex;
  }
  .table {
    display: flex;
    background: #f2f2f2;
    .left {
      flex: 1;
      background: #fff;
      margin: 5px;
      .title {
        line-height: 60px;
        margin-left: 10px;
      }
      .el-checkbox-group {
        display: flex;
        flex-direction: column;
        .el-checkbox {
          padding-left: 40px;
          line-height: 40px;
          margin-right: 0;
          &:hover {
            background: #f2f2f2;
          }
        }
      }
    }
    .right {
      flex: 3;
      margin: 5px;
      background: #fff;
    }
  }
  .time-price {
    margin-top: 10px;
    display: flex;
    .price {
      display: flex;
      .el-input {
        width: 100px;
      }
      span {
        margin: 0 5px;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    margin: 40px 0;
  }
}
</style>
