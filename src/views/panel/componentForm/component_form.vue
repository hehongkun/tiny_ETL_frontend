<template>
  <div style="text-align:center">
    <component :is="componetName"
               @save="save"
               @closeNodeForm="closeNodeForm"
               ref="virtualComponent"></component>
  </div>

</template>

<script>
import csvInput from './csvInput/csv_input.vue'
import jsonInput from './jsonInput/json_input.vue'
import mysqlInput from './mysqlInput/mysql_input.vue'

export default {
  data () {
    return {
      visible: true,
      componetName: null,
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
  components: {
    csvInput,
    mysqlInput,
    jsonInput
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
          this.componetName = node.type
        }
      })
      this.$nextTick(() => {
        this.$refs.virtualComponent.nodeInit(data, id)
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
      this.visible = false
      this.$emit('repaintEverything')
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
