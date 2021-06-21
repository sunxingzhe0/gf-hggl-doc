<template>
  <div class="view__card isInfo" v-loading="loading">
    <List v-model="query" :columns="columns" :tableData="tableData">
      <template v-slot:slot_groupName="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.groupName"
          @confirm="resolveSortChange($event, row, 'groupName')"
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

      <template v-slot:footertool>
        <el-button type="primary" @click="openDialog('add')"
          >新增分组</el-button
        >
      </template>
      <template v-slot:fixed="{ row }">
        <span class="btns" @click="openDialog('info', row)">预览排班</span>
        <span v-if="!row.state" class="btns" @click="delList(row)">删除</span>
      </template>
    </List>

    <el-dialog
      width="50%"
      :title="dialogData.title"
      :visible.sync="dialogData.isVisible"
      :close-on-click-modal="false"
      append-to-body
      custom-class="component__dialog"
      @closed="handleClosed('form')"
    >
      <el-form
        v-if="dialogData.isGroup"
        ref="form"
        :model="dialogData.model"
        :rules="dialogData.rules"
        label-width="100px"
        width="100%"
      >
        <el-form-item prop="groupName" label="分组名称">
          <el-input
            show-word-limit
            :maxlength="10"
            type="text"
            v-model="dialogData.model.groupName"
          ></el-input>
        </el-form-item>
      </el-form>
      <Shift
        v-if="!dialogData.isGroup"
        :groupId="userInfo.id"
        :pageType="'group'"
      />
      <template v-slot:footer v-if="dialogData.isGroup">
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
import { List, mixin } from '@/components'
import Shift from '@/views/nursingWorkers/components/shift'
import {
  getNspGroupList,
  addGroup,
  delGroup,
  editGroupInfo,
  editGroupState,
} from '@/api/nursingWorkers'
import headers from './header.json'
import EditableText from '@/components/EditableText'
export default {
  name: 'business',
  components: {
    List,
    Shift,
    EditableText,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await getNspGroupList(params)) || {}
          res.headers = headers.headers
          return res
        },
      },
    ]),
  ],
  data() {
    return {
      userInfo: {},
      dialogData: {
        isGroup: true,
        title: '新增分组',
        isVisible: false,
        model: {
          groupName: '',
        },
        rules: {
          groupName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
        },
      },
      query: {
        size: 10,
        current: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 160,
        },
        groupName: {
          label: '分组名称',
          prop: 'slot_groupName',
        },
        sortCode: {
          label: '排序',
          prop: 'slot_sortCode',
        },
        state: {
          label: '状态',
          prop: 'slot_state',
        },
      },
    }
  },
  created() {},
  methods: {
    //弹窗关闭时
    handleClosed(formName) {
      this.$refs[formName]?.resetFields()
    },

    //新增分组提交
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        if (!this.dialogData.isGroup) return
        await addGroup(this.dialogData.model)
        this.$_fetchTableData()
        this.$message.success('新增成功！')
        this.dialogData.isVisible = false
      })
    },

    //打开弹唱
    openDialog(type, row) {
      //获取dialog元素判断是否添加类
      let el = document.querySelector('.component__dialog')
      this.dialogData.isVisible = true
      if (type === 'add') {
        this.dialogData.title = '新增分组'
        this.dialogData.isGroup = true
        el.classList.remove('isInfo')
        return
      }
      this.dialogData.title = '排班信息'
      this.dialogData.isGroup = false
      el.classList.add('isInfo')

      this.userInfo = row
    },

    //删除分组
    async delList({ id }) {
      const confirm = await this.$confirm('是否确认删除？', '提示', {
        type: 'warning',
      }).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') return
      await delGroup({ id })
      this.$message.success('删除成功！')
      this.$_fetchTableData()
    },

    //修改名称和排序
    async resolveSortChange(value, { id }, type) {
      await editGroupInfo({ id, [type]: value })
      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })
      this.$_fetchTableData()
    },

    //状态变化
    async handleChange(state, { id }, index) {
      await editGroupState({ id, state }).catch(err => {
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

    //获取排班信息顶部基础信息
    async getTopInfo({ id }) {
      const res = await getScheduleTopInfo({ id })
      this.topInfo = res
    },
    //分组排班信息底部业务信息
    async getScheduleDayInfo({ id }) {
      const res = await getScheduleDayInfo({ id })
      console.log(res)
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .isInfo {
  max-width: 1200px;
  width: 1200px !important;
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
