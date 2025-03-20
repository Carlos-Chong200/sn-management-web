<template>
  <el-dialog title="批量录入设备" :visible.sync="showDialog" width="60%" @close="handleDialogClose"
    :close-on-click-modal="false" center>
    <el-table :data="generateDevices" style="width: 100%">
      <el-table-column label="sn" width="280">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sn" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="cpuId" label="设备cpu信息" width="auto">
        <template slot-scope="scope">
          <el-input v-model="scope.row.cpuId"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="sequenceInfo" label="生产序列号" width="auto">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sequenceInfo"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="manufacturingDate" label="出厂时间" width="auto">
        <template slot-scope="scope">
          <el-input v-model="scope.row.manufacturingDate"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deviceInfo" label="设备信息" width="auto">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deviceInfo"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deviceName" label="设备名称" width="auto">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deviceName"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deviceType" label="设备型号" width="auto">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deviceType"></el-input>
        </template>
      </el-table-column>

    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose(2)">取 消</el-button>
      <el-button type="primary" @click="handleClose(1)">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { doGenerate, doEdit } from '@/api/deviceManagement';

export default {
  name: 'DeviceManagementBatchSave',
  data() {
    return {
      showDialog: false,
      generateDevices: [],
      isProcessing: false
    };
  },
  mounted() {
    // 可在此处添加初始化逻辑
  },
  beforeDestroy() {
  },
  methods: {
    handleClose(status) {
      if (this.isProcessing) return;
      this.isProcessing = true;
      this.editAndSave(status);
      this.showDialog = false;
    },
    handleDialogClose() {
      if (this.isProcessing) return;
      this.showDialog = false;
    },
    showBatchSave() {
      this.showDialog = true;
      this.generateData();
    },
    async generateData() {
      try {
        const { datas } = await doGenerate({ number: 10 });
        this.generateDevices = datas;
      } catch (error) {
        console.error('生成设备数据失败:', error);
      }
    },
    async editAndSave(status) {
      try {
        await doEdit({ "handleStatus": status, "devices": this.generateDevices });
      } catch (error) {
        console.error('保存设备数据失败:', error);
      } finally {
        this.isProcessing = false;
      }
    }
  }
};
</script>

<style scoped></style>