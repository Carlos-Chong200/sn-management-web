<template>
  <el-dialog title="标定文件上传" :visible.sync="showFileUpload" center width="35%">
    <el-form :model="uploadForm">
      <el-form-item label="设备SN" label-width="150px">
        <el-input v-model="uploadForm.deviceSn" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="相机内参标" label-width="150px">
        <div class="upload-input-group">
          <el-upload class="upload-demo" :multiple=false :action="uploadUrl" :show-file-list="false"
            :on-success="(response) => handleUploadSuccess(response, 'cameraIntrinsic')">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          上次更新时间：<el-input v-model="uploadForm.lastCameraIntrinsic" autocomplete="off" disabled></el-input>
        </div>
      </el-form-item>
      <el-form-item label="相机到电机轴外参" label-width="150px">
        <div class="upload-input-group">
          <el-upload class="upload-demo" :multiple=false :action="uploadUrl" :show-file-list="false"
            :on-success="(response) => handleUploadSuccess(response, 'cameraCalibration')">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          上次更新时间：<el-input v-model="uploadForm.lastCameraCalibration" autocomplete="off" disabled></el-input>
        </div>
      </el-form-item>

      <el-form-item label="相机到雷达外参" label-width="150px">
        <div class="upload-input-group">
          <el-upload class="upload-demo" :multiple=false :action="uploadUrl" :show-file-list="false"
            :on-success="(response) => handleUploadSuccess(response, 'cameraToRadar')">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          上次更新时间：<el-input v-model="uploadForm.lastCameraToRadar" autocomplete="off" disabled></el-input>
        </div>
      </el-form-item>
      <el-form-item label="雷达到电机轴外参" label-width="150px">
        <div class="upload-input-group">
          <el-upload class="upload-demo" :multiple=false :action="uploadUrl" :show-file-list="false"
            :on-success="(response) => handleUploadSuccess(response, 'radarToMotor')">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          上次更新时间：<el-input v-model="uploadForm.lastRadarToMotor" autocomplete="off" disabled></el-input>
        </div>
      </el-form-item>
      <el-form-item label="标定原始文件(压缩包)" label-width="150px">
        <div class="upload-input-group">
          <el-upload class="upload-demo" :multiple=false :action="uploadUrl" :show-file-list="false"
            :on-success="(response) => handleUploadSuccess(response, 'originalFile')">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          上次更新时间：<el-input v-model="uploadForm.lastOriginalFile" autocomplete="off" disabled></el-input>
        </div>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showFileUpload = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmutRecord">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getLastRecord, addRecord } from '@/api/calibrationManagement';

export default {
  name: 'DeviceManagementUpload',
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_UPLOAD_URL,
      showFileUpload: false,
      uploadForm: {
      },
    };
  },
  mounted() {
    //获取这一条数据的最近更新记录
  },
  beforeDestroy() {
  },
  methods: {
    async handleLastRecord(sn) {
      this.showFileUpload = true;
      const { data } = await getLastRecord({ sn })
      if (data !== null) {
        this.uploadForm = data;
      } else {
        this.uploadForm = { deviceSn: sn }
      }
    },
    handleUploadSuccess(response, type) {
      switch (type) {
        case "cameraIntrinsic":
          this.$set(this.uploadForm, 'cameraIntrinsic', response.data.filepath);
          this.$set(this.uploadForm, 'lastCameraIntrinsic', response.data.uploadTime);
          break;
        case "cameraCalibration":
          this.$set(this.uploadForm, 'cameraCalibration', response.data.filepath);
          this.$set(this.uploadForm, 'lastCameraCalibration', response.data.uploadTime);
          break;
        case "cameraToRadar":
          this.$set(this.uploadForm, 'cameraToRadar', response.data.filepath);
          this.$set(this.uploadForm, 'lastCameraToRadar', response.data.uploadTime);
          break;
        case "radarToMotor":
          this.$set(this.uploadForm, 'radarToMotor', response.data.filepath);
          this.$set(this.uploadForm, 'lastRadarToMotor', response.data.uploadTime);
          break;
        case "originalFile":
          this.$set(this.uploadForm, 'originalFile', response.data.filepath);
          this.$set(this.uploadForm, 'lastOriginalFile', response.data.uploadTime);
      }
      this.$baseMessage("文件上传成功", 'success')
    },
    async handleSubmutRecord() {
      await addRecord(this.uploadForm);
      this.showFileUpload = false;
    }
  }
};
</script>

<style scoped>
.el-form-item__label {
  font-size: 14px;
  color: #333;
  margin-right: 10px;
}

.upload-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.upload-input-group .el-input {
  width: 200px;
  margin-right: 10px;
}
</style>