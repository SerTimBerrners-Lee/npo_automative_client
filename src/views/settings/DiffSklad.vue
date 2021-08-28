<template>
    <div>
        <h3>Настройки для отображения</h3>
        <div class="block">
            <div>
                <span>Минимальный остаток: </span>
                <p>
                    <input type="text" value="1">
                    <span>мес. потребление</span> 
                </p>
            </div>
            <div>
                <span>Рекомендуемый остаток: </span>
                <p>
                    <input type="text" value="3">
                    <span>мес. потребление</span> 
                </p>
            </div>
        </div>
    </div>
</template>


<style scoped>
    .block>div * {
        margin: 5px;
    }
    .block>div input {
        width: 10px;
        padding: 5px;
    }
    .block>div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>