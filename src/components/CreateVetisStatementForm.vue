<template>
    <div>
        <b-modal
            id="create-vetis-statement"
            size="lg"
            scrollable 
            title="Поля заявки Ветис.API"
            @ok="createVetisStatement"
            :no-enforce-focus="true"
            >
            <template #modal-footer="{ ok, cancel}">
                <b-button size="sm" variant="success" @click="ok()">Создать</b-button>
                <b-button size="sm" variant="danger" @click="cancel()">Назад</b-button>
            </template>
            <b-container fluid>
                <b-row class="modal-field" v-for="field in createVetisStatementFields" :key="field.key">
                    <b-col sm="3">
                        <label>{{ field.label }}</label>
                    </b-col>
                    <b-col sm="9">
                        <b-form-input 
                        size="sm"
                        :type="field.type" 
                        v-model="vetisStatement[field.key]"
                        ></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="modal-field">                    
                    <b-col sm="3">
                        <label>Филиалы</label>
                    </b-col>
                    <b-col sm="9">
                        <div v-for="(enterprise, index) in enterprises" :key="index">
                            <b-form-input class="modal-field" size="sm" type="text" v-model="enterprises[index]"/>
                        </div>
                        <b-button size="sm" variant="primary" @click="addEnterprise">+</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    name: "CreateVetisStatementForm",
    data() {
        return {
                createVetisStatementFields: [
                {
                    key: 'applicantPosition',
                    type: 'text',
                    label: 'Должность'
                }, {
                    key: 'applicantFio',
                    type: 'text',
                    label: 'ФИО'
                }, {
                    key: 'applicantEnterprise',
                    type: 'text',
                    label: 'Предприятие'
                }, {
                    key: 'enterpriseAddress',
                    type: 'text',
                    label: 'Адрес'
                }, {
                    key: 'inn',
                    type: 'text',
                    label: 'ИНН'
                }, {
                    key: 'ogrn',
                    type: 'text',
                    label: 'ОГРН'
                }, {
                    key: 'contactFio',
                    type: 'text',
                    label: 'Номер контактного лица'
                }, {
                    key: 'contactPosition',
                    type: 'text',
                    label: 'Должность контактного лица'
                }, {
                    key: 'contactEmail',
                    type: 'text',
                    label: 'E-mail контактного лица'
                }, {
                    key: 'contactPhone',
                    type: 'text',
                    label: 'Телефон контактного лица'
                }, {
                    key: 'infSystem',
                    type: 'text',
                    label: 'Информационная система'
                }
            ],
            vetisStatement: {},
            enterprises: []
        }
    },
    methods: {
        createVetisStatement() {            
            this.$loaderStart();
            this.vetisStatement.enterprises = this.enterprises;
            Vue.axios.post(this.$baseUrl + '/Template/FillTemplate/VetisStatement', {
                data: this.vetisStatement
            }, {
                responseType: 'blob'
            })
            .then((response) => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Заявление успешно сгенерировано.');
                let blob = new Blob([response.data], { type:response.headers['content-type'] });
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Заявление ' + this.vetisStatement.applicantFio;
                link.click();
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        addEnterprise() {
            this.enterprises.push('');
        }
    }
}
</script>

<style scoped>
.modal-field {
    margin: 10px 0px;
}
</style>