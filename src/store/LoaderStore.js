import {observable, action} from 'mobx';

export class LoaderStore {
    @observable
    isLoading = false;

    @action
    startLoader() {
        this.isLoading = true;
    }

    @action
    stopLoader() {
        this.isLoading = false;
    }
}

const _loaderStore = new LoaderStore();
export default _loaderStore;
