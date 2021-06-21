<template>
  <!-- 容器 -->
  <div ref="bar_dv" :style="styles"></div>
</template>
<script>
//引入echarts
import echarts from 'echarts'
export default {
  //配置对象与样式
  props: {
    styles: {
      type: Object,
    },
    options: {
      type: Object,
    },
  },
  methods: {
    drawLine() {
      //初始化
      let myCharts = echarts.init(this.$refs.bar_dv)
      //配置
      let option = this.options
      //创建图表
      myCharts.setOption(option)
      window.onresize = function () {
        myCharts.resize() // 如果有多个图标变动，可写多个
        console.log(123)
      }
    },
  },
  mounted() {
    this.drawLine()
  },
  beforeDestroy() {
    window.onresize = null
  },
  watch: {
    options: {
      handler() {
        this.drawLine()
      },
      deep: true,
    },
  },
}
</script>

<style lang="less" scoped></style>
