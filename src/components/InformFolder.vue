<template>
    <div class="message-folder-block" v-if="destrouCommponent" :class="typeMessage">
        <div>
            <span class="message-block-title">{{ title }}</span>
            <div @click="destrouCommponent = false">
                <unicon name="times" fill="black" width="25px" />
            </div>
        </div>
        <span>{{ message }}</span>
    </div>
</template>

<script>

export default {
    props: ['title', 'message', 'type'],
    data() {
        return {
            typeMessage: String,
            destrouCommponent: true
        }    
    },
    updated() {
        setTimeout(() => this.destrouCommponent = false, 7000)
    },
    mounted() {
        this.destrouCommponent = true
        this.$props.type == 'w' ?
            this.typeMessage = 'warning-message' :
            this.$props.type == 'e' ?
                this.typeMessage = 'error-message' :
                this.$props.type == 's' ?
                    this.typeMessage = 'success-message' :
                        this.typeMessage = 'inform-message'
    }
}
</script>

<style scoped>
.message-folder-block {
    position: fixed;
    z-index: 1111111;
    border-radius: 6px 6px 0px 0px;
    padding-left: 10px;
    padding-bottom: 10px;
    opacity: 0.8;
    display: flex;
    flex-direction: column;
    width: max-content;
    max-width: 610px;
    top: 20px;
    right: 20px;
    word-wrap: break-word;
}
.message-folder-block>div {
    display: flex;
    justify-content: space-between;
}
.message-folder-block>div>div{
    cursor: pointer;
    margin-right: 3px;
}
.message-folder-block span {
    margin-right: 20px;
}
.inform-message {
    border-bottom: 4px solid #0074d9;
    background: #d7dfe6;
}

.error-message {
    border-bottom: 4px solid #ee0000;
    background: #ffc2c2;
}

.warning-message {
    border-bottom: 4px solid #ffa700;
    background: #ffee63;
}
.success-message {
    border-bottom: 4px solid #2c9b00;
    background: #bdffa9;
}
.message-block-title {
    font-size: 20px;
    font-weight: bold;
    margin: 5px;
    margin-top: 13px;
}
.message-folder-block>span:last-child {
    margin-left: 5px;
}
</style>