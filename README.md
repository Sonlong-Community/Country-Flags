# Country Flags Plugin

**Note:** This plugin is an extension for WoltLab Suite Core (WSC) version 6.0 and above, primarily intended for developers. It does not provide direct benefits for end users, but offers a collection of country flags for developers to integrate into their own extensions or projects.

This plugin provides a comprehensive collection of country flags in SVG format. The flags are named according to ISO country codes and can be used in various projects.

## Features
- Over 200 country flags as SVG files
- Easy integration into your own projects
- Multilingual support (German, English)

## Usage Examples (WoltLab Suite Core)

The examples below show how to fetch countries and flags in WSC (6.0+) using the `CountryHandler` and render them in templates.

### Fetch all countries in PHP and assign to the template

```php
<?php

use wcf\system\country\CountryHandler;
use wcf\system\WCF;

// e.g., in a controller / action
$handler = CountryHandler::getInstance();

// Array<string, CountryItem>, key is the country code (e.g., "de", "us", ...)
$countries = $handler->getCountries();

// assign to the template
WCF::getTPL()->assign([
	'countries' => $countries,
]);

// now you can iterate in the template (see below)
```

### Render countries in the template (list with flags and names)

```smarty
{* Template example *}
<ul class="country-list">
	{foreach from=$countries key=code item=country}
		<li>
			<img src="{$country->getFilePath()}" alt="{$country->getCountryName()}" width="24" height="16">
			<span>{$country->getCountryName()} ({$code|upper})</span>
		</li>
	{/foreach}
	{if !$countries}
		<li>{lang}wcf.global.noItems{/lang}</li>
	{/if}
	</ul>
```

### Fetch a single country by code

```php
<?php

use wcf\system\country\CountryHandler;

$countryCode = 'de';
$country = CountryHandler::getInstance()->getCountry($countryCode);

if ($country !== null) {
	$name = $country->getCountryName(); // e.g., "Germany" (depends on the active language)
	$flag = $country->getFilePath();    // e.g., "wcf/images/country/flags/de.svg"
} else {
	// unknown code – optional fallback
}
```

Template usage for a single country (if `$country` is assigned):

```smarty
{if $country}
	<img src="{$country->getFilePath()}" alt="{$country->getCountryName()}" width="24" height="16">
	<strong>{$country->getCountryName()}</strong>
{else}
	<em>{lang}wcf.global.unknown{/lang}</em>
{/if}
```

### Dropdown (select) with all countries

```smarty
<select name="countryCode" class="jsCountrySelect">
	{foreach from=$countries key=code item=country}
		<option value="{$code}">{$country->getCountryName()}</option>
	{/foreach}
	{if !$countries}
		<option disabled>{lang}wcf.global.noItems{/lang}</option>
	{/if}
</select>
```

### Available methods

- `CountryHandler::getInstance()->getCountries(): array<string, CountryItem>`
- `CountryHandler::getInstance()->getCountry(string $code): ?CountryItem`
- `CountryItem::getCountryCode(): string`
- `CountryItem::getCountryName(): string` (language-dependent name via language variables `wcf.country.flag.<code>`)
- `CountryItem::getFilePath(): string` (path to the SVG file, e.g., `wcf/images/country/flags/de.svg`)

Notes:
- The data is built by a cache builder from the available SVG files. After adding/removing flags, clear the cache in the ACP under “System → Management → Clear cache”.
- Image paths are relative to the WCF directory (`RELATIVE_WCF_DIR`). In templates you can use the path returned by `getFilePath()` directly in the `src` attribute.

## License

This project is licensed under the MIT License. It allows free use, modification, and distribution, including for commercial purposes. For details, see the included [LICENSE](LICENSE) file.

## Contributing

Pull requests are welcome! Please make sure that new flags are in SVG format and named according to the ISO code.

## Contact

For questions or suggestions: [GitHub Issues](https://github.com/Sonlong-Community/Country-Flags/issues)
