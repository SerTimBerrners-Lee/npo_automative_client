<template>
    <div class="right-menu-modal">
        <div :class='destroyModalLeft' @click="destroyModalF"></div>
        <div :class='destroyModalRight'>
           <div :style="hiddens">
                <h3>Добавление документов всего: {{ parametrs.length }} шт</h3>
                <div class="block scroll-table">
                    <div v-for="(file, index) of arrItemsFile" :key="file">
                        <h4>Файл {{index + 1}}</h4>
                        <div>
                            <div class="fb-img-block">
                                <span class="span-type-files" v-if='file.typefile == "doc"'>.{{ file.typename }}</span>
                                <div class="imgShow-modal-div" v-if="file.typefile == 'img'">
                                    <img class="imgShow-modal" :src="file.url" alt="">
                                </div>
                            </div>
                            <div class="main-fb-modal-block">
                                <p>
                                    <span>Файл: </span><input type="text" :placeholder='file.name' >
                                    <span>Тип:</span>
                                    <select class="select-small" @change='e=>fileRead(e.target.value, "TypeDocument", index)'>
                                        <option value="Изменить тип">Изменить тип</option>
                                        <option value="МД">Медиа (тип МД)</option>
                                        <option value="КД">Конструкторская документация (тип КД)</option>
                                        <option value="ЧЖ">Чертижи (тип ЧЖ)</option>
                                        <option value="СД">Сопутствующие документы (тип СД)</option>
                                    </select>
                                </p>
                                <p>
                                    <span>Переименовать: </span><input type="text" :value='file.name.split(".")[0]' @change='e=>fileRead(e.target.value, "NameDocument" , index)'>
                                    <span>Версия: </span><input type="text" placeholder="000001" @change='e=>fileRead(e.target.value, "VersionDocument", index)'>
                                </p>
                                <p class="right-menu-p">
                                    <span>Примечание: </span><input type="text" placeholder="Описание файла" @change='e=>fileRead(e.target.value, "DescriptionDocument", index)'>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-control out-btn-control">
                    <button class="btn-status" @click='destroyModalF'>Отменить</button>
                    <button class="btn-status btn-black" @click='addFiles'>Добавить все</button>
                </div>
           </div>
        </div>
    </div>
</template>

<script>

import { photoPreloadUrl } from '@/js/';
import { mapActions } from 'vuex'
export default {
    props: ['parametrs'],
    data() {
        return {
            destroyModalLeft: 'left-block-modal',
            destroyModalRight: 'content-modal-right-menu',
            hiddens: 'opacity: 1;',
            typeDocs: ['МД', 'КД', 'ЧЖ', 'СД'],
            urlImg: '',
            imgShow: false,
            showDocType: false,
            docType: '',
            arrItemsFile: []
        }
    },
    async mounted() {
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
        let arr = this.$props.parametrs
        arr.forEach((doc, index) => {
            photoPreloadUrl(doc, (res) => {
                if (res.type == 'img') {
                    arr[index].TypeDocument = ''
                    arr[index].VersionDocument = ''
                    arr[index].DescriptionDocument = ''
                    arr[index].url = res.url 
                    arr[index].NameDocument = ''
                    arr[index].typefile = res.type
                    this.arrItemsFile.push(...[arr[index]])
                } else {
                    arr[index].TypeDocument = ''
                    arr[index].VersionDocument = ''
                    arr[index].DescriptionDocument = ''
                    arr[index].NameDocument = ''
                    arr[index].typename = res.typename
                    arr[index].typefile = res.type
                    this.arrItemsFile.push(...[arr[index]])
                }
            }) 
        });
    },
    methods: {
        ...mapActions(['pushDocuments']),
        destroyModalF() {
            this.destroyModalLeft = 'left-block-modal-hidden'
            this.destroyModalRight = 'content-modal-right-menu-hidden'
            this.hiddens = 'display: none;'
            this.$emit('unmount', null)
        },
        addFiles() {
            const formData = new FormData()
            const dataArr = []
            for(let doc of this.arrItemsFile) {
                formData.append('document', doc)
                dataArr.push({
                    type: doc.TypeDocument,
                    version: doc.VersionDocument,
                    description: doc.DescriptionDocument,
                    name: doc.NameDocument,
                    nameInstans: ''
                })
            }
            formData.append('docs', JSON.stringify(dataArr))
            this.pushDocuments(formData).then(() => {
                this.$emit('unmount', {
                    type: 'w',
                    message: 'Файлы переданы на сервер для обработки'
                })
            })
            this.destroyModalF()
        },
        fileRead(val, folder, index) {
            this.arrItemsFile[index][folder] = val
        }
    }
}
</script>

<style scoped>
    .right-menu-p>input {
        width: 70%;
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

    width: 40vw;
}
.left-block-modal {
    width: 60vw;
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
        width: 1vw;
    }
    to {
        width: 40vw;
    }
}
@keyframes width-right {
    from {
        width: 0vw;
    }
    to {
        width: 60vw;
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
        width: 60vw;
    }
    to {
        width: 00vw;
    }
}
@keyframes width-right-replace {
    from {
        width: 50vw;
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