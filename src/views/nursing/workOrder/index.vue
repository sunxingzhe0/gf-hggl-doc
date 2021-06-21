<template>
  <div class="view__card isInfo" v-loading="false">
    <List v-model="query" :columns="columns" :tableData="tableData">
      <template v-slot:slot_typeId="{ row }">
        {{ row.deptName }}，{{ row.inHospNo }}，{{ row.bedNum }}
      </template>
      <template v-slot:slot_patientSex="{ row }">
        {{ row.patientSex == 1 ? '男' : row.patientSex == 2 ? '女' : '未知' }}
      </template>
      <template v-slot:fixed="{ row }">
        <span class="btns" @click="goInfo(row.workId)">查看</span>
        <span class="btns" @click="end">终止</span>
        <span class="btns" @click="orderChange([row.workId])">转单</span>
      </template>
      <template v-slot:footertool v-if="!$route.query.orderId">
        <el-button type="primary" @click="addTask">批量转单</el-button>
      </template>
    </List>

    <el-dialog
      width="50%"
      :title="dialogData.title"
      :visible.sync="dialogData.isVisible"
      :close-on-click-modal="false"
      append-to-body
      custom-class="component__dialog"
    >
      <el-form
        ref="form"
        inline
        :model="dialogData.model"
        :rules="dialogData.rules"
        label-width="100px"
        width="100%"
      >
        <el-form-item prop="nurseName" label="转单对象">
          <el-select
            v-model="dialogData.model.group"
            placeholder="请选择护理组"
            value-key="id"
            @change="getWorkers"
          >
            <el-option
              v-for="item in groups"
              :key="item.id"
              :label="item.groupName"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="dialogData.model.nurse"
            placeholder="请选择护工"
            value-key="id"
          >
            <el-option
              v-for="item in workers"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="is-center">
          <el-button size="small" @click="dialogData.isVisible = false">
            取消
          </el-button>
          <el-button size="small" type="primary" @click="submit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { workorderList, workorderStop, changeEmployee } from '@/api/nursing'
import { getNspGroupList, workerList } from '@/api/nursingWorkers'
import header from './header.json'
export default {
  name: 'taskList',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          return Object.assign(await workorderList(params), {
            headers: header.headers,
          })
        },
      },
    ]),
  ],
  data() {
    return {
      groups: [],
      workers: [],
      query: {
        orderId: this.$route.query.orderId || '',
      },
      columns: {
        index: {
          hidden: true,
        },
        patientSex: {
          ids: [],
          label: '性别',
          prop: 'slot_patientSex',
        },
        typeId: {
          label: '服务对象',
          prop: 'slot_typeId',
        },
      },
      dialogData: {
        title: '转单',
        isVisible: false,
        model: {
          ids: [],
          group: {},
          nurse: {},
        },
        rules: {
          groupName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
        },
      },
    }
  },
  created() {
    this.getGroups()
  },
  methods: {
    goInfo(workId) {
      this.$router.push(`/nursing/workOrder/info?workId=${workId}`)
    },
    async getGroups() {
      this.groups = (await getNspGroupList()).records
    },
    async getWorkers() {
      this.workers = (await workerList()).records
    },
    async end(workId) {
      await workorderStop(workId)
      this.$_fetchTableData()
    },
    orderChange(ids) {
      this.dialogData.model.ids = ids
      this.dialogData.isVisible = true
    },
    async submit() {
      const { group, ids, nurse } = this.dialogData.model
      await changeEmployee(
        Object.assign({
          ids,
          groupId: group.id,
          groupName: group.groupName,
          nurseId: nurse.id,
          nurseName: nurse.name,
        }),
      )
      this.dialogData.isVisible = false
      this.$_fetchTableData()
      this.$message.success('操作成功')
    },
    addTask() {},
  },
}
</script>

<style lang="scss" scoped>
::v-deep .component__dialog {
  max-width: 1200px;
  width: 1200px !important;
}
.el-select {
  width: 280px;
}
.el-input {
  width: 280px;
}
.view__card {
  .el-dialog__body {
    padding: 30px 20px !important;
    .el-form {
      width: 100%;
    }
  }
}
.btns {
  color: #0ab2c1;
  font-size: 14px;
  cursor: pointer;
}
</style>
