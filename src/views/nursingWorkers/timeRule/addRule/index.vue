<template>
  <div class="view__card">
    <el-form :model="formData">
      <el-form-item label="规则名称：" label-width="100px">
        <el-input
          v-model="formData.ruleName"
          type="text"
          placeholder="请输入规则名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="时段：" label-width="100px">
        <el-input
          style="margin-right: 10px;"
          type="text"
          placeholder="请输入时段名称"
          v-model="formData.name"
        ></el-input>
        <el-time-picker
          is-range
          v-model="formData.time"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          format="HH:mm"
        >
        </el-time-picker>
        <el-button type="primary" style="margin-left: 20px;" @click="addTime"
          >添加</el-button
        >
        <div
          class="timeList"
          v-for="(val, index) in formData.times"
          :key="index"
        >
          <span class="time-list">{{ index + 1 }}. {{ val.name }}</span>
          <span class="time-list">{{ val.beginTime }}-{{ val.endTime }}</span>
          <el-button size="mini" @click="delTimeList(index)">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="submit">
          <el-button @click="back">返回</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { addTimeRule } from '@/api/nursingWorkers'
export default {
  data() {
    return {
      formData: {
        ruleName: '',
        name: '',
        time: [new Date(2021, 9, 10, 8, 40), new Date(2021, 9, 10, 9, 40)],
        times: [],
      },
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    delTimeList(index) {
      this.formData.times.splice(index, 1)
    },

    //添加时段规则
    addTime() {
      if (this.formData.name === '') {
        this.$message.warning('请输入时段名')
        return
      }
      const beginTime = parseTime(this.formData.time[0], '{h}:{i}')
      const endTime = parseTime(this.formData.time[1], '{h}:{i}')
      const parms = {
        name: this.formData.name,
        beginTime,
        endTime,
      }
      this.formData.times.push(parms)
      console.log(parms)
    },
    //提交
    async submit() {
      if (this.formData.ruleName === '') {
        this.$message.warning('请输入规则名')
        return
      }
      await addTimeRule(this.formData)
      this.$message.success('新增成功')
      this.$router.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.time-list {
  display: inline-block;
  min-width: 70px;
}
.el-input {
  width: 200px;
}
.timeList {
  margin-top: 20px;
  span {
    margin-right: 10px;
  }
  .el-button {
    margin-left: 40px;
  }
}
.submit {
  margin-top: 100px;
  display: flex;
  justify-content: center;
}
</style>
