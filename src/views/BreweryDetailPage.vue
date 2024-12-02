<template>
    <ion-page class="details-page">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>{{ brewery?.name }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="centered-content">
                <template v-if="!dataLoaded">
                    <ion-spinner color="primary" name="circular"></ion-spinner>
                </template>
            
                <template v-if="dataLoaded">
                    <ion-card>
                        <div class="img-container">
                           <img :src="cardBg" /> 
                        </div>
                        <ion-card-header>
                            <ion-card-subtitle>
                                <span class="capitalize">{{ brewery?.brewery_type }}</span> Brewery
                            </ion-card-subtitle>

                            <ion-card-title>
                                {{ brewery?.name }}
                            </ion-card-title>
                        </ion-card-header>

                        <ion-card-content>
                            <ion-grid class="no-padding">
                                <ion-row v-if="brewery?.address_1">
                                    <ion-col> {{ brewery.address_1 }}</ion-col>
                                </ion-row>
                                <ion-row  v-if="brewery?.address_2">
                                    <ion-col> {{ brewery.address_2 }}</ion-col>
                                </ion-row>
                                <ion-row v-if="brewery?.address_3">
                                    <ion-col> {{ brewery.address_3 }}</ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col>
                                        <span v-if="brewery?.city">{{ brewery.city }}, </span>
                                        <span v-if="brewery?.state">{{ brewery.state }}&nbsp;</span>
                                        <span v-if="brewery?.postal_code">{{ brewery.postal_code }} </span>
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-card-content>
                        <ion-buttons v-if="brewery?.website_url" class="ion-padding">
                            <ion-button @click="goTo(brewery.website_url)" fill="outline">
                                Visit Website
                            </ion-button>
                        </ion-buttons>
                    </ion-card>
                </template>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import breweryAPI from '@/api/brewery';
import { BreweryModel, BreweryType } from '@/models/brewery';
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCol, 
    IonContent, 
    IonGrid, 
    IonHeader, 
    IonPage, 
    IonRow, 
    IonTitle, 
    IonToolbar, 
    IonSpinner,
    onIonViewWillEnter,
    onIonViewDidLeave
} from '@ionic/vue';
import { computed, ComputedRef, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';

// hooks
const route = useRoute();

// non reactive vars
const { id } = route.params;

// reactive vars
const dataLoaded: Ref<boolean> = ref(false);
const brewery: Ref<BreweryModel | undefined> = ref();

// computed vars
const cardBg: ComputedRef<string> = computed(() => {
    switch (brewery.value?.brewery_type) {
        case BreweryType.REGIONAL:
            return 'https://thatssotampa.com/wp-content/uploads/2023/08/Brewery_cover-1024x576.webp';
        case BreweryType.LARGE:
            return 'https://www.craftbreweryequipment.com/uploads/zhangyanan/ruanwentupian1000/January-1st-January-31st/beer-equipment-Jan-eightteen-one.jpg';
        case BreweryType.MICRO:
            return 'https://cdn-ddian.nitrocdn.com/EsjHZfmtAUbTiXeHENILHlUqnmTcNOtP/assets/images/optimized/rev-12c7d61/www.micetcraft.com/wp-content/uploads/2023/12/1-3.jpg';
        case BreweryType.PUB:
            return 'https://images.squarespace-cdn.com/content/v1/622fd17d36eae15ad160c07e/1652665254173-FBF9VHVZG27JUXHDCHLL/Ramblers+3+.jpg';
        default:
            return 'https://townsquare.media/site/705/files/2018/06/closed-brewery.jpg';
    }
});

const goTo = (link: string) => {
    window.open(link,'_blank');
}

//lifecycle hook
onIonViewWillEnter(async () => {
    breweryAPI.reset();
    try {
        const response = await breweryAPI.read(id as string);
        brewery.value = response.data;
        dataLoaded.value = true;
    } catch (error) {
        console.error(error);
    }
});

onIonViewDidLeave(() => {
    breweryAPI.reset();
});


</script>

<style scoped lang="scss">
.details-page {
    ion-content {
        ion-spinner {
            width: 20%;
            height: 20%;
        }

        ion-card {
            width: 45%;
            height: 80%;
            .img-container {
                display: flex;
                justify-content: center;
                align-items: center;
                align-content: center;
                overflow-y: hidden;
                height: 40rem;

                img {
                    max-width: inherit;
                    object-fit: cover;
                }
            }

            ion-card-title {
                font-size: 2.5em;
            }

            ion-card-subtitle {
                font-size: 2em;
            }

            ion-grid {
                ion-row {
                    ion-col {
                        font-size: 1.5em;
                    }
                }
            }
        }   
    }
}

</style>