<template>
<div class="right-menu-modal">
        <div :class='destroyModalLeft' @click="destroyModalF"></div>
        <div :class='destroyModalRight'>
           <div :style="hiddens">
                <h3 v-if='typeInstrument == 3'>Добавление меритального инструмента</h3>
                <h3 v-else-if='typeInstrument == 2'>Добавление оснастки</h3>
                <h3 v-else>Добавление инструмента</h3>
                <div class="type-issue">
                    <span ref="all" class='active' @click='e => instansTools(0, e.target)'>Все</span>
                    <span ref="ins" @click='e => instansTools(1, e.target)'>Инструмент</span>
                    <span ref="osn" @click='e => instansTools(2, e.target)'>Оснастка</span>
                    <span ref="mer" @click='e => instansTools(3, e.target)'>Мерительный инструмент</span>
                </div>
                <div class="body_table_instr">
                        <TableMaterial :title='"Тип (инструмента или оснастки)"' 
                        :alltypeM="allTInstrument" 
                        :type='"T"' 
                        @search='serhType'
                        @clickMat="clickTInstrument"/>
                        <TableMaterial :title='"Подтип"' 
                        :alltypeM="allPTInstrument" 
                        :type="'PT'" 
                        @search='serhPType'
                        @clickMat="clickPTInstrument"/>
                        <TableMaterial :title='" Наименование (Марка / типоразмер)"' 
                        :alltypeM="allPPTInstrument" 
                        :type="'PPT'" 
                        @search='serhName'
                        @clickMat="clickPPTInstrument"/>
                </div>
                 <div class="btn-control body_table_instr">
                    <button class="btn-small btn-add" @click='addInstrumentToList'>Выбрать</button>
                </div>
                <div v-if='instrumentList.length > 0'>
                    <table>
                        <tr>
                            <th>Выбранное</th>
                            <th>Действие</th>
                        </tr>
                        <tr v-for='instr of instrumentList' :key='instr'>
                            <td>{{ instr.name }}</td>
                            <td class='delete_span' @click='delInstr(instr.id)'>удалить</td>
                        </tr>
                    </table>
                </div>
                <div class="btn-control out-btn-control">
                    <button class="btn-status" @click='destroyModalF'>Отменить</button>
                    <button class="btn-status btn-black" style="height: 0px;" @click='addInstruement'>Добавить выбранное</button>
                </div>
           </div>
        </div>
        <ModalInformation v-if='showModalInformation' :key='keyModalInformation' />

    </div> 

</template>

<script>

import TableMaterial from '@/components/mathzag/table-material.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import {random} from 'lodash'
import ModalInformation from '@/components/instrument/modal-information.vue'

export default {
    props: ['allProvider', 'listInstrument', 'typeInstrument'],
    data() {
        return {
            TInstrument: null,
            PTInstrument: null,
            PPTInstrument: null,
            showModalInformation: false,
            keyModalInformation: random(1, 2313423432423),

            destroyModalLeft: 'left-block-modal',
            destroyModalRight: 'content-modal-right-menu',
            hiddens: 'opacity: 1;',
            span: null,

            instrumentList: [],
            instrumentListId: []
        }
    },
    computed: mapGetters(['allTInstrument', 'allPTInstrument', 'allPPTInstrument', 'getOneNameInstrument']),
    components: {TableMaterial, ModalInformation},
    methods: {
        ...mapActions(['fetchAllInstruments', 'getAllPTInstances', 
            'fetchOneNameInstrument', 'banNameInstrument', 
            'getPTInstrumentList', 'getAllNameInstrument']),
        ...mapMutations([
            'filterAllpInstrument', 
            'getInstansTools',
            'searchTypeInst',
            'searchPTInst',
            'searchNameInst']),
        destroyModalF() {
            this.destroyModalLeft = 'left-block-modal-hidden'
            this.destroyModalRight = 'content-modal-right-menu-hidden'
            this.hiddens = 'display: none;'
            this.showModalInformation = false
        },
        clickTInstrument(instrument) {
            this.TInstrument = instrument
            this.filterAllpInstrument(instrument)
        },
        clickPTInstrument(PTInstrument) {
            this.PTInstrument = PTInstrument
            this.getAllPTInstances(PTInstrument.id)
        },
        clickPPTInstrument(PPTInstrument) {
            this.PPTInstrument = PPTInstrument
            this.fetchOneNameInstrument(PPTInstrument.id)
            this.showModalInformation = true;
            this.keyModalInformation = random(10, 4444)
        },
        addInstrumentToList() {
            if(!this.PPTInstrument)
                return 0;
            
            let add = true
            if(this.instrumentList.length > 0) {
                for(let inst of this.instrumentList) {
                    if(inst.id == this.PPTInstrument.id)
                        add=false
                }
            }
            if(add) {
                this.instrumentListId.push(this.PPTInstrument.id)
                this.instrumentList.push(this.PPTInstrument);
            }
        },
        delInstr(id) {
            this.instrumentList = this.instrumentList.filter(inst => inst.id != id)
            this.instrumentListId = this.instrumentListId.filter(inst => inst != id)
        },
        addInstruement() {
            this.destroyModalF()
            this.$emit('unmount_instrument', {
                instrumentListId: this.instrumentListId,
                instrumentList: this.instrumentList,
            })
        },
        instansTools(tools, span) {
            this.getInstansTools(tools)

            if(!this.span)
                this.span = (this.$refs.all)
            this.span.classList.remove('active')
            span.classList.add('active')
            this.span = span
        },
        serhType(inst) {
            this.searchTypeInst(inst)
        },
            serhPType(inst) {
            this.searchPTInst(inst)
        },
            serhName(inst) {
            this.searchNameInst(inst)
        }
    },
    async mounted() {
        this.destroyModalLeft = 'left-block-modal'
        this.destroyModalRight = 'content-modal-right-menu'
        this.hiddens = 'opacity: 1;'
        await this.fetchAllInstruments()
        await this.getPTInstrumentList()
        await this.getAllNameInstrument()
        if(this.$props.typeInstrument) {
            if(this.$props.typeInstrument == 1)
                this.instansTools(this.$props.typeInstrument, this.$refs.ins)
            if(this.$props.typeInstrument == 2)
                this.instansTools(this.$props.typeInstrument, this.$refs.osn)
            if(this.$props.typeInstrument == 3)
                this.instansTools(this.$props.typeInstrument, this.$refs.mer)

            this.getInstansTools(this.$props.typeInstrument)
        }
        if(this.$props.listInstrument) {
             this.instrumentList = this.$props.listInstrument
             this.$props.listInstrument.forEach((el) => {
                 this.instrumentListId.push(el.id)
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