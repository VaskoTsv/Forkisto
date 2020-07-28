import {observable, action} from 'mobx';

export class QuickPeekStore {
    @observable
    isShowModal = false;

    @action
    openModal() {
        this.isShowModal = true;
    }

    @action
    closeModal() {
        this.isShowModal = false;
    }
}

const _quickPeekStore = new QuickPeekStore();
export default _quickPeekStore;
