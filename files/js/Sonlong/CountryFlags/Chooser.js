/**
 * Dropdown country chooser.
 *
 * @author Stefan Larisch <Sonlong>, Marco Daries <xDeraiser>
 * @copyright 2002-2025 Sonlong-Community
 * @license MIT License <https://opensource.org/licenses/MIT>
 */
define(["require", "exports", "WoltLabSuite/Core/Language", "WoltLabSuite/Core/Dom/Util", "WoltLabSuite/Core/Ui/Dropdown/Simple", "WoltLabSuite/Core/Core"], function (require, exports, Language_1, Util_1, Simple_1, Core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChooser = getChooser;
    exports.getCountryCode = getCountryCode;
    exports.removeChooser = removeChooser;
    exports.setCountryCode = setCountryCode;
    exports.setup = setup;
    const _choosers = new Map();
    const _forms = new WeakMap();
    function initElement(chooserId, element, countryCode, countries, callback, allowEmptyValue) {
        let container;
        const parent = element.parentElement;
        if (parent.nodeName === "DD") {
            container = document.createElement("div");
            container.className = "dropdown";
            parent.insertAdjacentElement("afterbegin", container);
        }
        else {
            container = parent;
            container.classList.add("dropdown");
        }
        (0, Util_1.hide)(element);
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
        function callbackClick(event) {
            const target = event.currentTarget;
            const countryCode = target.dataset.countryCode;
            const activeItem = dropdownMenu.querySelector(".active");
            if (activeItem !== null) {
                activeItem.classList.remove("active");
            }
            target.classList.add("active");
            select(chooserId, countryCode, target);
        }
        const icon = document.createElement("fa-icon");
        icon.setIcon("caret-down", true);
        const fragment = document.createDocumentFragment();
        Object.entries(countries).forEach(([code, country]) => {
            const listItem = document.createElement("li");
            listItem.className = "boxFlage";
            listItem.addEventListener("click", callbackClick);
            listItem.dataset.countryCode = code;
            fragment.appendChild(listItem);
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
            fragment.appendChild(divider);
            const listItem = document.createElement("li");
            listItem.dataset.countryCode = "";
            listItem.addEventListener("click", callbackClick);
            fragment.appendChild(listItem);
            const link = document.createElement("a");
            link.textContent = (0, Language_1.getPhrase)("formulaone.global.country.noSelection");
            listItem.appendChild(link);
            if (countryCode === "") {
                dropdownToggle.innerHTML = link.innerHTML;
                dropdownToggle.append(icon);
            }
        }
        else if (countryCode === "") {
            dropdownToggle.innerHTML = "";
            const div = document.createElement("div");
            dropdownToggle.appendChild(div);
            const icon = document.createElement("fa-icon");
            icon.size = 24;
            icon.setIcon("question");
            div.appendChild(icon);
            const span = document.createElement("span");
            span.textContent = (0, Language_1.getPhrase)("formulaone.global.country.noSelection");
            span.append(icon);
            div.appendChild(span);
        }
        dropdownMenu.appendChild(fragment);
        (0, Simple_1.init)(dropdownToggle);
        _choosers.set(chooserId, {
            callback,
            dropdownMenu,
            dropdownToggle,
            element,
        });
        // bind to submit event
        const form = element.closest("form");
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
    function onSubmit(event) {
        const form = event.currentTarget;
        const elementIds = _forms.get(form);
        elementIds.forEach((elementId) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = elementId;
            input.value = getCountryCode(elementId);
            form.appendChild(input);
        });
    }
    function select(chooserId, countryCode, listItem) {
        const chooser = _choosers.get(chooserId);
        if (listItem === undefined) {
            listItem = Array.from(chooser.dropdownMenu.children).find((element) => {
                return element.dataset.countryCode === countryCode;
            });
            if (listItem === undefined) {
                throw new Error(`Country list item for code '${countryCode}' not found.`);
            }
        }
        chooser.element.value = countryCode;
        (0, Core_1.triggerEvent)(chooser.element, "change");
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
    function getChooser(chooserId) {
        const chooser = _choosers.get(chooserId);
        if (chooser === undefined) {
            throw new Error(`Country chooser with id '${chooserId}' not found.`);
        }
        return chooser;
    }
    /**
     * Get the country code for a chooser.
     */
    function getCountryCode(chooserId) {
        return getChooser(chooserId).element.value;
    }
    /**
     * Remove a chooser by its id.
     */
    function removeChooser(chooserId) {
        _choosers.delete(chooserId);
    }
    function setCountryCode(chooserId, countryCode) {
        if (_choosers.get(chooserId) === undefined) {
            throw new Error(`Country chooser with id '${chooserId}' not found.`);
        }
        select(chooserId, countryCode);
    }
    /**
     * Setup a new chooser.
     */
    function setup(containerId, chooserId, countryCode, countries, callback, allowEmptyValue) {
        if (_choosers.has(chooserId)) {
            return;
        }
        const container = document.getElementById(containerId);
        if (container === null) {
            throw new Error(`Expected a valid container id, cannot find '${chooserId}'`);
        }
        let element = document.getElementById(chooserId);
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
});
