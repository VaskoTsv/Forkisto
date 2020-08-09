import {observable, action} from 'mobx';
import {toggleBodyScroll} from '../utils.js';

export class QuickPeekStore {
    @observable
    isShowModal = false;

    @action
    openModal() {
        this.isShowModal = true;
        toggleBodyScroll(false);
    }

    @action
    closeModal() {
        this.isShowModal = false;
        toggleBodyScroll(true);
    }
}

const _quickPeekStore = new QuickPeekStore();
export default _quickPeekStore;
