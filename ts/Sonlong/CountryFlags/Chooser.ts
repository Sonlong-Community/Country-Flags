/**
 * Dropdown country chooser.
 *
 * @author Stefan Larisch <Sonlong>, Marco Daries <xDeraiser>
 * @copyright 2002-2025 Sonlong-Community
 * @license MIT License <https://opensource.org/licenses/MIT>
 */

import { getPhrase } from "WoltLabSuite/Core/Language";
import { hide as hideElement } from "WoltLabSuite/Core/Dom/Util";
import { init as initDropdownSimple } from "WoltLabSuite/Core/Ui/Dropdown/Simple";
import { triggerEvent } from "WoltLabSuite/Core/Core";

const _choosers = new Map<ChooserId, ChooserData>();
const _forms = new WeakMap<HTMLFormElement, ChooserId[]>();

function initElement(
  chooserId: ChooserId,
  element: SelectFieldOrHiddenInput,
  countryCode: string,
  countries: Countries,
  callback: CallbackSelect,
  allowEmptyValue: boolean,
): void {
  let container: HTMLElement;

  const parent = element.parentElement!;
  if (parent.nodeName === "DD") {
    container = document.createElement("div");
    container.className = "dropdown";

    parent.insertAdjacentElement("afterbegin", container);
  } else {
    container = parent;
    container.classList.add("dropdown");
  }

  hideElement(element);

  const dropdownToggle = document.createElement("a");
  dropdownToggle.className = "dropdownToggle boxFlag box24 inputPrefix";
  if (parent.nodeName === "DD") {
    dropdownToggle.classList.add("button");
  }
  container.appendChild(dropdownToggle);

  const dropdownMenu = document.createElement("ul");
  dropdownMenu.className = "dropdownMenu countryFlag";
  dropdownMenu.style.maxHeight = '200px';
  dropdownMenu.style.overflowY = 'auto';
  container.appendChild(dropdownMenu);

  function callbackClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const countryCode = target.dataset.countryCode!;

    const activeItem = dropdownMenu.querySelector(".active");
    if (activeItem !== null) {
      activeItem.classList.remove("active");
    }

    target.classList.add("active");

    select(chooserId, countryCode, target);
  }

  const icon = document.createElement("fa-icon");
  icon.setIcon("caret-down", true);

  Object.entries(countries).forEach(([code, country]) => {
    const listItem = document.createElement("li");
    listItem.className = "boxFlage";
    listItem.addEventListener("click", callbackClick);
    listItem.dataset.countryCode = code;
    dropdownMenu.appendChild(listItem);

    const link = document.createElement("a");
    link.className = "box24";
    link.href = "#";
    link.addEventListener("click", (event) => event.preventDefault());
    listItem.appendChild(link);

    const img = document.createElement("img");
    img.src = country.iconPath;
    img.alt = "";
    img.className = "iconFlag";
    img.height = 16;
    img.width = 24;
    img.loading = "eager";
    link.appendChild(img);

    const span = document.createElement("span");
    span.textContent = country.countryName;
    link.appendChild(span);

    if (code === countryCode) {
      dropdownToggle.innerHTML = link.innerHTML;
      dropdownToggle.append(icon);
    }
  });

  if (allowEmptyValue) {
    const divider = document.createElement("li");
    divider.className = "dropdownDivider";
    dropdownMenu.appendChild(divider);

    const listItem = document.createElement("li");
    listItem.dataset.countryCode = "";
    listItem.addEventListener("click", callbackClick);
    dropdownMenu.appendChild(listItem);

    const link = document.createElement("a");
    link.textContent = getPhrase("formulaone.global.country.noSelection");
    listItem.appendChild(link);

    if (countryCode === "") {
      dropdownToggle.innerHTML = link.innerHTML;
      dropdownToggle.append(icon);
    }
  } else if (countryCode === "") {
    dropdownToggle.innerHTML = "";

    const div = document.createElement("div");
    dropdownToggle.appendChild(div);

    const icon = document.createElement("fa-icon");
    icon.size = 24;
    icon.setIcon("question");
    div.appendChild(icon);

    const span = document.createElement("span");
    span.textContent = getPhrase("formulaone.global.country.noSelection");
    span.append(icon);
    div.appendChild(span);
  }

  initDropdownSimple(dropdownToggle);

  _choosers.set(chooserId, {
    callback,
    dropdownMenu,
    dropdownToggle,
    element,
  });

  // bind to submit event
  const form = element.closest("form") as HTMLFormElement;
  if (form !== null) {
    form.addEventListener("submit", onSubmit);

    let chooserIds = _forms.get(form);
    if (chooserIds === undefined) {
      chooserIds = [];
      _forms.set(form, chooserIds);
    }

    chooserIds.push(chooserId);
  }
}

/**
 * Inserts hidden input fields for each selected country chooser.
 */
function onSubmit(event: Event): void {
  const form = event.currentTarget as HTMLFormElement;
  const elementIds = _forms.get(form)!;

  elementIds.forEach((elementId) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = elementId;
    input.value = getCountryCode(elementId);

    form.appendChild(input);
  });
}

function select(chooserId: ChooserId, countryCode: string, listItem?: HTMLElement): void {
  const chooser = _choosers.get(chooserId)!;

  if (listItem === undefined) {
    listItem = Array.from(chooser.dropdownMenu.children).find((element: HTMLElement) => {
      return element.dataset.countryCode === countryCode;
    }) as HTMLElement;

    if (listItem === undefined) {
      throw new Error(`Country list item for code '${countryCode}' not found.`);
    }
  }

  chooser.element.value = countryCode;
  triggerEvent(chooser.element, "change");

  chooser.dropdownToggle.innerHTML = listItem.children[0].innerHTML;

  const icon = document.createElement("fa-icon");
  icon.setIcon("caret-down", true);
  chooser.dropdownToggle.append(icon);

  _choosers.set(chooserId, chooser);

  // execute callback
  if (typeof chooser.callback === "function") {
    chooser.callback(listItem);
  }
}

/** EXPORT */

/**
 * Return thte chooser for an input field.
 */
export function getChooser(chooserId: ChooserId): ChooserData {
  const chooser = _choosers.get(chooserId);
  if (chooser === undefined) {
    throw new Error(`Country chooser with id '${chooserId}' not found.`);
  }

  return chooser;
}

/**
 * Get the country code for a chooser.
 */
export function getCountryCode(chooserId: ChooserId): string {
  return getChooser(chooserId).element.value;
}

/**
 * Remove a chooser by its id.
 */
export function removeChooser(chooserId: ChooserId): void {
  _choosers.delete(chooserId);
}

export function setCountryCode(chooserId: ChooserId, countryCode: string): void {
  if (_choosers.get(chooserId) === undefined) {
    throw new Error(`Country chooser with id '${chooserId}' not found.`);
  }

  select(chooserId, countryCode);
}

/**
 * Setup a new chooser.
 */
export function setup(
  containerId: string,
  chooserId: ChooserId,
  countryCode: string,
  countries: Countries,
  callback: CallbackSelect,
  allowEmptyValue: boolean,
): void {
  if (_choosers.has(chooserId)) {
    return;
  }

  const container = document.getElementById(containerId);
  if (container === null) {
    throw new Error(`Expected a valid container id, cannot find '${chooserId}'`);
  }

  let element = document.getElementById(chooserId) as SelectFieldOrHiddenInput;
  if (element === null) {
    element = document.createElement("input");
    element.type = "hidden";
    element.id = chooserId;
    element.name = chooserId;
    element.value = countryCode;
    container.appendChild(element);
  }

  initElement(chooserId, element, countryCode, countries, callback, allowEmptyValue);
}

type CallbackSelect = (listItem: HTMLElement) => void;
type ChooserId = string;
type SelectFieldOrHiddenInput = HTMLSelectElement | HTMLInputElement;

interface ChooserData {
  callback: CallbackSelect;
  dropdownMenu: HTMLUListElement;
  dropdownToggle: HTMLAnchorElement;
  element: SelectFieldOrHiddenInput;
}

interface Countries {
  [key: string]: CountryData;
}

interface CountryData {
  countryName: string;
  iconPath: string;
}
