<template>
  <div v-if="easyFlowVisible"
       style="height: calc(100vh);"
       @contextmenu.prevent="rightClick">
    <el-row>
      <!--顶部工具菜单-->
      <el-col :span="24">
        <div class="ef-tooltar">
          <div style="float:left">
            <el-tag type="primary"
                    :underline="false"
                    @click="editTaskName">{{ hasTaskInfo ? data.name : 'null' }}
            </el-tag>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text"
                       icon="el-icon-video-play"
                       size="large"
                       @click="executeTask"></el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text"
                       icon="el-icon-download"
                       size="large"
                       @click="downloadData"></el-button>
            <el-button type="info"
                       plain
                       round
                       icon="el-icon-document"
                       @click="dataInfo"
                       size="mini">流程信息
            </el-button>
            <el-button type="info"
                       plain
                       round
                       icon="el-icon-document"
                       @click="openHelp"
                       size="mini">帮助
            </el-button>
          </div>
          <template>
            <div style="float: right;margin-right: 5px"
                 v-for="task in taskInfo"
                 :key="task.Id">
              <el-button key=task.Id
                         type="primary"
                         plain
                         round
                         @contextmenu.prevent.native="openMenu($event,task.Id)"
                         @click="loadData(task)"
                         icon="el-icon-refresh"
                         size="mini">{{ task.Name }}
              </el-button>
            </div>
          </template>
          <div style="float: right;margin-right: 5px">
            <el-button icon="el-icon-circle-plus"
                       plain
                       type="primary"
                       round
                       @click="addTask">新建任务
            </el-button>
            <el-button type="primary"
                       plain
                       round
                       icon="el-icon-document"
                       @click="openFilesDialog"
                       size="mini">文件库
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-if="!hasTaskInfo">
      <el-empty description="请先选择一个任务或创建一个任务"></el-empty>
    </div>
    <div v-else>
      <div style="display: flex;height: calc(100vh - 47px);">
        <div style="width: 230px;border-right: 1px solid #dce3e8;">
          <node-menu @addNode="addNode"
                     ref="nodeMenu"></node-menu>
        </div>
        <div id="efContainer"
             ref="efContainer"
             class="container"
             v-flowDrag>
          <template v-for="node in data.nodeList">
            <flow-node :id="node.id"
                       :key="node.id"
                       :node="node"
                       :activeElement="activeElement"
                       @changeNodeSite="changeNodeSite"
                       @nodeRightMenu="nodeRightMenu"
                       @clickNode="clickNode"
                       @showContexMenu="showNodeContextMenu">
            </flow-node>
          </template>
          <!-- 给画布一个默认的宽度和高度 -->
          <div style="position:absolute;top: 2000px;left: 2000px;">&nbsp;</div>
        </div>
        <!-- 组件参数配置框 -->
        <el-dialog :visible.sync="nodeFormShow"
                   style="height:100vh">
          <flow-node-form ref="nodeForm"
                          @setLineLabel="setLineLabel"
                          @repaintEverything="repaintEverything"
                          @closeNodeForm="closeNodeForm"></flow-node-form>
        </el-dialog>
      </div>
    </div>
    <!-- 流程数据详情 -->
    <task-data v-if="flowInfoVisible"
               ref="taskInfo"
               :data="data">
    </task-data>
    <task-help v-if="flowHelpVisible"
               ref="taskHelp"></task-help>
    <task-form v-if="taskFormVisible"
               ref="taskForm"
               @createTask="createTask($event)"></task-form>
    <user-files v-if="userFilesVisible"
                ref="userFiles"></user-files>
    <ul v-show="contexMenuVisible"
        :style="{left:left+'px',top:top+'px'}"
        class="contextmenu">
      <li @click="deleteElement">删除</li>
    </ul>
  </div>

</template>

<script>
import draggable from 'vuedraggable'
// import { jsPlumb } from 'jsplumb'
// 使用修改后的jsplumb
import './js/jsplumb'
import {easyFlowMixin} from '@/views/panel/js/mixins'
import flowNode from '@/views/panel/node'
import nodeMenu from '@/views/panel/componentMenu/component_menu'
import TaskData from '@/views/panel/taskData/task_data'
import TaskHelp from '@/views/panel/help/help'
import FlowNodeForm from '@/views/panel/componentForm/component_form'
import lodash from 'lodash'
import TaskForm from '@/views/panel/taskForm/task_form'
import UserFiles from '@/views/panel/userFiles/user_files.vue'
// eslint-disable-next-line no-unused-vars
import {ForceDirected} from './js/force-directed'
import {getAction, postAction} from '@/api/manage'
import {axios} from '@/utils/request'

export default {
  name: 'panel',
  data () {
    return {
      // 当前页面是否已经有任务信息
      hasTaskInfo: false,
      // 组件参数配置会话框是否显示
      nodeFormShow: false,
      // jsPlumb 实例
      jsPlumb: null,
      // 控制画布销毁
      easyFlowVisible: true,
      // 控制流程数据显示与隐藏
      flowInfoVisible: false,
      // 是否加载完毕标志位
      loadEasyFlowFinish: false,
      // 右键菜单
      contexMenuVisible: false,
      // 用户文件树
      userFilesVisible: false,
      top: 0,
      left: 0,
      that: this,
      // etl任务信息
      taskInfo: [],
      flowHelpVisible: false,
      taskFormVisible: false,
      // 数据
      data: {
        nodeList: [],
        lineList: [],
        name: ''
      },
      // 激活的元素、可能是节点、可能是连线
      activeElement: {
        // 可选值 node 、line
        type: undefined,
        // 节点ID
        nodeId: undefined,
        // 连线ID
        sourceId: undefined,
        targetId: undefined,
        taskId: undefined
      },
      zoom: 0.5
    }
  },
  // 一些基础配置移动该文件中
  mixins: [easyFlowMixin],
  components: {
    draggable, flowNode, nodeMenu, TaskData, FlowNodeForm, TaskHelp, TaskForm, UserFiles
  },
  directives: {
    'flowDrag': {
      bind (el, binding, vnode, oldNode) {
        if (!binding) {
          return
        }
        el.onmousedown = (e, binding) => {
          if (e.button === 2) {
            // 右键不管
            return
          }
          //  鼠标按下，计算当前原始距离可视区的高度
          let disX = e.clientX
          let disY = e.clientY
          el.style.cursor = 'move'

          document.onmousemove = function (e) {
            // 移动时禁止默认事件
            e.preventDefault()
            const left = e.clientX - disX
            disX = e.cldataientX
            el.scrollLeft += -left

            const top = e.clientY - disY
            disY = e.clientY
            el.scrollTop += -top
          }

          document.onmouseup = function (e) {
            el.style.cursor = 'auto'
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    this.jsPlumb = jsPlumb.getInstance()
    this.getTaskList()
  },
  watch: {
    contexMenuVisible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeContextMeny)
      } else {
        document.body.removeEventListener('click', this.closeContextMeny)
      }
    }
  },
  methods: {
    getTaskList () {
      this.taskFormVisible = false
      getAction('/task/getalltasklist').then((res) => {
        this.taskInfo.splice(0, this.taskInfo.length)
        if (res.data) {
          for (var task of res.data) {
            task['Running'] = false // 一开始所有任务的执行状态都是false
          }
          this.taskInfo = res.data
        } else {
          this.hasTaskInfo = false
        }
      })
    },
    closeNodeForm () {
      this.nodeFormShow = false
    },
    // 返回唯一标识
    getUUID () {
      return Math.random().toString(36).substr(3, 10)
    },
    createTask (task) {
      this.taskFormVisible = false
      task['Running'] = false
      this.taskInfo.splice(0, 0, task)
      this.data = JSON.parse(this.taskInfo[0].Data)
      this.hasTaskInfo = true
      this.$nextTick(() => {
        this.dataReload(this.data)
      })
    },
    jsPlumbInit () {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化节点
        this.loadEasyFlow()
        // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
        this.jsPlumb.bind('click', (conn, originalEvent) => {
          this.activeElement.type = 'line'
          this.activeElement.sourceId = conn.sourceId
          this.activeElement.targetId = conn.targetId
          // 暂时将连接的配置关闭
          // this.$refs.nodeForm.lineInit({
          //   from: conn.sourceId,
          //   to: conn.targetId,
          //   label: conn.getLabel()
          // })
        })
        // 连线
        this.jsPlumb.bind('connection', (evt) => {
          let from = evt.source.id
          let to = evt.target.id
          if (this.loadEasyFlowFinish) {
            this.data.lineList.push({from: from, to: to})
          }
        })

        // 删除连线回调
        this.jsPlumb.bind('connectionDetached', (evt) => {
          this.deleteLine(evt.sourceId, evt.targetId)
        })

        // 改变线的连接节点
        this.jsPlumb.bind('connectionMoved', (evt) => {
          this.changeLine(evt.originalSourceId, evt.originalTargetId)
        })

        // 连线右击
        this.jsPlumb.bind('contextmenu', (evt, e) => {
          this.activeElement.type = 'line'
          this.activeElement.sourceId = evt.sourceId
          this.activeElement.targetId = evt.targetId
          this.openContextMenu(e)
        })

        // 连线
        this.jsPlumb.bind('beforeDrop', (evt) => {
          let from = evt.sourceId
          let to = evt.targetId
          if (from === to) {
            this.$message.error('节点不支持连接自己')
            return false
          }
          if (this.hasLine(from, to)) {
            this.$message.error('该关系已存在,不允许重复创建')
            return false
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error('不支持两个节点之间连线回环')
            return false
          }
          this.$message.success('连接成功')
          return true
        })

        // beforeDetach
        this.jsPlumb.bind('beforeDetach', (evt) => {
        })
        this.jsPlumb.setContainer(this.$refs.efContainer)
      })
    },
    openMenu (evt, id) {
      this.activeElement.type = 'task'
      this.activeElement.taskId = id
      this.openContextMenu(evt)
    },
    showNodeContextMenu (data) {
      this.activeElement.type = 'node'
      this.activeElement.nodeId = data.nodeId
      this.openContextMenu(data.evt)
    },
    openContextMenu (evt) {
      var screenX = evt.clientX
      // let efContainer = this.$refs.efContainer
      // var containerRect = efContainer.getBoundingClientRect()
      var left = screenX
      // if (efContainer) {
      //   this.left = left + efContainer.scrollLeft
      // } else {
      this.left = left
      // }

      this.top = evt.clientY // fix 位置bug
      this.contexMenuVisible = true
    },
    // 获取用户id
    closeContextMeny () {
      this.contexMenuVisible = false
    },
    // 加载流程图
    loadEasyFlow () {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        if (!node.viewOnly) {
          this.jsPlumb.draggable(node.id, {
            containment: 'parent',
            stop: function (el) {
              // 拖拽节点结束后的对调
              console.log('拖拽结束: ', el)
            }
          })
        }
      }
      // 初始化连线
      // eslint-disable-next-line no-redeclare
      for (var i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i]
        var connParam = {
          source: line.from,
          target: line.to,
          label: line.label ? line.label : '',
          connector: line.connector ? line.connector : '',
          anchors: line.anchors ? line.anchors : undefined,
          paintStyle: line.paintStyle ? line.paintStyle : undefined
        }
        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
      }
      this.$nextTick(function () {
        this.loadEasyFlowFinish = true
      })
    },
    rightClick (MouseEvent) {
      // 鼠标右击触发事件
      this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
    },
    // 设置连线条件
    setLineLabel (from, to, label) {
      var conn = this.jsPlumb.getConnections({
        source: from,
        target: to
      })[0]
      if (!label || label === '') {
        conn.removeClass('flowLabel')
        conn.addClass('emptyFlowLabel')
      } else {
        conn.addClass('flowLabel')
      }
      conn.setLabel({
        label: label
      })
      this.data.lineList.forEach(function (line) {
        if (line.from === from && line.to === to) {
          line.label = label
        }
      })
    },
    // 删除激活的元素
    deleteElement () {
      if (this.activeElement.type === 'node') {
        this.deleteNode(this.activeElement.nodeId)
      } else if (this.activeElement.type === 'line') {
        this.$confirm('确定删除所点击的线吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var conn = this.jsPlumb.getConnections({
            source: this.activeElement.sourceId,
            target: this.activeElement.targetId
          })[0]
          this.jsPlumb.deleteConnection(conn)
        }).catch(() => {
        })
      } else if (this.activeElement.type === 'task') {
        this.$confirm('确定删除所点击的任务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/task/deletetask/' + this.activeElement.taskId.toString()).then((res) => {
            this.getTaskList()
          })
        }).catch(() => {
        })
      }
    },
    // 删除线
    deleteLine (from, to) {
      this.data.lineList = this.data.lineList.filter(function (line) {
        if (line.from === from && line.to === to) {
          return false
        }
        return true
      })
    },
    // 改变连线
    changeLine (oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },
    // 改变节点的位置
    changeNodeSite (data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }
    },
    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    addNode (evt, nodeMenu, mousePosition) {
      var screenX = evt.originalEvent.clientX
      var screenY = evt.originalEvent.clientY
      let efContainer = this.$refs.efContainer
      var containerRect = efContainer.getBoundingClientRect()
      var left = screenX
      var top = screenY
      // 计算是否拖入到容器中
      if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
        this.$message.error('请把节点拖入到画布中')
        return
      }
      left = left - containerRect.x + efContainer.scrollLeft
      top = top - containerRect.y + efContainer.scrollTop
      // 居中
      left -= 85
      top -= 16
      var nodeId = this.getUUID()
      // 动态生成名字
      var origName = nodeMenu.name
      var nodeName = origName
      var index = 1
      while (index < 10000) {
        var repeat = false
        for (var i = 0; i < this.data.nodeList.length; i++) {
          let node = this.data.nodeList[i]
          if (node.name === nodeName) {
            nodeName = origName + index
            repeat = true
          }
        }
        if (repeat) {
          index++
          continue
        }
        break
      }
      var node = {
        id: nodeId,
        name: nodeName,
        type: nodeMenu.type,
        left: left + 'px',
        top: top + 'px',
        ico: nodeMenu.ico,
        params: nodeMenu.params,
        state: null
      }
      /**
       * 这里可以进行业务判断、是否能够添加该节点
       */
      this.data.nodeList.push(node)
      this.$nextTick(function () {
        this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
        this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(nodeId, {
          containment: 'parent',
          stop: function (el) {
            // 拖拽节点结束后的对调
            // console.log('拖拽结束: ', el)
          }
        })
      })
    },
    /**
     * 删除节点
     * @param nodeId 被删除节点的ID
     */
    deleteNode (nodeId) {
      this.$confirm('确定要删除节点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        /**
         * 这里需要进行业务判断，是否可以删除
         */
        this.data.nodeList = this.data.nodeList.filter(function (node) {
          if (node.id === nodeId) {
            // 伪删除，将节点隐藏，否则会导致位置错位
            // node.show = false
            return false
          }
          return true
        })
        this.$nextTick(function () {
          this.jsPlumb.removeAllEndpoints(nodeId)
        })
      }).catch(() => {
      })
      return true
    },
    clickNode (nodeId) {
      this.activeElement.type = 'node'
      this.activeElement.nodeId = nodeId
      this.nodeFormShow = true
      this.$nextTick(() => {
        this.$refs.nodeForm.nodeInit(this.data, nodeId)
      })
    },
    // 是否具有该线
    hasLine (from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    // 是否含有相反的线
    hashOppositeLine (from, to) {
      return this.hasLine(to, from)
    },
    nodeRightMenu (nodeId, evt) {
      this.menu.show = true
      this.menu.curNodeId = nodeId
      this.menu.left = evt.x + 'px'
      this.menu.top = evt.y + 'px'
    },
    repaintEverything () {
      this.nodeFormShow = false
      this.jsPlumb.repaint()
    },
    // 流程数据信息
    dataInfo () {
      this.flowInfoVisible = true
      this.$nextTick(function () {
        this.$refs.taskInfo.init()
      })
    },
    // 加载流程图
    dataReload (data) {
      this.easyFlowVisible = false
      this.$nextTick(() => {
        data = lodash.cloneDeep(data)
        this.easyFlowVisible = true
        this.data = data
        this.$nextTick(() => {
          // eslint-disable-next-line no-undef
          this.jsPlumb = jsPlumb.getInstance()
          this.$nextTick(() => {
            this.jsPlumbInit()
          })
        })
      })
    },
    loadData (task) {
      var tmpData = JSON.parse(task.Data)
      this.data.nodeList = tmpData.nodeList
      this.data.lineList = tmpData.lineList
      this.data.name = tmpData.name
      this.data.id = task.Id
      this.hasTaskInfo = true
      this.$nextTick(() => {
        console.log(this.data)
        this.dataReload(this.data)
      })
    },
    zoomAdd () {
      if (this.zoom >= 1) {
        return
      }
      this.zoom = this.zoom + 0.1
      this.$refs.efContainer.style.transform = `scale(${this.zoom})`
      this.jsPlumb.setZoom(this.zoom)
    },
    zoomSub () {
      if (this.zoom <= 0) {
        return
      }
      this.zoom = this.zoom - 0.1
      this.$refs.efContainer.style.transform = `scale(${this.zoom})`
      this.jsPlumb.setZoom(this.zoom)
    },
    // 下载数据
    downloadData () {
      this.$confirm('确定要下载该流程数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        var datastr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data, null, '\t'))
        var downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute('href', datastr)
        downloadAnchorNode.setAttribute('download', 'data.json')
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
        this.$message.success('正在下载中,请稍后...')
      }).catch(() => {
      })
    },
    openHelp () {
      this.flowHelpVisible = true
      this.$nextTick(function () {
        this.$refs.taskHelp.init()
      })
    },
    openFilesDialog () {
      this.userFilesVisible = true
      this.$nextTick(() => {
        this.$refs.userFiles.init()
      })
    },
    executeTask () {
      var taskData = this.data
      var data
      this.taskInfo.filter(function (item) {
        if (item.Id === taskData.id) {
          delete taskData.id
          item.Data = JSON.stringify(taskData)
          data = item
          taskData.id = item.Id
        }
      })
      console.log(taskData)
      console.log(data)
      postAction('/task/run', data, (res) => {
        console.log(res)
      })
    },
    // 创建一个新的转换任务
    addTask () {
      this.taskFormVisible = true
      this.$nextTick(() => {
        this.$refs.taskForm.dialogVisible = true
        this.$refs.taskForm.edit = false
      })
    },
    editTaskName () {
      this.taskFormVisible = true
      this.$nextTick(() => {
        this.$refs.taskForm.dialogVisible = true
        this.$refs.taskForm.edit = true
        this.$refs.taskForm.task.data = this.data
        this.$refs.taskForm.task.id = this.data.id
        this.$refs.taskForm.task.name = this.data.name
      })
    }
  }
}
</script>

<style scoped>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}

.contextmenu li:hover {
  background: #eee;
}
</style>
