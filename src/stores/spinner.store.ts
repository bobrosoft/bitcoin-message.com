import {action, observable} from 'mobx';

export class SpinnerStore {
  @observable isShown: boolean = false;

  /**
   * Sets show/hide state of the spinner
   * @param {boolean} newState
   */
  @action setShownState(newState: boolean) {
    this.isShown = newState;
  }
}