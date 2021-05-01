<template>
    <div class="registration-form">
        <b-modal
            id="applicant-create"
            size="lg"
            scrollable 
            title="Заявка на регистрацию"
            @ok="createApplicant"
            :no-enforce-focus="true"
            >
            <template #modal-footer="{ ok, cancel}">
                <b-button size="sm" variant="success" @click="ok()">Создать</b-button>
                <b-button size="sm" variant="danger" @click="cancel()">Назад</b-button>
            </template>
            <b-container fluid>
                <b-row class="modal-field" v-for="field in applicantCreateModalFields" :key="field.key">
                    <b-col sm="3">
                        <label>{{ field.label }}</label>
                    </b-col>
                    <b-col sm="9">
                        <b-form-input 
                        size="sm"
                        :type="field.type" 
                        v-model="applicant[field.key]"
                        ></b-form-input>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    name: "CreateApplicantForm",
    data() {
        return {
            applicantCreateModalFields: [
                {
                    key: 'title',
                    type: 'text',
                    label: 'ФИО заявителя'
                }, {
                    key: 'phoneNumber',
                    type: 'text',
                    label: 'Номер телефона'
                }, {
                    key: 'email',
                    type: 'text',
                    label: 'E-mail'
                }, {
                    key: 'inn',
                    type: 'text',
                    label: 'ИНН'
                }
            ],
            applicant: {}
        }
    },
    methods: {
        createApplicant() {            
            this.$loaderStart();
            Vue.axios.post(this.$baseUrl + '/Applicant', this.applicant)
            .then(() => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Заявка успешно создана.');
                this.refreshUserList();
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        }
    }
}
</script>

<style scoped>
.modal-field {
    margin: 10px 0px;
}
</style>