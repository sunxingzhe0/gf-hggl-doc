<template>
  <div class="view__card">
    <el-tabs v-model="activeName">
      <el-tab-pane label="任务详情" name="detail">
        <Detail :order="order" />
      </el-tab-pane>
      <el-tab-pane label="关联工单" name="workOrder">
        <WorkOrder />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Detail from './detail'
import WorkOrder from '../../workOrder'
import { taskInfo } from '@/api/nursing'
export default {
  components: {
    Detail,
    WorkOrder,
  },
  data() {
    return {
      activeName: 'detail',
      order: {},
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.order = await taskInfo(this.$route.query.orderId)
    },
  },
}
</script>

<style lang="sass" scoped></style>
