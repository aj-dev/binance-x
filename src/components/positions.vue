<template>
  <!-- <div class="mt-3 mx-auto">
    <div class="flex items-center">
      <search v-model="searchQuery"/>
      <refreshBtn
        v-if="dataLoaded"
        v-bind:reloading="reloading"
        v-on:callback="getPositions"
        class="ml-auto"
      />
    </div>
    <loader v-bind:dataLoaded="dataLoaded"/>
    <table class="mt-2 shadow w-full" v-if="dataLoaded">
      <thead>
        <tr class="border bg-blue-100">
          <th
            v-for="column in columns"
            :key="column.property"
            @click="sortBy(column.property)"
            class="cursor-pointer hover:bg-blue-200 p-2 text-left"
          >{{column.label}}</th>
          <th class="p-2 text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(position, index) in sortedPositions"
          :key="position.symbol"
          class="border hover:bg-yellow-100"
          :class="{'bg-gray-100': index % 2 === 1}"
        >
          <td class="p-2">{{position.time}}</td>
          <td class="p-2">{{position.symbol}}</td>
          <td class="p-2">{{position.total}}</td>
          <td class="p-2">{{position.price}}</td>
          <transition name="fade" mode="out-in">
            <td class="p-2" :key="position.currentPrice">{{position.currentPrice}}</td>
          </transition>
          <transition name="fade" mode="out-in">
            <td class="font-bold p-2" :key="position.diffPercentage">{{position.diffPercentage}}%</td>
          </transition>
        </tr>
      </tbody>
    </table>
  </div> -->
  <h3 class="mt-8 mb-8 text-center">Coming soon</h3>
</template>

<script>
import api from '../services/api';
import refreshBtn from './common/refresh-btn';
import loader from './common/loader';
import search from './common/search';
import sortMixin from './mixins/sort';

export default {
    name: 'positions',

    components: {
        refreshBtn,
        loader,
        search
    },

    mixins: [sortMixin],

    data() {
        return {
            positions: [],
            dataLoaded: false,
            reloading: false,
            searchQuery: '',
            sortProperty: 'time',
            sortOrder: 'desc',
            columns: [
                {
                    label: 'Date',
                    property: 'time'
                },
                {
                    label: 'Pair',
                    property: 'symbol'
                },
                {
                    label: 'Amount',
                    property: 'total'
                },
                {
                    label: 'Entry price',
                    property: 'price'
                },
                {
                    label: 'Current price',
                    property: 'currentPrice'
                },
                {
                    label: 'Difference',
                    property: 'diffPercentage'
                }
            ]
        };
    },

    created() {
        this.getPositions().finally(() => {
            this.dataLoaded = true;
        });
    },

    computed: {
        sortedPositions() {
            return this.sortPositions(this.positions);
        }
    },

    methods: {
        async getPositions() {
            this.reloading = true;

            // Get account balances excluding small ones (less than 0.001 BTC) and BTC. Also get current tickers
            const [balances, tickers] = await Promise.all([api.getBalances(true), api.prices()]);
            const filteredBalances = api.filterSmallBalances(
                balances.map(balance => {
                    const currentPrice = api.getCurrentPrice(balance.asset, tickers);
                    const btcValue = api.getBtcValue(balance, currentPrice);

                    return { ...balance, btcValue, currentPrice: currentPrice.toFixed(8) };
                })
            );

            // Get all user trades per BTC pair
            const trades = await Promise.all(filteredBalances.map(balance => api.myTrades({ symbol: `${balance.asset}BTC` })));
            const mappedTrades = trades
                .filter(trade => trade.length)
                .flatMap(trade => {
                    const symbol = trade[0].symbol;

                    return { symbol: api.formatPair(symbol, true), trades: trade };
                });

            // Map trades with balances including current price per symbol and BTC value
            const positions = mappedTrades.map(trade => {
                const matchingBalance = filteredBalances.find(balance => balance.asset === trade.symbol.split('-').shift());

                return { ...trade, ...matchingBalance };
            }).reverse();

            // TODO: map trades to open orders

            this.positions = positions;
            this.reloading = false;
        },

        sortPositions(positions) {
            const filteredPositions = this.searchQuery ? positions.filter(position => position.symbol.toUpperCase().startsWith(this.searchQuery.toUpperCase())) : positions;

            return filteredPositions.sort((a, b) => {
                if (this.sortOrder === 'asc') {
                    return a[this.sortProperty] >= b[this.sortProperty] ? 1 : -1;
                }

                return a[this.sortProperty] <= b[this.sortProperty] ? 1 : -1;
            });
        }
    }
};
</script>
