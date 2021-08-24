<template>
    <div>{{ text }}</div>
</template>


<script>
export default {
    name: 'Authorization',
    props: {
        testMessage: String
    },
    data() {
        return {
            text: 666
        }
    }
}
</script>

<style scoped>

</style>