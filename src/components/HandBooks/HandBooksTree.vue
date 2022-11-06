<template>
    <div>
        <div class="d-flex flex-row justify-space-between align-center">
        <v-btn color="transparent" class="elevation-0" v-on:click="addNode()">
            <v-icon>
                mdi-plus
            </v-icon>
            Добавить
        </v-btn>
            <v-icon v-if="!isEditMode" v-on:click="isEditMode = true" small>
                mdi-pencil
            </v-icon>
            <v-icon v-else v-on:click="isEditMode=false" color="green darken-4">
                mdi-checkbox-marked-circle
            </v-icon>
        </div>
        <div style="max-height: 80vh; direction: rtl" class="overflow-y-auto; overflow-x-hidden">
        <v-treeview
                :open-all="true"
                :items="handbooksTree"
                style="direction: ltr"
        >
            <template v-slot:prepend="{ item, open }">
                <v-icon v-if="item.folder">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else>
                    mdi-file-document-outline
                </v-icon>
            </template>
            <template slot="label" slot-scope="{ item }">
                <v-card-text style="cursor: pointer" v-if="item.id !== editItem" v-on:click.self="changeSelectedNode(item)">
                    {{ item.name }}
                </v-card-text>
                <v-text-field v-else v-model="item.name" placeholder="Введите название..."></v-text-field>
            </template>
            <template slot="append" slot-scope="{ item }" v-if="isEditMode || item.id === editItem">
                <v-icon v-if="item.folder && !item.parent" v-on:click="addNode(item.id)">
                    mdi-plus
                </v-icon>
                <v-icon v-if="item.folder" v-on:click="onLoadClicked(item)" small>
                    mdi-tray-arrow-up
                </v-icon>
                <v-icon v-if="editItem !== item.id" v-on:click="editItem=item.id" small>
                    mdi-pencil
                </v-icon>
                <v-icon v-else v-on:click="saveItem(item)" color="green darken-4">
                    mdi-checkbox-marked-circle
                </v-icon>
                <v-icon v-on:click="deleteNode(item.id)" color="red darken-4" small>
                    mdi-delete
                </v-icon>
            </template>
        </v-treeview>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import {makeUrl} from "../../network/utils";
    import {eventBus} from "../../eventBus";

    export default {
        name: "HandBooksTree",
        data: () => {
            return {
                handbooks: {},
                handbooksTree: [],
                editItem: null,
                offset: 1,
                isLoadHandbook: false,
                node: null,
                isEditMode: false,
            }
        },
        watch: {
        },
        methods: {
            changeSelectedNode(node) {
                if (!node.folder) {
                    eventBus.$emit('handbook-selected', node)
                }
            },
            addNode(parent = null) {
                let node = {
                    id: this.offset++,
                    folder: true,
                    children: [],
                    name: null,
                    parent: parent,
                    temp: true
                }

                this.handbooks[node.id] = node;
                if (!parent)
                    this.handbooksTree.push(node);
                else
                    this.handbooks[node.parent].children.push(node);

                this.editItem = node.id;
            },
            deleteNode(id) {
                axios.delete(makeUrl(`/directory_list/delete/${id}`, false)).then(()=> {
                    this.initHandBooks();
                });
            },
            saveItem(item) {
                if(item.temp) {
                    axios.post(makeUrl(`directory_list/`), {
                        parent: item.parent,
                        name: item.name,
                        folder: item.folder
                    }).then(() => {
                        this.initHandBooks();
                        this.editItem=null;
                    })
                } else {
                    axios.put(makeUrl(`directory_list/update/${item.id}`, false), {
                        name: item.name
                    }).then(() => {
                        this.initHandBooks();
                        this.editItem=null;
                    })
                }

            },
            createHandbook(file) {
                axios.post(makeUrl(`directory_list/`), {
                    parent: this.node.id,
                    name: file,
                    folder: false
                }).then((response) => {
                    eventBus.$emit('handbook-node-ready', response.data);
                    this.initHandBooks();
                    this.node=null;
                })
            },
            onLoadClicked(item) {
                this.node = item;
                eventBus.$emit('handbook-loading');
            },
            makeTree(tempHandbooks) {
                let newHandbooks = tempHandbooks,
                    newHandbooksTree = [];

                for(const item of Object.values(tempHandbooks)) {
                    if( (item.parent === null && !item.folder) || (item.parent !== null && !(item.parent in newHandbooks)) )
                        continue

                    if( item.parent === null && item.folder ) {
                        newHandbooksTree.push(item);
                    } else {
                        newHandbooks[item.parent].children.push(item);
                    }
                }
                this.handbooks = newHandbooks;
                this.handbooksTree = newHandbooksTree;
                console.log(newHandbooks);
                console.log(newHandbooksTree);

            },
            initHandBooks() {
                axios.get(makeUrl('directory_list')).then(response=>{
                    const handbooks = response.data;
                    let tempHandbooks = {};
                    this.handbooks = {};
                    handbooks.results.forEach((handbook) => {
                        handbook['children'] = []
                        tempHandbooks[handbook.id] = handbook;
                        this.offset = Math.max(this.offset, handbook.id) + 1;
                    });

                    this.makeTree(tempHandbooks);
                })
            }
        },
        mounted() {
            this.initHandBooks();
            eventBus.$on('handbook-loading-start', file => {
                this.createHandbook(file);
            })
            eventBus.$on('handbook-loading-end', () => {
               this.initHandBooks();
            });
        }
    }
</script>

<style scoped>

</style>
