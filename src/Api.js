import { sampleProducts } from "./Data"


/* 
 * Methods of this class are used to simulate calls to server. 
 */
class Api {

    getItemUsingID(id) {

        return new Promise((resolve, reject) => {

            setTimeout(() => {
                let res = sampleProducts.filter(x => x.id === id);
                resolve(res.length === 0 ? null : res[0]);

            }, 500)
        })
    }



    static _sort(data, sortval) {
        let items = JSON.parse(JSON.stringify(data));

        if (sortval === "lh") {
            items.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));

        } else if (sortval === "hl") {
            items.sort((a, b) => (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0));

        }

        return items;
    }

    searchData({ category, term, sortValue, popular, usePriceFilter, minPrice, maxPrice }) {


        return new Promise((resolve, reject) => {

            if (typeof minPrice !== 'number') minPrice = parseInt(minPrice, 0);
            if (typeof maxPrice !== 'number') maxPrice = parseInt(maxPrice, 0);

            setTimeout(() => {

                let data = sampleProducts.filter(item => {

                    /* Check price filter first */
                    if (usePriceFilter && (item.price < minPrice || item.price > maxPrice)) {
                        return false;
                    }

                    if (category === "popular") {
                        return item.popular;
                    }

                    if (category !== "All categories" && category !== item.category)
                        return false;

                    if (term && !item.name.toLowerCase().includes(term.toLowerCase()))
                        return false;

                    return true;
                });

                if (sortValue) {
                    data = Api._sort(data, sortValue)
                }

                resolve(data)


            }, 500)
        })


    }
}

export default new Api()
