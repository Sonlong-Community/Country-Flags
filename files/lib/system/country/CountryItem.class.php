<?php

namespace wcf\system\country;

use wcf\system\WCF;

/**
 * Represents a country with code, name, and flag path.
 *
 * @author Stefan Larisch <Sonlong>, Marco Daries <xDeraiser>
 * @copyright 2002-2025 Sonlong-Community
 * @license MIT License <https://opensource.org/licenses/MIT>
 */
final class CountryItem
{
    public function __construct(
        private readonly string $countryCode
    ) {}

    /**
     * Returns the country code.
     */
    public function getCountryCode(): string
    {
        return $this->countryCode;
    }

    /**
     * Returns the name of the country.
     */
    public function getCountryName(): string
    {
        return \Locale::getDisplayRegion(
            \sprintf(
                '-%s',
                \strtoupper($this->countryCode)
            ),
            WCF::getLanguage()->getLocale(),
        );
    }

    /**
     * Returns the file path for the country flag icon.
     */
    public function getFilePath(): string
    {
        return \sprintf(
            '%simages/country/flags/%s.svg',
            RELATIVE_WCF_DIR,
            $this->countryCode
        );
    }
}
