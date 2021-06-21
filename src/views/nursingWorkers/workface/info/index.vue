<template>
  <div class="view__card">
    <el-row>
      <el-col v-for="item in tabList" :key="item.value" :span="item.rowSize">
        <span style="color: #666;">{{ item.label }}：</span>
        <span>{{ infoData[item.value] }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="time-view">
          <span>时段：</span>
          <div>
            <div>{{ infoData.beginDate }} ~ {{ infoData.endDate }}</div>
            <div
              class="time-list"
              v-for="val in infoData.timeInfo"
              :key="val.id"
            >
              <span>{{ val.name }}</span>
              <span>（{{ val.beginTime + ' ~ ' + val.endTime }}）</span>
              <span>¥{{ val.price }}/次</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="group">
      <div style="margin-bottom: 15px;">护工分组（{{ groupInfo.allNum }}）</div>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          style="margin-left: 50px;"
          :title="val.groupName + '（' + val.num + '）'"
          :name="index"
          v-for="(val, index) in groupInfo.groupList"
          :key="index"
        >
          <div
            v-for="(item, i) in val.nurseList"
            :key="i"
            style="margin-top: 10px;"
          >
            <span style="margin-right: 5px;">编号：{{ item.code }}</span>
            <span style="margin-right: 5px;">姓名：{{ item.name }}</span>
            <span style="margin-right: 5px;">手机号：{{ item.phone }}</span>
            <span style="margin-right: 5px;">性别：{{ item.sex }}</span>
            <span style="margin-right: 5px;">年龄：{{ item.age }}</span>
            <span style="margin-right: 5px;">开通业务：{{ item.busName }}</span>
            <span style="margin-right: 5px;">工单数量：{{ item.workNum }}</span>
            <span style="margin-right: 5px;">状态：{{ item.state }}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- <div class="btn">
      <el-button type="primary" @click="submit">终止</el-button>
    </div> -->
  </div>
</template>

<script>
import { backScheduleInfo, getGroupInfo } from '@/api/nursingWorkers'
export default {
  data() {
    return {
      code: '', //编号
      infoData: {}, //排班详情数据
      groupInfo: {}, //分组数据
      tabList: [
        { label: '编号', value: 'code', rowSize: 8 },
        { label: '标题', value: 'title', rowSize: 8 },
        { label: '业务', value: 'busName', rowSize: 8 },
        { label: '周期', value: 'cycleType', rowSize: 8 },
        { label: '创建时间', value: 'createTime', rowSize: 8 },
      ],
      activeNames: [0, 1, 2],
    }
  },
  created() {
    this.code = Object.values(this.$route.query).join('') || ''
    this.backScheduleInfo()
    this.getGroupInfo()
  },
  methods: {
    //获取排班详情回显数据
    async backScheduleInfo() {
      const res = await backScheduleInfo({ code: this.code })
      const types = {
        DAY: '每天',
        WEEK: '每周',
        MONTH: '每月',
      }
      res.cycleType = types[res.cycleType]
      this.infoData = res
    },

    //获取排班详情护工分组
    async getGroupInfo() {
      const res = await getGroupInfo({ code: this.code })
      this.groupInfo = res
    },

    handleChange() {},

    //终止
    submit() {
      this.$message.success('操作成功')
      // this.$router.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.view__card {
  .el-row {
    .el-col {
      margin-top: 30px;
      display: flex;
    }
  }
  .group {
    margin-top: 50px;
  }
  .btn {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
.time-view {
  display: flex;
  .time-list {
    margin-top: 10px;
    color: #666;
  }
}
</style>
