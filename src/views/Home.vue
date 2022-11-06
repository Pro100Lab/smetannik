<template>
    <div class="wrapper">
        <div class="content">
            <div>
                <section class="home__section" id="section_main">
                    <Main></Main>
                </section>

                <v-divider></v-divider>

                <section id="section_recognizer" class="home__section" v-if="user && user.isAuthorized">
                    <Recognizer></Recognizer>
                </section>

                <v-divider></v-divider>

                <section id="section_handbooks" class="home__section" v-if="user && user.isAuthorized && user.role > 1">
                    <HandBooks></HandBooks>
                </section>

                <v-divider></v-divider>
                <section id="section_roles" class="home__section" v-if="user && user.isAuthorized && user.role > 2">
                    <Roles></Roles>
                </section>

                <v-divider></v-divider>

                <section id="section_help" class="home__section">
                    <Help></Help>
                </section>

            </div>
        </div>

        <v-overlay v-show="wantsAuthorize">
            <authorize-form :action="authorizeAction"></authorize-form>
        </v-overlay>
    </div>
</template>

<script>
    import {eventBus} from "../eventBus";
    import AuthorizeForm from "../components/Authorize/AuthorizeForm";
    import Main from "../components/Sections/Main";
    import Recognizer from "../components/Sections/Recognizer";
    import HandBooks from "../components/Sections/HandBooks";
    import Help from "../components/Sections/Help"
    import Roles from "../components/Sections/Roles";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    export default {
        name: 'Home',
        components: {Roles, HandBooks, Recognizer, Main, AuthorizeForm, Help},
        data: () => {
            return {
                wantsAuthorize: false,
                authorizeAction: null,
                user: null,
                authError: null
            }
        },
        watch: {
            $user() {
                this.user = this.$user;
            }
        },
        mounted() {
            this.user = this.$user;
            eventBus.$on('wants-login', () => {
                this.wantsAuthorize = true;
                this.authorizeAction = 'login'
            });
            eventBus.$on('wants-register', () => {
                this.wantsAuthorize = true;
                this.authorizeAction = 'register'
            });
            eventBus.$on('change-mind-authorize', () => {
                this.wantsAuthorize = false;
                ScrollTrigger.refresh();
            })
        }
    }
</script>

<style scoped>
    .home__section {
        width: 70%;
        height: 100vh;
        margin: 0;
        margin-left: 20%;
        padding: 0 0
    }

</style>


