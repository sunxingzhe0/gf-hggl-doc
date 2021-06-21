<template>
  <div class="view__card">
    <el-row>
      <el-col :span="8">
        <div>
          <span style="color: #666;">单据号：</span>
          <span>{{ order.orderId }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <span style="color: #666;">护理人员：</span>
          <span>{{ order.nurseName }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <span style="color: #666;">单据状态：</span>
          <span>{{ order.workStatusText }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div>
          <span style="color: #666;">服务对象：</span>
          <span
            >{{ order.patientName }} {{ SEX_ENUM[order.patientSex] }}
            {{ order.patientAge }}岁 {{ order.inHospNo }} {{ order.bedNum }}
            {{ order.contactPhone }} {{ order.inHospTime }}</span
          >
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div>
          <span style="color: #666;">护理时间：</span>
          <span>{{ order.schDate }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div>
          <span style="color: #666;">护理内容：</span>
          <span>{{ order.content }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div>
          <span style="color: #666;">备注：</span>
          <span>{{ order.remark }}</span>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top: 40px;">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="activity in order.operLogList"
          :key="activity.logId"
          :timestamp="activity.createTime"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { workorder } from '@/api/nursing'
export default {
  data() {
    this.SEX_ENUM = ['未知', '男', '女']
    return {
      order: {},
      activities: [
        {
          content: '系统 创建工单',
          timestamp: '2018-04-15',
        },
        {
          content: '姓名 执行',
          timestamp: '2018-04-13',
        },
        {
          content: '姓名 评分',
          timestamp: '2018-04-11',
        },
      ],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.order = await workorder(this.$route.query.workId)
    },
  },
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-top: -30px;
}
.el-col {
  margin-top: 30px;
  font-size: 14px;
  color: #333;
}
</style>
