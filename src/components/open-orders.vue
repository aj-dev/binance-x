<template>
  <div class="mt-3 mx-auto">
    <div class="flex items-center">
      <search v-model="searchQuery"/>
      <refreshBtn
        v-if="dataLoaded"
        :reloading="reloading"
        v-on:callback="getOrders"
        class="ml-auto"
      />
    </div>
    <loader :dataLoaded="dataLoaded"/>
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
          <th class="p-2 text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(order, index) in allOrders"
          :key="order.orderId"
          class="border hover:bg-yellow-100"
          :class="{'bg-gray-100': index % 2 === 1}"
        >
          <td class="p-2">{{order.date}}</td>
          <td class="p-2">{{order.symbol}}</td>
          <td
            class="p-2 title-case"
            :class="{'text-green-700': order.side === 'BUY', 'text-red-700': order.side === 'SELL'}"
          >{{order.side}}</td>
          <td class="p-2">{{order.origQty}}</td>
          <td class="p-2">{{order.price}}</td>
          <transition name="fade" mode="out-in">
            <td class="p-2" :key="order.currentPrice">{{order.currentPrice}}</td>
          </transition>
          <transition name="fade" mode="out-in">
            <td class="font-bold p-2" :key="order.diffPercentage">{{order.diffPercentage}}%</td>
          </transition>
          <td class="p-1 text-center">
            <button
              class="focus:outline-none hover:text-red-400 text-gray-700"
              @click="cancel(order)"
              title="Cancel"
            >
              <svg class="fill-current w-4 h-4">
                <use xlink:href="#cancel"></use>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <modal v-if="showModal" @close="onModalClose">
      <template #header>
        <h3>The following order will be cancelled</h3>
      </template>
      <template #body>
        <dl>
          <div class="flex pb-1">
            <dt class="font-medium pr-1">Date:</dt>
            <dd>{{orderToCancel.date}}</dd>
          </div>
          <div class="flex pb-1">
            <dt class="font-medium pr-1">Pair:</dt>
            <dd>{{orderToCancel.symbol}}</dd>
          </div>
          <div class="flex pb-1">
            <dt class="font-medium pr-1">Side:</dt>
            <dd
              :class="{'text-green-700': orderToCancel.side === 'BUY', 'text-red-700': orderToCancel.side === 'SELL'}"
            >{{orderToCancel.side}}</dd>
          </div>
          <div class="flex pb-1">
            <dt class="font-medium pr-1">Amount:</dt>
            <dd>{{orderToCancel.origQty}}</dd>
          </div>
          <div class="flex pb-1">
            <dt class="font-medium pr-1">Bid/Ask:</dt>
            <dd>{{orderToCancel.price}}</dd>
          </div>
          <div class="flex pb-1">
            <dt class="font-medium pr-1">Current price:</dt>
            <dd>{{orderToCancel.currentPrice}}</dd>
          </div>
          <div class="flex pb-1">
            <dt class="font-medium pr-1">Difference:</dt>
            <dd>{{orderToCancel.diffPercentage}}%</dd>
          </div>
        </dl>
      </template>
    </modal>
  </div>
</template>

<script>
import api from '../services/api';
import refreshBtn from './common/refresh-btn';
import loader from './common/loader';
import search from './common/search';
import modal from './common/modal';
import tableHeader from './common/table-header';
import sortMixin from './mixins/sort';

export default {
    name: 'open-orders',

    components: {
        refreshBtn,
        loader,
        search,
        modal,
        tableHeader
    },

    mixins: [sortMixin],

    data() {
        return {
            orders: [],
            dataLoaded: false,
            reloading: false,
            showModal: false,
            orderToCancel: null,
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
                    label: 'Side',
                    property: 'side'
                },
                {
                    label: 'Amount',
                    property: 'origQty'
                },
                {
                    label: 'Bid/Ask',
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

    computed: {
        // TODO: create separate list for buy and sell orders
        buyOrders() {
            return this.sortOrders(this.orders.filter(order => order.side === 'BUY'));
        },

        sellOrders() {
            return this.sortOrders(this.orders.filter(order => order.side === 'SELL'));
        },

        allOrders() {
            return this.sortOrders(this.orders);
        }
    },

    methods: {
        async getOrders() {
            this.reloading = true;
            this.orders = await api.getPositions();
            this.reloading = false;

            return this.orders;
        },

        updateDiffPercentage(ticker) {
            const matchingOrders = this.orders.filter(({ symbol }) => Boolean(ticker[api.formatPair(symbol)]));

            if (matchingOrders.length) {
                const currentPrice = ticker[api.formatPair(matchingOrders[0].symbol)];

                matchingOrders.forEach(order => {
                    const { diff, diffPercentage } = api.getPriceDifference(order.price, Number(currentPrice));

                    Object.assign(order, { currentPrice, diff, diffPercentage });
                });
            }
        },

        sortOrders(orders) {
            const filteredOrders = this.searchQuery ? orders.filter(order => order.symbol.toUpperCase().startsWith(this.searchQuery.toUpperCase())) : orders;

            return filteredOrders.sort((a, b) => {
                if (this.sortOrder === 'asc') {
                    return a[this.sortProperty] >= b[this.sortProperty] ? 1 : -1;
                }

                return a[this.sortProperty] <= b[this.sortProperty] ? 1 : -1;
            });
        },

        cancel(order) {
            this.orderToCancel = order;
            this.showModal = true;
        },

        onModalClose(shouldCancelOrder) {
            if (shouldCancelOrder) {
                this.cancelOrder();
            } else {
                this.orderToCancel = null;
            }

            this.showModal = false;
        },

        async cancelOrder() {
            const { symbol, orderId } = this.orderToCancel;

            await api.cancelOrder({symbol: api.formatPair(symbol), orderId});

            const index = this.orders.findIndex(order => order.orderId === orderId);

            this.orders.splice(index, 1);
        }
    },

    created() {
        this.getOrders()
            .then(orders => {
                const symbols = orders.map(({ symbol }) => api.formatPair(symbol));

                window.addEventListener(
                    'beforeunload',
                    () => {
                        api.closeTradeDataStream();
                    },
                    false
                );

                api.streamTradeData(symbols, ticker => {
                    this.updateDiffPercentage(ticker);
                });
            })
            .finally(() => {
                this.dataLoaded = true;
            });
    }
};
</script>

<style scoped>
.fade-enter {
  opacity: 0.2;
}

.fade-enter-active {
  animation: fadein 0.2s;
}

.fade-leave {
  opacity: 1;
}

.fade-leave-active {
  animation: fadein 0.2s reverse;
}

@keyframes fadein {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>

