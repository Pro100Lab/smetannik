<template>
        <v-card class="elevation-0 section__handbooks fill-height overflow-hidden transparent">
            <v-card-title>
                Справочники классификаторов
            </v-card-title>

            <v-row class="fill-height align-start">
                <v-col cols="5">
                    <HandBooksTree></HandBooksTree>
                </v-col>
                <v-col cols="7">
                    <HandBooksView></HandBooksView>
                </v-col>
            </v-row>

            <v-dialog v-model="isLoadHandbook" width="500" >
                <v-card class="d-flex flex-column align-center">
                    <v-card-title>
                        Загрузка файла
                    </v-card-title>
                    <v-file-input style="width: 80%; margin: 0 auto" label="Выберите файл..." v-model="handBookToLoad">
                    </v-file-input>
                </v-card>
            </v-dialog>

        </v-card>
</template>

<script>
    import HandBooksTree from "../HandBooks/HandBooksTree";
    import HandBooksView from "../HandBooks/HandBooksView";
    import {eventBus} from "../../eventBus";
    import axios from "axios";
    import {makeUrlFile} from "../../network/utils";

    export default {
        name: "HandBooks",
        components: {HandBooksView, HandBooksTree},
        data: () => {
            return {
                isLoadHandbook: false,
                handBookToLoad: null,
                fileRef: null,
            }
        },
        methods: {
            loadHandbook(nodeId) {
                this.isLoadHandbook = false;
                console.log(this.handBookToLoad);

                let reader = new FileReader();
                reader.readAsArrayBuffer(this.handBookToLoad);
                reader.onload = () => {
                    let dataBlob = new Blob([reader.result])

                    let data = new FormData();
                    data.append('id', nodeId.id );
                    data.append('file', dataBlob);
                    console.log(dataBlob);
                    axios.post(makeUrlFile('/load/document/'), data, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }).then(() =>
                        {
                            eventBus.$emit('handbook-loading-end', this.file.name);
                            this.handBookToLoad = null;
                        }
                    ).catch(err=> {
                        console.log('Не удалось загрузить документ: ' + err);
                        eventBus.$emit('handbook-loading-end', this.file.name);
                        this.handBookToLoad = null;
                    })
                }
            }
        },
        watch: {
            handBookToLoad(newValue) {
                console.log('file' + newValue.name);

                if(newValue) {
                    eventBus.$emit('handbook-loading-start', newValue.name);
                    this.isLoadHandbook = false;
                }
            }
        },
        mounted() {
            eventBus.$on('handbook-loading', () => {
                this.isLoadHandbook = true;
            })
            eventBus.$on('handbook-node-ready', nodeId => {
                this.loadHandbook(nodeId);
            })
        }
    }
</script>

<style scoped>
    .section__handbooks {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-content: center;
        background-image: linear-gradient( rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8) ), url("../../assets/backgrounds/handbook.png");
        background-position: center;
        will-change: tranform;
    }

</style>
