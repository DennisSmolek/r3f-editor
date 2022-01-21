import { proxy } from 'valito';
import { derive } from 'valtio/utils';

// Core Graph Store that has data binding, history, persisitance
export const dataStore = proxy({ data: {}, meta: {}, editorMeta: {} });

// These two aren't bound so we can create funtionality to connect/disconnect them
export const activeStore = proxy({ data: {}, meta: {}, editorMeta: {} });

//Now the rest are derrived stores of arrayed objects
export const metaStore = derive({
    items: (get) => {
        const meta = get(activeStore).meta;
        return Object.keys(meta).map((key) => meta[key]);
    },
});

// Selected are only the items that have the selected attribute
export const selectedStore = derive({
    items: (get) => get(metaStore.items).filter((item) => item.selected),
});

class metaItem {
    editableProps: Array<string> = [];
    selected: Boolean = false;
    type: string;
    uuid: string = '';
}

class metaGraph {
    items: Array<metaItem>;
    activeToolProps = {};

    constructor(sourceStore) {
        this.items = Object.values(sourceStore.meta);
    }

    get selected() {
        return this.items.filter((item) => item.selected);
    }
}

const activeStore = proxy({});
const metaStore = proxy(metaGraph(activeStore));
