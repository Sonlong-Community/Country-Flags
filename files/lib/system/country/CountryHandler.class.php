<?php

namespace wcf\system\country;

use wcf\system\cache\builder\CountryCacheBuilder;
use wcf\system\SingletonFactory;

/**
 * Handles country-related operations.
 *
 * @author Stefan Larisch <Sonlong>, Marco Daries <xDeraiser>
 * @copyright 2002-2025 Sonlong-Community
 * @license MIT License <https://opensource.org/licenses/MIT>
 */
final class CountryHandler extends SingletonFactory
{
    /**
     * @var array<string, CountryItem>
     */
    protected array $countries = [];

    /**
     * Returns an array of country flags.
     *
     * @return array<string, CountryItem>
     */
    public function getCountries(): array
    {
        return $this->countries;
    }

    /**
     * Returns the name of a country by its code.
     */
    public function getCountry(string $countryCode): ?CountryItem
    {
        return $this->countries[$countryCode] ?? null;
    }

    #[\Override]
    protected function init(): void
    {
        $this->countries = CountryCacheBuilder::getInstance()->getData();

        \uasort($this->countries, static function (CountryItem $a, CountryItem $b) {
            return \strcasecmp($a->getCountryName(), $b->getCountryName());
        });
    }
}
