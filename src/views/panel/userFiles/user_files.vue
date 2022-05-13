<template>
  <el-dialog title="帮助"
             :visible.sync="dialogVisible"
             width="70%"
             customClass="flowHelp">
    <div class="ns-tree-com tree-com">
      <el-tree :indent="0"
               :data="data"
               node-key="id"
               :expand-on-click-node="false"
               default-expand-all
               @node-click="handleNodeClick">
        <div class="custom-node"
             slot-scope="{node, data}">
          <div class="node-left">
            <el-input v-if="data.edit"
                      size="mini"
                      v-model="curText"></el-input>
            <span v-else
                  style="margin-left: 7px;">{{node.label}}</span>
          </div>
          <div class="node-right">
            <template v-if="data.edit">
              <el-button type="text"
                         @click="cancel(node, data)">取消</el-button>
              <el-button type="text"
                         @click="sure(node, data)">确定</el-button>
            </template>
            <template v-else>
              <div v-if="data.isDir">
                <el-button type="text"
                           @click="edit(node, data)">重命名</el-button>
                <el-button type="text"
                           @click="add(node, data)">添加文件夹</el-button>
                <el-button type="text"
                           @click="deleteNode(node, data)">删除</el-button>
              </div>
              <div v-else>
                <el-button type="text"
                           @click="deleteNode(node, data)">删除</el-button>
              </div>
            </template>
          </div>
        </div>
      </el-tree>
    </div>
  </el-dialog>
</template>

<script>

import { axios } from '@/utils/request'

export default {
  name: 'tree',
  data () {
    return {
      dialogVisible: false,
      curNode: {},
      curText: '',
      data: null
    }
  },
  props: {
  },
  model: {
  },
  watch: {
    data (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    init () {
      this.dialogVisible = true
      var userId = localStorage.getItem('userId')
      axios.get('/user/getuserfiles/' + userId.toString()).then((res) => {
        console.log(res.data.data)
        var filetree = this.parseData([res.data.data])
        console.log(filetree)
        this.data = filetree
      })
    },
    parseData (data) {
      var res = []
      for (var i = 0; i < data.length; i++) {
        if (typeof data[i] === 'object') {
          var tmpres = {}
          tmpres['label'] = Object.keys(data[i])[0]
          tmpres['isDir'] = true
          tmpres['edit'] = false
          tmpres['children'] = this.parseData(data[i][Object.keys(data[i])[0]])
          res.push(tmpres)
        } else {
          res.push({ 'label': data[i], 'isDir': false })
        }
      }
      return res
    },
    sure (node, data) {
      if (this.curText) {
        data.label = this.curText
        data.edit = false
      } else {
        this.$message.error('分类不能为空！')
      }
    },
    cancel (node, data) {
      data.edit = false
    },
    edit (node, data) {
      console.log(111)
      // 处理当前节点
      if (this.curNode && this.curNode.data) {
        this.curNode.data.edit = false
      }
      let { label } = data
      this.curText = label
      data.edit = true
      this.curNode = node
    },
    deleteNode (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    add (node, data) {
      let { children, id, label } = data
      if (!children || !children.length) {
        this.$set(data, 'children', [])
      }
      children = data.children
      const newNode = {
        id: id + '-' + children.length,
        label: label + (children.length + 1),
        edit: false,
        children: []
      }
      data.children.push(newNode)
    },
    handleNodeClick (data) {
      this.$emit('itemClick', data)
    }
  }
}
</script>

<style lang="scss">
.ns-tree-com.tree-com {
  $icon-width: 18px;
  $line-color: #969696;
  @mixin lineTopLeft {
    content: '';
    left: -7px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .el-tree {
    & > .el-tree-node {
      &:before {
        border-left: none !important;
      }
      &:after {
        border-top: none !important;
      }
    }
    .el-tree-node {
      position: relative;
      padding-left: 16px;
      &:last-child:before {
        height: 38px;
      }
      &:before {
        @include lineTopLeft;
        border-left: 1px solid $line-color;
        bottom: 0;
        height: 100%;
        top: -26px;
        width: 1px;
      }
      &:after {
        @include lineTopLeft;
        border-top: 1px dashed $line-color;
        height: 20px;
        top: 12px;
        width: 24px;
      }
      .el-tree-node__content {
        height: 32px;
      }
      .el-tree-node__content:hover {
        .node-right {
          display: block;
        }
      }
    }
    .el-tree-node__children {
      padding-left: 16px;
    }
  }
  .el-tree-node__expand-icon {
    width: $icon-width;
    height: $icon-width;
    &.is-leaf {
      &.el-icon-caret-right {
        background-image: none;
      }
    }
    &.expanded {
      transform: rotate(-180deg);
      &.el-icon-caret-right {
        background-image: url('/static/shouqi.png');
      }
    }
    &.el-icon-caret-right {
      &::before {
        content: '';
      }
      background-image: url('/static/zhankai.png');
      background-size: 100% 100%;
    }
  }
  .custom-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .node-right {
      display: none;
    }
  }
}
</style>
