/// <reference types="jquery" />

declare namespace JQueryUI {
  interface CheckboxRadioOptions extends CheckboxRadioEvents, WidgetOptions {
    classes?: { [elementName: string]: string };
    icon?: boolean;
    label?: string;
  }

  interface CheckboxRadioEvent {
    (event: Event, ui: SelectMenuUIParams): void;
  }

  interface CheckboxRadioEvents {
    create?: CheckboxRadioEvent;
    click?: CheckboxRadioEvent;
  }

  interface CheckboxRadio extends Widget, CheckboxRadioOptions {}

  interface ControlGroupOptions extends WidgetOptions {
    direction?: 'horizontal' | 'vertical';
    onlyVisible?: boolean;
    items?: { [itemName: string]: string };
  }
}

interface JQuery {
  checkboxradio(): JQuery;
  checkboxradio(methodName: 'destroy'): JQuery;
  checkboxradio(methodName: 'disable'): JQuery;
  checkboxradio(methodName: 'enable'): JQuery;
  checkboxradio(methodName: 'instance'): any;
  checkboxradio(methodName: 'option'): JQuery;
  checkboxradio(methodName: 'refresh'): JQuery;
  checkboxradio(methodName: 'widget'): JQuery;
  checkboxradio(methodName: string): JQuery;
  checkboxradio(options: JQueryUI.CheckboxRadioOptions): JQuery;
  checkboxradio(optionLiteral: string, optionName: string): any;
  checkboxradio(optionLiteral: string, options: JQueryUI.CheckboxRadioOptions): any;
  checkboxradio(optionLiteral: string, optionName: string, optionValue: any): JQuery;

  controlgroup(): JQuery;
  controlgroup(methodName: string): JQuery;
  controlgroup(options: JQueryUI.ControlGroupOptions): JQuery;
  controlgroup(optionLiteral: string, optionName: string): any;
  controlgroup(optionLiteral: string, options: JQueryUI.ControlGroupOptions): any;
  controlgroup(optionLiteral: string, optionName: string, optionValue: any): JQuery;
}
