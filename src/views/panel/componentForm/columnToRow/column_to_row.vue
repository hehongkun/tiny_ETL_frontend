<template>
  <div>
    <div class="ef-node-form">
      <div class="ef-node-form-header">
        剪切字符串
      </div>
      <div class="ef-node-form-body">
        <el-form :model="node"
                 ref="dataForm"
                 label-width="160px"
                 v-show="type === 'node'">
          <el-form-item label="名称">
            <el-input v-model="node.name"></el-input>
          </el-form-item>
          <el-form-item label="关键字段">
            <el-input v-model="node.params.keyField"></el-input>
          </el-form-item>
          <h2>分组字段</h2>
          <div>
            <el-table :data="node.params.groupByFields"
                      size="mini"
                      @cell-mouse-enter="handleCellEnter"
                      @cell-mouse-leave="handleCellLeave">
              <el-table-column prop="groupByField"
                               label="目标字段"
                               align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit"
                            class="item"
                            v-model="scope.row.groupByField"></el-input>
                  <div v-else
                       class="txt">{{scope.row.groupByField}}</div>
                </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               align="center">
                <template slot-scope="scope">
                  <el-button @click="handleAddGroupByField()"
                             type="text"
                             size="small">插入字段</el-button>
                  <el-button @click="handleDeleteGroupByField(scope.row)"
                             type="text"
                             size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <h2>目标字段</h2>
          <div>
            <el-table :data="node.params.fields"
                      size="mini"
                      @cell-mouse-enter="handleCellEnter"
                      @cell-mouse-leave="handleCellLeave">
              <el-table-column prop="targetField"
                               label="目标字段"
                               align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit"
                            class="item"
                            v-model="scope.row.targetField"></el-input>
                  <div v-else
                       class="txt">{{scope.row.targetField}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="dataField"
                               label="数据字段"
                               align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit"
                            class="item"
                            v-model="scope.row.dataField"
                            placeholder="请输入目标值"></el-input>
                  <div v-else
                       class="txt">{{scope.row.dataField}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="keyValue"
                               label="关键字值"
                               align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit"
                            class="item"
                            v-model="scope.row.keyValue"></el-input>
                  <div v-else
                       class="txt">{{scope.row.keyValue}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="groupByType"
                               label="聚合方式"
                               align="center">
                <template slot-scope="scope">
                  <el-select value="scope.row.groupByType"
                             v-model="scope.row.groupByType">
                    <el-option label="最大值"
                               value="max"></el-option>
                    <el-option label="最小值"
                               value="min"></el-option>
                  </el-select>
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
          if (this.node.params.groupByFields.length === 0) {
            this.node.params.groupByFields.push({
              isEdit: false,
              groupByField: ''
            })
          }
          if (this.node.params.fields.length === 0) {
            this.node.params.fields.push({
              isEdit: false,
              targetField: '',
              dataField: '',
              keyValue: '',
              groupByType: ''
            })
          }
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
    handleAddGroupByField () {
      this.node.params.groupByFields.push({
        isEdit: false,
        groupByField: ''
      })
    },
    handleDeleteGroupByField (row) {
      if (this.node.params.groupByFields.length === 1) {
        row.groupByType = ''
        return
      }
      for (let i = 0; i < this.node.params.groupByFields.length; i++) {
        if (this.node.params.groupByFields[i].groupByField === row.groupByField) {
          this.node.params.groupByFields.splice(i, 1)
          break
        }
      }
    },
    handleAddField () {
      this.node.params.fields.push({
        isEdit: false,
        targetField: '',
        dataField: '',
        keyValue: '',
        groupByType: ''
      })
    },
    handleDelete (row) {
      if (this.node.params.fields.length === 1) {
        row.targetField = ''
        row.dataField = ''
        row.keyValue = ''
        row.groupByType = ''
        return
      }
      for (let i = 0; i < this.node.params.fields.length; i++) {
        if (this.node.params.fields[i].targetField === row.targetField) {
          this.node.params.fields.splice(i, 1)
          return
        }
      }
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
