<template>
    <v-navigation-drawer
            permanent
            ref="drawer"
            style="max-width: 12vw;"
    >
        <v-list>
            <v-list-item link v-on:click="scrollTo('.section__main')">
                <v-list-item-title>
                    SMETANNIK
                </v-list-item-title>
            </v-list-item>
            <v-divider/>

            <v-list-item v-if="isAuthorized" class="d-flex flex-row align-center justify-center px-2">
                <v-list-item-avatar>
                    <v-img src="https://img.championat.com/s/735x490/news/big/o/l/sasha-grej-provela-strim-v-obraze-princessy-lei-iz-zvjozdnyh-vojn_1588866382278634836.jpg"></v-img>
                </v-list-item-avatar>
            </v-list-item>

            <v-list-item link v-if="isAuthorized">
                <v-list-item-content>
                    <v-list-item-title class="text-h6">
                        {{user.login}}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link v-on:click="makeLogInOrOut">
                <v-list-item-icon>
                    <v-icon>
                        {{isAuthorized? 'mdi-account-arrow-left-outline' : 'mdi-account-arrow-right-outline'}}
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                    {{isAuthorized ? 'Выйти' : 'Войти' }}
                </v-list-item-title>
            </v-list-item>

        </v-list>

        <v-divider></v-divider>

        <v-list nav dense>

            <v-list-item link v-on:click="scrollTo('.section__recognize')" v-if="isAuthorized">
                <v-list-item-icon>
                    <v-icon>
                        mdi-text-box-search-outline
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                    Распознать документ
                </v-list-item-title>
            </v-list-item>

            <v-list-item v-if="isAuthorized && user.role > 1" link v-on:click="scrollTo('.section__handbooks')">
                <v-list-item-icon>
                    <v-icon>
                        mdi-bookshelf
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                    Справочники
                </v-list-item-title>
            </v-list-item>

            <v-list-item v-if="isAuthorized && user.role > 2" link v-on:click="scrollTo('.section_roles')">
                <v-list-item-icon>
                    <v-icon>
                        mdi-account
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                    Пользователи
                </v-list-item-title>
            </v-list-item>

            <v-list-item link v-on:click="scrollTo('.section_help')">
                <v-list-item-icon>
                    <v-icon>
                        mdi-help-rhombus-outline
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                    Руководство
                </v-list-item-title>
            </v-list-item>

        </v-list>
        <v-divider></v-divider>
        <v-list-item>
            <v-switch inset v-model="scrollLock" color="green darken 4">
                <template v-slot:label>
                    <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                            <v-list-item-subtitle v-on="on" v-bind="attrs">
                                Блокировка скролла
                            </v-list-item-subtitle>
                    </template>
                        <span>
                        Скролл автоматически блокируется при<br/> переходе через панель навигации
                        </span>
                    </v-tooltip>
                </template>
            </v-switch>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
            <v-list-item-title>
                Текущие задачи
            </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="parsing.length > 0">
            <v-list-item-icon class="mr-2">
                <v-icon color="green darken-4">
                    mdi-clipboard-search-outline
                </v-icon>
            </v-list-item-icon>
            <v-list-item-title>
                Распознавание смет
            </v-list-item-title>
        </v-list-item>
        <div class="d-flex flex-column ma-2" v-for="item of parsing" :key="item">
            <v-list-item-subtitle>
                {{item}}
            </v-list-item-subtitle>
            <v-progress-linear indeterminate color="green">
            </v-progress-linear>
        </div>
        <v-list-item v-if="handbooks.length">
            <v-list-item-icon class="mr-2">
                <v-icon color="green darken-4">
                    mdi-microsoft-excel
                </v-icon>
            </v-list-item-icon>
            <v-list-item-title>
                Загрузка справочников
            </v-list-item-title>
        </v-list-item>
        <div class="d-flex flex-column ma-2" v-for="handbook of handbooks" :key="handbook">
            <v-list-item-subtitle>
                {{handbook}}
            </v-list-item-subtitle>
            <v-progress-linear indeterminate color="green">
            </v-progress-linear>
        </div>
    </v-navigation-drawer>
</template>

<script>
    import {eventBus} from "../eventBus";

    export default {

        name: 'Navigation',
        data: () => {
            return {
                user: null,
                parsing: [],
                handbooks: [],
                scrollLock: false,
            }
        },
        mounted() {
            this.user = this.$user;
            eventBus.$on('estimete-parsing-start', (item) => {
                this.parsing.push(item);
                console.log(this.parsing)
            })
            eventBus.$on('estimate-parsing-end', (item) => {
                this.parsing.splice(this.parsing.indexOf(item), 1);
                console.log(this.parsing)
            })

            eventBus.$on('handbook-loading-start', (item) => {
                this.handbooks.push(item);
                console.log(this.handbooks)
            })
            eventBus.$on('handbook-loading-end', (item) => {
                this.handbooks.splice(this.handbooks.indexOf(item), 1);
                console.log(this.handbooks)
            })

            eventBus.$on('scroll-enabled', () => {
                this.scrollLock = false;
            })

            eventBus.$on('scroll-disabled', () => {
                this.scrollLock = true;
            })
        },
        watch: {
            $user() {
                this.user = this.$user;
            },
            scrollLock(newValue) {
                if (!newValue) {
                    eventBus.$emit('scroll-unlock');
                } else {
                    eventBus.$emit('scroll-lock');
                }
            },
        },
        computed: {
            isAuthorized: function () {
                console.log('compute authorized: ' + (this.$user && this.$user.isAuthorized))
                return this.user && this.user.isAuthorized;
            }
        },
        methods: {
            makeLogInOrOut() {
                if (this.$user.isAuthorized)
                    this.$user.LogOut();
                else
                    eventBus.$emit('wants-login')
            },
            scrollTo(node) {
                eventBus.$emit('wants-scroll', node);
            }
        }
    }
</script>

<style>

</style>
