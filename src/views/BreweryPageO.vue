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
                <ion-searchbar placeholder="Brewery" :debounce="1500" @ionInput="search($event)"></ion-searchbar>
              </ion-col>
            </ion-row>
    
            <ion-row>
              <ion-col>
                <ion-list>
                  <ion-item 
                    v-for="(brewery, index) in breweries" :key="index" 
                    @click="viewDetails(brewery?.id)" data-testid="brewery">
                    <ion-label>
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

<script lang="ts">
import breweryAPI from '@/api/brewery';
import { BreweryModel } from '@/models/brewery';
import { APIFilters } from '@/types/api.types';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
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
} from '@ionic/vue';
import { caretUpOutline } from 'ionicons/icons';

interface BreweryPageState {
    title: string;
    perPage: number;
    currentPage: number;
    path: string;
    currentType: 'search' | 'browse';
    breweries: BreweryModel[];
    defaultFilters: APIFilters;
    currentFilters?: APIFilters;
}

export default defineComponent({
    name: 'BreweryPageO',
    components: {
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
    },
    ionViewWillEnter() {
        this.getItems('browse',this.defaultFilters);
    },
    ionViewDidLeave() {
        this.reset();
    },
    data () {
        const state: BreweryPageState = {
            title: import.meta.env.VITE_APP_TITLE,
            perPage: 25,
            currentPage: 1,
            path: '',
            currentType: 'browse',
            breweries: [],
            defaultFilters: {
                per_page: 25,
                page: 1
            }
        }
        state.currentFilters = state.defaultFilters;
        return state;
    },
    setup() {
        return {
            caretUpOutline,
            //There is a bug with useIonRouter, it only works with composition API
            router$: useRouter(),
        }
    },
    methods: {
        async getItems(type: 'search' | 'browse', filters: APIFilters, replace: boolean = true, ionInfinite?: HTMLIonInfiniteScrollElement) {
            if(!replace) {
                this.currentPage++;
                filters.page = this.currentPage;
            }
            try {
                let response;
                if(type === 'search') {
                    response = await breweryAPI.search(this.path, filters);
                    this.breweries = (replace && response?.data) ? response.data : this.breweries?.concat(response.data);
                } else {
                    response = await breweryAPI.browse(filters);
                    this.breweries = (replace && response?.data) ? response.data : this.breweries?.concat(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if(ionInfinite) {
                    ionInfinite.complete();
                }
            }
        },
        loadItems(ev: InfiniteScrollCustomEvent) {
            if(this?.currentFilters) {
               this.getItems(this.currentType,this.currentFilters,false,ev.target); 
            }
        },
        search($event: any) {
            const query = $event.target.value;
            this.path = 'search';
            this.currentPage = 1;
            this.currentFilters = {
                per_page: this.perPage,
                page: this.currentPage,
                columns: {
                    query: query
                }
            };
            this.getItems('search',this.currentFilters);
        },
        viewDetails(id: string) {
            this.router$.push(`/brewery/${id}`);
        },
        reset() {
          this.currentPage = 1;
          this.currentType = 'browse';
          this.currentFilters!.page = 1;
          breweryAPI.reset();
          this.breweries = [];
        },
        scrollToTop() {
           (this.$refs as any).contentRef.$el.scrollToTop(500);
        }
    }
});
</script>

<style lang="scss" scoped>
.fixed-button {
    position: fixed;
    bottom: 2em;
    right: 3em;
}
</style>