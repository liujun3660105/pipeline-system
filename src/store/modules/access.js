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
            // {
            //   id: 6,
            //   title: '连通分析',
            //   name: 'Connection',
            //   icon: 'logo-steam'
            // },
            {
              id: 7,
              title: '文件上传',
              name: 'UploadFile',
              icon: 'ios-cloud-upload'
            },
            {
              id: 8,
              title: '数据导出',
              name: 'GeomExport',
              icon: 'ios-cloud-download'
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
              title: '行政边界',
              expand: false,
              children: [
                {
                  title: '新区行政边界',
                  expand: true,
                  value:'xzbj',
                  layer:null
                },
                {
                  title: '街镇',
                  expand: true,
                  value: 'jz',
                  layer: null
                },
                {
                  title: '功能区',
                  expand: true,
                  value: 'gnq',
                  layer: null
                },
                {
                  title: '双城绿廊管控分界线',
                  expand: true,
                  value: 'scllgkfjx',
                  layer: null
                }
              ]
            },
            {
              title: '管线数据',
              expand: false,
              children: [
                {
                  title: '普查管线',
                  expand: false,
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
              title: '交通',
              expand: false,
              children: [
                {
                  title: '规划轨道',
                  expand: false,
                  value: 'ghgd',
                  layer: null
                },
                {
                  title: '规划路网',
                  expand: false,
                  value: 'ghlw',
                  layer: null
                }
              ]
            },
            {
              title: '用地数据',
              expand: false,
              children:[
                {
                  title: '控规',
                  expand: true,
                  value:'kg',
                  layer:null
                },
                {
                  title: '土规',
                  expand: true,
                  value:'tg',
                  layer:null
                },
                {
                  title: '土地利用现状',
                  expand: true,
                  value:'tdlyxz',
                  layer:null
                }
              ]
            },
            {
              title: '规划控制线',
              expand: false,
              children:[
                {
                  title: '城市黄线',
                  expand: true,
                  value:'hx',
                  layer:null
                },
                {
                  title: '城市绿线',
                  expand: true,
                  value:'lx',
                  layer:null
                },
                {
                  title: '生态红线',
                  expand: true,
                  value:'sthx',
                  layer:null
                },
                {
                  title: '河道蓝线',
                  expand: true,
                  value:'hdlx',
                  layer:null
                },
                {
                  title: '城市开发边界',
                  expand: true,
                  value:'cskfbj',
                  layer:null
                },
                {
                  title: '海域边界',
                  expand: true,
                  value:'hybj',
                  layer:null
                },
                {
                  title: '永久基本农田',
                  expand: true,
                  value:'yjjbnt',
                  layer:null
                }
              ]
            },
            {
              title: '危险源',
              expand: false,
              children:[
                {
                  title: '危险站点',
                  expand: true,
                  value:'wxzd',
                  layer:null
                },
                {
                  title: '危险场站',
                  expand: true,
                  value:'wxcz',
                  layer:null
                }
              ]
            }
          ];
          break;
        case 'visitor':
          getLayers = [
            {
              title: '管线数据',
              expand: false,
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
              title: '交通',
              expand: false,
              children: [
                {
                  title: '规划轨道',
                  expand: false,
                  value: 'ghgd',
                  layer: null
                },
                {
                  title: '规划路网',
                  expand: false,
                  value: 'ghlw',
                  layer: null
                }
              ]
            }

          ];
          break;
        default:
          getLayers = [
            {
              title: '管线数据',
              expand: false,
              children: [
                {
                  title: '普查管线',
                  expand: false,
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
          ];
      }
      return getLayers

    }

  }

}
