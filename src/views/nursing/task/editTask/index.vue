<template>
  <div class="view__card">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="任务编号：" :label-width="labelWidth">
        -
      </el-form-item>
      <el-form-item label="任务类型：" :label-width="labelWidth">
        <el-select
          v-model="type"
          placeholder="任务类型"
          value-key="typeId"
          @change="value => Object.assign(this.form, value)"
        >
          <el-option
            label="陪护"
            :value="{ typeName: '陪护', typeId: '1' }"
          ></el-option>
          <el-option
            label="陪检"
            :value="{ typeName: '陪检', typeId: '2' }"
          ></el-option>
          <el-option
            label="送标本"
            :value="{ typeName: '送标本', typeId: '3' }"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务对象：" :label-width="labelWidth">
        <el-select
          v-model="dept"
          placeholder="请选择科室名称"
          value-key="deptCode"
          @change="
            value =>
              Object.assign(this.form, {
                deptName: value.deptName,
                deptId: value.deptCode,
              })
          "
        >
          <el-option
            v-for="item in depts"
            :key="item.deptCode"
            :label="item.deptName"
            :value="item"
          ></el-option>
        </el-select>
        <el-input v-model="form.inHospNo" placeholder="住院号"></el-input>
        <el-input
          v-model="form.bedNum"
          placeholder="病床号"
          @input="getPatient"
        ></el-input>
      </el-form-item>
      <el-form-item label="护理人员：" :label-width="labelWidth">
        <el-select
          v-model="form.groupId"
          placeholder="请选择护理组"
          @change="getWorkers"
        >
          <el-option
            v-for="item in groups"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="form.nurseId"
          placeholder="请选择护工"
          @change="getDates"
        >
          <el-option
            v-for="item in workers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="护理时间：" :label-width="labelWidth">
        <vc-calendar
          :attributes="attributes"
          @dayclick="onDayClick"
        ></vc-calendar>

        <el-checkbox-group v-model="form.schIds">
          <div v-for="item in times" :key="item.id">
            <el-checkbox :label="item.id"
              >{{ item.name }} （{{ item.beginTime }} -
              {{ item.endTime }}）</el-checkbox
            >
          </div>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="护理内容：" :label-width="labelWidth">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="备注：" :label-width="labelWidth">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="需要：" :label-width="labelWidth">
        <el-checkbox-group v-model="form.want">
          <el-checkbox label="轮椅"></el-checkbox>
          <el-checkbox label="推车床"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item size="large">
        <el-button @click="$router.back()">返回</el-button>
        <el-button @click="submit(false)">暂存</el-button>
        <el-button type="primary" @click="submit(true)">立即发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  addTask,
  getNurseScheInfo,
  getOrgDeptList,
  getPatientInfoByHospitalId,
} from '@/api/nursing'
import { getNspGroupList, workerList } from '@/api/nursingWorkers'
import { debounce } from 'lodash'
import moment from 'moment'
export default {
  data() {
    return {
      labelWidth: '100px',
      depts: [],
      groups: [],
      workers: [],
      scheDates: [],
      day: [],
      times: [],
      form: {
        typeId: '',
        typeName: '',
        deptId: '',
        deptName: '',
        inHospNo: '',
        bedNum: '',
        inHospTime: '2021-06-15',
        patientAge: 20,
        patientId: '4',
        patientName: '陈顶天',
        patientSex: 1,
        nurseId: '',
        schIds: [],
        content: '',
        remark: '',
        want: [],
      },
      type: {},
      dept: {},
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
  created() {
    this.getGroups()
    this.getDepts()
  },
  methods: {
    async submit(publish) {
      await addTask(
        Object.assign({}, this.form, {
          publish,
          want: this.form.want.join(),
        }),
      )
      this.$router.back()
    },
    async getDepts() {
      this.depts = await getOrgDeptList({ current: 1, size: 10 })
    },
    async getGroups() {
      this.groups = (await getNspGroupList()).records
    },
    async getWorkers() {
      this.workers = (await workerList()).records
    },
    async getDates() {
      this.scheDates = await getNurseScheInfo({
        busId: this.form.typeId,
        nurseId: this.form.nurseId,
        date: moment().format('YYYY-MM'),
      })
    },
    onDayClick(day) {
      const idx = this.scheDates.findIndex(d => d.date === day.id)
      if (idx > -1) {
        this.times = this.scheDates[idx].timeDtos
      }
    },
    getPatient: debounce(async function () {
      const info = await getPatientInfoByHospitalId({
        patientId: this.form.bedNum,
      })

      if (!info) return

      Object.assign(this.form, {
        contactPhone: info.contactPhone,
        patientId: info.patientId,
        patientName: info.patientName,
        patientAge: info.patientAge,
        patientSex: info.patientSex,
        inHospTime: info.inHospTime,
      })
    }, 1000),
  },
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 194px;
}
.el-textarea {
  width: 390px;
}
</style>
