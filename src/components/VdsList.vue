<template>
  <div>

    <div class="table">
        
        <div class="control">
            <select class="select-css large" v-model="selectedEnterprise">
                <option v-for="enterprise in enterprises" v-bind:value="enterprise.id" v-bind:key="enterprise.id">
                    {{ enterprise.name }}
                </option>
            </select>
            <div class="row">
                <select class="select-css" v-model="selectedType">
                    <option v-for="type in types" v-bind:value="type.id" v-bind:key="type.id">
                        {{ type.title }}
                    </option>
                </select>
                <select class="select-css" v-model="selectedStatus">
                    <option v-for="status in statuses" v-bind:value="status.id" v-bind:key="status.id">
                        {{ status.title }}
                    </option>
                </select>
                <button class="submit" v-on:click="getVdsList">Получить список ВДС</button>
            </div>


            
        </div>
        
        <div v-show="visible">
            
            <table>
                <tr>
                    <th></th>
                    <th>Идентификатор ВСД</th>
                    <th>Номер продукции</th>
                    <th>Наименование</th>
                    <th>Дата выработки</th>
                    <th>Дата окончания срока годности</th>
                    <th>Объем</th>
                </tr>
                <tr v-for="vds in vdsList" v-bind:key=vds.id>
                    <td><input type="checkbox"></td>
                    <td>{{ vds.id}}</td>
                    <td>{{ vds.productGlobalId}}</td>
                    <td>{{ vds.name}}</td>
                    <td>{{ vds.productDate}}</td>
                    <td>{{ vds.expirationDate}}</td>
                    <td>{{ vds.volume}}</td>
                    
                </tr>
            </table>

            <div class="control">

            <select class="select-css" v-model="pageSize">
                <option v-for="size in pageSizes" v-bind:value="size.value" v-bind:key="size.value">
                    {{ size.text }}
                </option>
            </select>

            </div>

        </div>
    </div>
  </div>
</template>


<script>

import Vue from 'vue'

export default {
  name: "VdsList",
  data() {
    return {
        vdsList: [],
        types: [],
        selectedType: Number,
        statuses: [],
        selectedStatus: Number,
        enterprises: [],
        selectedEnterprise: Number,
        count: 10,
        pageSize: 10,
        pageSizes: [
            {
                value: 10,
                text: "Показывать по: 10"
            },
            {
                value: 20,
                text: "Показывать по: 20"
            },
            {
                value: 50,
                text: "Показывать по: 50"
            },
            {
                value: 100,
                text: "Показывать по: 100"
            },
        ]
        
    }
  },
    methods: {
        getVdsList: function() {
            this.$loaderStart()
            Vue.axios
            .get(this.$baseUrl + '/Vsd/GetVsdList', {
                params: {
                    "pageSize": this.pageSize,
                    "page" : 1,
                    "status" : this.selectedStatus,
                    "type" : this.selectedType,
                    "enterpriseId": this.selectedEnterprise,
                }
            })
            .then((response) => {
                console.log(response.data)
                this.vdsList = response.data.result;
                this.$loaderEnd()
            }, (error) => {
                console.log(error);
                this.$loaderEnd()
            })
        }
    },
    mounted: function() { 
        Vue.axios
        .get(this.$baseUrl + '/Vsd/GetVsdTypes')
        .then((response) => {
            this.types = response.data.enumElements;
            this.selectedType = response.data.enumElements[3].id;
        },  (error) => {
            console.log(error);
        })

        Vue.axios
        .get(this.$baseUrl + '/Vsd/GetVsdStatuses')
        .then((response) => {
            this.statuses = response.data.enumElements;
            this.selectedStatus = response.data.enumElements[1].id;
        },  (error) => {
            console.log(error);
        })

        Vue.axios
        .get(this.$baseUrl + '/User/Current')
        .then((response) => {
            this.enterprises = response.data.enterprises;
            this.selectedEnterprise = response.data.enterprises[0].id;
        },  (error) => {
            console.log(error);
        })
        
    },
    computed: {
        visible: function() {
           return this.vdsList.length > 0;
        }
    }
  
};
</script>


<style scoped>
    .table {
        width: 100%;
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
    input[type="number"] {
        width: 100px;
        font-size: 13px;
        padding: 6px 0 10px 10px;
        border: 1px solid #cecece;
        background: #F6F6f6;
        border-radius: 3px;
    }
    .submit {
        cursor: pointer;
        font-size: 16px; 
        font-family: sans-serif; 
        font-weight: 700; 
        color: #444; 
        border: 1px solid #aaa;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: inset 0px 20px 20px #ffffff;
        border-radius: 5px;
        padding: 10px 6px;
        margin: 0 10px;
        width: auto;
        height: 100%;
    }
    .submit:hover {
        box-shadow: inset 0px -20px 20px #ffffff;
        border-color: #888;
    }
    .submit:active {
        margin-top: 1px;
        margin-bottom: -1px;
        zoom: 1;
    }
    .submit:focus
    {
        outline:none;
    }
    .control {
        margin: 20px 0;
    }
    .select-css { 
        cursor: pointer;
        display: inline-block; 
        font-size: 16px; 
        font-family: sans-serif; 
        font-weight: 700; 
        color: #444; 
        line-height: 1.3; 
        padding: .6em 1.4em .5em .8em; 
        width: 250px; 
        max-width: 100%; 
        box-sizing: border-box; 
        margin: 10px; 
        border: 1px solid #aaa;
        box-shadow: 0 1px 0 1px rgba(0,0,0,.04); 
        border-radius: .5em;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        background-color: rgba(255, 255, 255, 0.7); 
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'), linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%); 
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: .65em auto, 100%; 
        } 
        .select-css::-ms-expand { display: none; } 
        .select-css:hover { border-color: #888; } 
        .select-css:focus { border-color: #aaa; 
        box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
        box-shadow: 0 0 0 3px -moz-mac-focusring; 
        color: #222;
        outline: none; 
        } 
        .select-css option {  cursor: pointer; font-weight:normal; } 
        *[dir="rtl"] .select-css, :root:lang(ar) .select-css, :root:lang(iw) .select-css { 
        background-position: left .7em top 50%, 0 0; 
        padding: .6em .8em .5em 1.4em; 
    }

    .large {
        width: 70%;
    }



</style>