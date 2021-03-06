/* */ 
define(['exports', '../utilities'], function (exports, _utilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.data = undefined;
  var data = exports.data = {
    settings: {
      'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
    },
    messages: {
      'isRequired': 'er påkrevd',
      'onValidateCallback': 'ikke gyldig verdi',
      'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
        return 'kan kun inneholde alfanumeriske tegn eller mellomrom';
      },
      'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
        return 'kan kun inneholde alfanumeriske tegn';
      },
      'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
        return 'kan kun inneholde bokstaver';
      },
      'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
        return 'kan kun inneholde bokstaver og mellomrom';
      },
      'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
        return 'skal være mellom ' + _utilities.Utilities.getValue(threshold.minimumLength) + ' og ' + _utilities.Utilities.getValue(threshold.maximumLength) + ' tegn langt';
      },
      'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
        return 'skal være mellom ' + _utilities.Utilities.getValue(threshold.minimumValue) + ' og ' + _utilities.Utilities.getValue(threshold.maximumValue);
      },
      'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
        return 'ikke en gyldig verdi';
      },
      'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
        return 'kan kun inneholde tall';
      },
      'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
        return 'ikke en gyldig e-postadresse';
      },
      'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
        return 'burde være ' + _utilities.Utilities.getValue(threshold.otherValue);
      },
      'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
        return 'kan ikke være ' + _utilities.Utilities.getValue(threshold.otherValue);
      },
      'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'er ikke like ' + _utilities.Utilities.getValue(threshold.otherValueLabel);
      },
      'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'kan ikke være like ' + _utilities.Utilities.getValue(threshold.otherValueLabel);
      },
      'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
        return 'ikke en gyldig verdi';
      },
      'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
        return 'skal være ' + _utilities.Utilities.getValue(threshold) + ' eller høyere';
      },
      'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
        return 'skal være minst ' + _utilities.Utilities.getValue(threshold) + ' tegn langt';
      },
      'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
        return 'skal være større enn ' + _utilities.Utilities.getValue(threshold);
      },
      'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
        return 'skal være ' + _utilities.Utilities.getValue(threshold) + ' eller mindre';
      },
      'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
        return 'kan ikke være lengre enn ' + _utilities.Utilities.getValue(threshold) + ' tegn';
      },
      'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
        return 'skal være mindre enn ' + _utilities.Utilities.getValue(threshold);
      },
      'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
        return 'skal være en tallverdi';
      },
      'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
        return 'kan ikke inneholde mellomrom';
      },
      'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
        return 'ikke en gyldig verdi';
      },
      'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
        return 'ikke en gyldig verdi';
      },
      'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
        return 'skal være en kombinasjon av små bokstaver, store bokstaver, tall og spesialtegn';
      },
      'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
        return 'skal inneholde minst ' + _utilities.Utilities.getValue(threshold) + ' av følgende grupper: små bokstaver, store bokstaver, tall og spesialtegn';
      },
      'URLValidationRule': function URLValidationRule(newValue, threshold) {
        return 'ikke en gyldig URL';
      }
    }
  };
});