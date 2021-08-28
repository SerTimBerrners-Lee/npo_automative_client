<template>
    <div>
        <h3> {{ title }} </h3>

        <div class="block">
            <p>
                <span>ФИО: </span>
                <input type="text" value="Слесарь" style="width: 200px;">
            </p>
            <p>
                <span>Должность: </span>
                <input type="text" value="Слесарь">
            </p>
            <p>
                <span>Табельный номер: </span>
                <input type="text" value="008">      
            </p>
            <p>
                <span>Дата приема на работу: </span>
                <input type="text" value="01.09.19">
            </p>
            <p>
                <span>Дата увольнения: </span>
                <input type="text" value="...">
            </p>
            <p>
                <span>Логин: </span>
                <input type="text" value="Петров В.В.">
            </p>
            <p>
                <span>Пароль: </span>
                <input type="text" value="№:751!12">
            </p>
            <p>
                <span>День рождения: </span>
                <input type="text" value="08.09.1993">
            </p>
        </div>

        <div class="editblock-main">
            <div class="left-cont">
                <div class="addedit-docks">
                    <h3>Контактные данные</h3>
                    <table>
                        <tr>
                            <th rowspan="1" scope="row">Постоянный адрес проживания</th>
                            <td>г. Псков., Инженерная ул., д. 2</td>
                        </tr>
                        <tr>
                            <th rowspan="1" scope="row">Адрес по прописке</th>
                            <td>г. Псков., Инженерная ул., д. 2</td>
                        </tr>
                        <tr>
                            <th rowspan="1" scope="row">Моб. телефон</th>
                            <td>8-999-892-90-11</td>
                        </tr>
                        <tr>
                            <th rowspan="1" scope="row">Эл. почта</th>
                            <td>len@mail.ru</td>
                        </tr>
                    </table>
                    <div class="btn-control">
                        <button class="btn-small btn-add ">
                            Добавить
                        </button>
                        <button class="btn-small">Редактировать</button>
                        <button class="btn-small">Удалить</button>
                    </div>
                </div>
                <div class="addedit-docks">
                    <h3>Документы</h3>
                    <table>
                        <tr>
                            <th class="width-350">Файл</th>
                        </tr>
                        <tr class="td-row">
                            <td>Скан паспорта.jpg</td>
                        </tr>
                        <tr class="td-row">
                            <td>Снилс.png</td>
                        </tr>
                    </table>
                    <div class="btn-control">
                        <button class="btn-small">Открыть</button>
                        <button class="btn-small">Добавить из базы</button>
                        <button class="btn-small">Удалить</button>
                    </div>
                </div>
            </div>

            <div class="center-cont">

                <h3>Характеристика</h3>
                <textarea cols="30" rows="10"></textarea>
                <h3>Примечание</h3>
                <textarea cols="30" rows="10"></textarea>
                <h3>Роль пользователя</h3>
                <h3>История изменений</h3>
            </div>

            <img src="@/assets/img/photo_ava_example.jpg" alt="аватарка"/>

        </div>

        <div class="edit-save-block block">
            <button class="btn-status">В архив</button>
            <button class="btn-status">Отменить</button>
            <button class="btn-status btn-black">Сохранить</button>
        </div>
    </div>
</template>

<script>

export default ({
    computed: {
        title() {
            return this.$route.params.title
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
    height: 250px;
    margin-top: 40px;
    margin-left: 40px;
}
</style>
