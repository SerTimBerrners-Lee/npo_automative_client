<template>
  <div id="nav">
      <HeadersNav />
      <MenuItem />
      <NavigationPanel />
    <router-view />
  </div>
</template>

<script>

import MenuItem from '@/components/menu-left';
import HeadersNav from '@/components/header-nav';
import NavigationPanel from '@/components/navigation-panel';

export default {
  name: 'App',
  components: {
    MenuItem,
    HeadersNav,
    NavigationPanel
  },
  methods: {
    test(e) {
      console.log(e)
    }
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    left: 0;
    top: 0;
  }
  body {
    margin: 0px;
  }
  h3 {
      font-weight: unset;
      font-size: 21px;
  }
  .type-operation {
      width: 210px;
      height: 70px;
      border: 1px solid #9b9b9b;
      border-radius: 7px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 10px;
      padding-right: 10px;
      margin: 10px;
      user-select: none;
  }
  .type-operation>span:first-child{
      width: 10%;
      text-align: center;
  }
  .type-operation>span:last-child {
      width: 85%;
      text-align: center;
  }
  .type-operation:hover {
      cursor: pointer;
      background: #494949;
      border: none;
  }
  .operation-block {
      display: flex;
      flex-wrap: wrap;
  }
  .scroll-table{
      height: 250px;
      overflow: auto;
      direction: ltr;
      width: max-content;
  }
  table {
      border: 1px solid #d3d3d3;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 16px;
  }
  th {
      border: 1px solid #d3d3d3;
      padding: 6px;
  }
  td {
      border: 1px solid #d3d3d3;
      padding: 5px !important;
  }
  .td-row:hover {
    background: #b6b6b6;
    cursor: pointer;
  }
  .result-work {
        margin: 10px;
        border: 1px solid #d3d3d3;
        border-radius: 5px;
        padding: 20px;
        display: flex;
        align-items: center;
    }
    .result-work * {
        margin-left: 10px;    
    }
    button {
        cursor: pointer;
        height: 25px;
        padding: 5px;
    }
    .calendar-input {
        width: 100px;
        border-radius: 5px;
        height: 22px;
        border: 1px solid #d3d3d3;
    }
    .input-periud {
        width: 40px;
        border-radius: 5px;
        height: 22px;
        border: 1px solid #d3d3d3;
    }
    a {
      text-decoration: none;
      color: #000 !important;
    }
</style>
