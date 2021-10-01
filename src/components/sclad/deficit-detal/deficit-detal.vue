<template>
    <div>
        <h3>Дефицит деталей</h3>
        <div>
            <div class="block header_block">
                <span>Выбрать период, с:</span>
                <input type="text">
                <span>по: </span><input type="text">
                <button class="btn-small">Сбросить период или дату</button>
                <span>Фильтры по статусу:</span>
                <label for='z'>Заказано</label><input id='z' type="checkbox">
                <label for='zn'>Не заказано</label><input id='zn' type="checkbox">
                <label for='end'>Выполнено</label><input id='end' type='checkbox'>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header_block input[type='text']{
    width: 110px;
}
.header_block * {
    margin-left: 10px;
}
.header_block label{
    color: black;
    font-size: 14px;
}
</style>