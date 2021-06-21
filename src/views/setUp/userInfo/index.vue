<template>
  <div class="bg">
    <div class="box">
      <div class="admin-box-one" :key="val.value" v-for="val in nodeList">
        <div class="admin-title">{{ val.label }}</div>
        <div class="admin-text">{{ userInfo[val.value] || '--' }}</div>
      </div>
      <div class="admin-box-two">
        <div class="admin-title">密码</div>
        <div class="admin-text">
          <span>**********</span>
          <el-button
            size="mini"
            @click="dialogFormVisible = true"
            class="el-button"
            >修改</el-button
          >
        </div>
      </div>
    </div>
    <!-- 弹窗模块 -->
    <el-dialog
      title="修改密码"
      class="el-dailog"
      :visible.sync="dialogFormVisible"
      @close="closeDialog('ruleForm')"
    >
      <div class="formBox">
        <el-form
          :model="userInfo"
          ref="ruleForm"
          :rules="rules"
          class="el-form"
          label-position="left"
        >
          <el-form-item label="账号名称" label-width="80px">{{
            userInfo.account
          }}</el-form-item>
          <el-form-item label="账号角色" label-width="80px">{{
            userInfo.username
          }}</el-form-item>
          <el-form-item label="原密码" prop="oldPassword" label-width="80px">
            <el-input
              type="password"
              v-model="userInfo.oldPassword"
              autocomplete="off"
              placeholder="请输入原密码"
            ></el-input>
            <div class="judge" v-if="oldpwd !== 0">
              <div class="error" v-if="oldpwd === 1">
                <img src="@/assets/error.png" alt="" />
                <span>密码错误</span>
              </div>
              <div class="success" v-if="oldpwd === 2">
                <img src="@/assets/success.png" alt="" />
                <span>密码正确</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" label-width="80px">
            <el-input
              type="password"
              v-model="userInfo.newPassword"
              autocomplete="off"
              placeholder="请设置新密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="truePass" label-width="80px">
            <el-input
              type="password"
              v-model="userInfo.truePass"
              autocomplete="off"
              label-width="200px"
              placeholder="请再次输入新密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取消</el-button>
        <el-button type="primary" @click="sure('ruleForm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validatePassword, changePassword } from '@/api/setUp'
export default {
  data() {
    const validatPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      if (value !== this.userInfo.newPassword) {
        return callback(new Error('两次输入密码不一致!'))
      }
      callback()
    }
    return {
      // 原密码是否正确
      oldpwd: 0,
      dialogFormVisible: false,
      nodeList: [
        {
          label: '账户名称',
          value: 'account',
        },
        {
          label: '账号角色',
          value: 'username',
        },
        {
          label: '人员姓名',
          value: 'name',
        },
        {
          label: '联系电话',
          value: 'phone',
        },
      ],
      userInfo: {
        account: 'admin',
        username: '管理员',
        oldPassword: '',
        newPassword: '',
        truePass: '',
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', tigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', tigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '请输入6-16位字母或数字',
            tigger: 'blur',
          },
        ],
        truePass: [{ required: true, tigger: 'blur', validator: validatPass }],
      },
    }
  },
  created() {
    this.userInfo = Object.assign(
      this.userInfo,
      this.$store.state.user.userInfo,
    )
  },
  methods: {
    // 预校验旧密码
    async check() {
      let res = await validatePassword({
        oldPassword: this.userInfo.oldPassword,
      }).catch(error => {
        console.log(error)
      })
      return res
    },
    //修改密码
    async changePassword() {
      await changePassword(this.userInfo)
      this.$message.success('修改成功！')
    },

    cancel(ruleMsg) {
      this.dialogFormVisible = false
      this.$refs[ruleMsg].resetFields()
    },
    sure(ruleMsg) {
      this.$refs[ruleMsg].validate(async valid => {
        if (!valid) return
        //旧密码验证是否通过
        const res = await this.check()
        if (!res) return (this.oldpwd = 1)
        this.oldpwd = 2
        this.changePassword()
        this.dialogFormVisible = false
        this.$refs[ruleMsg].resetFields()
        this.oldpwd = 0
      })
    },
    closeDialog(ruleMsg) {
      this.$refs[ruleMsg].resetFields()
      this.oldpwd = 0
    },
  },
}
</script>

<style lang="scss">
.bg {
  background-color: #fff;
}
.el-tabs__nav {
  padding: 0 20px;
}
.el-tabs__active-bar {
  margin: 0 20px;
}
.el-tab-pane1 {
  display: flex;
  flex-direction: row;
  padding: 40px;
}
.box {
  margin-left: 200px;
  padding-top: 100px;
  width: 300px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 16px;
}
.admin-box-one,
.admin-box-two {
  width: 100%;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  line-height: 40px;
}
.admin-title {
  width: 80px;
  height: 100%;
}
.admin-text {
  flex: 1;
  height: 100%;
}
.el-button {
  margin-left: 10px;
}
.formBox {
  width: 100%;
  height: 100%;
  box-shadow: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.form-head {
  width: 350px;
  display: flex;
  flex-direction: row;
}
.el-form {
  width: 350px;
  margin-top: 15px;
}
.el-dialog__header,
.el-dialog__footer {
  padding: 10px;
}
.el-dialog__body {
  padding: 0;
}
.el-tabs__header {
  margin: 0;
}
.el-tab-pane2 {
  padding: 40px;
  box-sizing: border-box;
}
</style>
