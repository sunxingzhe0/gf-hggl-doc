<template>
  <div class="view__card">
    <h2>{{ infoData.title || 'xxx' }}</h2>
    <div>发布日期：{{ infoData.sendTime || 'xxx' }}</div>
    <div class="content">{{ infoData.content || 'xxx' }}</div>
  </div>
</template>

<script>
import { changeReaded } from '@/api/setUp'
export default {
  name: 'msgDetail',
  data() {
    return {
      infoData: {},
    }
  },
  async created() {
    this.infoData = this.$route.query
    await changeReaded({ id: this.infoData.id })
  },
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 20px;
  color: #666;
}
</style>
