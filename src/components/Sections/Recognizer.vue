<template>
    <div class="section__recognize fill-height">
        <v-card-title>
            Распознать документ
        </v-card-title>
        <v-sheet class="fill-height overflow-x-hidden overflow-y-auto" color="transparent" style="max-height: 90vh;">
            <v-expansion-panels style="width: 100%" class="transparent mt-4" multiple v-model="expandedPanel">
                <v-expansion-panel :key="1">
                    <v-expansion-panel-header style="background-color: aliceblue">
                        Загрузка сметы
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card class="elevation-0">
                            <div class="d-flex flex-row mx-auto">
                                <v-card-title>
                                    Параметры распознавания
                                </v-card-title>
                                <v-spacer></v-spacer>
                                <v-card-title>
                                    Выбор сметы
                                </v-card-title>
                            </div>
                            <v-row class="mx-auto d-flex flex-row fill-height">
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="6">
                                            <v-progress-linear v-show="tzLoading" indeterminate
                                                               color="green darken 4"
                                            ></v-progress-linear>
                                            <v-combobox
                                                    :error="requiredFieldsNotFilled"
                                                    :error-messages="errMessage"
                                                    label="Шаблон ТЗ"
                                                    v-model="tz"
                                                    :items="tzNames"
                                                    v-on:update:search-input="onChangeTZ"
                                            >

                                            </v-combobox>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-progress-linear v-show="kpgzLoading" indeterminate
                                                               color="green darken 4"
                                            ></v-progress-linear>
                                            <v-combobox :error="requiredFieldsNotFilled"
                                                        :error-messages="errMessage"
                                                        label="КПГЗ"
                                                        :items="kpgzNames"
                                                        v-model="kpgz"
                                                        v-on:update:search-input="onChangeKPGZ"
                                            >
                                            </v-combobox>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mx-auto">
                                        <v-text-field placeholder="Адрес проведения работы"
                                                      v-model="workAddress"></v-text-field>
                                    </v-row>
                                </v-col>
                                <v-col>
                                    <RecognizeLoad :class="loadWindowClass"></RecognizeLoad>
                                </v-col>
                            </v-row>
                            <v-btn class="transparent elevation-0" v-on:click="recognizeEstimate" block>
                                Распознать
                            </v-btn>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel :key="2">
                    <v-expansion-panel-header style="background-color: aliceblue">
                        Найденные работы
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card-text v-if="!hasData" class="text-center">
                            Загрузите смету чтобы просмотреть работы здесь
                        </v-card-text>
                        <RecognizeView style="width: 100%;"
                                       v-if="hasData" :worksList="worksList"></RecognizeView>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-sheet>
        <v-dialog v-model="showUpload" width="500">
            <v-card class="d-flex flex-column align-center">
                <v-card-title>
                    Загрузка файла
                </v-card-title>
                <v-file-input show-size style="width: 80%; margin: 0 auto" label="Выберите файл..." v-model="fileRef">
                </v-file-input>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import RecognizeLoad from "../Recognize/RecognizeLoad";
    import RecognizeView from "../Recognize/RecognizeView";
    import {eventBus} from "../../eventBus";
    import axios from "axios";
    import {makeUrl, makeUrlFile} from "../../network/utils";

    export default {
        name: "Recognizer",
        components: {RecognizeView, RecognizeLoad},

        data: () => {
            return {
                expandedPanel: [1],
                hasData: false,
                showUpload: false,
                uploading: false,
                fileRef: null,
                errMessage: null,

                tz: null,
                tzItems: {},
                tzNames: [],
                tzOptions: {
                    limit: 100,
                    offset: 0,
                    search: null,
                    prevSearch: null,
                },
                tzLoading: false,
                kpgz: null,
                kpgzItems: {},
                kpgzNames: [],
                kpgzOptions: {
                    limit: 100,
                    offset: 0,
                    search: null,
                    prevSearch: null,
                },
                kpgzLoading: false,
                workAddress: null,
                requiredFieldsNotFilled: false,
                loadWindowClass: 'accept',
                worksList: [
                    {
                        name: 'Работы по ремонту кровли',
                        price: 645000,
                        recommendPrice: 516000,
                        recalc: 0.8,
                        handbook: '0001.200.4 Реконструкция исторических объектов',
                        isKey: true
                    },
                    {
                        name: 'Очистка крыши от снега',
                        price: 75000,
                        recommendPrice: 12000,
                        recalc: 6.25,
                        handbook: '0001.118.1 Очистные работы',
                        isKey: false
                    },
                    {
                        name: 'Демонтаж кровли',
                        price: 150000,
                        recommendPrice: 300000,
                        recalc: 0.5,
                        handbook: '0001.121.5 Демонтаж металлоконструкций',
                        isKey: true
                    },
                    {
                        name: 'Работы по ремонту кровли',
                        price: 645000,
                        recommendPrice: 516000,
                        recalc: 0.8,
                        handbook: '0001.200.4 Реконструкция исторических объектов',
                        isKey: true
                    },
                    {
                        name: 'Очистка крыши от снега',
                        price: 75000,
                        recommendPrice: 12000,
                        recalc: 6.25,
                        handbook: '0001.118.1 Очистные работы',
                        isKey: false
                    },
                    {
                        name: 'Демонтаж кровли',
                        price: 150000,
                        recommendPrice: 300000,
                        recalc: 0.5,
                        handbook: '0001.121.5 Демонтаж металлоконструкций',
                        isKey: true
                    }
                ],
            }
        },
        watch: {
            fileRef(newFile) {
                if (newFile) {
                    this.showUpload = false;
                    eventBus.$emit('estimate-file-chosen', newFile.name);
                    this.loadWindowClass = 'accept'
                }
            },
            kpgz(newValue) {
                if (newValue && newValue.length || this.tz && this.tz.length) {
                    this.requiredFieldsNotFilled = false;
                    this.errMessage = null;
                    console.log(!(newValue in this.kpgzItems))

                }
            },
            tz(newValue) {
                if (newValue && newValue.length || this.kpgz && this.kpgz.length) {
                    this.requiredFieldsNotFilled = false;
                    this.errMessage = null;
                    console.log(!(newValue in this.tzItems))
                }
            }
        },
        methods: {
            loadFile() {
                this.uploading = true;
                console.log(this.fileRef);

                let reader = new FileReader();
                reader.readAsArrayBuffer(this.fileRef);
                reader.onload = () => {
                    let dataBlob = new Blob([reader.result])
                    this.hasData = false;
                    let data = new FormData();
                    data.append('type', 'estimate');
                    if (this.tz)
                        data.append('TZ', this.tzItems[this.tz].id);
                    if (this.kpgz)
                        data.append('KPGZ', this.kpgzItems[this.kpgz].id);
                    if (this.workAddress) {
                        data.append('address', this.workAddress);
                    }
                    data.append('file', dataBlob, this.fileRef.name);
                    console.log(dataBlob);
                    eventBus.$emit('estimete-parsing-start', this.fileRef.name);
                    axios.post(makeUrlFile('/load/estimate/'), data, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }).then(() => {
                            eventBus.$emit('estimate-parsing-end', this.fileRef.name);
                            this.fileRef = null;
                            this.hasData = true;
                            this.uploading = false;
                        }
                    ).catch(err => {
                        console.log('Не удалось загрузить документ: ' + err);
                        eventBus.$emit('estimate-parsing-end', this.fileRef.name);
                        this.uploading = false;
                        this.fileRef = null;
                        this.hasData = true;
                    })
                }
            },
            recognizeEstimate() {
                if (this.fileRef && (this.tz || this.kpgz)) {
                    this.loadFile();
                    this.requiredFieldsNotFilled = false;
                }
                if (!(this.tz || this.kpgz)) {
                    this.requiredFieldsNotFilled = true;
                    this.errMessage = 'Не заполнено поле';
                }
                if(!this.fileRef) {
                    this.loadWindowClass = 'deny';
                }
            },
            dropKPGZOptions() {
                this.kpgzOptions = {
                    limit: 100,
                    offset: 0,
                    search: null
                }
            },
            dropTZOptions() {
                this.tzOptions = {
                    limit: 100,
                    offset: 0,
                    search: null
                }
            },
            loadKPGZ() {
                let kpgzNames = [],
                    kpgzItems = {};

                this.kpgzLoading = true;
                axios.get(makeUrl('spgz'), {params: this.kpgzOptions}).then(response => {
                    const items = response.data.results;
                    items.forEach(item => {
                        const key = `${item.name} | ${item.kpgz}`
                        if (!(key in this.kpgzItems)) {
                            kpgzNames.push(key);
                            kpgzItems[key] = item;
                        }
                    })
                    this.kpgzItems = kpgzItems;
                    this.kpgzNames = kpgzNames;
                    this.kpgzLoading = false;
                    if (this.kpgzOptions.search !== this.kpgzOptions.prevSearch && this.kpgzOptions.prevSearch) {
                        this.kpgzOptions.search = this.kpgzOptions.prevSearch;
                        this.loadKPGZ();
                    }
                })
            },
            loadTZ() {
                let tzNames = [],
                    tzItems = {};
                this.tzLoading = true;
                axios.get(makeUrl('tz'), {params: this.tzOptions}).then(response => {
                    const items = response.data.results;
                    items.forEach(item => {
                        const key = `${item.name ? item.name : ''} | ${item.kpgz}`
                        if (!(key in this.tzItems)) {
                            tzNames.push(key);
                            tzItems[key] = item;
                        }
                    })
                    this.tzLoading = false;
                })
                this.tzNames = tzNames;
                this.tzItems = tzItems;
                if (this.tzOptions.search !== this.tzOptions.prevSearch && this.tzOptions.prevSearch) {
                    this.tzOptions.search = this.tzOptions.prevSearch;
                    this.loadTZ();
                }
            },
            onChangeKPGZ(value) {
                if (value && value.length < 3)
                    return;

                if (!value) {
                    this.dropKPGZOptions();
                    this.loadKPGZ();
                }

                if (this.kpgzLoading) {
                    this.kpgzOptions.prevSearch = value;
                    return;
                }

                if (!(value in this.kpgzItems)) {
                    this.kpgzOptions.search = value;
                    this.loadKPGZ();
                }
            },
            onChangeTZ(value) {
                if (value && value.length < 3)
                    return;

                if (!value) {
                    this.dropTZOptions();
                    this.loadTZ();
                }

                if (this.tzLoading) {
                    this.tzOptions.prevSearch = value;
                    return
                }

                if (!(value in this.tzItems)) {

                    this.tzOptions.search = value;
                    this.loadTZ();
                }
            }
        },
        mounted() {
            eventBus.$on('estimate-chose-click', () => {
                this.showUpload = true;
            });

            this.loadTZ();
            this.loadKPGZ();
        }
    }
</script>

<style scoped>
    .section__recognize {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-content: center;
        background-image: linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url("../../assets/backgrounds/recognize.png");
        background-position: center;
    }

    .accept{
        background-color: aliceblue
    }

    .deny {
        background-color: rgba(182, 126, 126, 0.99);
    }
</style>
