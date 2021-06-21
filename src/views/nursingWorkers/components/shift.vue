<template>
  <div class="shift-wrapper">
    <!-- 顶部信息 -->
    <div class="top-msg">
      <span v-if="pageType === 'group'" style="margin-right: 24px;"
        >分组名称：{{ topInfo.groupName }}</span
      >
      <span v-if="pageType === 'group'">护工数量：{{ topInfo.nspNum }}</span>
      <span style="margin-left: 20px;">业务：</span>
      <el-checkbox-group
        v-if="pageType === 'group'"
        v-model="busIds"
        @change="handelCheck"
      >
        <el-checkbox
          v-for="item in topInfo.busConfigs"
          :key="item.id"
          :label="item.id"
          >{{
            item.del ? item.busName + '(已删除)' : item.busName
          }}</el-checkbox
        >
      </el-checkbox-group>
      <el-checkbox-group
        v-if="pageType !== 'group'"
        v-model="busIds"
        @change="handelCheck"
      >
        <el-checkbox
          v-for="item in workerInfo.bizList"
          :key="item.id"
          :label="item.id"
          >{{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
    </div>

    <div class="tabs flex-start-start">
      <div class="flex-between">
        <div class="flex-start-center">
          <el-button-group size="small">
            <el-button
              size="small"
              icon="el-icon-arrow-left"
              @click="changeMonth('pre')"
            ></el-button>
            <el-button size="small" style="height: 32px;">{{
              moment(value).format('YYYY 年 MM 月')
            }}</el-button>
            <el-button size="small" @click="changeMonth('next')"
              ><i class="el-icon-arrow-right"></i
            ></el-button>
          </el-button-group>
          <el-button size="small" @click="today" style="margin-left: 10px;"
            >今日</el-button
          >
          <el-button size="small" @click="nextDay">次日</el-button>
        </div>
        <el-input
          placeholder="请输入"
          v-if="pageType === 'make'"
          v-model="searchKeywords"
          size="small"
          style="width: 280px;"
          class="input-with-select"
          @keyup.enter.native="search"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search"
          ></el-button>
        </el-input>
      </div>
    </div>

    <!-- 日历与信息 -->
    <div class="shift">
      <el-row :gutter="10">
        <!-- 左侧排班信息 -->
        <el-col :span="16">
          <div class="shSpandara">
            <span>星期一</span>
            <span>星期二</span>
            <span>星期三</span>
            <span>星期四</span>
            <span>星期五</span>
            <span>星期六</span>
            <span>星期日</span>
          </div>
          <el-calendar ref="date" v-model="value" v-loading="isTimeLoading">
            <template v-slot:dateCell="{ date, data }">
              <div style="display: none;">{{ date }}</div>
              <div
                :class="data.isSelected ? 'active dateWrap' : 'dateWrap'"
                @click="changeDay(data.day)"
              >
                <div class="date">
                  {{ data.day.split('-')[2] }}日<span>{{
                    datefu.GetLunarDay(
                      data.day.split('-')[0],
                      data.day.split('-')[1],
                      data.day.split('-')[2],
                    )
                  }}</span>
                  <span></span>
                </div>
                <template
                  v-for="(item, index) in pageType === 'make'
                    ? nameList
                    : infoList"
                >
                  <!--  <div
                    class="isday_"
                    :key="index + 'today'"
                    v-if="data.day == todayDate"
                  >
                    今
                  </div> -->
                  <div class="list" :key="index" v-if="item.date == data.day">
                    <div
                      class="Item text-overflow"
                      v-for="(i, index1) in pageType === 'make'
                        ? item.userDtos
                        : item.busNames"
                      v-show="index1 < 4"
                      :key="index1"
                    >
                      <span class="list-style" :class="classType[i]">{{
                        index1 != 3
                          ? pageType === 'make'
                            ? i.timeName + ' ' + i.userName
                            : i
                          : '...'
                      }}</span>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </el-calendar>
        </el-col>

        <!-- 右侧当天排班信息 -->
        <el-col :span="8">
          <!-- 头部 -->
          <div class="header">
            <div class="today" v-html="rightDate"></div>
            <el-switch
              v-if="pageType === 'admin'"
              v-model="status"
              :active-value="1"
              :inactive-value="0"
              :disabled="isDisable"
              @change="handleChangeAll(parseTime(value, '{y}-{m}-{d}'), status)"
            ></el-switch>
          </div>
          <!-- 内容 -->
          <div class="planPeek" v-loading="isInfoLoading">
            <div
              class="time-list"
              v-for="val in pageType === 'make' ? listEscort : timeDiv"
              :key="val.id"
            >
              <div class="left">
                <span>{{ val.name }}</span>
                <span>{{ val.beginTime + '-' + val.endTime }}</span>
                <el-button
                  @click="addList(val.id)"
                  v-if="pageType === 'admin'"
                  size="mini"
                  style="margin-top: 5px;"
                  >新增</el-button
                >
              </div>
              <div class="right">
                <!-- <div class="itme" v-if="!val.timeDtos.length">暂无</div> -->
                <div class="itme" v-for="(item, i) in val.timeDtos" :key="i">
                  <span :class="classType[item.busName]">{{
                    item.busName
                  }}</span>
                  <span v-if="pageType !== 'make'">￥{{ item.price }}/次</span>
                  <div v-if="pageType === 'make'">
                    <span
                      class="name-list"
                      v-for="(listName, index3) in item.userNames || []"
                      :key="index3"
                      >{{ listName }}</span
                    >
                  </div>
                  <el-button
                    @click="delList(item.id)"
                    v-if="pageType === 'admin'"
                    size="mini"
                    >移除</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="新增"
      :visible.sync="dialogData.isVisiBle"
      width="30%"
      :before-close="handleClose"
    >
      <div class="dialog-content">
        <el-select v-model="dialogData.busId" placeholder="请选择">
          <el-option
            v-for="item in dialogData.options"
            :key="item.id"
            :label="item.busName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <span>￥</span>
        <el-input
          v-model="dialogData.price"
          placeholder="请输入价格"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handelDialog('cancel')">取 消</el-button>
        <el-button type="primary" @click="handelDialog('confirm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import datefu from './date'
import { parseTime } from '@/utils'
import {
  getScheduleTopInfo,
  getScheduleDayInfo,
  getDayTimePriceInfo,
  addNurseBus,
  getNurseScheduleBus,
  getNurseScheDayInfo,
  delNurseBus,
  getOrderSchInfo,
  getDayOrderInfo,
} from '@/api/nursingWorkers'
import { bizList } from '@/api/setUp'
import moment from 'moment'

export default {
  props: {
    // 当前页面类型
    pageType: {
      type: String,
    },

    //护工分组id
    groupId: {
      type: String,
    },

    //护工详情
    workerInfo: {
      type: Object,
    },
  },
  data() {
    return {
      searchKeywords: '', //搜索关键字
      ruleRelId: '',
      //类类型
      classType: {
        陪护: 'escort',
        陪检: 'accompany',
        送标本: 'send',
      },
      //loading
      isTimeLoading: false,
      isInfoLoading: false,
      status: 0,
      isDisable: false,
      /* 顶部信息 */
      topInfo: {},
      //当前选中时间
      nowTime: '',
      dialogData: {
        isVisiBle: false,
        busId: '',
        busName: '',
        price: '',
        options: [
          { label: '陪护', value: '陪护' },
          { label: '陪检', value: '陪检' },
          { label: '送标本', value: '送标本' },
        ],
      },
      checkBtns: [
        { label: '陪护', value: 'escort' },
        { label: '陪检', value: 'accompany' },
        { label: '送标本', value: 'send' },
        { label: '送标本（已删除）', value: 'del' },
      ],
      busIds: [],
      datefu: datefu,
      value: new Date(),
      todayDate: moment().format('YYYY-MM-DD'),
      valueMonth: moment().format('YYYY-MM'),
      parseTime: parseTime,
      rightDate: parseTime(new Date(), '{y}年 {m}月 {d}日  &emsp; 星期{a}'),
      // 业务信息列表
      infoList: [],
      nameList: [],
      //有患者的集合
      searchInfoList: [{}],

      // 激活
      active: 0,

      searchInfoListPre: [],
      searchInfoListNext: [],
      isWorkDay: false, // 是否是工作日
      timeDiv: [],
      listEscort: [],
    }
  },

  created() {
    this.getBizList() //业务类型（全局）
    if (this.pageType === 'group') {
      this.getScheduleTopInfo() //顶部信息（分组页）
      this.getCurData() //时段价格信息（分组页）
    }
    if (this.pageType === 'admin') {
      this.$nextTick(() => {
        this.getNurseScheDayInfo() //时段价格信息（护工管理）
      })
    }
    if (this.pageType === 'make') {
      this.$nextTick(() => {
        this.getDayOrderInfo() //单日预约排期时段信息（护工管理）
      })
    }
  },
  methods: {
    //全局业务类型请求
    async getBizList() {
      const res = await bizList()
      this.dialogData.options = res
    },

    //勾选业务选项
    handelCheck() {
      if (this.pageType === 'group') {
        this.getScheduleDayInfo() //排班信息(分组页)
      }
      if (this.pageType === 'admin') {
        this.getNurseScheduleBus() //排班信息 （护工管理）
      }
      if (this.pageType === 'make') {
        this.getOrderSchInfo() //预约信息（护工管理）
      }
    },

    //获取排班顶部信息（分组页）
    async getScheduleTopInfo() {
      const res = await getScheduleTopInfo({ id: this.groupId })
      this.topInfo = res
    },

    //分组排班信息底部业务信息(分组页)
    async getScheduleDayInfo() {
      this.isTimeLoading = true
      const res = await getScheduleDayInfo({
        id: this.groupId,
        busIds: this.busIds,
        date: this.valueMonth,
      })
      //筛选存在业务信息日期
      const infoArr = res.filter(item => {
        return item.busNames
      })
      this.isTimeLoading = false
      this.infoList = infoArr
    },

    //护工排班信息底部业务信息（护工管理页）
    async getNurseScheduleBus() {
      this.isTimeLoading = true
      const res = await getNurseScheduleBus({
        id: this.workerInfo.id,
        busIds: this.busIds,
        date: this.valueMonth,
      })
      //筛选存在业务信息日期
      const infoArr = res.filter(item => {
        return item.busNames
      })
      this.isTimeLoading = false
      this.infoList = infoArr
    },

    //预约排期信息（预约排期）
    async getOrderSchInfo() {
      this.isTimeLoading = true
      const res = await getOrderSchInfo({
        id: this.workerInfo.id,
        busIds: this.busIds,
        date: this.valueMonth,
        searchKeywords: this.searchKeywords,
      })
      //筛选存在业务信息日期
      const infoArr = res.filter(item => {
        return item.userDtos
      })
      this.isTimeLoading = false
      this.nameList = infoArr
      console.log(this.nameList, '预约排期信息')
    },
    moment,

    // 获取单日排班时段价格信息（分组页）
    async getCurData() {
      this.isInfoLoading = true
      const res = await getDayTimePriceInfo({
        date: moment(this.value).format('YYYY-MM-DD'),
        id: this.groupId,
      })
      console.log(res, '当天排班详情')
      this.timeDiv = res
      this.isInfoLoading = false
    },

    //获取单日排班时段价格信息（护工管理）
    async getNurseScheDayInfo() {
      this.isInfoLoading = true
      const res = await getNurseScheDayInfo({
        date: moment(this.value).format('YYYY-MM-DD'),
        nurseId: this.workerInfo.id,
      })
      console.log(res, '当天排班详情')
      this.timeDiv = res
      this.isInfoLoading = false

      //判断是否禁用总开关
      for (let item of res) {
        if (item.timeDtos?.length) {
          this.isDisable = false
          this.status = 1
          break
        }
        this.isDisable = true
        this.status = 0
      }
    },

    //获取单日预约排期时段信息（护工管理）
    async getDayOrderInfo() {
      this.isInfoLoading = true
      const res = await getDayOrderInfo({
        date: moment(this.value).format('YYYY-MM-DD'),
        nurseId: this.workerInfo.id,
      })
      console.log(res, '当天预约详情')
      this.listEscort = res
      this.isInfoLoading = false
    },

    // 关闭、开启某个时段
    async handleChangeAll(time, status) {
      const confirm = await this.$confirm(
        '是否确认移除当前日期所有时段价格？',
        '提示',
        {
          type: 'warning',
        },
      ).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') return (this.status = 1)

      const scheduleIds = []
      for (let item of this.timeDiv) {
        for (let val of item.timeDtos) {
          scheduleIds.push(val.id)
        }
      }
      const params = {
        date: time,
        nurseId: this.workerInfo.id,
        scheduleIds,
      }
      console.log(params, 'params--------')
      await delNurseBus(params)
      this.$message.success(status ? '开启成功' : '关闭成功')
      this.getNurseScheduleBus()
      this.getNurseScheDayInfo()
    },

    // 搜索
    search() {
      this.getOrderSchInfo()
    },

    // 改变日期，获取当天排班详情
    changeDay(day) {
      console.log(day, '选中日期')
      this.nowTime = day
    },

    // 今日
    today() {
      this.value = new Date()
    },
    // 次日
    nextDay() {
      this.value = moment().add(1, 'd').format('YYYY-MM-DD')
    },

    //月份变化
    changeMonth(type) {
      if (type == 'pre') {
        this.value = this.$refs.date.prevMonthDatePrefix
      } else {
        this.value = this.$refs.date.nextMonthDatePrefix
      }
    },

    //新增弹窗打开
    addList(id) {
      this.dialogData.isVisiBle = true
      this.ruleRelId = id //保存当前时段ID
    },

    //关闭新增弹窗
    handleClose() {},

    //取消确认新增弹窗（护工管理页）
    async handelDialog(status) {
      //取消
      this.dialogData.isVisiBle = false
      if (status === 'cancel') {
        return
      }

      //确认
      this.dialogData.options.forEach(item => {
        this.dialogData.busId === item.id &&
          (this.dialogData.busName = item.busName)
      })
      const params = {
        busId: this.dialogData.busId, //业务id
        busName: this.dialogData.busName, //业务名称
        price: this.dialogData.price, //价格
        date: moment(this.value).format('YYYY-MM-DD'), //左侧选择时间
        nurseId: this.workerInfo.id, //护工id
        ruleRelId: this.ruleRelId, //当前新增的时段ID
      }
      //新增
      await addNurseBus(params)
      this.getNurseScheDayInfo()
      this.getNurseScheduleBus()
      this.$message.success('操作成功！')
    },

    //移除（护工管理页）
    async delList(id) {
      const confirm = await this.$confirm('是否确认移除？', '提示', {
        type: 'warning',
      }).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') return
      await delNurseBus({
        date: moment(this.value).format('YYYY-MM-DD'),
        nurseId: this.workerInfo.id,
        scheduleIds: [id],
      })
      this.$message.success('操作成功')
      this.getNurseScheDayInfo()
      this.getNurseScheduleBus()
    },
  },
  watch: {
    value() {
      let month = moment(this.value).format('YYYY-MM')
      this.rightDate = parseTime(
        this.value,
        '{y}年 {m}月 {d}日  &emsp; 星期{a}',
      )
      if (month != this.valueMonth) {
        this.valueMonth = month
        if (this.pageType === 'group') {
          this.getScheduleDayInfo() //排班信息（分组页）
        }
        if (this.pageType === 'admin') {
          this.getNurseScheduleBus() //排班信息（护工管理页）
        }
        if (this.pageType === 'make') {
          this.getOrderSchInfo() //预约信息(护工管理)
        }
      }
      if (this.pageType === 'group') {
        this.getCurData() //时段价格信息（分组页）
      }
      if (this.pageType === 'admin') {
        this.getNurseScheDayInfo() //时段价格信息（护工管理）
      }
      if (this.pageType === 'make') {
        this.getDayOrderInfo() //单日预约排期时段信息（护工管理）
      }
    },

    //护工分组ID存在的时候触发
    groupId() {
      this.getScheduleTopInfo() //顶部信息（分组页）
      this.getScheduleDayInfo() //排班信息（分组页）
      this.getCurData() //时段价格信息（分组页）
    },
    //护工详情变化
    workerInfo() {
      console.log(this.workerInfo)
      if (this.pageType === 'admin') {
        this.getNurseScheduleBus() //排班信息（护工管理页）
        this.getNurseScheDayInfo() //时段价格信息（护工管理）
      }
      if (this.pageType === 'make') {
        this.getOrderSchInfo() //预约信息 （护工管理）
        this.getDayOrderInfo() //单日预约排期时段信息（护工管理）
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.name-list {
  padding: 4px 6px;
  background: #f2f2f2;
  color: #333;
}
.dialog-content {
  display: flex;
  span {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-select {
    width: 150px;
  }
  .el-input {
    width: 200px;
  }
}
.shift-wrapper {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .shift {
    flex: 1;
    overflow: hidden;
    & > .el-row,
    .el-col-16 {
      height: 100%;
      .shSpandara {
        // margin-left: 48px;
        padding: 12px 30px 0 50px;
        span {
          display: inline-block;
          width: 14.2857%;
          padding: 0 4px 0 4px;
          text-align: center;
          font-family: PingFang SC;
          font-weight: bold;
          color: #333333;
          flex: 1;
        }
      }
    }
    & > .el-row.el-col-8 {
      height: 100%;
    }
    .el-col-8 {
      display: flex;
      flex-direction: column;
    }
    .plan {
      // flex: 1;
      overflow-y: scroll;
      height: calc(100% - 10px);
    }
    &::v-deep {
      .el-calendar {
        height: 100%;
      }
      .el-calendar__body {
        padding: 0px 0px 20px 35px;
        margin-top: 10px;
        overflow-y: auto;
        padding-bottom: 0;
        height: calc(100% - 10px);
      }
    }
  }
  .top-msg {
    padding: 20px;
    padding-bottom: 0;
    display: flex;
    // background: #f2f2f2;
  }
}
.tabs {
  // background: #f2f2f2;
  padding: 20px;
  // margin-top: 30px;
  .flex-between {
    padding-left: 20px;
    display: flex;
    flex: 1;
    .flex-start-center {
      // margin-left: 40px;
    }
  }
}
.shift {
  ::v-deep.el-calendar__header {
    display: none;
  }
  ::v-deep.el-calendar-table thead th {
    font-weight: bold;
    color: #333;
  }
  ::v-deep.el-calendar-table td {
    border: 0;
  }
  ::v-deep.el-calendar-table .el-calendar-day {
    padding: 4px;
    border: 0;
    height: 128px;
  }
}
.dateWrap {
  height: 100%;
  background: url('~@/assets/dateBg1.png') no-repeat center;
  background-size: 100% 100%;
  position: relative;
  color: #999;
  .date {
    text-align: center;
    // color: #999;

    font-size: 18px;
    font-weight: bold;
    line-height: 30px;
    padding-top: 4px;
    span {
      font-size: 12px;
      font-weight: normal;
      margin-left: 5px;
    }
  }
  .isday_ {
    position: absolute;
    right: -5px;
    top: -5px;
    width: 20px;
    height: 26px;
    font-size: 14px;
    font-weight: bold;
    line-height: 26px;
    text-align: center;
    color: #fff;
    background: #0ab2c1;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .list {
    padding: 8px 5%;
    font-size: 12px;
    // color: #666;
    line-height: 16px;
    text-align: center;
  }
  .more {
    // color: #666;
    text-align: center;
  }
  &.active {
    background: url('~@/assets/dateBg.png') no-repeat center;
    background-size: 100% 100%;
    color: #fff !important;
    // .date,
    // .list,
  }
}
.today {
  line-height: 58px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  white-space: nowrap;
}
.planPeek {
  border: 1px solid #ccc;
  border-bottom: 0;
  height: 520px;
  overflow-y: scroll;
  border-bottom: 1px solid #ccc;
  .time-list {
    display: flex;
    height: 172px;
    border-bottom: 1px solid #f2f2f2;
    .left {
      flex: 1.7;
      border-right: 1px solid #f2f2f2;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
    .right {
      flex: 5;
      display: flex;
      flex-direction: column;
      .itme {
        padding: 5px 10px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          margin-right: 10px;
        }
      }
    }
  }
}

.itemCenter {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.header {
  display: flex;
  justify-content: center;
  // padding: 8px 25px 8px 100px;
  align-items: center;
  margin: -10px 0 -3px 0;
}
::v-deep.el-switch {
  margin-left: 20px;
}
::v-deep .el-tag.el-tag--success {
  margin-left: 42px;
}
::v-deep thead {
  display: none;
}

.escort {
  color: #0ab2c1;
  padding: 5px 8px;

  background: #e6f7f9;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.accompany {
  color: #fead00;
  padding: 5px 8px;
  background: #fff7e5;
  display: flex;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.send {
  padding: 5px 8px;

  color: #20b507;
  display: flex;
  background: #e8f7e6;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
}
.list-style {
  display: inline-block;
  padding: 0;
  margin-top: 2px;
}
</style>
