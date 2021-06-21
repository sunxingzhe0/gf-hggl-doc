<template>
  <div class="view__card isInfo" v-loading="false">
    <List v-model="query" :columns="columns" :tableData="tableData">
      <!-- <template v-slot:footertool>
        <el-button type="primary" @click="addTask">新增任务</el-button>
      </template> -->

      <template v-slot:fixed="{ row, $index }">
        <span class="btns" @click="goInfo(row)">详情</span>
        <span class="btns" @click="openAgreeDialog($index)">同意</span>
        <span class="btns" @click="openRefuseDialog(row.orderId)">拒绝</span>
        <span class="btns" @click="openAfterSaleDialog(row.orderId)">售后</span>
      </template>
    </List>

    <!-- 售后 -->
    <el-dialog
      width="50%"
      :title="dialogData.title"
      :visible.sync="dialogData.isVisible"
      :close-on-click-modal="false"
      append-to-body
      custom-class="component__dialog"
      @open="getData"
    >
      <el-form
        ref="form"
        :model="dialogData.model"
        :rules="dialogData.rules"
        label-width="100px"
        width="100%"
      >
        <el-form-item prop="nurseName" label="售后类型">
          <el-select
            v-model="dialogData.model.serviceType"
            placeholder="请选择售后类型"
            value-key="id"
          >
            <el-option
              v-for="item in serviceTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="nurseName" label="售后理由">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="dialogData.model.serviceReason"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="nurseName" label="退订服务">
          <el-select
            v-model="dialogData.model.workIds"
            multiple
            placeholder="请选择护工"
          >
            <el-option
              v-for="item in orders"
              :key="item.orderId"
              :label="`${item.orderId}-${item.nurseName}`"
              :value="item.orderId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="nurseName" label="退款金额">
          <el-input v-model="dialogData.model.serviceMoney">
            <template slot="prepend">¥</template>
          </el-input>
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

    <!-- 同意预约单 -->
    <el-dialog
      width="50%"
      :title="agreeDialogData.title"
      :visible.sync="agreeDialogData.isVisible"
      :close-on-click-modal="false"
      append-to-body
      custom-class="component__dialog"
    >
      <el-row>
        <el-col :span="8"
          ><div class="grid-content bg-purple-dark">
            预约项目：{{ agreeDialogData.data.typeName }}
          </div></el-col
        >
        <el-col :span="8"
          ><div class="grid-content bg-purple-dark">
            护理对象：{{ agreeDialogData.data.patientName }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="8"
          ><div class="grid-content bg-purple-dark">
            联系电话：{{ agreeDialogData.data.contactPhone }}
          </div></el-col
        >
        <el-col :span="8"
          ><div class="grid-content bg-purple-dark">
            护理时间：查看
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col
          ><div class="grid-content bg-purple-dark">
            护工姓名：{{ agreeDialogData.data.nurseName }}，分组名称
          </div></el-col
        >
      </el-row>

      <el-form
        ref="form"
        :model="agreeDialogData.model"
        :rules="agreeDialogData.rules"
        label-width="100px"
        width="100%"
      >
        <el-row>
          <el-col :span="8" style="margin-top: 10px;"
            ><div class="grid-content bg-purple-dark">
              护理总额：￥{{ agreeDialogData.data.orderPrice }}
            </div></el-col
          >
          <el-col :span="16"
            ><div class="grid-content bg-purple-dark">
              <el-form-item prop="nurseName" label="优惠金额：" labelWidth="70">
                <el-switch
                  v-model="agreeDialogData.model.discountType"
                  active-text="+"
                  inactive-text="-"
                  active-value="+"
                  inactive-value="-"
                >
                </el-switch>
                <el-input
                  v-model="agreeDialogData.model.discountPrice"
                  style="margin-left: 20px;"
                >
                </el-input>
              </el-form-item></div
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8" style="margin-top: 10px;"
            ><div class="grid-content bg-purple-dark">
              应付金额：￥{{ agreeDialogData.data.payMoney }}
            </div></el-col
          >
          <el-col :span="8"
            ><div class="grid-content bg-purple-dark">
              <el-form-item prop="nurseName" label="支付方式：" labelWidth="70">
                <el-select v-model="agreeDialogData.model.paymentType">
                  <el-option
                    v-for="item in payTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item></div
          ></el-col>
        </el-row>
        <el-row>
          <el-col
            ><div class="grid-content bg-purple-dark">
              备注：{{ agreeDialogData.data.remark }}
            </div></el-col
          >
        </el-row>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入注意事项"
          v-model="agreeDialogData.model.note"
        >
        </el-input>
      </el-form>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="small" @click="agreeDialogData.isVisible = false">
            取消
          </el-button>
          <el-button size="small" type="primary" @click="agree">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 拒绝预约单 -->
    <el-dialog
      width="50%"
      :title="refuseDialogData.title"
      :visible.sync="refuseDialogData.isVisible"
      :close-on-click-modal="false"
      append-to-body
      custom-class="component__dialog"
    >
      <el-form
        ref="form"
        :model="refuseDialogData.model"
        :rules="refuseDialogData.rules"
        label-width="100px"
        width="100%"
      >
        <el-form-item prop="cancelReason" label="拒绝理由">
          <el-input
            v-model="refuseDialogData.model.cancelReason"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="is-center">
          <el-button size="small" @click="refuseDialogData.isVisible = false">
            取消
          </el-button>
          <el-button size="small" type="primary" @click="refuse">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { orderList, aftermarket, confirm, refuse } from '@/api/nursing'
import header from './header'

export default {
  name: 'taskList',
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function () {
          return Object.assign(await orderList(), {
            headers: header.headers,
          })
        },
      },
    ]),
  ],
  data() {
    this.payTypes = [
      { label: '在线支付', value: 'ONLINE' },
      { label: '线下支付', value: 'OFFLINE' },
    ]
    this.serviceTypes = [
      {
        label: '退服务退款',
        value: 'RETURN_GOODS_MONEY',
      },
      {
        label: '仅退服务',
        value: 'RETURN_GOODS',
      },
      {
        label: '仅退款',
        value: 'RETURN_MONEY',
      },
    ]
    return {
      orders: [],
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
      },
      dialogData: {
        title: '售后-预约单',
        isVisible: false,
        model: {
          operator: this.$store.state.user.userId,
          orderId: '',
          serviceMoney: 0,
          serviceReason: '',
          serviceType: '',
          workIds: [],
        },
        rules: {
          groupName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
        },
      },
      agreeDialogData: {
        title: '同意-预约单',
        isVisible: false,
        data: {},
        model: {
          operator: this.$store.state.user.userId,
          discountType: '-',
          discountPrice: 0,
          note: '',
          orderId: '',
          paymentType: '',
        },
        rules: {
          groupName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
        },
      },
      refuseDialogData: {
        title: '拒绝-预约单',
        isVisible: false,
        model: {
          operator: this.$store.state.user.userId,
          cancelReason: '',
          orderId: '',
        },
        rules: {
          groupName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
        },
      },
    }
  },
  methods: {
    async getData() {
      this.orders = (await orderList()).records
    },
    openAfterSaleDialog(orderId) {
      this.dialogData.isVisible = true
      this.dialogData.model.orderId = orderId
    },
    openAgreeDialog(index) {
      const ob = this.tableData.list[index]
      this.agreeDialogData.isVisible = true
      this.agreeDialogData.data = ob
      this.agreeDialogData.model.orderId = ob.orderId
    },
    openRefuseDialog(orderId) {
      this.refuseDialogData.isVisible = true
      this.refuseDialogData.model.orderId = orderId
    },
    goInfo(e) {
      this.$router.push(`/nursing/bookingForm/info?orderId=${e.orderId}`)
    },
    edit() {
      this.$router.push('/nursing/task/edit')
    },
    addTask() {
      this.$router.push('/nursing/task/add')
    },
    async submit() {
      await aftermarket(
        Object.assign({}, this.dialogData.model, {
          serviceMoney: Number(this.dialogData.model.serviceMoney),
        }),
      )
      this.$message.success('操作成功')
      this.dialogData.isVisible = false
      this.$_fetchTableData()
    },
    async agree() {
      await confirm(this.agreeDialogData.model)
      this.agreeDialogData.isVisible = false
      this.$_fetchTableData()
    },
    async refuse() {
      await refuse(this.refuseDialogData.model)
      this.refuseDialogData.isVisible = false
      this.$_fetchTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
.el-col {
  margin-bottom: 20px;
}
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
