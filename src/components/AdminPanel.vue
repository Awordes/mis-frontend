<template>
    <div class="admin-tab-panel">
        <b-tabs class="admin-tab-panel-wr" content-class="mt-3" justified pills>            
            <b-tab title="Пользователи" active><UserList/></b-tab>
            <b-tab title="Заявки на регистрацию"><ApplicantList/></b-tab>
        </b-tabs>
    </div>
</template>

<script>
import UserList from './UserList'
import ApplicantList from './ApplicantList'

export default {
    name: 'AdminPanel',
    components: {
        UserList,
        ApplicantList
    }
}
</script>

<style scoped>
.admin-tab-panel {
    position: absolute;
    left: 1%;
    right: 1%;
}

.admin-tab-panel-wr {
    box-shadow: 3px 3px 10px #333;
    position: relative;
    background-color: white;
    margin-top: 20px;
    margin-bottom: 5px;
}
</style>