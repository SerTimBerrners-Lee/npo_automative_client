<template>
    <div>
        <div class="flex-box-main">
            <div class="left-block-bprovider">
                 <h3>База поставщиков</h3>
                <div class="scroll-table">
                    <table>
                        <tr>
                            <th>ИНН</th>
                            <th style="width: 440px;">Наименование поставщика</th>
                        </tr>
                        <tr v-for="hh in 45" :key="hh" class="td-row">
                            <td>{{ 342364 * hh }}</td>
                            <td>ООО "Лента"</td>
                        </tr>
                    </table>
                </div>
                <div class="btn-control">
                    <button class="btn-small btn-add">Создать</button>
                    <button class="btn-small">Редактировать</button>
                    <button class="btn-small">В архив</button>
                </div>
                <h3>Фильтр по материалу</h3>
                <div class="scroll-table table-filter-bproveder">
                    <table>
                        <tr>
                            <th>Тип</th>
                            <th> Подтип</th>
                            <th> Наименование</th>
                        </tr>
                        <tr v-for="g in 25" :key="g" class="td-row" >
                            <td>Метизы</td>
                            <td>Гайки</td>
                            <td>М12</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="right-block-bprovider">
                <h3>Подробная информация о поставщике</h3>
                <div class="block">
                    <div class="first-block-description">
                        <p>
                            <span>Наименование: </span><input type="text" value="ООО Лента">
                        </p>
                        <p>
                            <span>ИНН: </span><input type="text" value="345345345345">
                        </p>
                        <p>
                            <span>КПП: </span><input type="text" value="345345435345">
                        </p>
                    </div>
                    <div>
                        <div class="block-d-r">
                            <div>
                                <div>
                                    <h3>Реквизиты</h3>
                                    <table>
                                        <tr class="td-row">
                                            <th>Юр.адрес</th>
                                            <td>192658 Москва, Юрия гагарина 125, оф. 87</td>
                                        </tr>
                                         <tr class="td-row">
                                            <th>Сайт</th>
                                            <td>www.lenta.ru</td>
                                        </tr>
                                         <tr class="td-row">
                                            <th>Эл. почта</th>
                                            <td>lenta@mail.ru</td>
                                        </tr>
                                    </table>
                                </div>
                                <div>
                                    <h3>Контакты</h3>
                                    <table>
                                        <tr class="td-row">
                                            <th>Юрий петрович белинский</th>
                                            <td>+79008895674, yra@lenta.ru, заместитель начальника склада</td>
                                        </tr>
                                        <tr class="td-row">
                                            <th>Василий Николай Горохов</th>
                                            <td>+79008895674, yra@lenta.ru, заместитель начальника склада</td>
                                        </tr>
                                    </table>
                                </div>
                                <div>
                                    <h3>Описание / примечание</h3>
                                    <textarea ></textarea>
                                    <h3>История изменений</h3>
                                </div>
                            </div>
                            <div>
                                 <div>
                                <div>
                                    <h3>Документы</h3>
                                    <table style="width: 100%">
                                        <tr>
                                            <th>Файл</th>
                                        </tr>
                                        <tr class="td-row">
                                            <td>Сопутствующая документация (Тип СД)          </td>
                                        </tr>
                                        <tr class="td-row">
                                            <td>Документация.pdf</td>
                                        </tr>
                                    </table>
                                    <div class="btn-control">
                                        <button class="btn-small">Открыть</button>
                                        <button class="btn-small">Скачать</button>
                                    </div>
                                </div>
                                </div>
                                <div>
                                    <h3>Поставляемый материал</h3>
                                    <div class="scroll-table" style="width: 100%">
                                        <table style="width: 100%"> 
                                            <tr>
                                                <th>Тип</th>
                                                <th>Подтип</th>
                                                <th>Наименование</th>
                                            </tr>
                                            <tr v-for="ff in 25" :key="ff" class="td-row">
                                                <td>...</td>
                                                <td>...</td>
                                                <td>...</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3>Поставки поставщиков</h3>
                            <div class="scroll-table">
                                <table>
                                    <tr>
                                        <th>№ Заказа</th>
                                        <th>Дата создания</th>
                                        <th>№ счета и Дата</th>
                                        <th>Сумма, руб.</th>
                                        <th>Дата прихода</th>
                                        <th>Статус</th>
                                        <th>Подробнее</th>
                                    </tr>
                                    <tr v-for="uu in 40" :key="uu" class="td-row">
                                        <td>32432</td>
                                        <td>11.19.2020</td>
                                        <td>№23432 11.19.2020</td>
                                        <td>11 900</td>
                                        <td>15.19.2020</td>
                                        <td>Выполняется</td>
                                        <td>Раскрыть</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                <div class="btn-control block endgroup">
                    <button class=" btn-black">Печать подробной информации о поставщике</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

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
</style>