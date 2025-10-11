<noscript>
	<select name="{$field->getPrefixedId()}" id="{$field->getPrefixedId()}" {if $field->isImmutable()}
		disabled{/if}>
		{if !$field->isRequired()}
			<option>{lang}wcf.global.country.noSelection{/lang}</option>
		{/if}
		{foreach from=$field->getCountries() item='country'}
			<option value="{$country->getCountryCode()}">{$country->getCountryName()}</option>
		{/foreach}
	</select>
</noscript>

<script data-relocate="true">
	require(['Sonlong/CountryFlags/Chooser', 'WoltLabSuite/Core/Dom/Traverse', 'WoltLabSuite/Core/Dom/Util'],
	function({ setup, setCountryCode }, { childByTag }, { identify }) {
		var countries = {
			{implode from=$field->getCountries() item='country'}
			'{$country->getCountryCode()}': {
			countryName: '{$country->getCountryName()|encodeJS}',
			iconPath: '{unsafe:$country->getFilePath()|encodeJS}',
		}
		{/implode}
	};

	setup(
		identify(childByTag(elById('{unsafe:$field->getPrefixedId()|encodeJS}Container'), 'DD')),
		'{unsafe:$field->getPrefixedId()|encodeJS}',
		'{if $field->getValue()}{$field->getValue()}{/if}',
		countries,
		undefined,
		{if !$field->isRequired()}true{else}false{/if}
	)
	});
</script>
