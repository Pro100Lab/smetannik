<template>
    <v-card v-if="selectedNode" >
        <v-data-table
                class="overflow-y-auto overflow-x-hidden"
                :class="expanded ? 'expanded' : 'collapsed'"
                no-data-text="Пусто!"
                :items="data"
                :items-per-page-options="[10, 15]"
                :headers="headers"
                :loading="loading"
                :options.sync="options"
                :server-items-length="totalItems"
                :footer-props="{'items-per-page-all-text': '100', 'items-per-page-text': 'Строк'}"
        >

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>{{selectedNode.name}}</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Поиск"
                            single-line
                            hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn class="transparent elevation-0">
                        <v-icon>mdi-plus</v-icon>
                        Добавить
                    </v-btn>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" v-on:click="expanded = !expanded"
                                   class="transparent elevation-0">
                                <v-icon>
                                    {{expanded ? 'mdi-arrow-collapse-all' : 'mdi-arrow-expand-all'}}
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>
                            {{expanded ? 'Свернуть':'Развернуть'}}
                        </span>
                    </v-tooltip>
                </v-toolbar>
            </template>
            >
        </v-data-table>
    </v-card>
</template>

<script>
    import {eventBus} from "../../eventBus";
    import {makeUrl} from "../../network/utils";
    import axios from 'axios';

    export default {
        name: "HandBooksView",
        props: ['pickedNode'],
        data: () => {
            return {
                wOffset: 0,
                selectedNode: null,
                expanded: false,
                search: null,
                paginationData: {
                    limit: 10,
                    offset: 0,
                    document: null,
                    search: null
                },
                headers: [
                    {
                        text: 'Ид',
                        value: 'id'
                    },
                    {
                        text: 'Наименование работ',
                        value: 'name_works_and_costs'
                    }
                ],
                data: [],
                totalItems: null,
                loading: false,
                options: {},
                searchBefore: null,
            }
        },
        watch: {
            wOffset(newValue) {
                this.paginationData.offset = newValue;
                this.loadData();
            },
            options: {
                handler() {
                    this.paginationData.offset = (this.options.page - 1) * this.options.itemsPerPage;
                    this.paginationData.limit = this.options.itemsPerPage;
                    this.loadData();
                },
                deep: true
            },
            search(newValue) {
                this.searchBefore = newValue;
                if(newValue && newValue.length > 3 && !this.loading) {
                    this.doSearch(newValue);
                }
            }
        },
        methods: {
            doSearch(text) {
                this.paginationData.search = text;
                this.paginationData.offset = 0;
                this.options.page = 1;
                this.loadData();
            },
            loadData() {
                this.loading = true;

                axios.get(makeUrl('/directory'), {params: this.paginationData}).then(response => {
                    this.data = response.data.results;
                    this.totalItems = response.data.count;
                    this.loading = false;
                    if(this.search !== this.searchBefore) {
                        this.doSearch(this.searchBefore)
                    }
                })
            }
        },
        mounted() {
            eventBus.$on('handbook-selected', item => {
                this.selectedNode = item;

                this.paginationData =
                    {document: item.id,
                        limit: 10,
                        offset: 0,
                        search: null
                };
                this.loadData();
            })
        }
    }
</script>

<style scoped>
    .expanded {
        position: fixed;
        width: 80vw;
        height: 90vh;
        right: 0;
        z-index: 100;
    }

    .collapsed {
        max-height: 80vh;
    }
</style>
