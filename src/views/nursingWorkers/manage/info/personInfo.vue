<template>
  <el-row>
    <el-col v-for="val in viewList" :key="val.value" :span="val.rowSize">
      <div>
        <span style="color: #666;">{{ val.label }}：</span>
        <span>{{ infoData[val.value] }}</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    infoData: {
      type: Object,
    },
  },
  data() {
    return {
      /*   infoData: {
        phone: '1776458944',
        name: '赵德苑',
        sex: '男',
        groupId: '分组一',
        birthday: '1993.12.01',
        bloodType: 'o',
        marriage: '已婚',
        education: '本科',
        censusAddress: '重庆',
        nowAddress: '重庆',
        idCard: '6314862145645645',
        remark: 'xxxx',
        bizList: [],
      }, */
      viewList: [
        { label: '手机号', value: 'phone', rowSize: 8 },
        { label: '姓名', value: 'name', rowSize: 8 },
        { label: '性别', value: 'sex', rowSize: 8 },
        { label: '分组', value: 'groupName', rowSize: 8 },
        { label: '出生日期', value: 'birthday', rowSize: 8 },
        { label: '血型', value: 'bloodType', rowSize: 8 },
        { label: '婚姻状况', value: 'marriage', rowSize: 8 },
        { label: '学历', value: 'education', rowSize: 8 },
        { label: '籍贯', value: 'censusAddress', rowSize: 8 },
        { label: '居住地', value: 'nowAddress', rowSize: 8 },
        { label: '身份证号', value: 'idCard', rowSize: 8 },
        { label: '个人简介', value: 'remark', rowSize: 24 },
        { label: '开通业务', value: 'bizListName', rowSize: 8 },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.el-row {
  .el-col {
    margin-top: 40px;
  }
}
</style>
