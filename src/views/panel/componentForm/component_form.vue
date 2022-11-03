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
import mysqlOutput from './mysqlOutput/mysql_output.vue'
import changeFieldType from './changeFieldType/change_field_type.vue'
import valueMapping from './valueMapping/value_mapping.vue'
import cutString from './cutString/cut_string.vue'
import replaceString from './replaceString/replace_string.vue'
import removeDuplicateRecord from './removeDuplicateRecord/remove_duplicate_record.vue'
import columnToRow from './columnToRow/column_to_row.vue'
import fieldSelect from './fieldSelect/field_select.vue'
import rowToColumn from './rowToColumn/row_to_column'
import filterNull from './filterNull/filter_null.vue'
import filterNum from './filterNum/filter_num.vue'
import filterDate from './filterDate/filter_date.vue'
import filterString from './filterString/filter_string.vue'
import fillNum from './fillNum/fillNum'
import fillDate from './fillDate/fillDate'
import fillString from './fillString/fillString'
import filterNumRange from './filterNumRange/filter_num_range'
import filterDateRange from './filterDateRange/filter_date_range'
import addField from './addField/add_field'
import deleteField from './deleteField/delete_field'
import getFieldLength from './getFieldLength/get_field_length'
import addSequence from './addSequence/add_sequence'
import rowFlatten from './rowFlatten/row_flatten'
import splitFieldToRows from './splitFieldToRows/split_field_to_rows'
import setFieldValue from './setFieldValue/set_field_value'
import changeSequenceByValue from './changeSequenceByValue/change_sequence_by_value'
import postgresInput from './postgresInput/postgres_input.vue'
import postgresOutput from './postgresOutput/postgres_output.vue'
import leftJoin from './leftJoin/left_join.vue'

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
    jsonInput,
    mysqlOutput,
    changeFieldType,
    valueMapping,
    cutString,
    replaceString,
    removeDuplicateRecord,
    columnToRow,
    fieldSelect,
    rowToColumn,
    filterNull,
    filterNum,
    filterDate,
    filterString,
    fillNum,
    fillDate,
    fillString,
    setFieldValue,
    filterNumRange,
    filterDateRange,
    addField,
    deleteField,
    getFieldLength,
    addSequence,
    rowFlatten,
    splitFieldToRows,
    changeSequenceByValue,
    postgresInput,
    postgresOutput,
    leftJoin
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
