<template>
    <v-sheet color="white"
             style="background-image: linear-gradient( rgba(255, 255, 255, 0.9),
                                                       rgba(255, 255, 255, 0.9) );
                    height: 100%; width: 100%"
             class="d-flex flex-column justify-center align-center"
    >
        <p class="stuck__presentation">SMETANNIK</p>
        <p class="stuck__presentation-subtitle">распознавание смет</p>
        <v-progress-circular indeterminate size="150" color="green darken-4"></v-progress-circular>
    </v-sheet>
</template>

<script>
    import {eventBus} from "../eventBus";

    export default {
        name: "Stuck",
        data: () => {
            return {
                user: null
            }
        },
        mounted() {
            this.user = this.$user;
            setTimeout(() => {
                eventBus.$emit('main-loaded')
            }, 2000)
        },
        watch: {
          $user() {
                this.user = this.$user;
            }
        },
        methods: {
            wantsAuthorize() {
                eventBus.$emit('wants-login')
            }
        }
    }
</script>

<style scoped>
.stuck__presentation {
    font-family: Roboto sans-serif;
    font-weight: 100;
    font-size: calc(var(--index) * 5)
}

    .stuck__presentation-subtitle {
        font-family: Roboto sans-serif;
        font-weight: 400;
        color: #2a402a;
        font-size: calc(var(--index) * 2)
    }

</style>
