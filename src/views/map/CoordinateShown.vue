<template>
    <div class="coor-div">
      <div class="dropdown-coortype">
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
      </div>
      <div class="coor-shown">
        <span>{{XCoordinate|coorFormat}}
          <br>
          {{YCoordinate|coorFormat}}</span>

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
      },
      filters:{
          coorFormat(val){
            if(val){
              return val.toFixed(4)
            }


          }
      }
    }
</script>

<style scoped>
  .coor-div{
    height:50px;
    min-width:200px;
    position:absolute;
    top:10px;
    left:100px;
    background-color:white;
    z-index:5;
    box-shadow: 2px 2px 5px #888888;
    border-radius:5px;
    background:rgba(0,0,0,0.5);
  }
  .dropdown-coortype{
    display: inline-block;
    line-height: 30px;
    font-size:14px;
    margin-left:10px;
    margin-top: 4px;
    float:left;
  }
  .dropdown-coortype a{
    color:white;
  }
  .coor-shown{
    height:45px;
    display:inline-block;
    color: white;
    margin-top:4px;
    margin-left:15px;
    margin-right:10px;
  }
  .coor-shown span{
    font-family: "Adobe 黑体 Std R";
    font-size:15px;
  }
</style>
