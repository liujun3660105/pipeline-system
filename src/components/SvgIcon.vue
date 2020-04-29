<template>
    <svg :class = "svgClass" :style = "styles" aria-hidden="true" v-on="$listeners">
        <use :xlink:href = "iconName"/>
    </svg>
</template>

<script>
    export default {
        name:"SvgIcon",
        props:{
            name:{
                type:String,
                required: true
            },
            className:{
                type:String,
                default:''
            },
            size:{
                type:String,
                default:'5'
            },
            color:{
                type:String,
                default:'white'
            }
        },
        computed:{
            styles(){
                let style = {};
                if(this.size){
                    style['width'] = `${this.size}px`;
                    style['height'] = `${this.size}px`;
                }
                if(this.color){
                    style.color = this.color;
                }
                return style
            },
            iconName(){
                return `#icon-${this.name}`
            },
            svgClass(){
                if(this.className){
                    return 'svg-icon' + this.className
                }else{
                    return 'svg-icon'
                }
            }
        }
        
    }
</script>

<style scoped>
.svg-icon {
    vertical-align: -0.15em;
    fill:currentColor;
    overflow: hidden;
}

</style>