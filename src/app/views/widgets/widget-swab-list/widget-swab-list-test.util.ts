import { DebugElement } from '@angular/core';
import { WidgetSwabListComponent } from './widget-swab-list.component';

export async function updateData(component: WidgetSwabListComponent, data: any) {

    component.appList = data;
    component.summarySwab.total = data.length;
    component.summarySwab.done = data.filter((val: any) => val.checkup_result !== null).length;
    component.summarySwab.undone = data.filter((val: any) => val.checkup_result === null).length;
}

export async function inputTextChangeAndEnter(de: DebugElement, idComponent: string, newValue: any) {

  const input: HTMLInputElement = de.nativeElement.querySelector(idComponent);
  input.focus();
  input.value = newValue;
  input.dispatchEvent(new KeyboardEvent('keypress', {
    key: 'enter'
  }));
}

export async function selectBoxChange(de: DebugElement, idComponent: string, key: any) {

  const select: HTMLSelectElement = de.nativeElement.querySelector(idComponent);
  select.selectedIndex = key;
  select.dispatchEvent(new Event('change'));
}
