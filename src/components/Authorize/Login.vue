<template>
    <v-card>
        <v-form class="ma-4">
            <v-text-field label="Логин" v-model="login" :error-messages="loginErrors"></v-text-field>
            <v-text-field label="Пароль" v-model="password" :error-messages="passwordErrors"></v-text-field>
        </v-form>
            <v-btn block v-on:click="$user.TryLogIn(login, password)">Логинимся!!!</v-btn>
    </v-card>
</template>

<script>
    import {eventBus} from "../../eventBus";

    export default {
        name: "Login",
        data: () => {
            return {
                login: null,
                loginErrors: [],
                password: null,
                passwordErrors: [],
            }
        },
        mounted() {
            eventBus.$on('auth-errors', errors => {
                console.log(errors)
                this.loginErrors = errors.email;
                this.passwordErrors = errors.password;
            })
        }
    }
</script>

<style scoped>

</style>
