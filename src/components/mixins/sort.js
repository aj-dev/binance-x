export default {
    methods: {
        sortBy(property) {
            if (this.sortProperty === property) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortProperty = property;
            }
        }
    }
};