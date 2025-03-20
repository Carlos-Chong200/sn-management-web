<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item label="设备SN码:">
            <el-input v-model.trim="queryForm.deviceSn" clearable placeholder="请输入设备sn码" />
          </el-form-item>
          <el-form-item label="标定时间:">
            <el-date-picker v-model="queryForm.dateRange" align="right" end-placeholder="结束日期" range-separator="至"
              start-placeholder="开始日期" type="daterange" unlink-panels />
          </el-form-item>

          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column fit label="设备sn码" fixed prop="deviceSn" show-overflow-tooltip width="300" fix />
      <el-table-column label="标定人" prop="calibrationPerson" show-overflow-tooltip width="100" />
      <el-table-column label="相机内参更新时间" prop="lastCameraIntrinsic" show-overflow-tooltip width="auto">
        <template #default="scope">
          <span class="date-text">{{ scope.row.lastCameraIntrinsic }}</span>
          <el-button v-if="scope.row.cameraIntrinsic" type="primary" class="download-button"
            @click="handleDownload(scope.row.cameraIntrinsic)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="相机外参更新时间" prop="lastCameraCalibration" show-overflow-tooltip width="300">
        <template #default="scope">
          <span class="date-text">{{ scope.row.lastCameraCalibration }}</span>
          <el-button v-if="scope.row.cameraCalibration" type="primary" class="download-button"
            @click="handleDownload(scope.row.cameraCalibration)">下载</el-button>
        </template>
      </el-table-column></el-table-column>
      <el-table-column label="相机到雷达外参更新时间" prop="lastCameraToRadar" show-overflow-tooltip width="300">
        <template #default="scope">
          <span class="date-text">{{ scope.row.lastCameraToRadar }}</span>
          <el-button v-if="scope.row.cameraToRadar" type="primary" class="download-button"
            @click="handleDownload(scope.row.cameraToRadar)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="雷达到电机轴外参更新时间" prop="lastRadarToMotor" show-overflow-tooltip width="300">
        <template #default="scope">
          <span class="date-text">{{ scope.row.lastRadarToMotor }}</span>
          <el-button type="primary" class="download-button" v-if="scope.row.radarToMotor"
            @click="handleDownload(scope.row.radarToMotor)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="记录创建时间" prop="createdTime" show-overflow-tooltip width="auto" />


    </el-table></el-table>
    <el-pagination background :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
      :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
  </div>
</template>

<script>
import { getRecordList } from '@/api/calibrationManagement'

export default {
  name: 'CalibrationManagement',
  data() {
    return {
      listLoading: false,
      list: [],
      downloadUrl: "http://localhost:8809/api/deviceManagement/download?",
      total: 0,
      layout: 'total, sizes, prev, pager, next, jumper',
      elementLoadingText: '正在加载...',
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        sn: '',
        dateRange: [],
      },
    }
  },
  mounted() {
    this.queryData();
  },
  beforeDestroy() { },
  methods: {
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    setSelectRows(val) {
      this.selectRows = val
    },
    queryData() {
      this.queryForm.pageNo = 1
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      const { datas, total } = await getRecordList(this.queryForm)
      this.list = datas
      this.total = total
      this.timeOutID = setTimeout(() => {
        this.listLoading = false
      }, 300)
    },
    async handleDownload(filePath) {
      const url = this.downloadUrl + "filePath=" + filePath;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
}
</script>

<style lang="scss" scoped>
.el-table .date-text {
  margin-right: 10px;
}

.el-table .download-button {
  margin-left: 5px;
}
</style>
