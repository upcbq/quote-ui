export const ADA_CONSTANTS = {
  CLASSES: {
    MOUSE_FOCUS: 'mouse-focus',
    KEYBOARD_FOCUS: 'keyboard-focus',
  },
  EVENTS: {
    MOUSEDOWN: 'mousedown',
    KEYDOWN: 'keydown',
    FOCUSIN: 'focusin',
    FOCUSOUT: 'focusout',
  },
  ATTRS: {
    FOCUS_PARENT: 'data-focus-parent',
  },
};

export enum ADA_FOCUS_TYPES {
  MOUSE = 'mouse',
  KEYBOARD = 'keyboard',
}

export class AdaService {
  private lastInput: ADA_FOCUS_TYPES = ADA_FOCUS_TYPES.MOUSE;
  public initialize() {
    document.addEventListener(
      ADA_CONSTANTS.EVENTS.MOUSEDOWN,
      this.handleBodyMouseDown.bind(this)
    );
    document.addEventListener(
      ADA_CONSTANTS.EVENTS.KEYDOWN,
      this.handleBodyKeyDown.bind(this)
    );
    document.addEventListener(
      ADA_CONSTANTS.EVENTS.FOCUSIN,
      this.handleBodyFocusIn.bind(this)
    );
    document.addEventListener(
      ADA_CONSTANTS.EVENTS.FOCUSOUT,
      this.handleBodyFocusOut.bind(this)
    );
  }

  /**
   * @description On a focus in the body add the necessary class to the focused element
   */
  private handleBodyFocusIn(event: Event): void {
    document.body.classList.remove(ADA_CONSTANTS.CLASSES.KEYBOARD_FOCUS);
    document.body.classList.remove(ADA_CONSTANTS.CLASSES.MOUSE_FOCUS);
    document.body.classList.add(`${this.lastInput}-focus`);
    const element = event.target;
    if (element instanceof HTMLElement) {
      let el = element;
      if (
        element.hasAttribute(ADA_CONSTANTS.ATTRS.FOCUS_PARENT) &&
        element.parentElement
      ) {
        el = element.parentElement;
      }
      el.classList.add(`${this.lastInput}-focus`);
    }
  }
  /**
   * @description On a focus out in the body remove the class from the element
   */
  private handleBodyFocusOut(event: Event): void {
    document.body.classList.remove(ADA_CONSTANTS.CLASSES.KEYBOARD_FOCUS);
    document.body.classList.remove(ADA_CONSTANTS.CLASSES.MOUSE_FOCUS);
    document.body.classList.add(`${this.lastInput}-focus`);
    const element = event.target;
    if (element instanceof HTMLElement) {
      let el = element;
      if (
        element.hasAttribute(ADA_CONSTANTS.ATTRS.FOCUS_PARENT) &&
        element.parentElement
      ) {
        el = element.parentElement;
      }
      el.classList.remove(ADA_CONSTANTS.CLASSES.MOUSE_FOCUS);
      el.classList.remove(ADA_CONSTANTS.CLASSES.KEYBOARD_FOCUS);
    }
  }

  /**
   * @description Changes the last used input to mouse on a mousedown event on the body
   */
  private handleBodyMouseDown(): void {
    this.lastInput = ADA_FOCUS_TYPES.MOUSE;
  }
  /**
   * @description Changes the last used input to keyboard on a keydown event on the body
   */
  private handleBodyKeyDown(): void {
    this.lastInput = ADA_FOCUS_TYPES.KEYBOARD;
  }
}

export const adaService = new AdaService();
