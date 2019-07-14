<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: {
    pieData: Array,
    pieInnerData: Array,
    text: String,
    subtext: String,
    isDataChange:false
  },
  data () {
    return {
      dom: null,
      option:null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  watch:{
    option:{
      handler(newVal,oldVal){
        this.dom.setOption(newVal);
      },
      deep:true
    }
  },
  mounted () {
    this.$nextTick(() => {
       let pieDataLegend = this.pieData.map(_ => _.name);
      let pieInnerDataLegend = this.pieInnerData.map(_ => _.name);
      let legend=pieDataLegend.concat(pieInnerDataLegend);
      this.option = {
        //普查、示意、调绘      给水、中水、排水、燃气、电力、电信、热力、工业、其它
        color: ['#2d8cf0','#19be6b','#ff9900','#0000FF','#00EEEE', '#7F0000', '#FF00FF', '#FF0000','#00FF00','#854C99','#FFDF7F','#d8d1c7'],
        grid:{
          right:'0'
        },
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: legend
        },
        series: [
          {
            name:'长度',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            center: ['60%', '55%'],
            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data:this.pieInnerData
          },
          {
            name:"长度",
            type: 'pie',
            radius: ['40%','55%'],
            center: ['60%', '55%'],
            data: this.pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.dom = echarts.init(this.$refs.dom, 'tdTheme');
      this.dom.setOption(this.option);

    })
  }
}
</script>
