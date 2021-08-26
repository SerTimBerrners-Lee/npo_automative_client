<template>
    <div class="container">
        <div class="table-content">
        <h3>Сотрудники</h3>
            <div class="scroll-table" style="height: 690px;">
            <table>
                <tr>
                    <th>Табельный номер</th>
                    <th>Должность</th>
                    <th>Инициалы</th>
                </tr>
                <tr class="td-row" v-for="iten in 6" :key="iten">
                    <td class="tabel-td">00{{ iten }}</td>
                    <td>Слесарь</td>
                    <td>Петров Виталий Валентинович</td>
                </tr>
                <tr class="td-row" v-for="iten in 40" :key="iten">
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
            </div>
            <div class="btn-control">
                <button>В архив</button>
                <button>Редактировать</button>
                <button>Добавить</button>
            </div>
        </div>
        <div class="inform-content">
            <h3 class="initial-user">Петров Виталий Валентинович</h3>
            <div class="inform-block">
                <div class="contact-inform">
                    <div class="data-user-form">
                        <div class="prim">
                            <p class="p-1">
                            <span>Должность: </span>
                            <input type="text" value="Слесарь">
                            <span>Табельный номер: </span>
                            <input type="text" value="008">
                            </p>
                            <p class="p-2">
                                <span>Дата приема на работу: </span>
                                <input type="text" value="01.09.19">
                            </p>
                            <p class="p-3">
                                <span>Логин: </span>
                                <input type="text" value="Петров В.В.">
                                <span>День рождения: </span>
                                <input type="text" value="08.09.1993">
                            </p>
                            <h3>Контактные данные</h3>
                            <p class="p-4">
                                <span>Моб. телефон: </span>
                                <input type="text" value="8-920-444-87-90">
                            </p>
                            <p class="p-5">
                                <span>Постоянный адрес проживания: </span>
                                <input type="text" value="г. Псков., Инженерная ул., д. 2">
                            </p>
                            <p class="p-6">
                                <span>Адрес по прописке: </span>
                                <input type="text" value="г. Псков., Инженерная ул., д. 2 ">
                            </p>
                        </div>
                        <h3>Примечание</h3>
                        <textarea name="description" icols="30" rows="10">
                            
                        </textarea>
                    </div>
                </div>
                <div class="har-inform">
                    <div class="ava-block">
                        <img src="@/assets/img/photo_ava_example.jpg" alt="аватарка"/>
                            <h3>Роль пользователя</h3>
                            <h3>Оборот ТМЦ</h3>
                    </div>
                    <div class="ava-right-block">
                        <h3>Характеристика</h3>
                        <textarea class="textarea-har" cols="30" rows="10"></textarea>
                        <h3>Документы</h3>
                        <table>
                            <tr>
                                <th>Файл</th>
                            </tr>
                            <tr>
                                <td>Скан паспорта.jpg</td>
                            </tr>
                            <tr>
                                <td>Снилс.png</td>
                            </tr>
                        </table>
                        <button>Скачать</button>
                        <button>Открыть</button>
                    </div>
                </div>
            </div>
            <div class="working-block">
                <h3>Объем выполненных работ</h3>
                <div class="result-work">
                    <span>Дата: </span>
                    <input type="text" class="calendar-input">
                    <span>Выбрать период, с: </span>
                    <input type="text" class="calendar-input">
                    <span>по: </span>
                    <input type="text" class="calendar-input">
                    <button>Сбросить фильтр</button>
                </div>
                <div class="scroll-table" style="height: 190px; margin-left: 10px;">
                    <table >
                        <tr>
                            <th>Дата</th>
                            <th>№ Заказа</th>
                            <th>Изделие</th>
                            <th>Операция</th>
                            <th>Норма ч.</th>
                            <th>Кол-во, ч.</th>
                            <th>Итого, ч.</th>
                        </tr>
                        <tr v-for="iten in 6" :key="iten">
                            <td>13.05.2021</td>
                            <td>18-225</td>
                            <td>Выпрессовщик сайдендблоков ВСГ25</td>
                            <td>Заготовительная</td>
                            <td>5</td>
                            <td>4</td>
                            <td>8</td>
                        </tr>
                        <tr>
                            <th colspan="5" scope="colgroup" style="border: none;"></th>
                            <th colspan="1" scope="colgroup">Итого, ч:</th>
                            <th colspan="1" scope="colgroup">46</th>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-control> button {
    margin: 5px;
    padding-left: 5px;
    padding-right: 5px;
    float:right;
}
.table-content {
    width: max-content;
}
.container {
    display: flex;
    flex-direction: row;
}
.container>div:last-child {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
}
.initial-user{
    color: #057dff;
}
.p-1 input{
    width: 70px;
}
.p-2 input{
    width: 80px;
}
.p-3 input{
    width: 85px;
}
.p-4 input{
    width: 100px;
}
.p-5 input{
    width: 160px;
}
.p-6 input{
    width: 160px;
}
input {
    margin-left: 4px;
    margin-right: 4px;
    border: 1px solid #d3d3d3;
    border-radius: 4px;
}
textarea {
    height: 90px;
    width: 400px;
    border: 1px solid #d3d3d3;
    border-radius: 4px;
}
.inform-block {
    display: flex;
    flex-direction: row;
}
.prim {
    border: 1px solid #d3d3d3;
    border-radius: 4px;
    padding: 8px;
}
.tabel-td {
    width: 60px;
}
.har-inform {
    padding: 2px;
    display: flex;
    flex-wrap: nowrap;
}
.textarea-har {
    width: 300px;
    height: 80px;
}
.ava-block>img {
    height: 200px;
    width: 160px;
}
.har-inform>div {
    margin-left: 10px;
}
.har-inform>div:last-child {
    margin-left: 30px;
    width: 300px;
}
.har-inform table {
    width: 300px;
}
.har-inform  button {
    margin: 5px;
    float: right;
}
.working-block {
    width: max-content;
}
</style>