<template>
    <div>
        <b-modal
            id="upload-vetis-statement"
            size="lg"
            scrollable 
            title="Прикрепить заявку Ветис.API"
            @ok="uploadVetisStatement"
            :no-enforce-focus="true"
            >
            <template #modal-footer="{ ok, cancel}">
                <b-button size="sm" variant="success" @click="ok()">Создать</b-button>
                <b-button size="sm" variant="danger" @click="cancel()">Назад</b-button>
            </template>
            <b-container fluid>
                <b-row class="modal-field">
                    <b-col>
                        <b-form-file
                            v-model="vetisStatementFile"
                            placeholder="Выберите или перенесите сюда файл..."
                        />
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    name: "UploadVetisStatementForm",
    data() {
        return {
            vetisStatementFile: null
        }
    },
    methods: {
        uploadVetisStatement() {            
            this.$loaderStart();
            let formData = new FormData();
            formData.append('file', this.vetisStatementFile);
            Vue.axios.post(this.$baseUrl + '/User/' + this.$store.state.userId + '/UploadVetisStatement', formData,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(() => {
                this.$loaderEnd();
                this.$createNotification('success', 'Успешно', 'Заявка успешно прикреплена.');
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