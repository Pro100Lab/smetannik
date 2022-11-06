<template>
    <v-card class="d-flex flex-column justify-center align-center fill-height elevation-0 rounded-xl">
        <v-card-text class="text-center " v-if="!uploading">
            Перенесите файл сюда или <a v-on:click="uploadClick">загрузите его</a>
        </v-card-text>
        <div v-else>

            <v-card-text class="mb-0 pb-0">
                {{this.fileRef}}
            </v-card-text>
            <v-card-text class="mt-0 pt-0">
                <a v-on:click="uploadClick">Выбрать другой файл</a>
            </v-card-text>
        </div>
    </v-card>
</template>

<script>
    import {eventBus} from "../../eventBus";

    export default {
        name: "RecognizeLoad",
        components: {},
        data: () => {
            return {
                fileRef: null,
                uploading: false
            }
        },
        methods: {
            uploadClick() {
                eventBus.$emit('estimate-chose-click');
            }
        },
        mounted() {
            eventBus.$on('estimate-file-chosen', fileRef => {
                this.fileRef = fileRef;
                this.uploading = true;
            });
            eventBus.$on('estimete-parsing-end', () => {
                this.fileRef = null;
                this.uploading = false;
            })
        }
    }
</script>

<style scoped>

</style>
