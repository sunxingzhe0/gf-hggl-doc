<template>
  <div class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_status="{ row, $index }">
        <el-switch
          v-model="row.status"
          @change="handleChange($event, row, $index)"
          :active-value="1"
          :inactive-value="0"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" @click="openDialog('add')"
          >新增账号</el-button
        >
      </template>
      <template v-slot:fixed="{ row }">
        <span class="btns" @click="openDialog('edit', row)">编辑</span>
        <span class="btns" @click="delList(row.id)">删除</span>
      </template>
    </List>

    <el-dialog
      :title="dialogData.title"
      :visible.sync="dialogData.isVisible"
      append-to-body
      custom-class="component__dialog"
      @close="closeDialog"
    >
      <el-form
        ref="form"
        :model="dialogData.model"
        :rules="dialogData.rules"
        label-width="100px"
        width="100%"
      >
        <el-form-item prop="account" label="账号名称">
          <el-input
            :disabled="dialogData.isEdit"
            type="text"
            v-model="dialogData.model.account"
          ></el-input>
        </el-form-item>
        <el-form-item prop="roles" label="账号角色">
          <el-select
            :disabled="dialogData.isEdit"
            v-model="dialogData.model.roleList"
            multiple
            ollapse-tags
            placeholder="请选择账号角色"
          >
            <el-option
              v-for="val in dialogData.roles"
              :key="val.id"
              :label="val.name"
              :value="val.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="pwd" label="登录密码">
          <el-input type="password" v-model="dialogData.model.pwd"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="人员姓名">
          <el-input
            :disabled="dialogData.isEdit"
            type="text"
            v-model="dialogData.model.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="联系电话">
          <el-input
            :disabled="dialogData.isEdit"
            type="text"
            v-model="dialogData.model.phone"
          ></el-input>
        </el-form-item>
        <el-form-item prop="status" label="账号状态">
          <el-radio v-model="dialogData.model.status" :label="1">启用</el-radio>
          <el-radio v-model="dialogData.model.status" :label="0">禁用</el-radio>
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

import {
  accountList,
  roleList,
  addAccount,
  editAccount,
  changeAccountStatus,
  delAccount,
} from '@/api/setUp'
import headers from './header.json'
// import accountlist from '@/store/mockState/accountlist'
export default {
  name: 'accountSet',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          if (params.searchType && params.searchKeywords) {
            const key = params.searchType
            const val = params.searchKeywords
            Object.assign(params, { [key]: val })
            key === 'account' && params.name && delete params.name
            key === 'name' && params.account && delete params.account
          }
          if (!params.searchKeywords) {
            delete params.name
            delete params.account
          }
          const res = (await accountList(params)) || {}
          res.headers = headers.headers
          return res
        },
      },
    ]),
  ],

  data() {
    return {
      row: {},
      dialogData: {
        title: '',
        isVisible: false,
        isEdit: false,
        roles: [],
        model: {
          account: '',
          roleList: [],
          pwd: '',
          name: '',
          phone: '',
          status: 0,
        },
        rules: {
          account: [
            { required: true, message: '账号名称不能为空', trigger: 'blur' },
          ],
          roleList: [
            { required: true, message: '请选择账号角色', trigger: 'change' },
          ],
          pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
      },
      filter: {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['timeType', 'startCreateTime', 'endCreateTime'],
        },
        search: {
          props: {
            options: [
              { label: '账号', value: 'account' },
              { label: '姓名', value: 'name' },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '业务状态',
              options: [
                { label: '不限', value: '' },
                { label: '启用', value: '1' },
                { label: '禁用', value: '0' },
              ],
            },
            keys: 'bizStatus',
          },
        ],
      },
      query: {
        timeType: 0,
        searchType: 'account',
        size: 10,
        current: 1,
        // sorted: 'DESC',
      },
      columns: {
        index: {
          hidden: true,
        },
        status: {
          label: '状态',
          prop: 'slot_status',
        },
        roleList: {
          formatter(row) {
            let arr = row.roleList.map(item => {
              return item.name
            })
            return arr.join('、')
          },
        },
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const res = await roleList()
      this.dialogData.roles = res.records
    },
    closeDialog() {
      this.$refs['form'].resetFields()
      this.dialogData.model = {
        account: '',
        roleList: [],
        pwd: '',
        name: '',
        phone: '',
        status: 0,
      }
    },
    openDialog(type, row) {
      this.dialogData.isVisible = true
      this.$nextTick(function () {
        this.$refs['form'].clearValidate()
      })
      //新增
      if (type === 'add') {
        const state = {
          title: '新增账号',
          isEdit: false,
        }
        return Object.assign(this.dialogData, state)
      }
      //编辑
      const state = {
        title: '编辑账号',
        isEdit: true,
      }

      this.dialogData.model = {
        account: row.account,
        roleList: row.roleList,
        pwd: '',
        name: row.name,
        phone: row.phone,
        status: row.status,
        id: row.id,
      }
      Object.assign(this.dialogData, state)
    },
    //保存
    submit() {
      if (!this.vilidate()) {
        return
      }
      if (this.dialogData.isEdit) {
        return this.editAccount()
      }
      this.addAccount()
    },
    //新增账号
    async addAccount() {
      const params = JSON.parse(JSON.stringify(this.dialogData.model))
      // console.log(params, '参数')
      // return
      this.dialogData.isVisible = false
      await addAccount(params)
      this.$message.success('新增成功！')
      this.$_fetchTableData()
    },
    //编辑账号
    async editAccount() {
      const params = JSON.parse(JSON.stringify(this.dialogData.model))
      this.dialogData.isVisible = false
      await editAccount(params)
      this.$message.success('编辑成功！')
      this.$_fetchTableData()
    },
    //验证
    vilidate() {
      let status = false
      this.$refs['form'].validate(valid => {
        if (valid) {
          status = true
        }
      })
      return status
    },
    async delList(id) {
      const confirm = await this.$confirm('是否确认删除？', '提示', {
        type: 'warning',
      })
      if (confirm !== 'confirm') return
      await delAccount({ id })
      this.$message.success('删除成功！')
      this.$_fetchTableData()
    },
    async handleChange(status, { id }, index) {
      await changeAccountStatus({ id, status }).catch(err => {
        this.tableData.list[index].status = !status
        throw Error(err)
      })
      this.tableData.list[index].status = status

      this.$message({
        type: 'success',
        message: status ? '角色启用成功' : '角色禁用成功',
        showClose: true,
      })
    },
  },
  mounted() {
    this.$_fetchTableData()
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
