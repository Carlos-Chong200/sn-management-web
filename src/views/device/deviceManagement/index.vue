<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary">添加</el-button>
        <el-button icon="el-icon-delete" type="danger">批量删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item label="设备SN码:">
            <el-input v-model.trim="queryForm.sn" clearable placeholder="请输入设备sn码" />
          </el-form-item>
          <el-form-item label="出厂日期:">
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
      <el-table-column fit label="设备sn码" prop="sn" show-overflow-tooltip width="300" />
      <el-table-column label="序列号" prop="sequenceInfo" show-overflow-tooltip />
      <el-table-column label="CPU信息" prop="cpuId" show-overflow-tooltip />
      <el-table-column label="设备名" prop="deviceName" show-overflow-tooltip />
      <el-table-column label="设备类型" prop="deviceType" show-overflow-tooltip />
      <el-table-column label="设备参数信息" prop="deviceInfo" show-overflow-tooltip width="150" />
      <el-table-column label="出厂日期" prop="manufacturingDate" show-overflow-tooltip width="200" />
      <el-table-column label="销售时间" prop="purchaseDate" show-overflow-tooltip width="250" />
      <el-table-column label="保修到期时间" prop="warrantyExpiryDate" show-overflow-tooltip width="200" />
      <el-table-column label="生厂商" prop="manufacturer" show-overflow-tooltip />
      <el-table-column label="设备状态" show-overflow-tooltip>
        <template #default="scope">
          {{ getStatusText(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <!-- <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange"
            :file-list="fileList">
            <el-button size="small" type="primary">上传标定文件</el-button>
          </el-upload> -->
          <el-button size="small" type="success" @click="handleCalibUpload(row)">上传标定文件</el-button>
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
      :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />

    <el-dialog title="标定文件上传" :visible.sync="showFileUpload" center width="30%">
      <el-form :model="uploadForm">
        <el-form-item label="设备SN" label-width="150px">
          <el-input v-model="uploadForm.sn" autocomplete="off" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动区域" label-width="150px">
          <el-select v-model="uploadForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="相机内参标" label-width="150px">
          <div class="upload-input-group">
            <el-upload class="upload-demo" multiple=false action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            上次更新时间：<el-input v-model="calibratuonRecord.lastCameraIntrinsic" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item></el-form-item>
        <el-form-item label="相机到电机轴外参" label-width="150px">
          <div class="upload-input-group">
            <el-upload class="upload-demo" multiple=false action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            上次更新时间：<el-input v-model="calibratuonRecord.lastCameraIntrinsic" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>

        <el-form-item label="相机到雷达外参" label-width="150px">
          <div class="upload-input-group">
            <el-upload class="upload-demo" multiple=false action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            上次更新时间：<el-input v-model="calibratuonRecord.lastCameraIntrinsic" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="雷达到电机轴外参" label-width="150px">
          <div class="upload-input-group">
            <el-upload class="upload-demo" multiple=false action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            上次更新时间：<el-input v-model="calibratuonRecord.lastCameraIntrinsic" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showFileUpload = false">取 消</el-button>
        <el-button type="primary" @click="showFileUpload = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/deviceManagement'
import Add from './components/DeviceManagementAdd.vue'

export default {
  name: 'DeviceManagement',
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      layout: 'total, sizes, prev, pager, next, jumper',
      elementLoadingText: '正在加载...',
      showFileUpload: false,
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        sn: '',
        dateRange: [],
      },
      uploadForm: {
        sn: "",
      },
      calibratuonRecord: {
        lastCameraIntrinsic: "20240106:20:10:23"
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  beforeDestroy() { },
  methods: {
    handleCalibUpload(row) {
      this.uploadForm.sn = row.sn;
      this.showFileUpload = true;
      console.log("row", row)
    },
    handleEdit(row) {
      this.showFileUpload = true;
      console.log('row', row)
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return '正常'
        case 2:
          return '维修'
        case 3:
          return '报废'
        case 4:
          return '拒保'
        default:
          return '未知状态'
      }
    },
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
      const { datas, total } = await getList(this.queryForm)
      this.list = datas
      this.total = total
      this.timeOutID = setTimeout(() => {
        this.listLoading = false
      }, 300)
    },
  },
}
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