export class FilterModel {
  constructor(bloodline) {
    this.bloodline = bloodline;
    this.removeHiddenPeople = false;
    this.fromYear = '';
    this.toYear = '';
    this.textFilters = {};
    this.hiddenPeople = new Set();
    this.alwaysShownPeople = new Set();
    this.filterByFamily = false;
  }
}
