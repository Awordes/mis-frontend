<template>
    <div class="vsd-list">
        <b-container class="vsd-wr">
            <b-row class="d-flex flex-row p-2">
                <b-col>
                    <b-form-select v-model="selectedEnterprise">
                        <b-form-select-option v-for="enterprise in enterprises" v-bind:value="enterprise.id" v-bind:key="enterprise.id">
                            {{ enterprise.name }}
                        </b-form-select-option>
                    </b-form-select>
                </b-col>
            </b-row>
            <b-row class="d-flex flex-row p-2">
                <b-col>
                    <b-form-select v-model="selectedType">
                        <b-form-select-option v-for="type in types" v-bind:value="type.id" v-bind:key="type.id">
                            {{ type.title }}
                        </b-form-select-option>
                    </b-form-select>
                </b-col>
                <b-col>
                    <b-form-select v-model="selectedStatus">
                        <b-form-select-option v-for="status in statuses" v-bind:value="status.id" v-bind:key="status.id">
                            {{ status.title }}
                        </b-form-select-option>
                    </b-form-select>
                </b-col>            
                <b-col>
                    <b-form-select v-model="pageSize">
                        <b-form-select-option v-for="size in pageSizes" v-bind:value="size.value" v-bind:key="size.value">
                            {{ size.text }}
                        </b-form-select-option>
                    </b-form-select>
                </b-col>
                <b-col>
                    <b-button variant="primary" class="submit" v-on:click="getVsdList(1)">Получить список ВДС</b-button>
                </b-col>
            </b-row>
        </b-container>
        
        <b-container class="vsd-wr">
            <b-row>
                <b-table striped selectable outlined hover
                    :items="vsdList"
                    :fields="vsdFields"
                    :busy="isLoading"
                    :select-mode="selectMode"
                    ref="vsdListTable"
                    >
                    <template #table-busy>
                        <div class="text-center text-primary my-2">
                            <b-spinner class="align-middle"></b-spinner><br />
                            <strong>Подождите пожалуйста</strong>
                        </div>
                    </template>
                    <template #cell(isChecked)="data">
                        <input type="checkbox" v-model="data.item.selected" />
                    </template>
                </b-table>
            </b-row>
            <b-row>
                <b-col>
                    <b-pagination v-model="currentPage" :total-rows="elementCount" @change="getVsdList"></b-pagination>
                </b-col>
                <b-col>
                    <b-button variant="outline-info" @click="selectAll">Выбрать всё</b-button>
                    <b-button variant="outline-primary" @click="clearSelected">Очистить выделение</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: "VsdList",
  data() {
    return {
        isLoading: false,
        selectMode: 'multi',
        vsdFields:[
            {key: 'id', label: 'Идентификатор ВСД'},
            {key: 'productGlobalId', label: 'Номер продукции'},
            {key: 'name', label: 'Наименование'},
            {key: 'productDate', label: 'Дата выработки'},
            {key: 'expirationDate', label: 'Дата окончания срока годности'},
            {key: 'volume', label: 'Объем'}
        ],
        vsdList: [
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
            {
                id: "aslkfnas",
                productGlobalId: "asd",
                name: "asd",
                productDate: "asd",
                expirationDate: "asd",
                volume: "sad"
            },
        ],
        selectedRows:[],
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
        ],
        currentPage: 1,
        pageCount: 4,
        elementCount: 400,
    }
  },
    methods: {
        getVsdList: function(currentPage) {
            this.isLoading = true;
            Vue.axios.get(this.$baseUrl + '/Vsd/GetVsdList', {
                params: {
                    "pageSize": this.pageSize,
                    "page" : currentPage,
                    "status" : this.selectedStatus,
                    "type" : this.selectedType,
                    "enterpriseId": this.selectedEnterprise,
                }
            })
            .then((response) => {
                this.isLoading = false;
                this.vsdList = response.data.result;
                this.pageCount = response.data.pageCount;
                this.elementCount = response.data.elementCount;
            }, (error) => {
                console.log(error);
                this.isLoading = false;
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        selectAll: function() {
            this.$refs.vsdListTable.selectAllRows();
        },
        clearSelected() {
            this.$refs.vsdListTable.clearSelected();
        }
    },
    mounted: function() {
        Vue.axios.get(this.$baseUrl + '/Vsd/GetVsdTypes')
        .then((response) => {
            this.types = response.data.enumElements;
            this.selectedType = response.data.enumElements[3].id;
        },  (error) => {
            console.log(error);
            this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
        })

        Vue.axios.get(this.$baseUrl + '/Vsd/GetVsdStatuses')
        .then((response) => {
            this.statuses = response.data.enumElements;
            this.selectedStatus = response.data.enumElements[1].id;
        },  (error) => {
            console.log(error);            
            this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
        })

        Vue.axios.get(this.$baseUrl + '/User/Current')
        .then((response) => {
            this.enterprises = response.data.enterprises;
            this.selectedEnterprise = response.data.enterprises[0].id;
        },  (error) => {
            console.log(error);
            this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
        })        
    }  
};
</script>


<style scoped>
.vsd-list {
    position: absolute;
}

.vsd-wr {
  box-shadow: 3px 3px 10px #333;
  position: relative;
  display: inline-block;
  background-color: white;
  margin-top: 80px;
  margin-bottom: 80px;
  left: 1px;
  right: 1px;
  text-align: center;
  padding: 15px;
}
</style>