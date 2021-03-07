<template>
    <div class="admin-panel">
        <b-container class="admin-panel-wr">            
            <b-row>
                <b-col>
                    <b-table outlined hover responsive 
                        :items="userList"
                        :busy="userListIsLoading"
                        :fields="userListFields"
                        ref="vsdListTable">
                        <template #table-busy>
                            <div class="text-center text-primary my-2">
                                <b-spinner class="align-middle"></b-spinner><br />
                                <strong>Подождите пожалуйста</strong>
                            </div>
                        </template>
                        <template #cell(expirationDate)="data">
                            <span>{{ data.item.expirationDate | moment("MM.DD.YYYY") }}</span>
                        </template>
                        <template #cell(action)="data">
                            <b-row>
                                <b-col>
                                    <b-button v-b-modal.user-edit v-b-tooltip.hover size="sm"
                                        title="Редактировать пользователя" @click="openUserEdit(data.item.id)">
                                        <b-icon icon="pencil-square"></b-icon>
                                    </b-button>
                                </b-col>
                                <b-col>
                                    <b-button v-b-modal.user-role-edit v-b-tooltip.hover size="sm"
                                        title="Редактировать роли" @click="openRoleEdit(data.item.id)">
                                        <b-icon icon="card-checklist"></b-icon>
                                    </b-button>
                                </b-col>
                                <b-col>
                                    <b-button v-b-modal.user-role-edit v-b-tooltip.hover size="sm"
                                        title="Редактировать предприятия" @click="openUserEdit(data.item.id)">
                                        <b-icon icon="stickies"></b-icon>
                                    </b-button>
                                </b-col>
                            </b-row>
                        </template>
                    </b-table>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-pagination
                        v-model="userListCurrentPage"
                        :per-page="userListPageSize"
                        :total-rows="userListRowCount"
                        @change="getUserList"
                        align="left"
                        last-number>
                    </b-pagination>
                </b-col>
            </b-row>
        </b-container>

    <b-modal
        id="user-edit"
        size="lg"
        scrollable 
        title="Редактирование пользователя"
        @ok="updateUser"
        @show="showModal"
        :no-enforce-focus="true"
        >
        <template #modal-footer="{ ok, cancel}">
            <b-form-checkbox switch v-b-tooltip.hover title="Разрешить редактирование" v-model="disableForm"></b-form-checkbox>
            <b-button size="sm" variant="success" @click="ok()">Сохранить</b-button>
            <b-button size="sm" variant="danger" @click="cancel()">Назад</b-button>
        </template>
        <b-container fluid>
            <b-row class="modal-field">
                <b-col sm="3">
                    <label>Логин</label>
                </b-col>
                <b-col sm="9">
                    <b-form-input
                    type="text" 
                    v-model="selectedUser['userName']"
                    disabled
                    ></b-form-input>
                </b-col>
            </b-row>
            <b-row class="modal-field" v-for="field in userEditModalFields" :key="field.key">
                <b-col sm="3">
                    <label>{{ field.label }}</label>
                </b-col>
                <b-col sm="9">
                    <b-form-input 
                    size="sm"
                    :type="field.type" 
                    v-model="selectedUser[field.key]"
                    :disabled="!disableForm"
                    ></b-form-input>
                </b-col>
            </b-row>
        </b-container>
    </b-modal>

    <b-modal        
        id="user-role-edit"
        @ok="updateUserRoles"
        @show="showModal"
        title="Редактирование ролей пользователя"
        :no-enforce-focus="true">
        <template #modal-footer="{ ok, cancel}">
            <b-form-checkbox switch v-b-tooltip.hover title="Разрешить редактирование" v-model="disableForm"></b-form-checkbox>
            <b-button size="sm" variant="success" @click="ok()">Сохранить</b-button>
            <b-button size="sm" variant="danger" @click="cancel()">Назад</b-button>
        </template>     
        <b-container fluid>
            <b-row>
                <b-col>
                    <b-form-checkbox-group 
                        stacked 
                        switches
                        v-model="userRoles"
                        :options="roles"
                        value-field="name"
                        text-field="description"
                        :disabled="!disableForm">
                    </b-form-checkbox-group>
                </b-col>
            </b-row>
        </b-container>
    </b-modal>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: "AdminPanel",
    data() {
        return {
            userListIsLoading: false,
            userListFields:[                
                {key: 'id', label: 'Идентификатор'},
                {key: 'userName', label: 'Логин'},
                {key: 'title', label: 'Имя пользователя'},
                {key: 'expirationDate', label: 'Дата окончания подписки'},
                {key: 'action', label: 'Действия'}
            ],
            userList: [],
            userListPageSize: 10,
            userListCurrentPage: 1,
            userListRowCount: 1,
            userEditModalFields: [
                {
                    key: 'title',
                    type: 'text',
                    label: 'Имя пользователя'
                }, {
                    key: 'inn',
                    type: 'text',
                    label: 'ИНН'
                }, {
                    key: 'mercuryLogin',
                    type: 'text',
                    label: 'Логин Меркурия'
                }, {
                    key: 'mercuryPassword',
                    type: 'text',
                    label: 'Пароль Меркурия'
                }, {
                    key: 'apiLogin',
                    type: 'text',
                    label: 'Логин API'
                }, {
                    key: 'apiPassword',
                    type: 'text',
                    label: 'Пароль API'
                }, {
                    key: 'apiKey',
                    type: 'text',
                    label: 'Ключ API'
                }, {
                    key: 'issuerId',
                    type: 'text',
                    label: 'Идентификатор пользователя'
                }, {
                    key: 'expirationDate',
                    type: 'date',
                    label: 'Дата окончания подписки'
                }
            ],
            selectedUserId: "",
            selectedUser: {},
            disableForm: false,
            roles: [],
            userRoles: []
        }
    },
    methods: {
        getUserList(currentPage) {
            this.userListIsLoading = true;
            Vue.axios.get(this.$baseUrl + '/User/List', {
                params: {
                    "pageSize": this.userListPageSize,
                    "page" : currentPage
                }
            })
            .then((response) => {
                this.userListIsLoading = false;
                this.userList = response.data.results;
                this.pageCount = response.data.pageCount;
                this.userListRowCount = response.data.rowCount;
            }, (error) => {
                console.log(error);
                this.userListIsLoading = false;
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        getUser(userId) {
            this.$loaderStart();     
            Vue.axios.get(this.$baseUrl + '/User', {
                params: {
                    "id": userId
                }
            })
            .then((response) => {
                this.$loaderEnd();
                this.selectedUser = response.data;
                this.selectedUserId = response.data.id;
                this.selectedUser.expirationDate = this.$moment(response.data.expirationDate).format("YYYY-MM-DD");
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        updateUser() {
            this.$loaderStart();
            Vue.axios.put(this.$baseUrl + '/User/' + this.selectedUser.id, this.selectedUser)
            .then(() => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Пользователь ' + this.selectedUser.title + ' успешно обновлён.');
                this.refreshUserList();
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        getUserRoles(userId) {
            this.$loaderStart();
            Vue.axios.get(this.$baseUrl + '/User/' + userId + '/Roles')
            .then((response) => {
                this.$loaderEnd();
                this.userRoles = response.data.roles;
                this.selectedUserId = userId;
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        updateUserRoles() {
            this.$loaderStart();
            Vue.axios.post(this.$baseUrl + '/User/' + this.selectedUserId + '/EditRoles', {
                roles: this.userRoles
            })
            .then(() => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Роли пользователя успешно обновлены.');
                this.refreshUserList();
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        getAllRoles() {
            this.$loaderStart();
            Vue.axios.get(this.$baseUrl + '/Role/List')
            .then((response) => {
                this.$loaderEnd();
                this.roles = response.data.roles;
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        openUserEdit(userId) {
            this.getUser(userId);
        },
        openRoleEdit(userId) {
            this.getAllRoles();
            this.getUserRoles(userId);
        },
        refreshUserList() {
            this.getUserList(this.userListCurrentPage);
        },
        showModal() {
            this.disableForm = false;
        }
    },
    mounted() {
        this.getUserList(this.userListCurrentPage);
    }
}
</script>

<style scoped>

.admin-panel {
    position: absolute;
    left: 1%;
    right: 1%;
}

.admin-panel-wr {
    box-shadow: 3px 3px 10px #333;
    position: relative;
    background-color: white;
    margin-top: 40px;
    margin-bottom: 20px;    
    padding: 15px;
}

.modal-field {
    margin: 10px 0px;
}

span.select2-container {
    z-index:10050;
}
</style>