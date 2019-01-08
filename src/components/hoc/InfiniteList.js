import InfiniteListTemplate from "./InfiniteListTemplate";

/**
 * 使用高阶组件的办法实现了一个无限加载列表
 * 可以根据数据循环渲染出特定的组件，并且管理加载状态
 * @param component 具体项的组件 {props: {data}}
 * @return {*}
 * @constructor
 */
export default function InfiniteList(component) {
  const {tipColor, loadingTip, loadTip} = InfiniteListTemplate.props;
  return {
    mounted() {
      console.log("mounted hoc");
    },
    components: {
      InfiniteListTemplate  //  列表框架的模板，这个模板里面只有ui表现
    },
    props: {
      tipColor,
      loadTip,
      loadingTip,
      offset: {
        type: Number,
        default: 5
      },
      // 数据加载的函数，需要的是一个 (index, offset) => []
      loadDataFunc: {
        type: Function,
        default() {
          return (index, offset) => Promise.resolve(new Array(offset).map((o, i) => index + i));
        }
      }
    },
    data() {
      return {
        hasMore: true,
        loading: false,
        dataList: []
      }
    },
    watch: {
      // 当数据加载函数改变时，就必须加载数据了
      async loadDataFunc(newVal) {
        console.log(newVal);
        if (newVal) {
          try {
            this.loading = true;
            let res = await newVal(this.dataList.length, this.offset);
            if (res && res.length) {
              this.dataList = this.dataList.concat(res);
              this.$Message.success(`成功获取到${res.length}条新数据`);
            } else {
              this.$Message.info(`已经获取了全部数据了`);
              this.hasMore = false;
            }
          } catch (e) {
            this.$Message.error("加载失败" + e.message);
          } finally {
            this.loading = false;
          }
        }
      }
    },
    methods: {
      /**
       * 监听模板点出了加载按钮时的操作
       * 调用数据加载函数加载数据
       * @return {Promise<void>}
       */
      async handleLoadData() {
        try {
          this.loading = true;
          let res = await this.loadDataFunc(this.dataList.length, this.offset);
          if (res && res.length) {
            this.dataList = this.dataList.concat(res);
            this.$Message.success(`成功获取到${res.length}条新数据`);
          } else {
            this.$Message.info(`已经获取了全部数据了`);
            this.hasMore = false;
          }
        } catch (e) {
          this.$Message.error("加载失败" + e.message);
        } finally {
          this.loading = false;
        }
      }
    },
    render(h) {
      const self = this;
      // 根据 dataList循环渲染子组件
      const listItems = this.dataList.map(item => {
          console.log(item);
          return h(component, {
            props: {
              data: item
            }
          })
        });

      return h(InfiniteListTemplate, {
        props: {
          ...self.$props, // 传递所有参数
          hasMore: self.hasMore,  // 另外的hasMore和loading是这个HOC的state
          loading: self.loading
        },
        attrs: self.$attrs,
        on: {
          // 监听加载按钮事件
          "on-load": () => self.handleLoadData()
        }
      }, listItems);
    },
  }
}
