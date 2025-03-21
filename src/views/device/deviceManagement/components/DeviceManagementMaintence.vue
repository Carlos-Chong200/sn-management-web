<template>
  <el-dialog title="维修登记" :visible.sync="showMaintence" center width="35%" @close="handleClose">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="设备SN码">
        <el-input v-model="form.deviceSn" disabled></el-input>
      </el-form-item>
      <el-form-item label="维修人">
        <el-input v-model="form.maintenancePerson"></el-input>
      </el-form-item>
      <el-form-item label="维修类型">
        <el-input v-model="form.maintenanceType"></el-input>
      </el-form-item>
      <el-form-item label="维修花费">
        <el-input v-model="form.maintenanceCost"></el-input>
      </el-form-item>
      <el-form-item label="登记维修日期">
        <el-date-picker type="date" placeholder="选择日期" v-model="maintenanceDateForPicker"
          style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.maintenanceDetails"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="showMaintence = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { doCreate } from '@/api/maintenceManagement'

export default {
  name: "DeviceManagementMaintence",
  data() {
    return {
      showMaintence: false,
      form: {
        maintenanceDate: null,
        maintenanceDateString: null
      }
    }
  },
  created() {

  },
  beforeDestroy() {
    this.form = {}
  },
  computed: {
    maintenanceDateForPicker: {
      get() {
        return this.form.maintenanceDate;
      },
      set(newValue) {
        if (newValue) {
          const d = new Date(newValue);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          this.$set(this.form, 'maintenanceDate', formattedDate);
          this.form.maintenanceDateString = formattedDate;
        } else {
          this.$set(this.form, 'maintenanceDate', null);
          this.form.maintenanceDateString = null;
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.showMaintence = false;
      this.form = {};
    },
    async handleSave() {
      await doCreate(this.form);
      this.showMaintence = false;
    },
    handleClose() {
      this.form = {}
      this.showMaintence = false;
    }
  }
}
</script>