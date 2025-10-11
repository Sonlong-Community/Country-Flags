/**
 * Data handler for a country flag form builder field in an Ajax form.
 *
 * @author Stefan Larisch <Sonlong>, Marco Daries <xDeraiser>
 * @copyright 2002-2025 Sonlong-Community
 * @license MIT License <https://opensource.org/licenses/MIT>
 */

import Value from "WoltLabSuite/Core/Form/Builder/Field/Value"
import { removeChooser } from "../../../Chooser";

class CountryFlag extends Value {
  public destroy(): void {
      removeChooser(this._fieldId);
  }
}

export = CountryFlag;
