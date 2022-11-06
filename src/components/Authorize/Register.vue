<template>
    <v-card>
        <v-form class="ma-4 ">
            <v-text-field label="Имя пользователя" v-model="login" :error-messages="loginErrors"></v-text-field>
            <v-text-field label="Email" v-model="email" :error-messages="emailErrors"></v-text-field>
            <v-text-field label="Пароль" v-model="password" :error-messages="passwordErrors"></v-text-field>
        </v-form>
        <v-btn block v-on:click="$user.TryRegister(login, email, password)">Регистримся!!!</v-btn>
    </v-card>
</template>

<script>
    import {eventBus} from "../../eventBus";

    export default {
        name: "Register",
        data: () => {
            return {
                email: null,
                emailErrors: [],
                login: null,
                loginErrors: [],
                password: null,
                passwordErrors: []
            }
        },
        mounted() {
            eventBus.$on('reg-errors', errors => {
                console.log(errors)
                this.loginErrors = errors.username;
                this.emailErrors = errors.email;
                this.passwordErrors = errors.password;
            })
        }
    }
</script>

<style scoped>

</style>
