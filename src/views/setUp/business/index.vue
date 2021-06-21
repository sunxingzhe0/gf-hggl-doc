<template>
  <div class="view__card" v-loading="false">
    <List v-model="query" :columns="columns" :tableData="tableData">
      <template v-slot:footertool>
        <el-button type="primary" @click="dialogData.isVisible = true"
          >新增业务</el-button
        >
      </template>
      <template v-slot:slot_busName="{ row }">
        <span v-if="!row.nature">{{ row.busName }}</span>
        <EditableText
          v-else
          icon="el-icon-edit"
          v-model="row.busName"
          @confirm="resolveSortChange($event, row, 'busName')"
        ></EditableText>
      </template>
      <template v-slot:slot_sortCode="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.sortCode"
          @confirm="resolveSortChange($event, row, 'sortCode')"
        ></EditableText>
      </template>
      <template v-slot:slot_state="{ row, $index }">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="row.state"
          @change="handleChange($event, row, $index)"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:fixed="{ row }">
        <span v-if="row.nature && !row.state" class="btns" @click="delList(row)"
          >删除</span
        >
        <span v-else></span>
      </template>
    </List>

    <el-dialog
      :title="dialogData.title"
      :visible.sync="dialogData.isVisible"
      append-to-body
      custom-class="component__dialog"
      @closed="handleClosed('form')"
    >
      <el-form
        ref="form"
        :model="dialogData.model"
        :rules="dialogData.rules"
        label-width="100px"
        width="100%"
      >
        <el-form-item prop="busName" label="业务名称">
          <el-input
            :maxlength="10"
            type="text"
            show-word-limit
            v-model="dialogData.model.busName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="busDesc" label="业务描述">
          <el-input
            type="textarea"
            :maxlength="500"
            show-word-limit
            v-model="dialogData.model.busDesc"
          ></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="small" @click="dialogData.isVisible = false">
            取消
          </el-button>
          <el-button size="small" type="primary" @click="submit('form')">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { List, mixin, EditableText } from '@/components'
import {
  getBusList,
  editBusInfo,
  editBusState,
  addBusConfig,
  delBusConfig,
} from '@/api/setUp'
import headers from './headers.json'
export default {
  name: 'business',
  components: {
    List,
    EditableText,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await getBusList(params)) || {}
          res.headers = headers.headers
          return res
        },
      },
    ]),
  ],
  data() {
    return {
      dialogData: {
        title: '新增业务',
        isVisible: false,
        model: {
          busName: '',
          busDesc: '',
        },
        rules: {
          busName: [
            { required: true, message: '请输入业务名称', trigger: 'blur' },
          ],
          busDesc: [
            { required: true, message: '请输入业务描述', trigger: 'blur' },
          ],
        },
      },
      filter: {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 0 },
              { label: '提交时间', value: 1 },
            ],
          },
          keys: ['timeType', 'start', 'end'],
        },
        search: {
          props: {
            options: [
              { label: '账号', value: 0 },
              { label: '姓名', value: 1 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '账号类型',
              options: [
                { label: '不限', value: '' },
                { label: '管理员', value: 'admin' },
                { label: '超级管理员', value: 'admin2' },
              ],
            },
            keys: 'userType',
          },
        ],
      },
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        field: 'create_time',
        sorted: 'DESC',
      },
      columns: {
        index: {
          hidden: true,
        },
        nature: {
          formatter(row) {
            return row.nature ? '自定义' : '默认'
          },
        },
        state: {
          label: '状态',
          prop: 'slot_state',
        },
        busName: {
          label: '业务名称',
          prop: 'slot_busName',
        },
        sortCode: {
          label: '排序',
          prop: 'slot_sortCode',
        },
      },
    }
  },
  created() {},
  methods: {
    handleClosed(formName) {
      this.$refs[formName].clearValidate()
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        await addBusConfig(this.dialogData.model)
        this.dialogData.isVisible = false
        this.dialogData.model = {
          busName: '',
          busDesc: '',
        }
        this.$message.success('新增成功')
        this.$_fetchTableData()
      })
    },

    //更改业务状态
    async handleChange(state, { id }, index) {
      await editBusState({ id, state }).catch(err => {
        this.tableData.list[index].state = !state
        throw Error(err)
      })
      this.tableData.list[index].state = state
      this.$message({
        type: 'success',
        message: state ? '启用成功' : '禁用成功',
        showClose: true,
      })
    },
    //删除业务
    async delList({ id }) {
      const confirm = await this.$confirm('是否确认删除？', '提示', {
        type: 'warning',
      }).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') return
      await delBusConfig({ id })
      this.$message.success('删除成功')
      this.$_fetchTableData()
    },

    //修改名称和排序
    async resolveSortChange(value, { id }, type) {
      await editBusInfo({ id, [type]: value })
      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })
      this.$_fetchTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
.el-dialog__body {
  padding: 30px 20px !important;
  .el-form {
    width: 100%;
    .el-select {
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
