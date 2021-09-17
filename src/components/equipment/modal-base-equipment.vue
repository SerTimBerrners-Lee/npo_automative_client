<template>
<div class="right-menu-modal">
        <div :class='destroyModalLeft' @click="destroyModalF"></div>
        <div :class='destroyModalRight'>
           <div :style="hiddens">
                <h3>Добавление типа инструмента или оснастки</h3>
                <div class="body_table_instr">
                    <TableMaterial :title='"Тип"' 
                        :alltypeM="allEquipmentType" 
                        :type='"T"' 
                        @clickMat="clickEquipmentType"/>
                    <TableMaterial :title='"Подтип"' 
                        :alltypeM="allEquipmentPType" 
                        :type="'PT'" 
                        @clickMat="clickEquipmentPType"/>
                    <TableMaterial :title='" Наименование (Марка / типоразмер)"' 
                        :alltypeM="allEquipment" 
                        :type="'PPT'" 
                        @clickMat="clickEquipment"/>
                </div>
                 <div class="btn-control body_table_instr">
                    <button class="btn-small btn-add" @click='addEuipmentToList'>Выбрать</button>
                </div>
                <div v-if='equipmentList.length > 0'>
                    <table>
                        <tr>
                            <th>Выбранное</th>
                            <th>Действие</th>
                        </tr>
                        <tr v-for='eq of equipmentList' :key='eq'>
                            <td>{{ eq.name }}</td>
                            <td class='delete_span' @click='delEQ(eq.id)'>удалить</td>
                        </tr>
                    </table>
                </div>
                <div class="btn-control out-btn-control">
                    <button class="btn-status" @click='destroyModalF'>Отменить</button>
                    <button class="btn-status btn-black" style="height: 0px;" @click='addEquipment'>Добавить выбранное</button>
                </div>
           </div>
        </div>
        <ModalInformation v-if='showModalInformationEq' :key='keyModalInformation' />

    </div> 

</template>

<script>

import TableMaterial from '@/components/mathzag/table-material.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import {random} from 'lodash'
import ModalInformation from './modal-information.vue'

export default {
    props: ['allProvider', 'listInstrument'],
    data() {
        return {
            equipmentT: null,
            equipmentPT: null,

            showModalInformationEq: false,
            keyModalInformation: random(1, 34e121),

            destroyModalLeft: 'left-block-modal',
            destroyModalRight: 'content-modal-right-menu',
            hiddens: 'opacity: 1;',

            equipmentList: [],
            equipmentListId: []
        }
    },
    computed: mapGetters(['allEquipmentType', 'allEquipmentPType', 'allEquipment', 'equipment']),
    components: {TableMaterial, ModalInformation},
    methods: {
        ...mapActions([
            'fetchAllEquipmentType',
            'getOneEquipmentPType',
            'fetchOneEquipment',
            'banEquipment'
            ]),
        ...mapMutations(['filterAllPTEquipment']),
        clickEquipmentType(equipment) {
            this.equipmentT = equipment
            this.filterAllPTEquipment(this.equipmentT.equipmentsPT)
        },
        clickEquipmentPType(equipmentPT) {
            this.equipmentPT = equipmentPT
            this.getOneEquipmentPType(equipmentPT.id)
        },
        clickEquipment(eq) {
            this.fetchOneEquipment(eq.id).then(() => {
                this.showModalInformationEq = true;
                this.keyModalInformation = random(10, 34e121)
            })
            
        },
        destroyModalF() {
            this.destroyModalLeft = 'left-block-modal-hidden'
            this.destroyModalRight = 'content-modal-right-menu-hidden'
            this.hiddens = 'display: none;'
        },

        // ---------------------------------------
        addEuipmentToList() {
            if(!this.equipment)
                return 0;
            
            let add = true
            if(this.equipmentList.length > 0) {
                for(let eq of this.equipmentList) {
                    if(eq.id == this.equipment.id)
                        add=false
                }
            }
            if(add) {
                this.equipmentListId.push(this.equipment.id)
                this.equipmentList.push(this.equipment);
            }
        },
        delEQ(id) {
            this.equipmentList = this.equipmentList.filter(eq => eq.id != id)
            this.equipmentListId = this.equipmentListId.filter(eq => eq != id)
        },
        addEquipment() {
            this.destroyModalF()
            this.$emit('unmount_eq', {
                equipmentListId: this.equipmentListId,
                equipmentList: this.equipmentList,
            })
        }
    },
    async mounted() {
        this.destroyModalLeft = 'left-block-modal'
        this.destroyModalRight = 'content-modal-right-menu'
        this.hiddens = 'opacity: 1;'
        this.fetchAllEquipmentType()
        if(this.$props.listEquipment) {
             this.equipmentList = this.$props.listEquipment
             this.$props.listEquipment.forEach((el) => {
                 this.equipmentListId.push(el.id)
             })
        }
    }
}
</script>

<style scoped>
    .delete_span {
        font-size: 11px;
        cursor: pointer;
        display: flex;
        justify-content:center;
        align-items:center;
        color: rgb(211, 102, 102);
        border: none;
        font-weight: bold;
    }
    .delete_span:hover{
        color: rgb(184, 52, 52);
    }
    .body_table_instr {
     width: 1150px;
     display: flex;  
    }
    .table_rek{
        width: 420px;
    }
    .table-filter-bproveder th {
        width: 158px;
    }
    .left-block-bprovider {
        width: 528px;
        float: left;
    }
    .left-block-bprovider .btn-control {
        margin-top: 20px;
    }
    .right-block-bprovider {
        margin-left: 20px;
        width: 1030px;
    }
    .block {
        display: flex;
        flex-direction: column;
    }
    .flex-box-main {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    .first-block-description p {
        margin-left: 5px;
        float: left;
        width: 30%;
    }
    .first-block-description input {
        width: 150px;
    }
    textarea {
        height: 90px;
        width: 350px;
        border: 1px solid #d3d3d3;
        border-radius: 4px;
    }
    .block-d-r {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
    }
    .block-d-r>div>div {
        margin: 5px;
        margin-top: 10px;
        margin-left: 5px;
    }
    .block-d-r>div {
        width: 50%;
    }
    .block-d-r th {
        text-align: start;
    }
    .btn-black {
        width:max-content;
        height: 45px;
    }
    .endgroup {
        display: flex;
        justify-content: end;
        margin-top: 20px;
        align-items: end;
    }
    .provider_table {
        width: 520px;
    }

     .main-fb-modal-block p {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
    }
    .main-fb-modal-block {
        display: flex;
        flex-wrap: wrap;
        width: 64%;
        justify-content: space-between;
    }
    .main-fb-modal-block>p * {
        margin-left: 10px;
    }
    .fb-img-block {
        width: 36%;
        float: left;
        height: 190px;
    }
    .scroll-table {
        width: 98%;
        height: 78vh;
    }
    .out-btn-control {
        margin-top: 10px;
    }
    .span-type-files {
        width: 100%;
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        font-size: 70px;
        color: #606060;
        background: #a4a4a4;
    }
    .imgShow-modal {
        height: 100%;
        width: 100%;
    }
    .imgShow-modal-div {
        display: flex;
        justify-content: center;
        widows: 100%;
        height: 100%;
    }
.content-modal-right-menu-hidden {
    animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
    animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
    animation: width 1s 1 ease;
    height: 10000px;
    width: 80%;
}
.left-block-modal {
    width: 20%;
    height: 10000px;
    animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
    animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
    animation: hidden-content 1s 1 ease;
}
    @keyframes width {
    from {
        width: 1%;
    }
    to {
        width: 80%;
    }
}
@keyframes width-right {
    from {
        width: 0%;
    }
    to {
        width: 20%;
    }
}
@keyframes hidden-content {
    from {
        opacity: 0;
    }
    80% {
        opacity: 0;
    }
    90% {
        opacity: 0.5;
    }
    to {
        opacity: 1;
    }
}
@keyframes width-replace {
    from {
        width: 20vw;
    }
    to {
        width: 00vw;
    }
}
@keyframes width-right-replace {
    from {
        width: 80vw;
    }
    to {
        width: 0vw;
    }
}
@keyframes hidden-content-replace {
    from {
        opacity: 1;
    }
    20% {
        opacity: 0;
    }
    to {
        opacity: 0;
    }
}
</style>