export default {
  state: {},
  mutations: {},
  actions: {},
  getters: {
    /**
     * @param {state} state modules中的state数据
     * @param {getters} getters modules中的getters数据
     * @param {rootState} rootState 根部state数据
     * @param {rootGetters} rootGetters 根部getters数据
     * @description 根据user模块的access值，获取对应用户的功能模块
     */
    getAccessModules(state, getters, rootState, rootGetters) {
      let access = rootState.user.access;
      let getModules = [];
      switch (access) {
        case 'admin':
          getModules = [
            {
              id: 1,
              title: '图层控制',
              name: 'Layer',
              icon: 'logo-buffer'
            },
            {
              id: 2,
              title: '查询分析',
              name: 'Search',
              icon: 'ios-search'
            },
            {
              id: 3,
              title: '统计分析',
              name: 'Statistic',
              icon: 'md-stats'
            },
            {
              id: 4,
              title: '碰撞分析',
              name: 'Collide',
              icon: 'md-shuffle'
            },
            {
              id: 5,
              title: '净距分析',
              name: 'Distance',
              icon: 'md-pause'
            },
            {
              id: 6,
              title: '连通分析',
              name: 'Connection',
              icon: 'logo-steam'
            }
          ];
          break;
        case 'visitor':
          getModules = [
            {
              id: 1,
              title: '图层控制',
              name: 'Layer',
              icon: 'logo-buffer'
            },
            {
              id: 2,
              title: '查询分析',
              name: 'Search',
              icon: 'ios-search'
            },
            {
              id: 3,
              title: '统计分析',
              name: 'Statistic',
              icon: 'md-stats'
            },
            {
              id: 4,
              title: '碰撞分析',
              name: 'Collide',
              icon: 'md-shuffle'
            },
            {
              id: 5,
              title: '净距分析',
              name: 'Distance',
              icon: 'md-pause'
            }
          ];
          break;
        default:
          getModules = [
            {
              id: 1,
              title: '图层控制',
              name: 'Layer',
              icon: 'logo-buffer'
            },
            {
              id: 2,
              title: '查询分析',
              name: 'Search',
              icon: 'ios-search'
            },
            {
              id: 3,
              title: '统计分析',
              name: 'Statistic',
              icon: 'md-stats'
            }];
      }
      return getModules
    }
    ,
    /**
     * @param {state} state modules中的state数据
     * @param {getters} getters modules中的getters数据
     * @param {rootState} rootState 根部state数据
     * @param {rootGetters} rootGetters 根部getters数据
     * @description 根据user模块的access值，获取对应用户的图层
     */
    getAccessLayers(state, getters, rootState, rootGetters) {
      let access = rootState.user.access;
      let getLayers = [];
      switch (access) {
        case 'admin':
          getLayers = [
            {
              title: '管线数据',
              expand: true,
              children: [
                {
                  title: '普查管线',
                  expand: true,
                  children: [
                    {
                      title: '普查',
                      expand: true,
                      value: 'pc',
                      layer: null
                    },
                    {
                      title: '调绘',
                      expand: true,
                      value: 'dh',
                      layer: null
                    },
                    {
                      title: '示意',
                      expand: true,
                      value: 'sy',
                      layer: null
                    }
                  ]
                },
                {
                  title: '物探管线',
                  expand: true,
                  value: 'wt',
                  layer: null
                },
                {
                  title: '规划管线',
                  expand: true,
                  value: 'xm',
                  layer: null
                }
              ]
            },
            {
              title: '路网',
              expand: true,
              children: [
                {
                  title: '道路中线',
                  expand: false,
                  value: 'dlzx',
                  layer: null
                },
                {
                  title: '道路红线',
                  expand: false,
                  value: 'dlhx',
                  layer: null
                }
              ]
            },
            {
              title: '控规',
              expand: true,
              value: 'kg',
              layer: null
            }
          ];
          break;
        case 'visitor':
          getLayers = [
            {
              title: '管线数据',
              expand: true,
              children: [
                {
                  title: '普查管线',
                  expand: true,
                  children: [
                    {
                      title: '普查',
                      expand: true,
                      value: 'pc',
                      layer: null
                    },
                    {
                      title: '调绘',
                      expand: true,
                      value: 'dh',
                      layer: null
                    },
                    {
                      title: '示意',
                      expand: true,
                      value: 'sy',
                      layer: null
                    }
                  ]
                },
                {
                  title: '物探管线',
                  expand: true,
                  value: 'wt',
                  layer: null
                },
                {
                  title: '规划管线',
                  expand: true,
                  value: 'xm',
                  layer: null
                }
              ]
            },
            {
              title: '路网',
              expand: true,
              children: [
                {
                  title: '道路中线',
                  expand: false,
                  value: 'dlzx',
                  layer: null
                },
                {
                  title: '道路红线',
                  expand: false,
                  value: 'dlhx',
                  layer: null
                }
              ]
            },

          ];
          break;
        default:
          getLayers = [
            {
              title: '管线数据',
              expand: true,
              children: [
                {
                  title: '普查管线',
                  expand: true,
                  children: [
                    {
                      title: '普查',
                      expand: true,
                      value: 'pc',
                      layer: null
                    },
                    {
                      title: '调绘',
                      expand: true,
                      value: 'dh',
                      layer: null
                    },
                    {
                      title: '示意',
                      expand: true,
                      value: 'sy',
                      layer: null
                    }
                  ]
                },
                {
                  title: '物探管线',
                  expand: true,
                  value: 'wt',
                  layer: null
                },
                {
                  title: '规划管线',
                  expand: true,
                  value: 'xm',
                  layer: null
                }
              ]
            }
          ]
      }
      return getLayers

    }

  }

}
