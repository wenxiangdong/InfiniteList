<template>
  <div id="app">
    <img src="./assets/logo.png">
    <InfiniteListComponent
      v-if="loadDataFunc"
      v-bind:load-data-func="loadDataFunc">
    </InfiniteListComponent>
  </div>
</template>

<script>
import MyComponent from "./components/MyComponent";
import InfiniteList from "./components/hoc/InfiniteList";
const InfiniteListComponent = InfiniteList(MyComponent);
export default {
  name: 'App',
  components: {MyComponent, InfiniteListComponent},
  data() {
    return {
      cmp: MyComponent,
      loadDataFunc: null,
      dataList: []
    }
  },
  mounted() {
    this.updateDataSource();
  },
  methods: {
    updateDataSource() {
      this.loadDataFunc = (index, offset) => new Promise(resolve => {
        let list = Array.apply(null, {length: offset}).map((item, i) => index + i);
        console.log("加载中", list);
        setTimeout(() => {
          resolve(list);
        }, 2000);
      });
    },
    handleLoadData() {
      this.updateDataSource();
    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
