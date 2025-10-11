<?php

namespace formulaone\system\form\builder\field;

use wcf\system\country\CountryHandler;
use wcf\system\country\CountryItem;
use wcf\system\form\builder\field\AbstractFormField;
use wcf\system\form\builder\field\IImmutableFormField;
use wcf\system\form\builder\field\TImmutableFormField;
use wcf\system\form\builder\field\validation\FormFieldValidationError;

/**
 * Implementation of a form field for selecting a country flag.
 *
 * @author Stefan Larisch <Sonlong>, Marco Daries <xDeraiser>
 * @copyright 2002-2025 Sonlong-Community
 * @license MIT License <https://opensource.org/licenses/MIT>
 */
final class CountryFlagFormField extends AbstractFormField implements IImmutableFormField
{
    use TImmutableFormField;

    protected $javaScriptDataHandlerModule = 'Sonlong/CountryFlags/Form/Builder/Field/CountryFlag';
    protected $templateName = 'shared_countryFlagFormField';

    /**
     * Returns an array of country flags.
     * 
     * @return array<string, CountryItem>
     */
    public function getCountries(): array
    {
        return CountryHandler::getInstance()->getCountries();
    }

    #[\Override]
    public function isAvailable(): bool
    {
        return $this->getCountries() !== [];
    }

    #[\Override]
    public function readValue(): static
    {
        if ($this->getDocument()->hasRequestData($this->getPrefixedId())) {
            $this->value = (string) $this->getDocument()->getRequestData($this->getPrefixedId());

            if (!$this->isRequired() && !$this->value) {
                $this->value = null;
            }
        }

        return $this;
    }

    #[\Override]
    public function validate(): void
    {
        if (
            $this->isRequired()
            && ($this->getValue() === null || CountryHandler::getInstance()->getCountry($this->getValue()) === null)
        ) {
            $this->addValidationError(new FormFieldValidationError(
                'invalidValue',
                'wcf.global.form.error.noValidSelection'
            ));
        }
    }
}