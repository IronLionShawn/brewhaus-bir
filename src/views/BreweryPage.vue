<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content ref="contentRef">
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-searchbar v-model="searchText" placeholder="Brewery" :debounce="750" @ionInput="search($event)"></ion-searchbar>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-list>
              <ion-item v-for="(brewery, index) in breweries" :key="index" @click.prevent="viewDetails(brewery?.id)">
                <ion-label data-testid="brewery">
                  {{ brewery?.name }}
                </ion-label>
              </ion-item>
            </ion-list>
            <ion-infinite-scroll @ionInfinite="loadItems" loading-text="loading" loading-spinner="bubbles">
              <ion-infinite-scroll-content>
              </ion-infinite-scroll-content>
            </ion-infinite-scroll>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-button v-show="breweries.length > 0" @click="scrollToTop" class="fixed-button" shape="round">
      <ion-icon slot="icon-only" :icon="caretUpOutline"></ion-icon>
    </ion-button>
  </ion-page>
</template>

<script setup lang="ts">
import breweryAPI from '@/api/brewery';
import { BreweryModel } from '@/models/brewery';
import { APIFilters } from '@/types/api.types';
import { 
  InfiniteScrollCustomEvent,
  IonButton,
  IonButtons,
  IonCol, 
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInfiniteScroll, 
  IonInfiniteScrollContent, 
  IonItem, 
  IonLabel, 
  IonList, 
  IonMenuButton, 
  IonPage,
  IonRow,
  IonSearchbar,
  IonTitle, 
  IonToolbar, 
  onIonViewDidLeave, 
  onIonViewWillEnter
} from '@ionic/vue';
import { caretUpOutline } from 'ionicons/icons';
import { ref, Ref, useTemplateRef } from 'vue';
import { useIonRouter } from '@ionic/vue';

// env based vars
const title = import.meta.env.VITE_APP_TITLE;

// hooks
const router = useIonRouter();

// vars that don't get updated / aren't used in template
const perPage = 25; 
let currentPage: number = 1;
let path = ''; 
let currentType: 'search' | 'browse' = 'browse'
const defaultFilters: APIFilters = {
  per_page: perPage,
  page: currentPage
};
let currentFilters: APIFilters = defaultFilters;

// reactive variables
const breweries: Ref<BreweryModel[]> = ref([]);
const contentRef = useTemplateRef('contentRef');
const searchText: Ref<string> = ref('');

// navigation methods
const viewDetails = (id: string) => {
  router.push(`/brewery/${id}`);
};

const scrollToTop = () => {
  contentRef.value?.$el.scrollToTop(500);
};

// api request methods
const getItems = async(type: 'search' | 'browse', filters: APIFilters, replace: boolean = true, ionInfinite?: HTMLIonInfiniteScrollElement) => {
  if(!replace) {
    currentPage++;
    filters.page = currentPage;
  }
  try {
    let response;
    if(type === 'search') {
      response = await breweryAPI.search(path, filters);
      breweries.value = (replace && response?.data) ? response.data : breweries.value?.concat(response.data);
    } else {
      response = await breweryAPI.browse(filters);
      breweries.value = (replace && response?.data) ? response.data : breweries.value?.concat(response.data);
    }
  } catch (error) {
    console.error(error);
  } finally {
    if(ionInfinite) {
      ionInfinite.complete();
    }
  }
};

const loadItems = async (ev: InfiniteScrollCustomEvent) => {
  getItems(currentType,currentFilters,false,ev.target);
};

const search = async ($event: any) => {
  const query = $event.target.value;
  path = 'search';
  currentPage = 1;
  currentFilters = {
    per_page: perPage,
    page: currentPage,
    columns: {
      query: query
    }
  };
  getItems('search',currentFilters);
};

// component reset and lifecycle hooks
const reset = () => {
  currentPage = 1;
  currentType = 'browse';
  currentFilters.page = 1;
  breweryAPI.reset();
  breweries.value = [];
  searchText.value = '';
}

onIonViewWillEnter(async () => {  
  getItems('browse',currentFilters);
});

onIonViewDidLeave(() => {
  reset();
});

</script>

<style scoped>
.fixed-button {
  position: fixed;
  bottom: 2em;
  right: 3em;
}
</style>
