<template>
        <div class="main-dive">
        <h3>Операции технологического процесса</h3>
        <div class="cont">
            <div class="cont scroll-table scrolls-type-490">
                <table class="type-table">
                    <tr>
                        <th rowspan="2" scope="rowgroup">№</th>
                        <th rowspan="2" scope="rowgroup">Наименование операции </th>
                        <th colspan="3" scope="colgroup">Учет выработки сотрудником в нормо-часах</th>
                    </tr>
                    <tr>
                        <th>Подготовительное</th> 
                        <th>Вспомогательное</th>
                        <th>Основное</th>
                    </tr>
                    <tr class="td-row" 
                        v-for="(operation, inx) in operations" 
                        :key="operation"
                        @click='e => selectedF(operation, e.target.parentElement)'
                        >
                        <td>{{ inx }}</td>
                        <td>
                            <input 
                                type="text" 
                                class='name_input' 
                                :value='operation.name'
                                style='font-size: 16px;'
                                @change='e => operations[inx].name = e.target.value'
                            >
                        </td>
                        <td class="checkeds"> 
                            <input type="checkbox" 
                                :value='operation.preTime'
                                :checked='operation.preTime'
                                @change='operations[inx].preTime = !operations[inx].preTime'
                                >
                        </td>
                        <td class="checkeds">
                            <input type="checkbox" 
                                :value='operation.helperTime'
                                :checked='operation.helperTime'
                                @change='operations[inx].helperTime = !operations[inx].helperTime'>
                        </td>
                        <td class="checkeds">
                            <input type="checkbox" 
                                :value='operation.mainTime'
                                :checked='operation.mainTime'
                                @change='operations[inx].mainTime = !operations[inx].mainTime'>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="btn-control">
                    <button class="btn-small btn-add"
                        @click='addOperation'
                        v-if='!isCreate'>Добавить</button>
                    <button class="btn-small btn-add"
                        @click='saveOperation'
                        v-if='isCreate'>Создать</button>
                    <button class="btn-small"
                            ref='edit'
                            @click="editTO">Редактировать </button>
                    <button class=" btn-small" @click='deleteTO'>Удалить</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            operations: [],
            isCreate: false,

            selected: null,
            span: null
        }
    },
    computed: mapGetters(['getTypeOperations']),
    methods: {
        ...mapActions([
            'createTypeOperation', 
            'getAllTypeOperations',
            'deleteTypeOperation',
            'updateTypeOperation'
            ]),
        addOperation() {
            this.operations.push({
                name: '',
                preTime: false,
                helperTime: false,
                mainTime: false
            })
            this.isCreate = true
        },
        saveOperation() {
            if(this.operations[this.operations.length - 1].name.length < 2)
                return 0
            this.createTypeOperation(this.operations[this.operations.length - 1])
            this.operations.splice(this.operations.length - 1, 1)
            this.isCreate = false
        },
        selectedF(to, e) {
            this.selected = to

            if(this.span)
                this.span.classList.remove('td-row-all')
            this.span = e
            this.span.classList.add('td-row-all')
            if(this.selected.id) {
                this.$refs.edit.classList.add('btn-add')
                this.$refs.edit.innerText = ' Редактировать операцию ' + this.selected.name 
            }
            
        },
        deleteTO() {
            if(!this.selected)
                return 0

            this.deleteTypeOperation(this.selected.id)
            this.operations = this.operations.filter(op => op.id != this.selected.id)
        },
        editTO() {
            if(!this.selected && !this.selected.id)
                return 0

            this.updateTypeOperation(this.selected)
            this.$refs.edit.classList.remove('btn-add')
            this.$refs.edit.innerText = ' Редактировать'
        }
    },
    async mounted() {
        await this.getAllTypeOperations()

        if(this.getTypeOperations) {
            this.operations = this.getTypeOperations
        }
    }
}
</script>

<style scoped>
    input {
        width: 22px;
        height: 22px;
    }
    .checkeds {
        text-align: center;
    }
    .name_input {
        width: 96%;
    }
</style>