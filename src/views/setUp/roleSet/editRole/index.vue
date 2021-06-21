<template>
  <el-form
    class="view__card"
    ref="form"
    :model="model"
    :rules="rules"
    label-width="100px"
  >
    <el-form-item label="角色名称" prop="name">
      <el-input
        style="max-width: 400px;"
        v-model="model.name"
        maxlength="20"
        show-word-limit
      ></el-input>
    </el-form-item>

    <el-form-item label="权限配置" prop="role">
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        ref="tree"
        highlight-current
        :props="{
          children: 'children',
          label: 'label',
        }"
      >
      </el-tree>
    </el-form-item>

    <el-form-item label="角色状态" prop="state">
      <el-radio v-model="model.status" :label="1">启用</el-radio>
      <el-radio v-model="model.status" :label="0">禁用</el-radio>
    </el-form-item>

    <EditFooter class="is-center">
      <el-button type="primary" size="small" @click="submit">
        {{ id ? '保存' : '提交' }}
      </el-button>
    </EditFooter>
  </el-form>
</template>

<script>
import { EditFooter } from '@/components'
import { addRole, editRole } from '@/api/setUp'
import treeData from './treeData'
export default {
  name: 'AddAndEdit',
  props: {
    id: String,
  },
  components: {
    EditFooter,
  },
  data() {
    this.rules = {
      name: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    }
    return {
      treeData: treeData,
      loading: false,
      status: 'add',
      model: {
        id: '',
        name: '',
        status: 1,
        accessCodes: [],
      },
    }
  },
  created() {
    if (this.$route.query.id) {
      console.log(this.$route.query)
      this.model = this.$route.query
      this.status = 'edit'
      this.$nextTick(function () {
        this.$refs.tree.setCheckedKeys(
          this.$store.state.user.userInfo.accessCodes,
        )
      })
    }
  },
  methods: {
    submit() {
      const accessCodes = this.$refs.tree.getCheckedKeys().filter(item => {
        return isNaN(item)
      })
      Object.assign(this.model, { accessCodes })
      this.$refs.form.validate(async valid => {
        if (!valid) return
        if (this.status === 'add') {
          await addRole(this.model)
          this.$message.success('新增成功')
          this.$router.back()
          return
        }
        await editRole(this.model)
        this.$message.success('编辑成功')
        this.$router.back()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-form {
  width: 100%;
}
::v-deep {
  .el-tree > .el-tree-node + .el-tree-node {
    margin-top: 30px;
  }

  .c__edit-footer {
    z-index: 1;
  }
}
</style>
