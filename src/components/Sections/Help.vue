<template>
    <div class="section_help fill-height my-8">
        <v-card class="elevation-0 transparent">
            <v-card-title>
                Руководство
            </v-card-title>
            <v-row class="fill-height">
                <v-col cols="4">
                    <HelpTree></HelpTree>
                </v-col>
                <v-col cols="8" class="overflow-y-auto flex-wrap: nowrap;" style="max-height: 90vh">
                    <HelpView></HelpView>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
    import HelpTree from "../Help/HelpTree";
    import HelpView from "../Help/HelpView";
    export default {
        name: "Help",
        components: {HelpView, HelpTree}
    }
</script>

<style scoped>
    .section_help {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-content: center;
        background-image: linear-gradient( rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9) ), url("../../assets/backgrounds/manual.png");
        background-position: center;
    }
</style>
