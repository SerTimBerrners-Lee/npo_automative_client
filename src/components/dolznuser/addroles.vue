<template>
    <div class="right-menu-modal">
        <div :class='destroyModalLeft' @click="destroyModalF"></div>
        <div :class='destroyModalRight'>
           <div :style="hiddens">
                <h3>{{ titleapp }} должности</h3>
                <p class="right-menu-p">
                    <span>Наименование: </span><input type="text" v-model.trim='inputs' placeholder="Пример: Слесарь">
                </p>
                <p class="right-menu-p">
                     <span>Сокращение (EN): </span><input type="text" v-model.trim='inputs_short' placeholder="Пример: (SLESAR)">
                </p>
                <div class="btn-control out-btn-control">
                    <button class="btn-status btn-black" @click='addEditRole'>Сохранить</button>
                    <button class="btn-status" @click='destroyModalF'>Отменить</button>
                </div>
           </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['parametrs'],
    data() {
        return {
            destroyModalLeft: 'left-block-modal',
            destroyModalRight: 'content-modal-right-menu',
            hiddens: 'opacity: 1;',
            inputs: '',
            inputs_short: '',
            titleapp: 'Добавление',
        }
    },
    mounted() {
        this.destroyModalLeft = 'left-block-modal'
        this.destroyModalRight = 'content-modal-right-menu'
        this.hiddens = 'opacity: 1;'
        if(this.parametrs.type == 'create') {
            return 0;
        } else  {
            this.titleapp = 'Редактирование'
            this.inputs = this.parametrs.description
            this.inputs_short = this.parametrs.value
        }
    },
    methods: {
        destroyModalF() {
            this.destroyModalLeft = 'left-block-modal-hidden'
            this.destroyModalRight = 'content-modal-right-menu-hidden'
            this.hiddens = 'opacity: 0;'
            this.$emit('unmount', 0)
        },
        addEditRole() {
            if(this.inputs.length > 3 && this.inputs_short.length > 1) {
                if(this.parametrs.type == 'create') {
                    this.$emit('unmount', {
                        type: 'create',
                        dolzn: this.inputs,
                        short_dolzn: this.inputs_short.toUpperCase()
                    })
                } else if (this.parametrs.type == 'edit'){
                    this.$emit('unmount', {
                        type: 'edit',
                        id: this.parametrs.id,
                        dolzn: this.inputs,
                        short_dolzn: this.inputs_short.toUpperCase()
                    })
                }
                this.destroyModalF()
            } else {
                this.$emit('unmount', {
                    type: 'error',
                    message: 'Слишком короткое наименование'
                })
                return 0
            }
        }
    }
}
</script>

<style scoped>
    .right-menu-p>input {
        width: 70%;
    }
</style>