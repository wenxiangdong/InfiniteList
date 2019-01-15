<template>
  <div class="wrapper">
    <div class="content-wrapper">
      <slot></slot>
    </div>
    <div class="load-wrapper">
      <template v-if="!hasMore">
        <a style="color: #c5c8ce" href="javascript:return false;">{{loadButtonText}}</a>
      </template>
      <template v-else>
        <template v-if="loading">
          <Loading v-bind:color="tipColor" v-bind:text="loadButtonText"/>
        </template>
        <template v-else>
          <a
            v-on:click="handleClickLoad"
            v-bind:style="{color: tipColor}">
            {{loadButtonText}}
          </a>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import Loading from "./Loading";
  /**
   * 事件
   * on-request-load 请求加载数据(一般是更新数据源）
   * oon-load-completed 加载数据完成
   */
  export default {
    components: {Loading},
    props: {
      loadTip: {
        type: String,
        default: "加载更多"
      },
      loadingTip: {
        type: String,
        default: "正在加载"
      },
      // 加载提示的文字颜色
      tipColor: {
        type: String,
        default: "#2d8cf0"
      },
      loading: false,
      hasMore: true,
    },
    data() {
      return {
        noMoreTip: "已经加载全部"
      }
    },
    computed: {
      loadButtonText() {
        return this.loading ? this.loadingTip :
          (this.hasMore ? this.loadTip : this.noMoreTip);
      }
    },
    methods: {
      handleClickLoad() {
        // 发射 请求加载数据的 事件
        this.$emit("on-load");
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    width: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .load-wrapper {
    margin-top: 20px;
    text-align: center;
  }
  a {
    text-decoration: none;
    cursor: pointer;
  }
</style>
