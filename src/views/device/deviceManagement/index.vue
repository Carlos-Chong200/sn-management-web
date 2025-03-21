<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="8">
        <el-button icon="el-icon-folder-add" @click="handleBatchSave()" type="primary">批量录入设备</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">批量删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="16">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item label="设备SN码:">
            <el-input v-model.trim="queryForm.sn" clearable placeholder="请输入设备sn码" />
          </el-form-item>
          <el-form-item label="出厂日期:">
            <el-date-picker v-model="dateRangeForPicker" align="right" end-placeholder="结束日期" range-separator="至"
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
      @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column fit label="设备sn码" fixed prop="sn" show-overflow-tooltip min-width="220" />
      <el-table-column label="CPU信息" prop="cpuId" show-overflow-tooltip min-width="200" />
      <el-table-column label="序列号" prop="sequenceInfo" show-overflow-tooltip />
      <el-table-column label="设备名" prop="deviceName" show-overflow-tooltip />
      <el-table-column label="设备类型" prop="deviceType" show-overflow-tooltip />
      <el-table-column label="设备参数信息" prop="deviceInfo" show-overflow-tooltip width="150" />
      <el-table-column label="出厂日期" prop="manufacturingDateString" show-overflow-tooltip width="200" />
      <el-table-column label="销售时间" prop="purchaseDateString" show-overflow-tooltip width="250" />
      <el-table-column label="保修到期时间" prop="warrantyExpiryDateString" show-overflow-tooltip width="200" />
      <el-table-column label="生厂商" prop="manufacturer" show-overflow-tooltip />
      <el-table-column label="设备状态" show-overflow-tooltip>
        <template #default="scope">
          {{ getStatusText(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" show-overflow-tooltip width="300">
        <template #default="{ row }">
          <el-button size="small" type="success" @click="handleCalibUpload(row)">上传标定文件</el-button>
          <el-button type="danger" @click="handleMaintence(row)">维修登记</el-button>
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
      :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
    <batchsave ref="batchsave" />
    <cabliationUpload ref="cabliationUpload" />
    <edit ref="edit"></edit>
    <maintence ref="maintence"></maintence>
  </div>
</template>

<script>
import { getList, doDelete } from '@/api/deviceManagement'
import batchsave from './components/DeviceManagementBatchSave.vue'
import cabliationUpload from './components/DeviceManagementUpload.vue'
import edit from './components/DeviceManagementEdit.vue'
import maintence from './components/DeviceManagementMaintence.vue'

export default {
  name: 'DeviceManagement',
  components: { batchsave, cabliationUpload, edit, maintence },
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
      },
      selectRows: []
    }
  },
  mounted() {
    this.fetchData()
  },
  beforeDestroy() { },
  computed: {
    dateRangeForPicker: {
      get() {
        return this.queryForm.dateRange;
      },
      set(newValue) {
        if (newValue.length > 0) {
          this.queryForm.dateRange = newValue.map(date => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          });
        } else {
          this.queryForm.dateRange = [];
        }
      }
    }
  },
  methods: {
    handleBatchSave() {
      this.$refs['batchsave'].showBatchSave();
      //这里的逻辑首先打开某个面板，同时生成一些sn码，让用户填写设备信息
    },
    handleDelete(row) {
      if (row.id) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          console.log("row.id", row.id)
          const { msg } = await doDelete({ ids: [row.id] })
          this.$baseMessage(msg, 'success')
          this.fetchData()
        })
      } else {
        if (this.selectRows.length > 0) {
          const ids = this.selectRows.map((item) => item.id)
          this.$baseConfirm('你确定要删除选中项吗', null, async () => {
            const { msg } = await doDelete({ ids })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          this.$baseMessage('未选中任何行', 'error')
          return false
        }
      }
    },
    handleCalibUpload(row) {
      this.$refs['cabliationUpload'].showFileUpload = true;
      this.$refs['cabliationUpload'].uploadForm.deviceSn = row.sn;
      this.$refs['cabliationUpload'].handleLastRecord(row.sn);
    },
    handleEdit(row) {
      this.$refs['edit'].showEdit = true;
      this.$refs['edit'].form = row;
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return '正常'
        case 2:
          return '维修中'
        case 3:
          return '已拒保'
        case 4:
          return '已报废'
        default:
          return '未知状态'
      }
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleMaintence(row) {
      console.log("handleMaintence", row.sn)
      this.$refs['maintence'].form.deviceSn = row.sn;
      this.$refs['maintence'].showMaintence = true;
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