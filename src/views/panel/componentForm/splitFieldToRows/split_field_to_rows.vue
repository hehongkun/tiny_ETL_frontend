<template>
  <div>
    <div style="width: auto">
      <div class="ef-node-form-header">
        列拆分为多行
      </div>
      <div class="ef-node-form-body" style="display: inline-flex">
        <el-form :model="node"
                 ref="dataForm"
                 label-width="200px"
                 v-show="type === 'node'">
          <el-form-item label="要拆分的字段">
            <el-input v-model="node.params.field"></el-input>
          </el-form-item>
          <el-form-item label="分隔符">
            <el-input v-model="node.params.separator"></el-input>
          </el-form-item>
          <el-form-item label="分隔符是正则表达式">
            <el-switch
            v-model="node.params.isRegexp"
            active-color="#13ce66"
            inactive-color="#f1f3f4">
          </el-switch>
          </el-form-item>
          <el-form-item label="新字段名">
            <el-input v-model="node.params.newField"></el-input>
          </el-form-item>
          <el-form-item label="输出中包含行号">
            <el-switch
              v-model="node.params.generateRowId"
              active-color="#13ce66"
              inactive-color="#f1f3f4">
            </el-switch>
          </el-form-item>
          <el-form-item label="行号字段">
            <el-input v-model="node.params.rowIdField"></el-input>
          </el-form-item>
          <el-form-item label="重置行号">
            <el-switch
              v-model="node.params.resetRowId"
              active-color="#13ce66"
              inactive-color="#f1f3f4">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-close"
                       @click="closeNodeForm">取消</el-button>
            <el-button type="primary"
                       icon="el-icon-check"
                       @click="save">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>

</template>

<script>
import { cloneDeep } from 'lodash'

export default {
  data () {
    return {
      visible: true,
      // node 或 line
      type: 'node',
      node: {},
      line: {},
      data: {},
      stateList: [{
        state: 'success',
        label: '成功'
      }, {
        state: 'warning',
        label: '警告'
      }, {
        state: 'error',
        label: '错误'
      }, {
        state: 'running',
        label: '运行中'
      }]
    }
  },
  methods: {
    /**
     * 表单修改，这里可以根据传入的ID进行业务信息获取
     * @param data
     * @param id
     */
    nodeInit (data, id) {
      this.type = 'node'
      this.data = data
      data.nodeList.filter((node) => {
        if (node.id === id) {
          this.node = cloneDeep(node)
          console.log(this.node)
        }
      })
    },
    closeNodeForm () {
      this.$emit('closeNodeForm')
    },
    lineInit (line) {
      this.type = 'line'
      this.line = line
    },
    // 修改连线
    saveLine () {
      this.$emit('setLineLabel', this.line.from, this.line.to, this.line.label)
    },
    save () {
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.name = this.node.name
          node.left = this.node.left
          node.top = this.node.top
          node.ico = this.node.ico
          node.state = this.node.state
          node.params = this.node.params
          this.$emit('save')
        }
      })
      this.visible = false
    }
  }
}
</script>

<style>
.el-node-form-tag {
  position: absolute;
  top: 50%;
  margin-left: -15px;
  height: 40px;
  width: 15px;
  background-color: #fbfbfb;
  border: 1px solid rgb(220, 227, 232);
  border-right: none;
  z-index: 0;
}
</style>
