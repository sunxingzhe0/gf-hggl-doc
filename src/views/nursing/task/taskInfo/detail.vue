<template>
  <div class="view__card">
    <el-row>
      <el-col :span="8"
        ><div class="grid-content bg-purple">
          任务编号：{{ order.orderId }}
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple"></div>
        任务类型：{{ order.typeName }}</el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple"></div>
        状态：{{ order.publishStatus }}</el-col
      >
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-purple-dark">
          服务对象：{{ order.deptName }}，{{ order.inHospNo }}，{{
            order.bedNum
          }}，{{ order.patientName }}，{{ order.patientSex }}，{{
            order.patientAge
          }}岁，{{ order.contactPhone }}，{{ order.inHospTime }}
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-purple-dark">
          护理人员：{{ order.nurseName }}
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-purple-dark">
          护理时间：
          <vc-calendar
            :attributes="attributes"
            @dayclick="onDayClick"
            @update="page => console.log(page)"
          ></vc-calendar>
          <div
            v-for="t in times"
            :key="t.id"
            style="margin-top: 10px; margin-left: 80px;"
          >
            <el-checkbox
              :label="`${t.name}（${t.beginTime} ~ ${t.endTime}）`"
              :checked="order.schIds.includes(t.id)"
              disabled
            ></el-checkbox>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-purple-dark">
          护理内容：{{ order.content }}
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
          需要：{{ order.want }}
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          创建人：{{ order.createName }}
        </div></el-col
      >
      <el-col :span="8"
        ><div class="grid-content bg-purple-dark">
          创建时间：{{ order.createTime }}
        </div></el-col
      >
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import { getNurseScheInfo } from '@/api/nursing'
export default {
  props: {
    order: Object,
  },
  data() {
    return {
      scheDates: [],
      times: [],
    }
  },
  computed: {
    attributes() {
      return [
        ...this.scheDates.map(date => ({
          highlight: {
            fillMode: 'outline',
            class: 'primary',
          },
          dates: date.date,
        })),
      ]
    },
  },
  watch: {
    order() {
      this.getScheDate()
    },
  },
  methods: {
    onDayClick(day) {
      const idx = this.scheDates.findIndex(d => d.date === day.id)
      this.times = idx > -1 ? this.scheDates[idx].timeDtos : []
    },
    async getScheDate() {
      this.scheDates = await getNurseScheInfo({
        busId: this.order.typeId,
        nurseId: this.order.nurseId,
        date: moment().format('YYYY-MM'),
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.el-row {
  font-size: 14px;
  color: #333;

  + .el-row {
    margin-top: 30px;
  }
}
</style>
