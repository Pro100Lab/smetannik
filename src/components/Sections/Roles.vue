<template>
    <div class="section_roles fill-height">
        <v-card-title>Пользователи и роли</v-card-title>
        <v-row style="max-height: 90vh" class="overflow-y-auto">
            <v-col cols="4" >
                <v-data-table
                        caption="Роли"
                        :headers="roles.headers"
                        :items="roles.items"
                        no-data-text="Нет ролей"
                        disable-pagination
                        class="transparent no-footer"
                        :hide-default-footer="true"
                >

                </v-data-table>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="8">
                <v-data-table
                        caption="Пользователи"
                        :headers="users.headers"
                        :items="users.items"
                        no-data-text="Нет пользователей"
                        sort-by="id"

                        :footer-props="{'items-per-page-text': 'Итемов'}"
                        class="transparent"
                        style="max-height: 60vh;"
                >
                <template v-slot:item.role="{ item }">
                    <v-select  return-object
                               style="cursor: pointer"
                            :items="Object.keys(possibleRoles)" v-model="item.role.role" v-on:change="itemChanged(item)">
                    </v-select>
                </template>
                    <template v-slot:item.actions="{}">
                        <v-icon>
                            mdi-pen
                        </v-icon>
                    </template>

                </v-data-table>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import axios from 'axios';
    import {makeUrl} from "../../network/utils";

    export default {
        name: "Roles",
        data: () => {
            return {
                users: {
                    items: [],
                    headers: [{
                        text: 'Ид',
                        value: 'id'
                    }, {
                        text: 'Почта',
                        value: 'email'
                    }, {
                        text: 'Роль',
                        value: 'role'
                    }]
                },
                roles: {
                    items: [],
                    headers: [{
                        text: 'Ид',
                        value: 'id'
                    }, {
                        text: 'Роль',
                        value: 'role'
                    }]
                },
                possibleRoles: {

                }
            }
        },
        methods: {
            itemChanged(item) {
                item.role.id = this.possibleRoles[item.role.role];
                axios.get(makeUrl(`/user/role_user_change/${item.id}/${item.role.id}`, false)).then( () => {
                    this.loadUsers();
                })
            },
            loadUsers() {
                axios.get(makeUrl('/user/role_user/')).then(response => {
                    this.users.items = response.data.results;
                })
            },
            loadRoles() {
                axios.get(makeUrl('/user/role_list')).then(response => {
                    this.roles.items = response.data.results;
                    this.possibleRoles = {};
                    this.roles.items.forEach(item => {
                        this.possibleRoles[item.role] = item.id;
                    })
                    console.log('possible roles: ' + JSON.stringify(this.possibleRoles))
                });
            }
        },
        mounted() {
            this.loadRoles();
            this.loadUsers();
        }
    }
</script>

<style scoped>
    .section_roles {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-content: center;
        background-image: linear-gradient( rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9) ), url("../../assets/backgrounds/roles.png");
        background-position: center;
    }

</style>
