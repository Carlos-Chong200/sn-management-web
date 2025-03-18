<template>
  <div>
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary">添加</el-button>
        <el-button icon="el-icon-delete" type="danger">批量删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.sn" clearable placeholder="请输入设备sn码" />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryForm.dateRange"
              align="right"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              type="daterange"
              unlink-panels
            />
          </el-form-item>

          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" @selection-change="setSelectRows">
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
      <el-table-column fixed="right" label="操作" show-overflow-tooltip width="120">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  import { getList } from '@/api/deviceManagement'

  export default {
    name: 'DeviceManagement',
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
    mounted() {},
    beforeDestroy() {},
    methods: {
      handleEdit(row) {
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
        console.log('fetchData datas', datas)
        this.list = datas
        this.total = total
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
