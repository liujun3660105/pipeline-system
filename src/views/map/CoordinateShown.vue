<template>
    <div class="coor-div">
      <Dropdown @on-click="changeMenu">
        <a href="javascript:void(0)">
          {{coorType}}
          <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list" ref="dropdownmenu">
          <DropdownItem name="CGCS2000">国家2000坐标系</DropdownItem>
          <DropdownItem name="TJ90">天津90坐标系</DropdownItem>
          <DropdownItem name="WGS84">WGS84坐标系</DropdownItem>
          <DropdownItem name="GCJ-02">火星坐标系</DropdownItem>
          <DropdownItem name="BD09">百度坐标系</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div class="coor-shown">
        <span>{{XCoordinate}},{{YCoordinate}}</span>

      </div>

    </div>
</template>

<script>
    export default {
        name: "CoordinateShown",
      data(){
          return {
            coorType:'请选择显示的坐标系统'
          }
      },
      props:{
          coordinateArray:{
            type:Array,
            required:true
          }
      },
      computed:{
          XCoordinate(){
            return this.coordinateArray[0];
          },
          YCoordinate(){
          return this.coordinateArray[1];
    }
      },
      methods:{
        changeMenu(name){
          this.coorType=this.$refs.dropdownmenu.$children.filter(val=>{
            return val.name===name
          })[0].$el.innerHTML;
          this.$emit('coorTypeChange',name);
        }
      }
    }
</script>

<style scoped>
  .coor-div{
    width:fit-content;
    width:-webkit-fit-content;
    width:-moz-fit-content;
    height:50px;
    position:absolute;
    top:10px;
    left:100px;
    background-color:white;
    z-index:5;
  }
  .coor-shown span{
    font-family: "Adobe 黑体 Std R";
    font-size:15px;
  }
</style>
