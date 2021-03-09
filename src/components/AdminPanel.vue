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
                            <div class="text-center text-primary">
                                <b-spinner class="align-middle"></b-spinner><br />
                                <strong>Подождите пожалуйста</strong>
                            </div>
                        </template>
                        <template #cell(expirationDate)="data">
                            <span>{{ data.item.expirationDate | moment("DD.MM.YYYY") }}</span>
                        </template>
                        <template #cell(action)="data">
                            <b-row cols="4">
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
                                    <b-button v-b-modal.user-enterprise-list v-b-tooltip.hover size="sm"
                                        title="Редактировать предприятия" @click="openEnterpriseList(data.item.id)">
                                        <b-icon icon="stickies"></b-icon>
                                    </b-button>
                                </b-col>
                                <b-col>
                                    <b-button v-b-modal.user-change-password v-b-tooltip.hover size="sm"
                                        @click="openPasswordChange(data.item.id)"
                                        title="Изменить пароль">
                                        <b-icon icon="vector-pen"></b-icon>
                                    </b-button>
                                </b-col>
                            </b-row>
                        </template>
                    </b-table>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="9">
                    <b-pagination
                        v-model="userListCurrentPage"
                        :per-page="userListPageSize"
                        :total-rows="userListRowCount"
                        @change="getUserList"
                        align="left"
                        last-number>
                    </b-pagination>
                </b-col>
                <b-col cols="3">                    
                    <b-button v-b-modal.user-create v-b-tooltip.hover size="sm" variant="primary"
                        @click="openUserCreate()">
                        Создать пользователя
                    </b-button>
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
            id="user-create"
            size="lg"
            scrollable 
            title="Создание пользователя"
            @ok="userCreateModal"
            @show="showModal"
            :no-enforce-focus="true"
            >
            <template #modal-footer="{ ok, cancel}">
                <b-button size="sm" variant="success" @click="ok()">Создать</b-button>
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
                        ></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="modal-field">
                    
                    <b-col sm="3">
                        <label>Пароль</label>
                    </b-col>
                    <b-col sm="9">
                        <b-input-group>
                            <b-form-input 
                                type="text" 
                                v-model="selectedUser['password']"></b-form-input>
                            <b-input-group-append>
                                <b-button v-b-tooltip.hover title="Сгенерировать пароль" variant="outline-success" @click="generatePassword">
                                    <b-icon icon="arrow-repeat"></b-icon>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
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
        
        <b-modal        
            id="user-enterprise-list"
            size="xl"
            @ok="updateUserRoles"
            @show="showModal"
            title="Список предприятий пользователя"
            :no-enforce-focus="true">
            <template #modal-footer>
                <b-form-checkbox switch v-b-tooltip.hover title="Разрешить редактирование" v-model="disableForm"></b-form-checkbox>
            </template>

            <b-container>            
                <b-row>
                    <b-col>
                        <b-table outlined hover 
                            :items="userEnterprises"
                            :fields="userEnterprisesFields"
                            ref="vsdListTable">
                            <template #cell(action)="data">
                                <b-row>
                                    <b-col>
                                        <b-button v-b-modal.user-enterprise-edit v-b-tooltip.hover size="sm"
                                            title="Редактировать предприятие" :disabled="!disableForm" @click="selectEnterprise(data.item)">
                                            <b-icon icon="pencil"></b-icon>
                                        </b-button>
                                    </b-col>
                                    <b-col>
                                        <b-button v-b-modal.user-enterprise-delete v-b-tooltip.hover size="sm" @click="selectEnterprise(data.item)"
                                            title="Удалить предприятие" variant="danger" :disabled="!disableForm">
                                            <b-icon icon="trash"></b-icon>
                                        </b-button>
                                    </b-col>
                                </b-row>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-button v-b-modal.user-enterprise-create v-b-tooltip.hover variant="outline-primary" :disabled="!disableForm">
                            Добавить предприятие
                        </b-button>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>

        <b-modal
            id="user-enterprise-edit"
            @ok="updateEnterprise"
            @show="showModal"
            title="Редактирование предприятия"
            :no-enforce-focus="true">
            <template #modal-footer="{ ok, cancel}">
                <b-form-checkbox switch v-b-tooltip.hover title="Разрешить редактирование" v-model="disableForm"></b-form-checkbox>
                <b-button size="sm" variant="success" @click="ok()">Сохранить</b-button>
                <b-button size="sm" variant="danger" @click="cancel()">Назад</b-button>
            </template>
            <b-container>
                <b-row class="modal-field" v-for="field in userEnterpriseModalFields" :key="field.key">
                    <b-col sm="4">
                        <label>{{ field.label }}</label>
                    </b-col>
                    <b-col sm="8">
                        <b-form-input 
                        size="sm"
                        :type="field.type" 
                        v-model="selectedEnterprise[field.key]"
                        :disabled="!disableForm"
                        ></b-form-input>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>

        <b-modal
            id="user-enterprise-create"
            @ok="createEnterpriseModelClick"
            @show="showCreateEnterpriseModal"
            title="Создание предприятия"
            :no-enforce-focus="true">
            <template #modal-footer="{ ok, cancel}">
                <b-form-checkbox switch v-b-tooltip.hover title="Разрешить редактирование" v-model="disableForm"></b-form-checkbox>
                <b-button size="sm" variant="success" @click="ok()">Создать</b-button>
                <b-button size="sm" variant="danger" @click="cancel()">Назад</b-button>
            </template>
            <b-container>
                <b-row class="modal-field" v-for="field in userEnterpriseModalFields" :key="field.key">
                    <b-col sm="4">
                        <label>{{ field.label }}</label>
                    </b-col>
                    <b-col sm="8">
                        <b-form-input 
                        size="sm"
                        :type="field.type" 
                        v-model="selectedEnterprise[field.key]"
                        :disabled="!disableForm"
                        ></b-form-input>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>

        <b-modal
            id="user-enterprise-delete"
            @ok="deleteEnterpriseModalClick"
            title="Удаление предприятия"
            :no-enforce-focus="true">
            <template #modal-footer="{ ok, cancel}">
                <b-button size="sm" variant="danger" @click="ok()">Удалить</b-button>
                <b-button size="sm" variant="primary" @click="cancel()">Отмена</b-button>
            </template>
            Вы точно хотите удалить предприятие?
        </b-modal>

        <b-modal
            id="user-change-password"
            @ok="changePasswordModal"
            title="Изменение пароля"
            :no-enforce-focus="true">
            <template #modal-footer="{ ok, cancel}">
                <b-button size="sm" variant="success" @click="ok()">Изменить</b-button>
                <b-button size="sm" variant="danger" @click="cancel()">Отмена</b-button>
            </template> 
                <b-input-group prepend="Новый пароль">
                    <b-form-input v-model="newPassword"></b-form-input>
                    <b-input-group-append>
                        <b-button v-b-tooltip.hover title="Сгенерировать пароль" variant="outline-success" @click="generatePassword">
                            <b-icon icon="arrow-repeat"></b-icon>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
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
                {key: 'expirationDate', label: 'Дата окончания подписки', thStyle: {width: '130px'}},
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
            userRoles: [],
            userEnterprisesFields:[
                {key: 'mercuryId', label: 'Идентификатор Меркурия'},
                {key: 'name', label: 'Наименование'},
                {key: 'action', label: 'Действия', thStyle: {width: '130px'}}
            ],
            userEnterprises:[],            
            userEnterpriseModalFields: [
                {
                    key: 'mercuryId',
                    type: 'text',
                    label: 'Идентификатор Меркурия'
                }, {
                    key: 'name',
                    type: 'text',
                    label: 'Наименование'
                }
            ],
            selectedEnterpriseId: "",
            selectedEnterprise: {},
            newPassword: ''
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
            console.log(this.selectedUser);
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
        createUser() {
            this.$loaderStart();
            console.log(this.selectedUser);
            Vue.axios.post(this.$baseUrl + '/User', this.selectedUser)
            .then(() => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Пользователь успешно создан.');
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
        getUserEnterprises(userId) {
            this.$loaderStart();
            Vue.axios.get(this.$baseUrl + '/User/' + userId + '/Enterprises')
            .then((response) => {
                this.$loaderEnd();
                this.userEnterprises = response.data.enterprises;
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
        updateEnterprise() {
            this.$loaderStart();
            Vue.axios.put(this.$baseUrl + '/Enterprise/' + this.selectedEnterprise.id, this.selectedEnterprise)
            .then(() => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Предприятие успешно обновлено.');
                this.refreshEnterpriseList(this.selectedEnterprise.userId);
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        createEnterprise() {
            this.$loaderStart();
            Vue.axios.post(this.$baseUrl + '/Enterprise', this.selectedEnterprise)
            .then(() => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Предприятие успешно создано.');
                this.refreshEnterpriseList(this.selectedEnterprise.userId);
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        deleteEnterprise() {
            this.$loaderStart();
            Vue.axios.delete(this.$baseUrl + '/Enterprise/' + this.selectedEnterpriseId)
            .then(() => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Предприятие успешно удалено.');
                this.refreshEnterpriseList(this.selectedUserId);
            }, (error) => {
                this.$loaderEnd();
                console.log(error);
                this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
            })
        },
        changeUserPassword(userId, password) {
            Vue.axios.post(this.$baseUrl + '/User/' + userId + '/ChangePassword', {
                newPassword: password
            })
            .then(() => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Пароль успешно изменён.');
                this.refreshUserList();
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
        openEnterpriseList(userId) {
            this.getUserEnterprises(userId);
        },
        refreshUserList() {
            this.getUserList(this.userListCurrentPage);
        },
        showModal() {
            this.disableForm = false;
        },
        selectEnterprise(enterprise) {
            this.selectedEnterprise = enterprise;
            this.selectedEnterpriseId = enterprise.id;
            this.selectedEnterprise.userId = this.selectedUserId;
        },
        showCreateEnterpriseModal() {
            this.selectedEnterprise = {};
            this.selectedEnterprise.userId = this.selectedUserId;
            this.selectedEnterpriseId = '';
        },
        createEnterpriseModelClick() {
            this.createEnterprise();
        },
        refreshEnterpriseList(userId) {
            this.selectedEnterprise = {};
            this.selectedEnterprise.userId = this.selectedUserId;
            this.selectedEnterpriseId = '';
            this.getUserEnterprises(userId);
        },
        deleteEnterpriseModalClick() {
            this.deleteEnterprise();
        },
        generatePassword() {
            var charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var password = '';
            for(let i=0; i < 10; i++) {
                password += charSet.charAt(Math.floor(Math.random() * charSet.length));
            }
            this.newPassword = password;
        },
        changePasswordClose() {
            this.newPassword = '';
            this.selectedUserId = '';
        },
        openPasswordChange(userId) {
            this.selectedUserId = userId;
        },
        changePasswordModal() {
            this.changeUserPassword(this.selectedUserId, this.newPassword);
        },
        openUserCreate() {
            this.selectedUser = {};
            this.selectedUserId = '';
        },
        userCreateModal() {
            this.createUser();
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
</style>