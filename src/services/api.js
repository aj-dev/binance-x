import Binance from 'binance-api-node';
import store from './store';

const credentials = store.state.credentials || {};

const binanceApi = Binance({
    apiKey: credentials.key,
    apiSecret: credentials.secret
});

let closeWS;

export default Object.assign({
    smallBalanceQuantity: 0.001,

    formatPair(pair, withHyphen = false) {
        return withHyphen ? /([A-Z]+)(BTC)/.exec(pair).slice(1).join('-') : pair.replace('-', '');
    },

    getProfit(entryPrice, currentPrice) {
        const profit = currentPrice - entryPrice;
        const profitPercentage = ((profit / entryPrice) * 100).toFixed(2);

        return { profit, profitPercentage };
    },

    getPriceDifference(price, currentPrice) {
        const diff = currentPrice - price;
        const diffPercentage = Number((Math.abs(diff) / price * 100).toFixed(2));

        return { diff, diffPercentage };
    },

    filterSmallBalances(balances) {
        return balances.filter(balance => balance.btcValue > this.smallBalanceQuantity);
    },

    getCurrentPrice(asset, tickers) {
        return Number(tickers[`${asset}BTC`]);
    },

    getBtcValue(balance, currenPrice) {
        return (currenPrice ? currenPrice * balance.total : balance.asset === 'BTC' ? balance.total : 0).toFixed(8);
    },

    async getPositions() {
        const [orders, tickers] = await Promise.all([
            this.getOpenOrders(),
            binanceApi.prices()
        ]);

        return orders.map(order => {
            const currentPrice = Number(tickers[order.symbol]);
            const { diff, diffPercentage } = this.getPriceDifference(order.price, currentPrice);
            const symbol = this.formatPair(order.symbol, true);

            return { ...order, symbol, currentPrice: currentPrice.toFixed(8), diff, diffPercentage };
        });
    },

    async getOpenOrders() {
        const orders = await binanceApi.openOrders();
        const transformedOrders = orders.map(order => ({
            ...order,
            date: (new Date(order.time)).toLocaleString(),
            price: Number(order.price),
            origQty: Number(order.origQty)
        }));

        return transformedOrders;
    },

    /**
     * Gets all account balances. Optionally exclude BTC balance
     * @param {boolean} [excludeBtc]
     */
    async getBalances(excludeBtc = false) {
        const account = await binanceApi.accountInfo();

        return account.balances.filter(balance => {
            const nonZero = Boolean(Number(balance.free) || Number(balance.locked));

            return excludeBtc ? (balance.asset !== 'BTC' && nonZero) : nonZero;
        }).map(balance => {
            const free = Number(balance.free);
            const locked = Number(balance.locked);
            const total = free + locked;

            return { ...balance, free, locked, total };
        }).sort((a, b) => a.asset.localeCompare(b.asset));
    },

    streamTradeData(symbols, callback) {
        closeWS = binanceApi.ws.aggTrades(symbols, ({ price, symbol }) => {
            callback({ [symbol]: price });
        });
    },

    closeTradeDataStream() {
        if (closeWS) {
            closeWS();
        }
    },

    async getMyOrder(tradePair) {
        const trades = await binanceApi.myTrades({ symbol: tradePair, startTime: 1488322800000 });
        const transformedTrades = trades.map(trade => {
            return Object.assign({}, trade, { date: new Date(trade.time).toLocaleString() });
        });
        const buyOrders = transformedTrades
            .filter(order => order.isBuyer)
            .reduce(
                (accumulator, current) => {
                    accumulator.total += Number(current.quoteQty);
                    accumulator.fees += Number(current.commission);

                    return accumulator;
                },
                { total: 0, fees: 0 }
            );
        const sellOrders = transformedTrades
            .filter(order => !order.isBuyer)
            .reduce(
                (accumulator, current) => {
                    accumulator.total += Number(current.quoteQty);
                    accumulator.fees += Number(current.commission);

                    return accumulator;
                },
                { total: 0, fees: 0 }
            );
        const profit = sellOrders.total - buyOrders.total;
        const profitPercentage = Math.round(((profit / buyOrders.total) * 100) * 100) / 100;
        const fees = sellOrders.fees + buyOrders.fees;
        const symbol = /([A-Z]+)(BTC)/.exec(tradePair).slice(1).join('-');

        // console.log(`Symbol: ${symbol}; Profit: ${profit} BTC (${profitPercentage}); Fees: ${fees} BNB`, trades);

        return { symbol, profit, profitPercentage, fees };
    }
}, binanceApi);