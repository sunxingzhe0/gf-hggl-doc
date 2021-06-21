<template>
  <div class="view__card">
    <h4>预约信息</h4>
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-purple">
          预约单号：{{ order.orderId }}
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          预约项目：{{ order.typeName }}
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          护理护工：{{ order.nurseName }}
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-purple-dark">
          护理时间：{{ order.startTime }} - {{ order.endTime }}（{{
            order.days
          }}天）
          <span v-for="(item, index) in order.timeIntervalList" :key="index">{{
            item
          }}</span>
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-purple-dark">
          备注：{{ order.remark }}
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-purple-dark">
          评价：{{ order.comment && order.comment.level }}
        </div></el-col
      >
    </el-row>
    <h4>护理信息</h4>
    <el-row>
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          护理对象：{{ order.patientName }}
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          性别：{{ order.patientSex }}
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          年龄：{{ order.patientAge }}岁
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          所属区域：住院楼5F
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          详细地址：{{ order.bedNum }}
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          联系人：{{ order.contactName }}
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-purple-dark">
          护理任务编号：{{ order.orderId }}
        </div></el-col
      >
    </el-row>
    <h4>支付信息</h4>
    <el-row>
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          护理总额：￥{{ order.orderPrice }}
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          优惠金额：-￥{{ order.discountPrice }}
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          应付金额：￥{{ order.needPayMoney }}
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          实付金额：￥{{ order.payMoney }}
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          支付方式：{{ order.paymentMethod }}
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          支付时间：{{ order.paymentTime }}
        </div></el-col
      >
    </el-row>
    <h4>操作日志</h4>
    <el-timeline :reverse="true">
      <el-timeline-item
        v-for="activity in order.logList"
        :key="activity.logId"
        :timestamp="activity.createTime"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  props: {
    order: Object,
  },
}
</script>
<style lang="scss" scoped>
.el-row {
  font-size: 14px;
  color: #333;
  + .el-row {
    margin-top: 20px;
  }
}
</style>
