<template>
  <div class="flow-menu"
       ref="tool">
    <el-scrollbar style="height: calc(100vh - 47px);">
      <div v-for="menu  in  menuList"
           :key="menu.id">
        <span class="ef-node-pmenu"
              @click="menu.open = !menu.open"><i :class="{'el-icon-caret-bottom': menu.open,'el-icon-caret-right': !menu.open}"></i>&nbsp;{{menu.name}}</span>
        <ul v-show="menu.open"
            class="ef-node-menu-ul">
          <draggable @end="end"
                     @start="move"
                     v-model="menu.children"
                     :options="draggableOptions">
            <li v-for="subMenu in menu.children"
                class="ef-node-menu-li"
                :key="subMenu.id"
                :type="subMenu.type"
                style="text-align: left">
              <i :class="subMenu.ico"></i> {{subMenu.name}}
            </li>
          </draggable>
        </ul>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

var mousePosition = {
  left: -1,
  top: -1
}

export default {
  data () {
    return {
      activeNames: '1',
      // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
      draggableOptions: {
        preventOnFilter: false,
        sort: false,
        disabled: false,
        ghostClass: 'tt',
        // 不使用H5原生的配置
        forceFallback: true
        // 拖拽的时候样式
        // fallbackClass: 'flow-node-draggable'
      },
      // 默认打开的左侧菜单的id
      defaultOpeneds: [],
      menuList: [
        {
          id: '1',
          type: 'group',
          name: '输入',
          ico: 'el-icon-video-play',
          open: true,
          children: [
            {
              id: '11',
              type: 'csvInput',
              name: 'csv文件输入',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '12',
              type: 'jsonInput',
              name: 'json文件输入',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '13',
              type: 'txtInput',
              name: '文本文件输入',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '14',
              type: 'generateRecord',
              name: '生成记录',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '15',
              type: 'generateRand',
              name: '生成随机数',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '16',
              type: 'mysqlInput',
              name: 'mysql表输入',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
                host: '',
                port: '',
                username: '',
                password: '',
                database: '',
                sql: ''
              },
              // 自定义覆盖样式
              style: {}
            }
          ]
        },
        {
          id: '2',
          type: 'group',
          name: '输出',
          ico: 'el-icon-video-pause',
          open: true,
          children: [
            {
              id: '21',
              type: 'csvOutput',
              name: 'csv文件输出',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            }, {
              id: '22',
              type: 'excelOutput',
              name: 'excel文件输出',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            }, {
              id: '23',
              type: 'mysqlOutput',
              name: 'mysql表输出',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
                host: '',
                port: '',
                username: '',
                password: '',
                database: '',
                table: '',
                fieldMappings: []
              },
              // 自定义覆盖样式
              style: {}
            }, {
              id: '24',
              type: 'jsonOutput',
              name: 'json文件输出',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            }
          ]
        },
        {
          id: '3',
          type: 'group',
          name: '转换',
          ico: 'el-icon-video-pause',
          open: true,
          children: [
            {
              id: '31',
              type: 'valueMapping',
              name: '值映射',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            }, {
              id: '33',
              type: 'columnToRow',
              name: '列转行',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            }, {
              id: '34',
              type: 'cutString',
              name: '切割字符串',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            }, {
              id: '35',
              type: 'removeDuplicateRecord',
              name: '去除重复记录',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            }, {
              id: '36',
              type: 'replaceString',
              name: '字符串替换',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
              },
              // 自定义覆盖样式
              style: {}
            }, {
              id: '37',
              type: 'changeFieldType',
              name: '字段类型转换',
              ico: 'el-icon-caret-right',
              // 组件参数
              params: {
                fields: []
              },
              // 自定义覆盖样式
              style: {}
            }
          ]
        }
      ],
      nodeMenu: {}
    }
  },
  components: {
    draggable
  },
  created () {
    /**
     * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
     * @param event
     */
    if (this.isFirefox()) {
      document.body.ondrop = function (event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX
        mousePosition.top = event.clientY - 50
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    // 根据类型获取左侧菜单对象
    getMenuByType (type) {
      for (let i = 0; i < this.menuList.length; i++) {
        let children = this.menuList[i].children
        for (let j = 0; j < children.length; j++) {
          if (children[j].type === type) {
            return children[j]
          }
        }
      }
    },
    // 拖拽开始时触发
    move (evt, a, b, c) {
      var type = evt.item.attributes.type.nodeValue
      this.nodeMenu = this.getMenuByType(type)
    },
    // 拖拽结束时触发
    end (evt, e) {
      this.$emit('addNode', evt, this.nodeMenu, mousePosition)
    },
    // 是否是火狐浏览器
    isFirefox () {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf('Firefox') > -1) {
        return true
      }
      return false
    }
  }
}
</script>
