<template>
  <div class="view__card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="personInfo">
        <PersonInfo :infoData="infoData" />
      </el-tab-pane>
      <el-tab-pane label="排班信息" name="scheduling">
        <Shift :pageType="'admin'" :workerInfo="infoData" />
      </el-tab-pane>
      <el-tab-pane label="预约信息" name="appointment">
        <Shift :pageType="'make'" :workerInfo="infoData" />
      </el-tab-pane>
      <el-tab-pane label="工单信息" name="workOrder">
        <div v-if="types === 'workOrder'">
          <OrderList />
        </div>
      </el-tab-pane>
      <el-tab-pane label="评分记录" name="scoreLog">
        <div v-if="types === 'scoreLog'">
          <Log />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PersonInfo from './personInfo'
import Shift from '@/views/nursingWorkers/components/shift'
import Log from './log'
import OrderList from './orderList'
export default {
  components: {
    PersonInfo,
    Shift,
    Log,
    OrderList,
  },
  data() {
    return {
      types: '',
      infoData: {},
      activeName: 'personInfo',
      //工单列表参数
      query: {
        size: 10,
        current: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
      },
    }
  },
  created() {
    this.$route.query && this.personInfoData(this.$route.query)
  },
  methods: {
    handleClick(tab) {
      this.types = tab.name
      console.log(this.types)
    },
    //基本信息数据处理
    personInfoData(data) {
      const typeist = {
        sexType: {
          0: '未知',
          1: '男',
          2: '女',
        },
        bloodType: {
          1: 'A型',
          2: 'B型',
          3: 'O型',
          4: 'AB型',
          5: '不详',
        },
        marriage: {
          10: '未婚',
          20: '已婚',
          21: '初婚',
          22: '再婚',
          23: '复婚',
          30: '丧偶',
          40: '离婚',
          90: '未知',
        },
        education: {
          1: '小学',
          2: '初中',
          3: '高中',
          4: '中专',
          5: '大专',
          6: '本科',
          7: '硕士',
          8: '博士',
        },
      }
      data.sex = typeist.sexType[data.sex]
      data.bloodType = typeist.bloodType[data.bloodType]
      data.marriage = typeist.marriage[data.marriage]
      data.education = typeist.education[data.education]
      data.bizListName = data.bizList
        .map(item => {
          return item.name
        })
        .join('、')
      this.infoData = data
      console.log(this.infoData, '当前行信息')
    },
  },
}
</script>

<style lang="scss" scoped>
.btns {
  color: #0ab2c1;
  font-size: 14px;
  cursor: pointer;
}
</style>
