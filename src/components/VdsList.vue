<template>
  <div>

    

    <div class="table">

        <button v-show="visible" v-on:click="getVdsList">Получить список ВДС</button>

        <table v-show="visible">
            <tr>
                <th></th>
                <th>Статус</th>
                <th>Наименование</th>
                <th>Дата</th>
                <th>Количество</th>
            </tr>
            <tr v-for="vds in vdsList" v-bind:key=vds.id>
                <td><input type="checkbox"></td>
                <td>{{ vds.status}}</td>
                <td>{{ vds.name}}</td>
                <td>{{ vds.date}}</td>
                <td>{{ vds.count}}</td>
            </tr>
        </table>

    </div>
  </div>
</template>


<script>
//import axios from "axios"

export default {
  name: "VdsList",
  data() {
    return {
      vdsList: [],
      visible: this.getVisibility
    }
  },
  methods: {
    getVdsList: function() {
        this.vdsList.push({
            id: 1,
            name: "Мороженое эскимо, ванильное",
            status: "Новый",
            date: "13.12.2020",
            count: "1.2"
        })
        this.vdsList.push({
            id: 2,
            name: "Мороженое в стакане, 60г",
            status: "Просрочка",
            date: "13.12.2020",
            count: "11"
        })
    },
    getVisibility: function() {
        if (this.vdsList.count > 0)
        return true;
        else
        return false;
    }
  }
  
};
</script>


<style scoped>
    .table {
        width: 60%;
        margin: 0 auto;
        margin-top: 60px;
    }
    table {
        font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
        border-collapse: collapse;
        background: rgba(255, 255, 255, 0.7);
        width: 100%;
    }
    th {
        border-bottom: 3px solid transparent;
        padding: 10px;
        text-align: center;
        opacity: 0.8;
    }
    td {
        padding: 10px;
    }
    tr:nth-child(odd) {
        background: white;
        opacity: 0.7;
    }
    tr:nth-child(even) {
        background: #E8E6D1;
        opacity: 0.7;
    }
</style>