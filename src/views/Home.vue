<template>
    <section class="section">
        <div class="container is-fluid">
            <div class="content">
                
            </div>
        </div>
    </section>
</template>


<script>
export default {
    name: 'Home',
    data() {
        return {
            listeners: []
        }
    },
    created() {
        this.listeners.push(
            window.ipcRenderer.on('resultIsInitialized', this.resultIsInitialized)
        )
        window.ipcRenderer.send("isInitialized")
    },
    beforeDestroy() {
        this.listeners.forEach((listener) => {
            listener.remove()
        })
    },
    methods: {
        resultIsInitialized(result) {
            if(!result){
                this.$router.push("welcome")
            }
        }
    }
}
</script>