<template>
    <v-card tile class="rounded-xl d-flex flex-column elevation-0 rounded-t-0 pa-4 justify-start align-start">
        <div class="d-flex flex-row justify-space-between align-center pb-4">
            <v-btn class="transparent elevation-0">
                <v-icon>mdi-microsoft-excel</v-icon>
                Выгрузить Excel
            </v-btn>
        </div>
        <v-expansion-panels style="width: 100%" class="transparent">
            <v-expansion-panel class="transparent elevation-0 pa-4" v-for="work of worksList" :key="work.name">
                <v-expansion-panel-header>
                    <v-list-item-title>
                        {{work.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="work.isKey" style="color: darkred">
                        Ключевая работа
                    </v-list-item-subtitle>
                </v-expansion-panel-header>
                <v-expansion-panel-content>

                <v-list-item-subtitle>
                    Цена работы: {{work.price}}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                    Нормативная цена: {{work.recommendPrice}} ( Коэффициент перерасчёта: {{work.recalc}} )
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                    Применен классификатор: {{work.handbook}}
                </v-list-item-subtitle>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>

</template>

<script>
    export default {
        name: "RecognizeView",
        props: ['worksList'],
        data: () => {
            return {
                worksData: [],
            }
        },
        watch: {
            viewData(newData) {
                console.log('new works data: ' + JSON.stringify(newData))
                this.worksData = newData;
            }
        }
    }
</script>

<style scoped>

</style>
