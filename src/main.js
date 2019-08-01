import Vue from 'vue';
import app from './app.vue';
import store from './services/store';
import router from './services/router';

function requireAll(r) {
    r.keys().forEach(r);
}

requireAll(require.context('./assets/', true, /\.svg$/));

fetch('img/icons.svg').then(res => res.text()).then(data => {
    document.getElementById('svg-icons').innerHTML = data;
});

Vue.config.productionTip = false;

Vue.filter('currency', (value, symbol) => {
    if (!value) {
        return '';
    }

    const numberFormat = new Intl.NumberFormat(navigator.language, { style: 'currency', currency: symbol, minimumFractionDigits: 8 });

    return numberFormat.format(value);
});

new Vue({
    store,
    router,
    render: h => h(app),
}).$mount('#app')
