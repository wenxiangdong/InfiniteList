// 加载条动画组件
<template>
  <div class="wrapper">
    <div v-bind:style="colorStyle" class="load load-1"></div>
    <div v-bind:style="colorStyle" class="load load-2"></div>
    <div v-bind:style="colorStyle" class="load load-3"></div>
    <div v-bind:style="colorStyle" class="load load-4"></div>
    <div v-bind:style="{color: color}" class="text">{{text}}</div>
  </div>
</template>

<script>
  export default {
    name: "Loading",
    props: {
      text: {
        type: String,
        default: "加载中"
      },
      color: {
        type: String,
        default: "gray"
      }
    },
    computed: {
      colorStyle(){
        return {
          backgroundColor: this.color || "gray"
        }
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    align-items: center;
    height: 20px;
  }
  .load {
    display: inline;
    height: 10px;
    margin-right: 5px;
    width: 5px;
    border-radius: 15px;
  }

  @keyframes loading {
    50% {
      height: 20px;
    }
    100% {
      height: 10px;
    }
  }

  .load-1 {
    animation: loading 1.5s 0s infinite;
  }
  .load-2 {
    animation: loading 1.5s 0.3s infinite;
  }
  .load-3 {
    animation: loading 1.5s 0.6s infinite;
  }
  .load-4 {
    animation: loading 1.5s 0.9s infinite;
  }

  .text {
    line-height: 20px;
  }
</style>
