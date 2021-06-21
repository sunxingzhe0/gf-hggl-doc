<template>
  <div class="view__card isInfo" v-loading="false">
    <el-table :data="orderList">
      <el-table-column
        v-for="c in columns"
        :key="c.field"
        fixed
        :prop="c.dataField"
        :label="c.label"
      >
        <template v-slot:slot_typeId="{ row }">
          {{ row.deptName }}，{{ row.inHospNo }}，{{ row.bedNum }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { List } from '@/components'
import header from '../workOrder/header.json'
export default {
  props: {
    orderList: Array,
  },
  components: {
    List,
  },
  data() {
    this.columns = header.headers
    return {}
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
