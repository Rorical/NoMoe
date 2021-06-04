<template>
    <section class="section">
        <div class="container is-fluid">
            <b-steps
            :has-navigation="false"
            v-model="nowStep">
                <b-step-item step="1" :label="$t('app.welcome.1.title')">
                    <h1 class="title has-text-centered">{{ $t('app.welcome.1.title') }}</h1>
                    <div class="content">
                        {{ $t('app.welcome.1.description') }}
                    </div>
                </b-step-item>
                <b-step-item step="2" :label="$t('app.welcome.2.title')">
                    <h1 class="title has-text-centered">{{ $t('app.welcome.2.title') }}</h1>
                    <div class="content">
                        {{ $t('app.welcome.2.description') }}
                    </div>
                </b-step-item>
            </b-steps>
        </div>
    </section>
</template>


<script>
export default {
    name: 'Welcome',
    data() {
        return {
            listeners: [],
            nowStep: 1
        }
    },
    created() {
        this.listeners.push(
            window.ipcRenderer.on('resultIsInitialized', this.resultIsInitialized)
        )
    },
    beforeDestroy() {
        this.listeners.forEach((listener) => {
            listener.remove()
        })
    },
    methods: {
        
    }
}
</script>