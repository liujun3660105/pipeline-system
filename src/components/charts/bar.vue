<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>
<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    barData: Array,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null,
      option:null
    }
  },
  watch:{
    barData: {
      handler(newVal, oldVal) {
        console.log(newVal);
        this.option.series=[
          {
            name:'管线长度',
            type:'bar',
            data:this.barData.map(_ => _.length)
          },
          {
            name:'项目数量',
            type:'bar',
            yAxisIndex: 1,
            data:this.barData.map(_ => _.count)
          }];
        this.dom.setOption(this.option);
      },
      // immediate:true,
      deep: true
    }
  },
  methods: {
    resize () {
      this.dom.resize();
    }
  },
  mounted () {
    this.$nextTick(() => {
      // let xAxisData = Object.keys(this.value);
      // let seriesData = Object.values(this.value);
      let colors=['#5793f3', '#d14a61']
      this.option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        color: colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          // toolbox: {
          //   feature: {
          //     dataView: {show: true, readOnly: false},
          //     restore: {show: true},
          //     saveAsImage: {show: true}
          //   }
          // },
          legend: {
          left:'10%',
            data:['管线长度','项目数量']
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              data: ['给水','中水','排水','燃气','电力','电信','热力','工业','其它']
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '管线长度',
              axisLine: {
                lineStyle: {
                  color: colors[0]
                }
              },
              axisLabel: {
                formatter: '{value} km'
              }
            },
            {
              type: 'value',
              name: '项目数量',
              position: 'right',
              axisLine: {
                lineStyle: {
                  color: colors[1]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
            ],
          series: [
          {
            name:'管线长度',
            type:'bar',
            data:this.barData.map(_ => _.length)
          },
          {
            name:'项目数量',
            type:'bar',
            yAxisIndex: 1,
            data:this.barData.map(_ => _.count)
          }]

        };

      this.dom = echarts.init(this.$refs.dom, 'tdTheme');
      this.dom.setOption(this.option,true);
    });
  }
}
</script>
