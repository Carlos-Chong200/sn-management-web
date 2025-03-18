<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="form.username" autocomplete="off" :disabled="title !== '添加'" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" autocomplete="off" type="password" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="fullName">
        <el-input v-model.trim="form.fullName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model.trim="form.phone" autocomplete="off" />
      </el-form-item>
      <!--      <el-form-item label="权限" prop="permissions">-->
      <!--        <el-checkbox-group v-model="form.permissions">-->
      <!--          <el-checkbox label="admin" />-->
      <!--          <el-checkbox label="editor" />-->
      <!--        </el-checkbox-group>-->
      <!--      </el-form-item>-->
      <el-form-item label="权限" show-overflow-tooltip>
        <el-switch v-model="form.super" active-text="admin" inactive-text="user" />
      </el-form-item>
      <el-form-item label="启用状态" show-overflow-tooltip>
        <el-switch v-model="form.active" active-text="启用" inactive-text="禁用" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/userManagement'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          username: '',
          password: '',
          email: '',
          active: false,
        },
        rules: {
          username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
          password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
          email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        console.log('row', row)
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>
