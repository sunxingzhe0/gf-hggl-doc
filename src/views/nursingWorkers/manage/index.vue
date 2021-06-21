<template>
  <div class="view__card isInfo" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      showSelection
    >
      <template v-slot:slot_bizStatus="{ row, $index }">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="row.bizStatus"
          @change="bizStatusChange($event, row, $index)"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:slot_status="{ row, $index }">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="row.status"
          @change="statusChange($event, row, $index)"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>

      <template v-slot:footertool>
        <el-button @click="handelBatch(0)">批量禁用</el-button>
        <el-button @click="handelBatch(1)">批量启用</el-button>
        <el-button type="primary" @click="openDialog('add')"
          >新增护工</el-button
        >
      </template>

      <template v-slot:fixed="{ row }">
        <span class="btns" @click="goInfo(row)">查看</span>
        <span class="btns" @click="openDialog('edit', row)">编辑</span>
        <span
          class="btns"
          @click="delList(row)"
          v-if="!row.status && !row.bizStatus"
          >删除</span
        >
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
        <el-row>
          <!-- 循环渲染 -->
          <el-col
            :span="val.rowSize"
            v-for="val in dialogData.itemList"
            :key="val.value"
          >
            <el-form-item :prop="val.value" :label="val.label">
              <el-input
                v-if="val.type === 'input'"
                type="text"
                v-model="dialogData.model[val.value]"
              ></el-input>
              <el-select
                v-if="val.type === 'select'"
                v-model="dialogData.model[val.value]"
              >
                <el-option
                  v-for="it in dialogData.formSelectLists[val.value]"
                  :key="it.label"
                  :label="it.label"
                  :value="it.value"
                ></el-option>
              </el-select>
              <el-date-picker
                v-if="val.type === 'datePicker'"
                v-model="dialogData.model[val.value]"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>

              <el-cascader
                v-if="val.type === 'cascader'"
                v-model="dialogData.model[val.value]"
                :options="options"
                @change="addressChange(val.value, $event)"
              ></el-cascader>

              <el-input
                v-model="dialogData.model[val.value]"
                type="textarea"
                v-if="val.type === 'textarea'"
              ></el-input>
              <el-checkbox-group
                v-model="dialogData.model[val.value]"
                v-if="val.type === 'checkbox'"
              >
                <el-checkbox
                  v-for="it in dialogData.formSelectLists[val.value]"
                  :key="it.value"
                  :label="it.value"
                  >{{ it.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer v-if="dialogData.isGroup">
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
// import manageList from '@/store/mockState/manage'
import headers from './header.json'
import {
  workerList,
  changeBizStatus,
  changeStatus,
  workerDelete,
  chooseNurseGroup,
  workerAdd,
  workerEdit,
} from '@/api/nursingWorkers'
//公共接口 业务列表+选择护工分组列表(chooseNurseGroup)
import { bizList } from '@/api/setUp'
//地名
import {
  regionData,
  CodeToText /* TextToCode */,
} from 'element-china-area-data'
export default {
  name: 'manage',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          const res = (await workerList(params)) || {}
          res.headers = headers.headers
          return res
        },
      },
    ]),
  ],
  data() {
    return {
      row: {},
      //地址数据
      options: regionData,
      dialogData: {
        type: '',
        isGroup: true,
        title: '新增护工',
        isVisible: false,
        model: {
          phone: '',
          name: '',
          sex: '',
          groupId: '',
          birthday: '',
          bloodType: '',
          marriage: '',
          education: '',

          censusAddress: '', //籍贯
          censusAddressIds: [], //籍贯地址代码集合
          censusProvince: '', //籍贯省名
          censusCity: '', //籍贯市名
          censusCounty: '', //籍贯县名
          censusProvinceCode: '', //籍贯省代码
          censusCityCode: '', //籍贯市代码
          censusCountyCode: '', //籍贯县代码

          nowAddress: '', //居住地
          nowAddressIds: [], //居住地地址代码集合
          nowProvince: '', //居住地省名
          nowCity: '', //居住地市名
          nowCounty: '', //居住地县名
          nowProvinceCode: '', //居住地省代码
          nowCityCode: '', //居住地市代码
          nowCountyCode: '', //居住地县代码

          idCard: '',
          remark: '',
          bizList: [],
        },

        //表单列表选项值
        formSelectLists: {
          sex: [
            { label: '未知', value: 0 },
            { label: '男', value: 1 },
            { label: '女', value: 2 },
          ],
          //选择护工分组列表（接口请求赋值）
          groupId: [
            { label: '一组', value: 1 },
            { label: '二组', value: 0 },
          ],
          bloodType: [
            { label: 'A型', value: 1 },
            { label: 'B型', value: 2 },
            { label: 'O型', value: 3 },
            { label: 'AB型', value: 4 },
            { label: '不详', value: 5 },
          ],
          marriage: [
            { label: '未婚', value: 10 },
            { label: '已婚', value: 20 },
            { label: '初婚', value: 21 },
            { label: '再婚', value: 22 },
            { label: '复婚', value: 23 },
            { label: '丧偶', value: 30 },
            { label: '离婚', value: 40 },
            { label: '未知', value: 90 },
          ],
          education: [
            { label: '小学', value: 1 },
            { label: '初中', value: 2 },
            { label: '高中', value: 3 },
            { label: '中专', value: 4 },
            { label: '大专', value: 5 },
            { label: '本科', value: 6 },
            { label: '硕士', value: 7 },
            { label: '博士', value: 8 },
          ],
          //业务类型（接口请求赋值）
          bizList: [
            { label: '陪护', value: 2 },
            { label: '陪检', value: 1 },
            { label: '送标本', value: 0 },
          ],
        },

        //表单列表渲染数据
        itemList: [
          { label: '手机号', value: 'phone', type: 'input', rowSize: 8 },
          { label: '姓名', value: 'name', type: 'input', rowSize: 8 },
          { label: '性别', value: 'sex', type: 'select', rowSize: 8 },
          { label: '分组', value: 'groupId', type: 'select', rowSize: 24 },
          {
            label: '出生日期',
            value: 'birthday',
            type: 'datePicker',
            rowSize: 8,
          },
          { label: '血型', value: 'bloodType', type: 'select', rowSize: 8 },
          { label: '婚姻状况', value: 'marriage', type: 'select', rowSize: 8 },
          { label: '学历', value: 'education', type: 'select', rowSize: 8 },
          {
            label: '籍贯',
            value: 'censusAddressIds',
            type: 'cascader',
            rowSize: 8,
          },
          {
            label: '居住地',
            value: 'nowAddressIds',
            type: 'cascader',
            rowSize: 8,
          },
          { label: '身份证号', value: 'idCard', type: 'input', rowSize: 8 },
          {
            label: '个人简介',
            value: 'remark',
            type: 'textarea',
            rowSize: 24,
          },
          {
            label: '开通业务',
            value: 'bizList',
            type: 'checkbox',
            rowSize: 8,
          },
        ],
        rules: {
          phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
          groupId: [
            { required: true, message: '请选择分组', trigger: 'change' },
          ],
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
              { label: '姓名', value: 'name' },
              { label: '用户ID', value: 'id' },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '性别',
              options: [
                { label: '不限', value: '' },
                { label: '男', value: '1' },
                { label: '女', value: '2' },
              ],
            },
            keys: 'sex',
          },
        ],
      },
      query: {
        timeType: 0,
        searchType: 'name',
        size: 10,
        current: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        bizStatus: {
          label: '业务状态',
          prop: 'slot_bizStatus',
        },
        status: {
          label: '状态',
          prop: 'slot_status',
        },
        bizList: {
          formatter(row) {
            let arr = row.bizList.map(item => {
              return item.name
            })
            return arr.join('、')
          },
        },
        sex: {
          formatter(row) {
            return row.sex ? (row.sex === 1 ? '男' : '女') : '未知'
          },
        },
      },
    }
  },
  created() {},
  methods: {
    handleClosed(formName) {
      this.$refs[formName].resetFields()
    },

    //提交表单
    submit() {
      if (this.dialogData.type === 'add') {
        this.workerAdd()
        return
      }
      this.workerEdit()
    },

    //新增护工
    workerAdd() {
      console.log('新增')
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const params = this.dialogData.model
        await workerAdd(params)
        this.$message.success('新增成功！')
        this.dialogData.isVisible = false
        this.$_fetchTableData()
      })
    },

    //编辑护工
    async workerEdit() {
      console.log('编辑')
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const params = this.dialogData.model
        await workerEdit({ ...params, id: this.row.id })
        this.$message.success('编辑成功！')
        this.dialogData.isVisible = false
        this.$_fetchTableData()
      })
    },

    //获取分组列表和业务类型列表（公共接口）
    async getGroupAndBiz() {
      const groupList = await chooseNurseGroup()
      this.dialogData.formSelectLists.groupId = groupList.map(item => {
        return { label: item.groupName, value: item.id }
      })
      const businessList = await bizList()
      this.dialogData.formSelectLists.bizList = businessList.map(item => {
        return { label: item.busName, value: item.id }
      })
    },

    //打开弹窗
    async openDialog(type, row) {
      this.row = row
      this.dialogData.type = type
      this.dialogData.isVisible = true
      await this.getGroupAndBiz()
      if (type === 'add') {
        this.dialogData.title = '新增护工'
        return
      }
      this.dialogData.title = '编辑护工'
      console.log(row, '编辑')
      this.dialogData.model = JSON.parse(JSON.stringify(row))
      this.dialogData.model.bizList = this.dialogData.model.bizList.map(
        item => {
          return item.id
        },
      )
      this.dialogData.model.censusAddressIds = [
        row.censusProvinceCode,
        row.censusCityCode,
        row.censusCountyCode,
      ]
      this.dialogData.model.nowAddressIds = [
        row.nowProvinceCode,
        row.nowCityCode,
        row.nowCountyCode,
      ]
    },

    //查看详情
    goInfo(row) {
      this.$router.push({
        path: '/nursingWorkers/manage/info',
        query: row,
      })
    },

    //业务状态开关-开启时联动状态开关
    async bizStatusChange(bizStatus, row, index) {
      await changeBizStatus({ id: row.id, bizStatus }).catch(err => {
        this.tableData.list[index].bizStatus = !bizStatus
        throw Error(err)
      })
      this.tableData.list[index].bizStatus = bizStatus

      //开启时且状态未开启时联动
      if (bizStatus && !row.status) {
        this.statusChange((status = bizStatus), row, index)
        console.log('联动---------')
      }
      this.$_fetchTableData()
      this.$message({
        type: 'success',
        message: bizStatus ? '启用成功' : '禁用成功',
        showClose: true,
      })
    },

    // 状态开关-关闭时联动业务状态开关(关闭联动后台已做，只需拉取列表数据即可)
    async statusChange(status, row, index) {
      await changeStatus({ id: row.id, status }).catch(err => {
        this.tableData.list[index].status = !status
        throw Error(err)
      })
      this.tableData.list[index].status = status
      this.$_fetchTableData()
      this.$message({
        type: 'success',
        message: status ? '启用成功' : '禁用成功',
        showClose: true,
      })
    },

    //批量操作
    async handelBatch(status) {
      //选中项
      let list = this.tableData.multipleSelection
      const ids = list.map(item => {
        return item.id
      })
      const confirm = await this.$confirm('是否确认操作？', '提示！', {
        type: 'warning',
      }).catch(err => consle.log(err))
      if (confirm !== 'confirm') return
      // await changeStatus({ id: ids, status })
    },

    //删除护工
    async delList({ id }) {
      const confirm = await this.$confirm('是否确认删除？', '提示', {
        type: 'warning',
      }).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') return
      await workerDelete({ id })
      this.$message.success('删除成功！')
      this.$_fetchTableData()
    },
    //城市选择
    addressChange(type, e) {
      if (type === 'censusAddressIds') {
        this.censusAddressSet(e)
        return
      }
      this.nowAddressSet(e)
    },
    //籍贯地址处理
    censusAddressSet(e) {
      console.log(e, '地址编号')
      const nameList = {
        censusAddress:
          CodeToText[e[0]] + '/' + CodeToText[e[1]] + '/' + CodeToText[e[2]], //籍贯
        censusAddressIds: e, //籍贯地址代码集合
        censusProvince: CodeToText[e[0]], //籍贯省名
        censusCity: CodeToText[e[1]], //籍贯市名
        censusCounty: CodeToText[e[2]], //籍贯县名
        censusProvinceCode: e[0], //籍贯省代码
        censusCityCode: e[1], //籍贯市代码
        censusCountyCode: e[2], //籍贯县代码
      }
      Object.assign(this.dialogData.model, nameList)
    },
    //居住地地址处理
    nowAddressSet(e) {
      const nameList = {
        nowAddress:
          CodeToText[e[0]] + '/' + CodeToText[e[1]] + '/' + CodeToText[e[2]], //居住地
        nowAddressIds: e, //居住地地址代码集合
        nowProvince: CodeToText[e[0]], //居住地省名
        nowCity: CodeToText[e[1]], //居住地市名
        nowCounty: CodeToText[e[2]], //居住地县名
        nowProvinceCode: e[0], //居住地省代码
        nowCityCode: e[1], //居住地市代码
        nowCountyCode: e[2], //居住地县代码
      }
      Object.assign(this.dialogData.model, nameList)
    },
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
.el-cascader {
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
