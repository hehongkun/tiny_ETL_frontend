<template>
  <div>
    <div class="ef-node-form">
      <div class="ef-node-form-header">
        csv文件输入
      </div>
      <div class="ef-node-form-body">
        <el-form :model="node"
                 ref="dataForm"
                 label-width="80px"
                 v-show="type === 'node'">
          <el-form-item label="组件名称">
            <el-input v-model="node.name"></el-input>
          </el-form-item>
          <el-row>
            <el-col span=20>
              <el-form-item label="文件名">
                <el-input v-model="node.filename"></el-input>
              </el-form-item>
            </el-col>
            <el-button>浏览文件</el-button>
          </el-row>
          <el-form-item label="列分隔符">
            <el-input v-model="node.splitCharacter"></el-input>
          </el-form-item>
          <el-form-item label="封闭符">
            <el-input v-model="node.closureCharacter"></el-input>
          </el-form-item>
          <el-form-item label="文件编码">
            <el-select v-model="fileEncoding">
            </el-select>
          </el-form-item>
          <el-table :data="node.tableData"
                    size="mini"
                    style="align-self: center;"
                    @cell-mouse-enter="handleCellEnter"
                    @cell-mouse-leave="handleCellLeave">
            <el-table-column prop="fieldName"
                             label="字段名称"
                             width="180">
              <div class="item"
                   slot-scope="scope">
                <el-input class="item__input"
                          v-model="scope.row.fieldName"
                          placeholder="请输入内容"></el-input>
                <div class="item__txt">{{scope.row.fieldName}}</div>
              </div>
            </el-table-column>
            <el-table-column prop="fieldType"
                             label="字段类型"
                             width="180">
              <div class="item"
                   slot-scope="scope">
                <el-input class="item__input"
                          v-model="scope.row.fieldType"
                          placeholder="请输入内容"></el-input>
                <div class="item__txt">{{scope.row.fieldType}}</div>
              </div>
            </el-table-column>
            <el-table-column prop="fieldFormat"
                             label="字段格式">
              <div class="item"
                   slot-scope="scope">
                <el-select class="item__input"
                           v-model="scope.row.fieldFormat"
                           placeholder="请选择">
                  <el-option v-for="item in fieldFormatOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
                <div class="item__txt">{{foodLabel(scope.row.food)}}</div>
              </div>
            </el-table-column>
            <el-table-column prop="fieldFormat"
                             label="去除空格">
              <div class="item"
                   slot-scope="scope">
                <el-select class="item__input"
                           v-model="scope.row.fieldFormat"
                           placeholder="请选择">
                  <el-option v-for="item in fieldFormatOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
                <div class="item__txt">{{foodLabel(scope.row.food)}}</div>
              </div>
            </el-table-column>
          </el-table>
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
      }],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        food: '选项5'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        food: '选项5'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        food: '选项5'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        food: '选项5'
      }],
      // 需要编辑的属性
      editProp: ['date', 'name', 'food']
    }
  },
  computed: {
    foodLabel () {
      return (val) => {
        return this.options.find(o => o.value === val).label
      }
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
          this.$emit('save')
        }
      })
      this.visible = false
    },
    /** 鼠标移入cell */
    handleCellEnter (row, column, cell, event) {
      const property = column.property
      if (this.editProp.includes(property)) {
        cell.querySelector('.item__input').style.display = 'block'
        cell.querySelector('.item__txt').style.display = 'none'
      }
    },
    /** 鼠标移出cell */
    handleCellLeave (row, column, cell, event) {
      const property = column.property
      if (this.editProp.includes(property)) {
        cell.querySelector('.item__input').style.display = 'none'
        cell.querySelector('.item__txt').style.display = 'block'
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
