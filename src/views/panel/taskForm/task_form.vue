<template>
  <el-dialog title="流程信息"
             :visible.sync="dialogVisible"
             width="30%">
    <div class="ef-node-form">
      <div class="ef-node-form-body">
        <el-form :model="task"
                 :rules="rules"
                 ref="taskForm"
                 label-width="80px">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="task.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-close"
                       @click="closeNodeForm">关闭
            </el-button>
            <el-button type="primary"
                       icon="el-icon-check"
                       @click="saveTask">保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import {codemirror} from 'vue-codemirror'
import {postAction} from '@/api/manage'
import {putAction} from '../../../api/manage'

export default {
  props: {},
  data () {
    return {
      dialogVisible: false,
      edit: false,
      task: {
        name: '',
        data: {
          nodeList: [],
          lineList: [],
          name: ''
        },
        id: ''
      },
      rules: {
        name: [{required: true, message: '请输入任务名称', trigger: 'blur'}]
      }
    }
  },
  components: {
    codemirror
  },
  methods: {
    init () {
      this.dialogVisible = true
    },
    saveTask () {
      console.log(this.task)
      this.$refs['taskForm'].validate((valid) => {
        if (valid) {
          if (this.edit) {
            this.task.data.name = this.task.name
            this.task.data = JSON.stringify(this.task.data)
            putAction('/task/edittask/' + this.task.id, this.task).then(res => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.$emit('createTask', res.data.data)
            })
          } else {
            this.task = {
              name: this.task.name,
              data: {
                nodeList: [],
                lineList: [],
                name: this.task.name
              }
            }
            this.task.data = JSON.stringify(this.task.data)
            postAction('/task/add', this.task).then((res) => {
              if (res.data.success) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.$emit('createTask', res.data.data)
              } else {
                this.$message.error('创建失败')
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeNodeForm () {
    }
  }
}
</script>
