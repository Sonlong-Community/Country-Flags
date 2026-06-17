<?php

namespace wcf\system\cache\eager;

use wcf\system\country\CountryItem;

/**
 * Eager cache implementation for country items.
 *
 * @author Stefan Larisch <Sonlong>, Marco Daries <xDeraiser>
 * @copyright 2002-2025 Sonlong-Community
 * @license MIT License <https://opensource.org/licenses/MIT>
 *
 * @extends AbstractEagerCache<array<string, CountryItem>>
 */
final class CountryCache extends AbstractEagerCache
{
    #[\Override]
    protected function getCacheData(): array
    {
        $data = [];

        $flagPath = \sprintf('%s/images/country/flags', RELATIVE_WCF_DIR);
        $countryFlags = \array_map(
            static fn(string $file): string => \pathinfo($file, \PATHINFO_FILENAME),
            \glob(\sprintf('%s/*.svg', $flagPath)) ?: []
        );

        foreach ($countryFlags as $flag) {
            $data[$flag] = new CountryItem($flag);
        }

        return $data;
    }
}
