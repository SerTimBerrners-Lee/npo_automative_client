<template>
    <div>
        <h3> {{ title }} </h3>

        <div class="block">
            <p>
                <span>ФИО: </span>
                <input type="text" style="width: 200px;" v-model="object.initial">
            </p>
            <p>
                <span>Должность: </span>
                <select class="select-small" v-if="allRoles.length > 0" v-model='object.roles'>
                    <option v-for="role in allRoles" :key='role' :value='role.id' >{{ role.description }}</option>
                </select>
                <select class="select-small" v-else>
                    <option>Нет Ролей</option>
                </select>
            </p>
            <p>
                <span>Табельный номер: </span>
                <input type="text" v-model='object.tabel'>      
            </p>
            <p>
                <span>Дата приема на работу: </span>
                <input type="text" v-model="object.dateWork">
            </p>
            <p>
                <span>Дата увольнения: </span>
                <input type="text" v-model="object.dateUnWork">
            </p>
            <p>
                <span>Логин: </span>
                <input type="text" v-model='object.login'>
            </p>
            <p>
                <span>Пароль: </span>
                <input type="text" v-model="object.password">
            </p>
            <p>
                <span>День рождения: </span>
                <input type="text" v-model="object.birthday">
            </p>
        </div>

        <div class="editblock-main">
            <div class="left-cont">
                <div class="addedit-docks">
                    <h3>Контактные данные</h3>
                    <table>
                        <tr>
                            <th rowspan="1" scope="row" style="width: 250px;">Постоянный адрес проживания</th>
                            <td ref='adress' v-text='object.adress' style="width: 260px;" :contenteditable="editTableKontact"></td>
                        </tr>
                        <tr>
                            <th rowspan="1" scope="row">Адрес по прописке</th>
                            <td ref='adressProps' v-text='object.adressProps' :contenteditable="editTableKontact"></td>
                        </tr>
                        <tr>
                            <th rowspan="1" scope="row">Моб. телефон</th>
                            <td ref='phone' v-text='object.phone' :contenteditable="editTableKontact"></td>
                        </tr>
                        <tr>
                            <th rowspan="1" scope="row">Эл. почта</th>
                            <td ref='email' v-text='object.email' :contenteditable="editTableKontact"></td>
                        </tr>
                    </table>
                    <div class="btn-control">
                        <button class="btn-small btn-add " @click="saveContact">
                            Сохранить
                        </button>
                        <button class="btn-small" @click="editIsContac(editTableKontact), editTableKontact = !editTableKontact">{{ !editTableKontact ? 'Редактировать' : 'Отменить редактирование'}}</button>
                    </div>
                </div>
                <div class="addedit-docks">
                    <h3>Документы</h3>
                    <table>
                        <tr>
                            <th class="width-350" style="width: 520px;">Файл</th>
                        </tr>
                        <tr class="td-row">
                            <td>Скан паспорта.jpg</td>
                        </tr>
                        <tr class="td-row">
                            <td>Снилс.png</td>
                        </tr>
                    </table>
                    <div class="pointer-files-to-add">
                        <label for="docsFileSelected">Перенесите сюда файлы или кликните для добавления с вашего компьютера.</label>
                        <input id="docsFileSelected" type="file" style="display:none;">
                    </div>
                    <div class="btn-control">
                        <button class="btn-small">Открыть</button>
                        <button class="btn-small">Удалить</button>
                        <button class="btn-small">Добавить из базы</button>
                    </div>
                </div>
            </div>

            <div class="center-cont">

                <h3>Характеристика</h3>
                <textarea cols="30" rows="10" v-model="object.haracteristic"></textarea>
                <h3>Примечание</h3>
                <textarea cols="30" rows="10" v-model="object.primetch"></textarea>
                <h3>Роль пользователя</h3>
                <h3>История изменений</h3>
            </div>
            <div class="img-ava-block">
                <img :src='urlImg' alt="avatar" v-if="imgShow">
                <div v-if="!imgShow">
                    <label for="fileFolder" class="toltip">Нажмите чтобы загрузить фото</label>
                    <input type="file" @change="e => fileFolderF(e)" id="fileFolder" style="display: none;">
                </div>
            </div>

        </div>

        <div class="edit-save-block block">
            <button class="btn-status">В архив</button>
            <button class="btn-status" @click="$router.push('/employee')">Отменить</button>
            <button class="btn-status btn-black" @click="saveData">Сохранить</button>
        </div>
        <InformFolder :key="keyInformTip" :title='titleMessage' :message='message' :type='type' v-if='showInformPanel' />
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import InformFolder from '@/components/InformFolder.vue';
import showMessage from '@/js/inform_folder.js'
import photoPreloadUrl from '@/js/photo_preload.js'

export default ({ 
    data() {
        return {
            editTableKontact: false,
            showInformPanel: false,
            titleMessage: '',
            keyInformTip: 21, 
            message: '',
            type: '',
            urlImg: '',
            imgShow: false,
            fileFolder: '',
            object: {
                adress: '',
                adressProps: '',
                phone: '', 
                email: '',
                initial: '',
                tabel: '',
                roles: '',
                dateWork: '',
                dateUnWork: '',
                login: '',
                password: '',
                birthday: '',
                haracteristic: '',
                primetch: ''
            }
        }
    },
    computed: {
        ...mapGetters(['allRoles']),
        title() {
            return this.$route.params.title
        }
    },
    components: {
        InformFolder
    },
    mounted() {this.fetchRoles()},
    methods: {
        ...mapActions(['saveUser', 'fetchRoles']),

        saveData() {
            this.saveContact()
            const formData = new FormData()
            for (let dat in this.object) {
                formData.append(dat, this.object[dat])
            }
            formData.append('image', this.fileFolder)

            this.saveUser(formData).then(m => {
                if(m.type == 'error')
                    return showMessage('Ошибка', m.message, 'e', this)
                if(m.type == 'success')
                    return showMessage('Успешно', 'Пользователь успешно создан', 's', this)
            });

        },
        fileFolderF(e) {
            this.fileFolder = e.target.files[0]
            photoPreloadUrl(this.fileFolder, this)
        },
        saveContact() {
            this.object.adress = this.$refs.adress.textContent
            this.object.adressProps = this.$refs.adressProps.textContent
            this.object.phone = this.$refs.phone.textContent
            this.object.email = this.$refs.email.textContent
        },
        editIsContac(isQ) {
            if(isQ) {
                this.$refs.adress.textContent = this.object.adress
                this.$refs.adressProps.textContent = this.object.adressProps
                this.$refs.phone.textContent = this.object.phone
                this.$refs.email.textContent = this.object.email
            }
        }
    }
})
</script>

<style scoped>
.ava-block>img {
    height: 200px;
    width: 160px;
}

textarea {
    height: 90px;
    width: 400px;
    border: 1px solid #d3d3d3;
    border-radius: 4px;
}
.img-ava-block>img {
    max-width: 260px;
    max-height: 310px;
    margin-top: 30px;
}
.addedit-docks {
    width: max-content;
}
.select-small {
    width: max-content;
    height: 26px;
    padding: 0px;
    font-size: 13px;
    margin-top: 5px;
}
.block>p {
    margin-left: 10px;
}
.block>p input {
    width: 100px;
}
.block {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.addedit-docks th {
    text-align: start;
}
.editblock-main {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}
.editblock-main>div {
    margin: 10px;
}
.editblock-main img {
    max-width: 260px;
    max-height: 195px;
}
.img-ava-block {
    max-width: 260px;;
}
.toltip {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1a1a1a;
    color: white;
    height: 250px;
    width: 170px;
    margin-bottom: 115px;
    bottom: 100px;
    padding: 20px;
    text-align: center;
}
.img-ava-block:hover {
    content: attr(href)
}
.pointer-files-to-add {

}
</style>
