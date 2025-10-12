/**
 * Data handler for a country flag form builder field in an Ajax form.
 *
 * @author Stefan Larisch <Sonlong>, Marco Daries <xDeraiser>
 * @copyright 2002-2025 Sonlong-Community
 * @license MIT License <https://opensource.org/licenses/MIT>
 */
define(["require", "exports", "tslib", "WoltLabSuite/Core/Form/Builder/Field/Value", "../../../Chooser"], function (require, exports, tslib_1, Value_1, Chooser_1) {
    "use strict";
    Value_1 = tslib_1.__importDefault(Value_1);
    class CountryFlag extends Value_1.default {
        destroy() {
            (0, Chooser_1.removeChooser)(this._fieldId);
        }
    }
    return CountryFlag;
});
