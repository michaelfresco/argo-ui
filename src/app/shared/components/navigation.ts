import { History } from 'history';
import * as React from 'react';

export interface NavigationApi {
    goto(path: string, query?: {[name: string]: any}, event?: React.MouseEvent): void;
}

export class NavigationManager implements NavigationApi {

    private history: History;

    constructor(history: History) {
        this.history = history;
    }

    public goto(path: string, query: {[name: string]: any} = {}, event: React.MouseEvent): void {
        if (path.startsWith('.')) {
            path = this.history.location.pathname + path.slice(1);
        }
        const params = new URLSearchParams(this.history.location.search);
        for (const name of Object.keys(query)) {
            const val = query[name];
            params.delete(name);
            if (val !== undefined && val !== null) {
                if (val instanceof Array) {
                    for (const item of val) {
                        params.append(name, item);
                    }
                } else {
                    params.set(name, val);
                }
            }
        }
        const urlQuery = params.toString();
        if (urlQuery !== '') {
            path = `${path}?${urlQuery}`;
        }
        if (event && event.metaKey) {
            window.open(path, '__target');
        } else {
            this.history.push(path);
        }
    }
}
