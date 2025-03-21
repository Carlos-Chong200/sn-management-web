<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item label="设备SN码:">
            <el-input v-model.trim="queryForm.deviceSn" clearable placeholder="请输入设备sn码" />
          </el-form-item>
          <el-form-item label="维修登记时间:">
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
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column fit label="设备sn码" fixed prop="deviceSn" show-overflow-tooltip width="300" fix />
      <el-table-column label="维修登记日期" prop="maintenanceDate" show-overflow-tooltip width="300" />
      <el-table-column label="维修人" prop="maintenancePerson" show-overflow-tooltip width="auto">
      </el-table-column>
      <el-table-column label="维修类型" prop="maintenanceType" show-overflow-tooltip width="300">
      </el-table-column>
      <el-table-column label="维修花费" prop="maintenanceCost" show-overflow-tooltip width="300">
      </el-table-column>
      <el-table-column label="维修备注" prop="maintenanceDetails" show-overflow-tooltip width="300">
      </el-table-column>
      <el-table-column label="记录创建时间" prop="createdTime" show-overflow-tooltip width="auto" />

    </el-table>
    <el-pagination background :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
      :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
  </div>
</template>

<script>
import { getList } from '@/api/maintenceManagement'

export default {
  name: 'maintenanceManagement',
  data() {
    return {
      listLoading: false,
      list: [],
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
      const { datas, total } = await getList(this.queryForm)
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
