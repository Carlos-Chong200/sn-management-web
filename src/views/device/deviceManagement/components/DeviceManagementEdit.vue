<template>
  <el-dialog title="编辑设备信息" :visible.sync="showEdit" center width="35%">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="设备SN码">
        <el-input v-model="form.sn" disabled></el-input>
      </el-form-item>
      <el-form-item label="CPU信息">
        <el-input v-model="form.cpuId"></el-input>
      </el-form-item>
      <el-form-item label="序列号信息">
        <el-input v-model="form.sequenceInfo"></el-input>
      </el-form-item>

      <el-form-item label="设备名称">
        <el-input v-model="form.deviceName"></el-input>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-input v-model="form.deviceType"></el-input>
      </el-form-item>


      <el-form-item label="设备参数信息">
        <el-input v-model="form.deviceInfo"></el-input>
      </el-form-item>
      <el-form-item label="生产商">
        <el-input v-model="form.manufacturer"></el-input>
      </el-form-item>
      <el-form-item label="设备状态">
        <el-select v-model="form.status" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="出厂日期">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.manufacturingDate"
            style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
      </el-form-item>
      <el-form-item label="销售时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.purchaseDate"
            style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { doUpdate } from '@/api/deviceManagement';

export default {
  name: "DeviceManagementEdit",
  data() {
    return {
      showEdit: false,
      form: {

      },
      options: [{
        value: 1,
        label: '正常'
      }, {
        value: 2,
        label: '维修中'
      }, {
        value: 3,
        label: '已拒保'
      }, {
        value: 4,
        label: '已报废'
      }],
    }
  },
  created() {

  },
  methods: {
    async onSubmit() {
      await doUpdate(this.form)
      this.showEdit = false;
    }
  }
}
</script>