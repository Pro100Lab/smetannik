<template>
    <v-container>
        <v-card-actions class="d-flex flex-row justify-end">
        <v-icon v-on:click="close">
            mdi-close
        </v-icon>
        </v-card-actions>
        <v-tabs v-model="tab">
            <v-tab key="login">
                Авторизация
            </v-tab>
            <v-tab key="register">
                Регистрация
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <v-tab-item key="login">
                <login></login>
            </v-tab-item>
            <v-tab-item key="register">
                <register></register>
            </v-tab-item>
        </v-tabs-items>
    </v-container>
</template>

<script>
    import Login from "./Login";
    import Register from "./Register";
    import {eventBus} from "../../eventBus";

    export default {
        name: "AuthorizeForm",
        components: {Register, Login},
        props: ['action'],
        data: () => {
            return {
                tab: 'login',
                eventBus
            }
        },
        methods: {
          close() {
              this.tab = 'login';
              eventBus.$emit('change-mind-authorize', false);
          }
        },
        mounted() {
            this.tab = this.action;
        }
    }
</script>

<style scoped>

</style>
