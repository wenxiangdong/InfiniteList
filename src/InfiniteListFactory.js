import InfiniteListTemplate from "./InfiniteListTemplate";

/**
 * 使用高阶组件的办法实现了一个无限加载列表
 * 可以根据数据循环渲染出特定的组件，并且管理加载状态
 */
export default class InfiniteListFactory {

  static _defaultDataSource (index, offset = 5){return Promise.resolve([]);}

  // 以下是两个后续事件，只能接收到内部处理完之后发出的消息
  static EVENT_ON_SUCCESS = 'on-success';
  static EVENT_ON_FAIL = 'on-fail';

  /**
   * 创建一个无限列表组件
   * @param component 具体项的组件 {props: {data}}
   * @param {Function}dataSource  (index, offset) => Promise<[]> 的数据加载函数
   * @param {Function}onSuccess
   * @param {Function}onError
   * @return {*}
   */
  static createListComponent (
    component,
    dataSource = this._defaultDataSource
  ) {
    // 提取外层模板组件的属性，以便后面赋给框架
    const {tipColor, loadingTip, loadTip} = InfiniteListTemplate.props;
    return {
      mounted() {
        // 首次加载
        this.handleLoadData();
      },
      components: {
        InfiniteListTemplate  //  列表框架的模板，这个模板里面只有ui表现
      },
      props: {
        tipColor,
        loadTip,
        loadingTip,
      },
      data() {
        return {
          hasMore: true,  // 是否有更多数据
          loading: false, // 是否正在加载
          dataList: []  // 存放数据
        };
      },
      methods: {
        /**
         * 监听模板点出了加载按钮时的操作
         * 调用数据加载函数加载数据
         */
        async handleLoadData() {
          if (!this.hasMore || this.loading) return;
          try {
            this.loading = true;
            let res = await dataSource(this.dataList.length);
            if (res && res.length) {
              this.dataList = this.dataList.concat(res);
              this.$emit('on-success', "成功获取" + res.length + "条新数据");
            } else {
              this.hasMore = false;
              this.$emit('on-success', "已经获取全部数据");
            }
          } catch (e) {
            this.$emit('on-fail', e.message);
          } finally {
            this.loading = false;
          }
        }
      },
      // 返回渲染结果，vue的render函数
      render(h) {
        const self = this;
        // 根据数据List循环渲染出组件
        const listItems = this.dataList.map((o, i) => {
          return h(component, {
            props: {
              data: o
            },
            key: i
          });
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
            "on-load": function() {
              self.handleLoadData();
            }
          }
        }, listItems);
      }
    }
  }
}
