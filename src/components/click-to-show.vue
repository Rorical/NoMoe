<template>
    <span @click="clicked()">
        {{ show }}
    </span>
</template>

<script>
    export default {
        name: 'ClickToShow',
        props: {
            text: String,
            showNum: {
                type: Number,
                default: 6
            }
        },
        data() {
            return {
                isShow: false
            }
        },
        computed: {
            show() {
                if(this.isShow){
                    return this.text
                }else{
                    let stars = "******"
                    let modified = this.text.substring(0, this.showNum) + stars + this.text.substring(this.text.length - this.showNum, this.text.length)
                    return modified
                }
            }
        },
        methods: {
            clicked() {
                if(this.isShow) {
                    this.isShow = false
                }else{
                    this.isShow = true
                }
            }
        }
    }
</script>