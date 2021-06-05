<template>
    <div class="container">
        <section class="notification lift-hover" :class="'is-' + item.color" :key="index" @click="item.click" v-for="(item, index) in items">
            <div class="notification-body">
                <p class="title">
                    {{ item.title }}
                </p>
                <p class="subtitle">
                    {{ item.subTitle }}
                </p>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: "HoverSelector",
    props: {
        items: {
            type: Array
        }
    }
}
</script>

<style lang="scss">

</style>