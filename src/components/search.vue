<template>
    <div id="cover">
        <div class="tb">
            <div class="td">
                <input type="text" 
                        placeholder="Поиск по Артиклу" 
                        required
                        @keyup="e => $emit('unmount', e.target.value)"
                        >
            </div>
            <div class="td" >
               <unicon name="search-alt"  fill='gray'/>
            </div>
        </div>
        </div>
</template>


<style scoped>
    *
{
    outline: none;
}


.td
{
    display: table-cell;
    vertical-align: middle;
}

input, button
{
    color: rgb(61, 61, 61);
    padding: 0;
    margin: 0;
    border: 0;
    background-color: transparent;
}

#cover
{
    width: 90%;
    padding: 2px;
    background-color: #e7e7e7;
    border-radius: 6px;
    box-shadow: 0 10px 20px #cecece, 0 0 0 10px #ffffffeb;
}
input[type="text"]
{
    width: 90%;
    font-size: 16px;
    line-height: 1;
}

input[type="text"]::placeholder
{
    color: #d4d4d4;
    font-size: 16px;
    font-weight: bold;
}
input[type="text"]:hover::placeholder
{
    color: #03030352;
    
}
.tb {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

</style>