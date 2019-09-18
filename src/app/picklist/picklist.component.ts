

import { Component, OnInit, ElementRef, AfterContentInit, AfterViewChecked, Input, Output, ContentChildren, QueryList, TemplateRef, EventEmitter, ViewChild, Directive } from '@angular/core';
import { ObjectUtils } from '../utils/objectutils';
import { FilterUtils } from '../utils/filterutils';
import { DomHandler } from '../utils/domhandler';

@Directive({
  selector: '[pTemplate]',
  host: {
  }
})
export class PrimeTemplate {

  @Input() type: string;

  @Input('pTemplate') name: string;

  constructor(public template: TemplateRef<any>) { }

  getType(): string {
    return this.name;
  }
}


@Component({
  selector: 'app-picklist',
  templateUrl: './picklist.component.html',
  styleUrls: ['./picklist.component.css']
})




export class PicklistComponent implements AfterViewChecked, AfterContentInit, OnInit {

  @Input() source: any[];

  @Input() target: any[];

  @Input() sourceHeader: string;

  @Input() targetHeader: string;

  @Input() responsive: boolean;

  @Input() filterBy: string;

  @Input() trackBy: Function = (index: number, item: any) => item;

  @Input() sourceTrackBy: Function;

  @Input() targetTrackBy: Function;

  @Input() showSourceFilter: boolean = true;

  @Input() showTargetFilter: boolean = true;

  @Input() metaKeySelection: boolean = true;

  @Input() dragdrop: boolean;

  @Input() style: any;

  @Input() styleClass: string;

  @Input() sourceStyle: any;

  @Input() targetStyle: any;

  @Input() showSourceControls: boolean = true;

  @Input() showTargetControls: boolean = true;

  @Input() sourceFilterPlaceholder: string;

  @Input() targetFilterPlaceholder: string;

  @Input() disabled: boolean = false;

  @Input() ariaSourceFilterLabel: string;

  @Input() ariaTargetFilterLabel: string;

  @Input() filterMatchMode: string = "contains";

  @Output() onMoveToSource: EventEmitter<any> = new EventEmitter();

  @Output() onMoveAllToSource: EventEmitter<any> = new EventEmitter();

  @Output() onMoveAllToTarget: EventEmitter<any> = new EventEmitter();

  @Output() onMoveToTarget: EventEmitter<any> = new EventEmitter();

  @Output() onSourceReorder: EventEmitter<any> = new EventEmitter();

  @Output() onTargetReorder: EventEmitter<any> = new EventEmitter();

  @Output() onSourceSelect: EventEmitter<any> = new EventEmitter();

  @Output() onTargetSelect: EventEmitter<any> = new EventEmitter();

  @Output() onSourceFilter: EventEmitter<any> = new EventEmitter();

  @Output() onTargetFilter: EventEmitter<any> = new EventEmitter();

  @ViewChild('sourcelist') listViewSourceChild: ElementRef;

  @ViewChild('targetlist') listViewTargetChild: ElementRef;

  @ViewChild('sourceFilter') sourceFilterViewChild: ElementRef;

  @ViewChild('targetFilter') targetFilterViewChild: ElementRef;

  @ContentChildren(PrimeTemplate) templates: QueryList<any>;

  public itemTemplate: TemplateRef<any>;

  public visibleOptionsSource: any[];

  public visibleOptionsTarget: any[];

  selectedItemsSource: any[] = [];

  selectedItemsTarget: any[] = [];

  reorderedListElement: any;

  draggedItemIndexSource: number;

  draggedItemIndexTarget: number;

  dragOverItemIndexSource: number;

  dragOverItemIndexTarget: number;

  dragging: boolean;

  movedUp: boolean;

  movedDown: boolean;

  itemTouched: boolean;

  filterValueSource: string;

  filterValueTarget: string;

  fromListType: number;

  toListType: number;

  onListItemDroppoint: boolean;

  listHighlightTarget: boolean;

  listHighlightSource: boolean;

  emptyMessageSourceTemplate: TemplateRef<any>;

  emptyMessageTargetTemplate: TemplateRef<any>;

  readonly SOURCE_LIST = -1;

  readonly TARGET_LIST = 1;

  constructor(public el: ElementRef) { }

  ngAfterContentInit() {
    // console.log(this.templates);
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'item':
          this.itemTemplate = item.template;
          break;

        case 'emptymessagesource':
          this.emptyMessageSourceTemplate = item.template;
          break;

        case 'emptymessagetarget':
          this.emptyMessageTargetTemplate = item.template;
          break;

        default:
          this.itemTemplate = item.template;
          break;
      }
    });
  }

  ngOnInit() {
  }


  ngAfterViewChecked() {

  }

  onItemClick(event, item: any, selectedItems: any[], callback: EventEmitter<any>) {
    if (this.disabled) {
      return;
    }

    let index = this.findIndexInSelection(item, selectedItems);
    let selected = (index != -1);
    let metaSelection = this.itemTouched ? false : this.metaKeySelection;

    if (metaSelection) {
      let metaKey = (event.metaKey || event.ctrlKey || event.shiftKey);

      if (selected && metaKey) {
        selectedItems.splice(index, 1);
      }
      else {
        if (!metaKey) {
          selectedItems.length = 0;
        }
        selectedItems.push(item);
      }
    }
    else {
      if (selected)
        selectedItems.splice(index, 1);
      else
        selectedItems.push(item);
    }

    callback.emit({ originalEvent: event, items: selectedItems });

    this.itemTouched = false;
  }

  onSourceItemDblClick() {
    if (this.disabled) {
      return;
    }

    this.moveRight();
  }

  onTargetItemDblClick() {
    if (this.disabled) {
      return;
    }

    this.moveLeft();
  }

  onFilter(event: KeyboardEvent, data: any[], listType: number) {
    let query = (<HTMLInputElement>event.target).value.trim().toLowerCase();
    let searchFields = this.filterBy.split(',');

    if (listType === this.SOURCE_LIST) {
      this.filterValueSource = query;
      this.visibleOptionsSource = FilterUtils.filter(data, searchFields, this.filterValueSource, this.filterMatchMode);
      this.onSourceFilter.emit({ query: this.filterValueSource, value: this.visibleOptionsSource });
    }
    else if (listType === this.TARGET_LIST) {
      this.filterValueTarget = query;
      this.visibleOptionsTarget = FilterUtils.filter(data, searchFields, this.filterValueTarget, this.filterMatchMode);
      this.onTargetFilter.emit({ query: this.filterValueTarget, value: this.visibleOptionsTarget });
    }
  }

  isItemVisible(item: any, listType: number): boolean {
    if (listType == this.SOURCE_LIST)
      return this.isVisibleInList(this.visibleOptionsSource, item, this.filterValueSource);
    else
      return this.isVisibleInList(this.visibleOptionsTarget, item, this.filterValueTarget);
  }

  isVisibleInList(data: any[], item: any, filterValue: string): boolean {
    if (filterValue && filterValue.trim().length) {
      for (let i = 0; i < data.length; i++) {
        if (item == data[i]) {
          return true;
        }
      }
    }
    else {
      return true;
    }
  }

  onItemTouchEnd(event) {
    if (this.disabled) {
      return;
    }

    this.itemTouched = true;
  }

  private sortByIndexInList(items: any[], list: any) {
    return items.sort((item1, item2) =>
      this.findIndexInList(item1, list) - this.findIndexInList(item2, list));
  }

  moveUp(listElement, list, selectedItems, callback) {
    if (selectedItems && selectedItems.length) {
      selectedItems = this.sortByIndexInList(selectedItems, list);
      for (let i = 0; i < selectedItems.length; i++) {
        let selectedItem = selectedItems[i];
        let selectedItemIndex: number = this.findIndexInList(selectedItem, list);

        if (selectedItemIndex != 0) {
          let movedItem = list[selectedItemIndex];
          let temp = list[selectedItemIndex - 1];
          list[selectedItemIndex - 1] = movedItem;
          list[selectedItemIndex] = temp;
        }
        else {
          break;
        }
      }

      this.movedUp = true;
      this.reorderedListElement = listElement;
      callback.emit({ items: selectedItems });
    }
  }

  moveTop(listElement, list, selectedItems, callback) {
    if (selectedItems && selectedItems.length) {
      selectedItems = this.sortByIndexInList(selectedItems, list);
      for (let i = 0; i < selectedItems.length; i++) {
        let selectedItem = selectedItems[i];
        let selectedItemIndex: number = this.findIndexInList(selectedItem, list);

        if (selectedItemIndex != 0) {
          let movedItem = list.splice(selectedItemIndex, 1)[0];
          list.unshift(movedItem);
        }
        else {
          break;
        }
      }

      listElement.scrollTop = 0;
      callback.emit({ items: selectedItems });
    }
  }

  moveDown(listElement, list, selectedItems, callback) {
    if (selectedItems && selectedItems.length) {
      selectedItems = this.sortByIndexInList(selectedItems, list);
      for (let i = selectedItems.length - 1; i >= 0; i--) {
        let selectedItem = selectedItems[i];
        let selectedItemIndex: number = this.findIndexInList(selectedItem, list);

        if (selectedItemIndex != (list.length - 1)) {
          let movedItem = list[selectedItemIndex];
          let temp = list[selectedItemIndex + 1];
          list[selectedItemIndex + 1] = movedItem;
          list[selectedItemIndex] = temp;
        }
        else {
          break;
        }
      }

      this.movedDown = true;
      this.reorderedListElement = listElement;
      callback.emit({ items: selectedItems });
    }
  }

  moveBottom(listElement, list, selectedItems, callback) {
    if (selectedItems && selectedItems.length) {
      selectedItems = this.sortByIndexInList(selectedItems, list);
      for (let i = selectedItems.length - 1; i >= 0; i--) {
        let selectedItem = selectedItems[i];
        let selectedItemIndex: number = this.findIndexInList(selectedItem, list);

        if (selectedItemIndex != (list.length - 1)) {
          let movedItem = list.splice(selectedItemIndex, 1)[0];
          list.push(movedItem);
        }
        else {
          break;
        }
      }

      listElement.scrollTop = listElement.scrollHeight;
      callback.emit({ items: selectedItems });
    }
  }

  moveRight() {
    if (this.selectedItemsSource && this.selectedItemsSource.length) {
      for (let i = 0; i < this.selectedItemsSource.length; i++) {
        let selectedItem = this.selectedItemsSource[i];
        if (this.findIndexInList(selectedItem, this.target) == -1) {
          this.target.push(this.source.splice(this.findIndexInList(selectedItem, this.source), 1)[0]);
        }
      }
      this.onMoveToTarget.emit({
        items: this.selectedItemsSource
      });
      this.selectedItemsSource = [];
    }
  }

  moveAllRight() {
    if (this.source) {
      let movedItems = [];

      for (let i = 0; i < this.source.length; i++) {
        if (this.isItemVisible(this.source[i], this.SOURCE_LIST)) {
          let removedItem = this.source.splice(i, 1)[0];
          this.target.push(removedItem);
          movedItems.push(removedItem);
          i--;
        }
      }

      this.onMoveToTarget.emit({
        items: movedItems
      });

      this.onMoveAllToTarget.emit({
        items: movedItems
      });

      this.selectedItemsSource = [];
    }
  }

  moveLeft() {
    if (this.selectedItemsTarget && this.selectedItemsTarget.length) {
      for (let i = 0; i < this.selectedItemsTarget.length; i++) {
        let selectedItem = this.selectedItemsTarget[i];
        if (this.findIndexInList(selectedItem, this.source) == -1) {
          this.source.push(this.target.splice(this.findIndexInList(selectedItem, this.target), 1)[0]);
        }
      }
      this.onMoveToSource.emit({
        items: this.selectedItemsTarget
      });

      this.selectedItemsTarget = [];
    }
  }

  moveAllLeft() {
    if (this.target) {
      let movedItems = [];

      for (let i = 0; i < this.target.length; i++) {
        if (this.isItemVisible(this.target[i], this.TARGET_LIST)) {
          let removedItem = this.target.splice(i, 1)[0];
          this.source.push(removedItem);
          movedItems.push(removedItem);
          i--;
        }
      }

      this.onMoveToSource.emit({
        items: movedItems
      });

      this.onMoveAllToSource.emit({
        items: movedItems
      });

      this.selectedItemsTarget = [];
    }
  }

  isSelected(item: any, selectedItems: any[]) {
    return this.findIndexInSelection(item, selectedItems) != -1;
  }

  findIndexInSelection(item: any, selectedItems: any[]): number {
    return this.findIndexInList(item, selectedItems);
  }

  findIndexInList(item: any, list: any): number {
    let index: number = -1;

    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] == item) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  onDragStart(event: DragEvent, index: number, listType: number) {
    (<HTMLLIElement>event.target).blur();
    this.dragging = true;
    this.fromListType = listType;

    if (listType === this.SOURCE_LIST)
      this.draggedItemIndexSource = index;
    else
      this.draggedItemIndexTarget = index;
  }

  onDragOver(event: DragEvent, index: number, listType: number) {
    if (this.dragging) {
      if (listType == this.SOURCE_LIST) {
        if (this.draggedItemIndexSource !== index && this.draggedItemIndexSource + 1 !== index || (this.fromListType === this.TARGET_LIST)) {
          this.dragOverItemIndexSource = index;
          event.preventDefault();
        }
      }
      else {
        if (this.draggedItemIndexTarget !== index && this.draggedItemIndexTarget + 1 !== index || (this.fromListType === this.SOURCE_LIST)) {
          this.dragOverItemIndexTarget = index;
          event.preventDefault();
        }
      }
      this.onListItemDroppoint = true;
    }
  }

  onDragLeave(event: DragEvent, listType: number) {
    this.dragOverItemIndexSource = null;
    this.dragOverItemIndexTarget = null;
    this.onListItemDroppoint = false;
  }

  onDrop(event: DragEvent, index: number, listType: number) {
    if (this.onListItemDroppoint) {
      if (listType === this.SOURCE_LIST) {
        if (this.fromListType === this.TARGET_LIST) {
          this.insert(this.draggedItemIndexTarget, this.target, index, this.source, this.onMoveToSource);
        }
        else {
          ObjectUtils.reorderArray(this.source, this.draggedItemIndexSource, (this.draggedItemIndexSource > index) ? index : (index === 0) ? 0 : index - 1);
          this.onSourceReorder.emit({ items: this.source[this.draggedItemIndexSource] });
        }

        this.dragOverItemIndexSource = null;
      }
      else {
        if (this.fromListType === this.SOURCE_LIST) {
          this.insert(this.draggedItemIndexSource, this.source, index, this.target, this.onMoveToTarget);
        }
        else {
          ObjectUtils.reorderArray(this.target, this.draggedItemIndexTarget, (this.draggedItemIndexTarget > index) ? index : (index === 0) ? 0 : index - 1);
          this.onTargetReorder.emit({ items: this.target[this.draggedItemIndexTarget] });
        }

        this.dragOverItemIndexTarget = null;
      }

      this.listHighlightTarget = false;
      this.listHighlightSource = false;
      event.preventDefault();
    }
  }

  onDragEnd(event: DragEvent) {
    this.dragging = false;
  }

  onListDrop(event: DragEvent, listType: number) {
    if (!this.onListItemDroppoint) {
      if (listType === this.SOURCE_LIST) {
        if (this.fromListType === this.TARGET_LIST) {
          this.insert(this.draggedItemIndexTarget, this.target, null, this.source, this.onMoveToSource);
        }
      }
      else {
        if (this.fromListType === this.SOURCE_LIST) {
          this.insert(this.draggedItemIndexSource, this.source, null, this.target, this.onMoveToTarget);
        }
      }

      this.listHighlightTarget = false;
      this.listHighlightSource = false;
      event.preventDefault();
    }
  }

  insert(fromIndex, fromList, toIndex, toList, callback) {
    const elementtomove = fromList[fromIndex];

    if (toIndex === null)
      toList.push(fromList.splice(fromIndex, 1)[0]);
    else
      toList.splice(toIndex, 0, fromList.splice(fromIndex, 1)[0]);

    callback.emit({
      items: [elementtomove]
    });
  }

  onListMouseMove(event: MouseEvent, listType: number) {
    if (this.dragging) {
      let moveListType = (listType == 0 ? this.listViewSourceChild : this.listViewTargetChild);
      let offsetY = moveListType.nativeElement.getBoundingClientRect().top + document.body.scrollTop;
      let bottomDiff = (offsetY + moveListType.nativeElement.clientHeight) - event.pageY;
      let topDiff = (event.pageY - offsetY);

      if (bottomDiff < 25 && bottomDiff > 0)
        moveListType.nativeElement.scrollTop += 15;
      else if (topDiff < 25 && topDiff > 0)
        moveListType.nativeElement.scrollTop -= 15;

      if (listType === this.SOURCE_LIST) {
        if (this.fromListType === this.TARGET_LIST)
          this.listHighlightSource = true;
      }
      else {
        if (this.fromListType === this.SOURCE_LIST)
          this.listHighlightTarget = true;
      }

      event.preventDefault();
    }
  }

  onListDragLeave() {
    this.listHighlightTarget = false;
    this.listHighlightSource = false;
  }

  resetFilter() {
    this.visibleOptionsSource = null;
    this.filterValueSource = null;
    this.visibleOptionsTarget = null;
    this.filterValueTarget = null;

    (<HTMLInputElement>this.sourceFilterViewChild.nativeElement).value = '';
    (<HTMLInputElement>this.targetFilterViewChild.nativeElement).value = '';
  }

  onItemKeydown(event: KeyboardEvent, item: any, selectedItems: any[], callback: EventEmitter<any>) {
    let listItem = <HTMLLIElement>event.currentTarget;

    switch (event.which) {
      //down
      case 40:
        var nextItem = this.findNextItem(listItem);
        if (nextItem) {
          nextItem.focus();
        }

        event.preventDefault();
        break;

      //up
      case 38:
        var prevItem = this.findPrevItem(listItem);
        if (prevItem) {
          prevItem.focus();
        }

        event.preventDefault();
        break;

      //enter
      case 13:
        this.onItemClick(event, item, selectedItems, callback);
        event.preventDefault();
        break;
    }
  }

  findNextItem(item) {
    let nextItem = item.nextElementSibling;

    if (nextItem)
      return !DomHandler.hasClass(nextItem, 'ui-picklist-item') || DomHandler.isHidden(nextItem) ? this.findNextItem(nextItem) : nextItem;
    else
      return null;
  }

  findPrevItem(item) {
    let prevItem = item.previousElementSibling;

    if (prevItem)
      return !DomHandler.hasClass(prevItem, 'ui-picklist-item') || DomHandler.isHidden(prevItem) ? this.findPrevItem(prevItem) : prevItem;
    else
      return null;
  }
}
