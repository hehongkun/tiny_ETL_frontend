<template>
  <div>
    <div class="ef-node-form">
      <div class="ef-node-form-header">
        字段类型转换
      </div>
      <div class="ef-node-form-body">
        <el-form :model="node"
                 ref="dataForm"
                 label-width="80px"
                 v-show="type === 'node'">
          <div>
            <el-table :data="node.params.fields"
                      size="mini"
                      @cell-mouse-enter="handleCellEnter"
                      @cell-mouse-leave="handleCellLeave">
              <el-table-column prop="fieldName"
                               label="字段名"
                               align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit"
                            class="item"
                            v-model="scope.row.src"
                            placeholder="请输入字段名"></el-input>
                  <div v-else
                       class="txt">{{scope.row.src}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="fieldType"
                               label="字段类型"
                               align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit"
                            class="item"
                            v-model="scope.row.fieldType"
                            placeholder="请输入字段类型"></el-input>
                  <div v-else
                       class="txt">{{scope.row.fieldType}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="fieldFormat"
                               label="字段格式"
                               align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit"
                            class="item"
                            v-model="scope.row.fieldFormat"
                            placeholder="请输入字段格式"></el-input>
                  <div v-else
                       class="txt">{{scope.row.fieldFormat}}</div>
                </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               align="center">
                <template slot-scope="scope">
                  <el-button @click="handleAddField()"
                             type="text"
                             size="small">插入字段</el-button>
                  <el-button @click="handleDelete(scope.row)"
                             type="text"
                             size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
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
          console.log(typeof this.node.params.fields)
          this.node.params.fields.push({
            isEdit: false,
            fieldName: '',
            fieldType: '',
            fieldFormat: ''
          })
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
    },
    /** 鼠标移入cell */
    handleCellEnter (row, column, cell, event) {
      row.isEdit = true
    },
    /** 鼠标移出cell */
    handleCellLeave (row, column, cell, event) {
      row.isEdit = false
    },
    handleAddField () {
      this.node.params.fields.push({
        isEdit: false,
        fieldName: '',
        fieldType: '',
        fieldFormat: ''
      })
    },
    handleDelete (row) {
      if (this.node.params.fields.length === 1) {
        row.isEdit = false
        row.fieldName = ''
        row.fieldType = ''
        row.fieldFormat = ''
        return
      }
      this.node.params.fields.forEach(element => {
        if (element.src === row.src && element.dest === row.dest) {
          this.node.params.fields.splice(this.node.params.fields.indexOf(element), 1)
        }
      })
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

<style lang='scss'>
.item {
  width: 200px;
  /* 调整elementUI中样式 如果不需要调整请忽略 */
  .el-input__inner {
    height: 24px !important;
  }
}
.txt {
  line-height: 24px;
  padding: 0 9px;
  box-sizing: border-box;
}
.el-table {
  text-align: center;
}
</style>
