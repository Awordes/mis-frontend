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
                    <b-form-select v-model="vsdListPageSize">
                        <b-form-select-option v-for="size in vsdListPageSizes" v-bind:value="size.value" v-bind:key="size.value">
                            {{ size.text }}
                        </b-form-select-option>
                    </b-form-select>
                </b-col>
                <b-col>
                    <b-button :disabled="vsdProcessingInProgress"
                        variant="primary"
                        class="submit"
                        v-on:click="getVsdList(1)">Получить список ВДС</b-button>
                </b-col>
            </b-row>
        </b-container>
        
        <b-container class="vsd-wr">
            <b-row>
                <b-col sm="4">
                    <b-pagination
                        v-model="vsdListCurrentPage"
                        :per-page="vsdListPageSize"
                        :total-rows="vsdListRowCount"
                        @change="getVsdList"
                        align="left"
                        last-number>
                    </b-pagination>
                </b-col>
                <b-col sm="2">
                    <p>Количество ВСД: {{vsdListTotalCount}}<p/>
                </b-col>
                <b-col sm="3">
                    <b-button variant="success" class="submit" 
                        v-on:click="processVsdList(selectedRows)" 
                        :disabled="selectedRows.length < 1 || vsdProcessingInProgress">
                        <b-spinner small :hidden="!vsdProcessingInProgress"></b-spinner>
                        Погасить выбранные ВСД</b-button>
                </b-col>
                <b-col sm="3">
                    <b-button size="sm" variant="outline-info" @click="selectAll" style="margin: 5px;">Выбрать всё</b-button>
                    <b-button size="sm" variant="outline-primary" @click="clearSelected" style="margin: 5px;">Очистить выделение</b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-table selectable outlined hover responsive
                        :items="vsdList"
                        :fields="vsdFields"
                        :busy="vsdListIsLoading"
                        :select-mode="selectMode"
                        ref="vsdListTable"
                        @row-selected="onRowSelected">
                        <template #table-busy>
                            <div class="text-center text-primary my-2">
                                <b-spinner class="align-middle"></b-spinner><br />
                                <strong>Подождите пожалуйста</strong>
                            </div>
                        </template>
                        <template #cell(productDate)="data">
                            <span>{{ data.item.productDate | moment("DD.MM.YYYY") }}</span>
                        </template>
                        <template #cell(issueDate)="data">
                            <span>{{ data.item.issueDate | moment("DD.MM.YYYY") }}</span>
                        </template>
                        <template #cell(processDate)="data">
                            <b-form-input type="date" v-model="data.item.processDate" />
                        </template>
                    </b-table>
                </b-col>
            </b-row>
        </b-container>
        
        <b-container class="vsd-wr">
            <b-row>
                <b-col>
                    <b-button v-b-toggle.collapse-log variant="primary" class="collapse-log-btn">Лог гашения</b-button>
                </b-col>
            </b-row>
            <b-collapse id="collapse-log">
                <b-row>
                    <b-col>
                        <b-table class="vsd-log" outlined hover responsive
                            :items="vsdProcessTransactionList"
                            :fields="vsdProcessTransactionFields"
                            ref="vsdProcessTransactionListTable">
                            <template #cell(startTime)="data">
                                <span>{{ data.item.startTime | moment("DD.MM.YYYY HH:mm:ss") }}</span>
                            </template>
                            <template #cell(finishTime)="data">
                                <span>{{ data.item.finishTime | moment("DD.MM.YYYY HH:mm:ss") }}</span>
                            </template>
                            <template #cell(error)="data">
                                <span class="nowrap">{{data.item.error}}</span>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
                <b-row>                
                    <b-col>
                        <b-pagination
                            v-model="vsdProcessTransactionCurrentPage"
                            :per-page="vsdProcessTransactionPageSize"
                            :total-rows="vsdProcessTransactionRowCount"
                            @change="getVsdProcessTransactionList"
                            align="left"
                            last-number>
                        </b-pagination>
                    </b-col>
                </b-row>
            </b-collapse>
        </b-container>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: "VsdList",
    data() {
        return {
            vsdListIsLoading: false,
            selectMode: 'multi',
            vsdFields:[
                {key: 'id', label: 'Идентификатор ВСД'},
                {key: 'issueDate', label: 'Дата оформления ВСД'},
                {key: 'productDate', label: 'Дата выработки'},
                {key: 'name', label: 'Наименование'},
                {key: 'volume', label: 'Объем'},
                {key: 'productGlobalId', label: 'Номер продукции'},
                {key: 'processDate', label: 'Дата поступления товара', thStyle: {width: '13%'}}
            ],
            vsdList: [],
            selectedRows:[],
            types: [],
            selectedType: null,
            statuses: [],
            selectedStatus: null,
            enterprises: [],
            selectedEnterprise: null,
            vsdListPageSizes: [
                {
                    value: 10,
                    text: "Показывать по: 10"
                }, {
                    value: 20,
                    text: "Показывать по: 20"
                }, {
                    value: 50,
                    text: "Показывать по: 50"
                }, {
                    value: 100,
                    text: "Показывать по: 100"
                }
            ],
            vsdListPageSize: 10,
            vsdListCurrentPage: null,
            vsdListRowCount: 0,
            vsdListTotalCount: 0,
            vsdProcessTransactionFields: [
                {key: 'id', label: 'Идентификатор транзакции', thStyle: {width: '25%'}},
                {key: 'startTime', label: 'Начало', thStyle: {width: '13%'}},
                {key: 'finishTime', label: 'Завершение', thStyle: {width: '13%'}},
                {key: 'vsdId', label: 'ВСД', thStyle: {width: '25%'}},
                {key: 'error', label: 'Ошибка'}
            ],
            vsdProcessTransactionList: [],
            vsdProcessingInProgress: false,            
            vsdProcessTransactionPageSize: 10,
            vsdProcessTransactionCurrentPage: null,
            vsdProcessTransactionPageCount: 0,
            vsdProcessTransactionRowCount: 0,
        }
    },
    methods: {
        getVsdList: function(vsdListCurrentPage) {
            this.vsdListIsLoading = true;
            Vue.axios.get(this.$baseUrl + '/Vsd/GetVsdList', {
                params: {
                    "pageSize": this.vsdListPageSize,
                    "page" : vsdListCurrentPage,
                    "status" : this.selectedStatus,
                    "type" : this.selectedType,
                    "enterpriseId": this.selectedEnterprise,
                }
            })
            .then((response) => {
                this.vsdListIsLoading = false;
                this.vsdList = response.data.result;

                for (var vsd in this.vsdList) {
                    this.vsdList[vsd].processDate = this.$moment(this.vsdList[vsd].processDate).format("YYYY-MM-DD");
                }

                this.vsdListRowCount = response.data.elementCount;
                this.vsdListTotalCount = response.data.elementCount;
            }, (error) => {
                console.log(error);
                this.vsdListIsLoading = false;
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },

        selectAll: function() {
            this.$refs.vsdListTable.selectAllRows();
        },

        clearSelected() {
            this.$refs.vsdListTable.clearSelected();
        },
        
        onRowSelected(items) {
            this.selectedRows = [];
            items.forEach(element => {
                this.selectedRows.push({
                    'vsdId': element.id,
                    'processDate': element.processDate,
                });
            });
        },
        processVsdList(vsds) {
            this.interval = setInterval(() => this.getVsdProcessTransactionList(1), 1000);
            this.vsdProcessingInProgress = true;
            Vue.axios.post(this.$baseUrl + '/Vsd/ProcessVsdList', {
                "enterpriseId": this.selectedEnterprise,
                "vsds": vsds
            })
            .then(() => {
                clearInterval(this.interval);
                this.getVsdProcessTransactionList(1);
                this.vsdProcessingInProgress = false;
                this.vsdList = [];
                this.vsdListRowCount = 0;
                this.selectedRows = [];
                this.$createNotification('success', 'ВСД успешно погашены', ' ');
                this.getVsdList(1);
            }, (error) => {
                console.log(error);
                clearInterval(this.interval);
                this.getVsdProcessTransactionList(1);
                this.vsdProcessingInProgress = false;
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },        
        getVsdProcessTransactionList(vsdProcessTransactionCurrentPage) {
            Vue.axios.get(this.$baseUrl + '/VsdProcessTransaction/List', {
                params: {
                    "pageSize": this.vsdProcessTransactionPageSize,
                    "page" : vsdProcessTransactionCurrentPage
                }
            })
            .then((response) => {
                this.vsdProcessTransactionList = response.data.results;
                this.vsdProcessTransactionPageCount = response.data.pageCount;
                this.vsdProcessTransactionRowCount = response.data.rowCount;
            }, (error) => {
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
    },
    mounted: function() {
        this.getVsdProcessTransactionList(1);
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
    left: 1%;
    right: 1%;
}

.vsd-wr {
    box-shadow: 3px 3px 10px #333;
    position: relative;
    background-color: white;
    margin-top: 40px;
    margin-bottom: 20px;    
    padding: 15px;
    max-width: 1330px;
}

.vsd-log {
    font-size: 80%;
}

.collapse-log-btn {
    margin-bottom: 10px;
}
</style>