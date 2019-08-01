<template>
  <div class="mt-3 mx-auto">
    <div class="flex items-center">
      <search v-model="searchQuery"/>
      <div class="ml-auto">
        Estimated value:
        <span class="font-bold">{{totalBtcValue | currency('BTC')}}</span>
      </div>
      <div class="ml-auto">
        <input type="checkbox" id="hide-small" v-model="smallBalancesHidden">
        <label for="hide-small" class="pl-2 cursor-pointer">Hide small balances</label>
      </div>
      <refreshBtn
        v-if="dataLoaded"
        v-bind:reloading="reloading"
        v-on:callback="getBalances"
        class="ml-auto"
      />
    </div>
    <loader v-bind:dataLoaded="dataLoaded"/>
    <table class="mt-2 shadow w-full" v-if="dataLoaded">
      <thead>
        <tr class="border bg-blue-100">
          <table-header
            v-for="column in columns"
            :key="column.property"
            :column="column"
            :sortProperty="sortProperty"
            :sortOrder="sortOrder"
            v-on:sort="sortBy"
          />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(balance, index) in sortedBalances"
          :key="balance.asset"
          class="border hover:bg-yellow-100"
          :class="{'bg-gray-100': index % 2 === 1}"
        >
          <td class="p-2">{{balance.asset}}</td>
          <td class="p-2">{{balance.free}}</td>
          <td class="p-2">{{balance.locked}}</td>
          <td class="p-2">{{balance.total}}</td>
          <td class="p-2" :class="{'text-gray-500': !balance.btcValue}">{{balance.btcValue || 'N/A'}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '../services/api';
import refreshBtn from './common/refresh-btn';
import loader from './common/loader';
import search from './common/search';
import tableHeader from './common/table-header';
import sortMixin from './mixins/sort';

export default {
    name: 'portfolio',

    components: {
        refreshBtn,
        loader,
        search,
        tableHeader
    },

    mixins: [sortMixin],

    data() {
        return {
            balances: [],
            totalBtcValue: 0,
            smallBalancesHidden: false,
            reloading: false,
            dataLoaded: false,
            searchQuery: '',
            sortProperty: 'asset',
            sortOrder: 'asc',
            columns: [
                {
                    label: 'Symbol',
                    property: 'asset'
                },
                {
                    label: 'Available',
                    property: 'free'
                },
                {
                    label: 'In order',
                    property: 'locked'
                },
                {
                    label: 'Total',
                    property: 'total'
                },
                {
                    label: 'BTC value',
                    property: 'btcValue'
                }
            ]
        };
    },

    computed: {
        sortedBalances() {
            let balances = this.searchQuery ? this.balances.filter(balance => balance.asset.toUpperCase().startsWith(this.searchQuery.toUpperCase())) : this.balances;

            if (this.smallBalancesHidden) {
                balances = balances.filter(balance => balance.btcValue > api.smallBalanceQuantity);
            }

            return balances.sort((a, b) => {
                if (this.sortOrder === 'asc') {
                    return a[this.sortProperty] >= b[this.sortProperty] ? 1 : -1;
                }

                return a[this.sortProperty] <= b[this.sortProperty] ? 1 : -1;
            });
        }
    },

    methods: {
        async getBalances() {
            this.reloading = true;

            const [balances, tickers] = await Promise.all([
                api.getBalances(),
                api.prices()
            ]);

            this.balances = balances.map(balance => {
                const currenPrice = Number(tickers[`${balance.asset}BTC`]);
                const btcValue = (currenPrice ? currenPrice * balance.total : balance.asset === 'BTC' ? balance.total : 0).toFixed(8);

                return { ...balance, btcValue };
            });
            this.totalBtcValue = this.balances.reduce((accumulator, current) => accumulator + Number(current.btcValue), 0).toFixed(8);
            this.reloading = false;
        }
    },

    created() {
        this.getBalances().finally(() => {
            this.dataLoaded = true;
        });
    }
};
</script>
