<template>
  <div class="anan-table" ref="tableRef">
    <el-table
      v-bind="tableConfig"
      v-loading="loading"
      :class="{'no-border': !tableConfig.border}"
      :data="tableData"
      :height="bodyHeight-tableHeight"
      v-on="tableEvent"
      >
      <template v-for="(x, i) in colConfig">
        <el-table-column
          v-if="x.type && x.type === 'selection'"
          :key="x.id || i"
          v-bind="x">
        </el-table-column>
        <template v-else>
          <column-item 
            v-if="!x.isHidden" 
            :key="x.id || i" 
            :item-props="x"
            @btn-click="operateEvent">
            <template v-if="x.slot" v-slot:[x.slot]="data">
              <slot :name="x.slot" :data="data" />
            </template>
          </column-item>
        </template>
      </template>
      <template v-slot:empty>
        <span>暂无数据</span>
      </template>
    </el-table>
    <div class="anan-table-pagination" v-if="pageParams.total && pageParams.total>0">
      <el-pagination
        v-model:currentPage="pageParams.curPage"
        v-model:page-size="pageParams.limit"
        v-bind="{...paginationConfig, ...pageParams}"
        v-on="pageHandler" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex';
import ColumnItem from './components/ColumnItem.vue'

export default {
  name: 'anan-table',
  components: {
    ColumnItem
  },
  props: {
    tableConfig: {
      type: Object,
      required: false,
      default: () => {
        return {
          size: 'small',
          border: true
        }
      }
    },
    tableEvent: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    tableData: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: false
    },
    tableHeight: {
      type: [Number],
      required: false,
      default: 194
    },
    colConfig: {
      type: Array,
      required: true
    },
    paginationConfig: {
      type: Object,
      required: false,
      default: () => {
        return {
          small: false,
          background: true,
          layout: 'total, ->, prev, pager, next, jumper',
          pageSizes: ['20', '50', '100']
        }
      }
    },
    pageParams: {
      type: Object,
      required: true,
    },
    pageHandler: {
      type: Object,
      required: false,
      default: () => {
        return {
          sizeChange: () => {
            console.log('size change')
          },
          currentChange: () => {
            console.log('current change')
          }
        }
      }
    }
  },
  setup(props, context) {
    let bodyHeight = ref(document.querySelector('body').clientHeight)

    onMounted(() => {
      bodyHeight.value = document.querySelector('body').clientHeight
    })

    const store = useStore();

    const operateEvent = ({btn, data}) => {
      context.emit("btn-click", {
        btn,
        data,
      });
    };

    return {
      bodyHeight,
      operateEvent
    }
  }
}
</script>

<style lang="scss">
.anan-table {
  .anan-table-pagination {
    padding: 15px 0;
    background-color: #fff;
  }
  .no-border {
    &.el-table {
      thead.is-group th.el-table__cell {
        background: none;
      }
      .el-table__cell {
        border-right: none;
      }
      // .el-table__inner-wrapper::before,
      .el-table__inner-wrapper::after {
        height: 0;
      }
      .el-table__border-left-patch,
      &::before,
      &::after {
        width: 0;
      }
      .el-table__inner-wrapper tr:first-child th:first-child,
      .el-table__inner-wrapper tr:first-child td:first-child {
        border-left-width: 0;
      }
    }
  }
}
</style>
