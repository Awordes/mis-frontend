<template>
    <div class="applicant-list-panel">
        <b-container class="applicant-list-panel-wr">
            <b-row>
                <b-col>
                    <b-table outlined hover responsive 
                        :items="applicantList"
                        :busy="isApplicantListLoading"
                        :fields="applicantListFields">
                        <template #table-busy>
                            <div class="text-center text-primary">
                                <b-spinner class="align-middle"></b-spinner><br />
                                <strong>Подождите пожалуйста</strong>
                            </div>
                        </template>
                        <template #cell(creationDate)="data">
                            <span>{{ data.item.creationDate | moment("DD.MM.YYYY") }}</span>
                        </template>
                        <template #cell(action)="data">
                            <b-button v-b-modal.applicant-to-user-confirm v-b-tooltip.hover size="sm" v-if="data.item.status == 'Новая'"
                                title="Создать пользователя из заявки" @click="openApplicantToUserConfirmModal(data.item.id)">
                                <b-icon icon="pencil-square"></b-icon>
                            </b-button>
                        </template>
                    </b-table>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="9">
                    <b-pagination
                        v-model="applicantListCurrentPage"
                        :per-page="applicantListPageSize"
                        :total-rows="applicantListRowCount"
                        @change="getApplicantList"
                        align="left"
                        last-number>
                    </b-pagination>
                </b-col>
            </b-row>
        </b-container>
        
        <b-modal
            id="applicant-to-user-confirm"
            @ok="createUserFromApplicant"
            title="Создание пользователя из заявки"
            :no-enforce-focus="true">
            <template #modal-footer="{ ok, cancel}">
                <b-button size="sm" variant="success" @click="ok()">Да</b-button>
                <b-button size="sm" variant="primary" @click="cancel()">Отмена</b-button>
            </template>
            Вы точно хотите создать пользователя из заявки?
        </b-modal>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: 'ApplicantList',
    data() {
        return {
            applicantListFields: [
                { key: 'title', label: 'ФИО заявителя' },
                { key: 'phoneNumber', label: 'Номер телефона' },
                { key: 'email', label: 'E-mail' },
                { key: 'inn', label: 'ИНН' },
                { key: 'status', label: 'Статус' },
                { key: 'creationDate', label: 'Дата регистрации', thStyle: { width: '130px' } },
                { key: 'action', label: 'Действия' }
            ],
            applicantList: [],
            isApplicantListLoading: false,
            applicantListCurrentPage: 1,
            applicantListPageSize: 10,
            applicantListRowCount: 0,
            selectedApplicantId: ""
        }
    },
    methods: {        
        getApplicantList(currentPage) {
            this.isApplicantListLoading = true;
            Vue.axios.get(this.$baseUrl + '/Applicant/List', {
                params: {
                    "pageSize": this.applicantListPageSize,
                    "page" : currentPage
                }
            })
            .then((response) => {
                this.isApplicantListLoading = false;
                this.applicantList = response.data.results;
                this.pageCount = response.data.pageCount;
                this.applicantListRowCount = response.data.rowCount;
            }, (error) => {
                console.log(error);
                this.applicantListIsLoading = false;
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },

        createUserFromApplicant() {
            this.$loaderStart();
            Vue.axios.post(this.$baseUrl + '/User/CreateFromApplicant/' + this.selectedApplicantId)
            .then(() => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Пользователь успешно создан.');
                this.refreshApplicantList();
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },

        openApplicantToUserConfirmModal(applicantId) {
            this.selectedApplicantId = applicantId;
        },

        refreshApplicantList() {
            this.getApplicantList(this.applicantListCurrentPage);
        },
    },
    mounted() {
        this.getApplicantList(this.applicantListCurrentPage);
    }
}
</script>

<style scoped>
.applicant-list-panel {
    position: absolute;
    left: 1%;
    right: 1%;
}

.applicant-list-panel-wr {
    box-shadow: 3px 3px 10px #333;
    position: relative;
    background-color: white;
    margin-top: 40px;
    margin-bottom: 20px;
    padding: 15px;
}
</style>