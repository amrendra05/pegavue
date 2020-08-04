/**
 * Helper function to translate Pega string / bool / property reference to desired value.
 * If we receiving a direct string value from Pega, it will be enclosed in quotes.
 * If we recieve a property reference path, we want the actual value of the property.
 * If we receive a number, we want numerical type, not a string.
 * If we receive a bool in string form, we want a bool returned.
 * e.g. "\"I am a sample string\"" yields "I am a sample string"
 *      OR true yields true
 *      OR ".FirstName" yields actual value of FirstName property
 * @param { String / Bool } property - desired property to get value of
 * @return { String / Int / Bool } value of property, depending on contents
 */
import { ReferenceHelper } from '.'

export const getPropertyValue = (property, values) => {
  // If the property is a bool, return it directly
  if (typeof property === "boolean") {
    return property;
  }

  // If the property starts with a " character, then strip the quotes.
  if (property.charAt(0) === '"') {
    return property.replace(/"/g, "");
  }

  // If the property starts with a . character, then convert it to full path and get its value
  if (property.charAt(0) === ".") {
    return values[ReferenceHelper.expandRelativePath(property)];
  }

  // The property format was unhandled, return it directly
  return property;
}
