import _ from 'lodash';
import get from 'lodash.get'
import set from 'lodash.set'

export class JsonData {
    
    private data: any;
    private readonly OriginalData: any;


    constructor(data: any) {
        this.data = data;
    }

    get<T = any>(path: string, defaultValue: T = path as unknown as T): T {
        return _.get(this.data, path, defaultValue)
    }

    set(path: string, value: string): void {
        set(this.data, path, value);
    }

    delete(path: string, value: string) {
        this.delete(path)
    }

    toJson(): any {
        return this.data;
    }
}
