/* Helper function to return proper formatted text for various Pega field types
 */
import moment from "moment"

const mISOFormat = "YYYYMMDD[T]HHmmss[.]SSS Z"

const getMomentDateFmtString = (dateFormat) => {
  let sReturnFormat = ""
  switch(dateFormat) {
    case "Date-Short":
      // 1/1/01
    case "DateTime-Short":
      // 1/1/01 1:00 AM
      sReturnFormat = "M/D/YY"
      break
    case "Date-Short-YYYY":
      // 1/1/2001
    case "DateTime-Short-YYYY":
      // 1/1/2001 1:00 AM
    case "DateTime-Custom":
      sReturnFormat = "M/D/YYYY"
      break
    case "Date-Short-Custom":
      // 01/01/01
    case 'DateTime-Short-Custom':
      // 01/01/01 01:00 AM
      sReturnFormat = "MM/DD/YY"
      break
    case "Date-Short-Custom-YYYY":
      // 01/01/2001
    case "DateTime-Short-YYYY-Custom":
      // 01/01/2001 01:00 AM
      sReturnFormat = "L"
      break
    case "Date-Medium":
      // Jan 1, 2001
    case "DateTime-Medium":
      // Jan 1, 2001 1:00:00 AM
      sReturnFormat = "ll"
      break
    case "Date-DayMonthYear-Custom":
      // 01-Jan-2001
    case "DateTime-DayMonthYear-Custom":
      // 01-Jan-2001 1:00:00 AM
      sReturnFormat = "DD-MMM-YYYY"
      break;
    case "Date-Full":
      // Monday, January 1, 2001 (not emitting day of week for now)
    case "DateTime-Full":
      // Monday, January 1, 2001 1:00 AM EDT
      sReturnFormat = "dddd, MMMM D, YYYY"
      break
    case "Date-Long":
      // January 1, 2001
    case "DateTime-Long":
      // January 1, 2001 1:00:00 AM
      sReturnFormat = "MMMM D, YYYY"
      break
    case "Date-ISO-8601":
      // 2001/01/01 y/m/d
    case "DateTime-ISO-8601":
      // 2001/01/01 1:00:00 AM     y/m/d
      sReturnFormat = "YYYY/MM/DD"
      break
    case "Date-Gregorian-1":
      // 01 January, 2001
    case "DateTime-Gregorian-1":
      // 01 January, 2001 1:00:00 AM
      sReturnFormat = "DD MMMM, YYYY"
      break
    case "Date-Gregorian-2":
      // January 01, 2001
    case "DateTime-Gregorian-2":
      // January 01, 2001 1:00:00 AM
      sReturnFormat = "MMMM DD, YYYY"
      break
    case "Date-Gregorian-3":
      // 2001, January 01
      sReturnFormat = "YYYY, MMMM DD"
    break
    
    case "DateTime-Custom":
    default:
      break
  }
  return sReturnFormat
}

const getMomentDateTimeFmtString = (dateTimeFormat) => {
  let sReturnFormat = ""
  switch(dateTimeFormat) {
    case "DateTime-Short":
      // 1/1/01 1:00 AM
      sReturnFormat = "M/D/YY h:mm A"
      break
    case 'DateTime-Short-Custom':
      // 01/01/01 01:00 AM
      sReturnFormat = "MM/DD/YY hh:mm A"
      break
    case "DateTime-Short-YYYY":
      // 1/1/2001 1:00 AM
      sReturnFormat = "M/D/YYYY h:mm A"
      break
    case "DateTime-Short-YYYY-Custom":
      // 01/01/2001 01:00 AM
      sReturnFormat = "M/D/YYYY hh:mm A"
      break
    case "DateTime-Medium":
      // Jan 1, 2001 1:00:00 AM
      sReturnFormat = "MMM D, YYYY h:mm:ss A"
      break
    case "DateTime-Long":
      // January 1, 2001 1:00:00 AM
      sReturnFormat = "MMMM D, YYYY h:mm:ss A"
      break
    case "DateTime-DayMonthYear-Custom":
      // 01-Jan-2001 1:00:00 AM
      sReturnFormat = "DD-MMM-YYYY h:mm:ss A"
      break;
    case "DateTime-Full":
      // Monday, January 1, 2001 1:00 AM EDT
      sReturnFormat = "dddd, MMMM D, YYYY h:mm A Z"
      break
    case "Date-ISO-8601":
      // 2001/01/01 y/m/d
    case "DateTime-ISO-8601":
      // 2001/01/01 1:00:00 AM     y/m/d
      sReturnFormat = "YYYY/MM/DD"
      break
    case "Date-Gregorian-1":
      // 01 January, 2001
    case "DateTime-Gregorian-1":
      // 01 January, 2001 1:00:00 AM
      sReturnFormat = "DD MMMM, YYYY"
      break
    case "Date-Gregorian-2":
      // January 01, 2001
    case "DateTime-Gregorian-2":
      // January 01, 2001 1:00:00 AM
      sReturnFormat = "MMMM DD, YYYY"
      break
    case "Date-Gregorian-3":
      // 2001, January 01
      sReturnFormat = "YYYY, MMMM DD"
      break
    case "DateTime-Custom":
      break
    }
  return sReturnFormat
}

// Date formatting helper
const generateDate = (sVal, dateFmt) => {
    let retVal = sVal
    if( -1 != sVal.indexOf(".")) {
        sVal = moment( sVal.replace("GMT", "+0000"), mISOFormat).format("YYYYMMDD")
        retVal = sVal
    }
    retVal = moment(sVal).format(getMomentDateFmtString(dateFmt))
    return retVal
  }
  
  // DateTime formatting helper
  const generateDateTime = (sVal, dateTimeFmt) => {
    let retVal = sVal
    sVal = sVal.replace("GMT", "+0000")
    switch( dateTimeFmt ) {
      case "DateTime-Frame":
      case "DateTime-Frame-Short":
        // 2 days, 5 hours ago
        retVal = moment(sVal, mISOFormat).fromNow()
        break;
      default:
        retVal = moment(sVal, mISOFormat).format(getMomentDateTimeFmtString(dateTimeFmt))
        break
    }
   return retVal
  }
  
// Url formatting helper
const generateUrl = (sVal) => {
  if( -1 == sVal.indexOf(":") ) {
    // assume http protocol value
    sVal = "http://" + sVal
  }
  return sVal
}

// Text formatting helper
const generateText = (sVal, mode) => {
  if( mode.autoPrepend && mode.autoPrepend.length ) {
    sVal = mode.autoPrepend + sVal
  }
  if( mode.autoAppend && mode.autoAppend.length ) {
    sVal = sVal + mode.autoAppend
  }
  return sVal
}

// Phone number formatting helper
const generatePhoneNumber = (sVal) => {
  let fmtNum = ""
  let locale = navigator.language
  switch( locale ) {
    case "en-US":
    case "es-US":
    case "en-CA":
    case "es-MX":
      // If no special delim chars, then add some
      let pat = new RegExp("[^()-,]*", "g")
      if( pat.test(sVal) ) {
        let fmtNum = ""
        let phoneLen = sVal.length
        if( phoneLen == 11 ) {
          fmtNum = sVal.substring(0,1) + "-"
          sVal = sVal.substring(1);
        }
        if( sVal.length == 10 ) {
          fmtNum += sVal.substring(0,3) + "-" + sVal.substring(3,6) + "-" +sVal.substring(6)
          sVal = fmtNum
        }    
      }
      break
    default:
      break
  }
  return sVal
}

// Currency formatting helper
const generateCurrency = (sVal, mode) => {

  // just mapping a few for now to illustrate how this can be done

  let locale = navigator.language;

  let sCurrency = "USD";
  switch (locale) {
    case "en-US" :
    case "es-US" :
      sCurrency = "USD";
      break;
    case "en-CA" :
    case "fr-CA" :
      sCurrency = "CAD";
      break;
    case "fr-FR":
    case "es-ES":
    case "de-DE":
      sCurrency = "EUR";
      break;
    case "en-GB":
      sCurrency = "GBP";
      break;
  }

  let sDecimal = mode.decimalPlaces;
  let sDisplay = mode.currencySymbol;
  switch (sDisplay) {
    case "currencySymbol":
      sDisplay = "symbol";
      break;
    case "currencyCode":
      sDisplay = "code";
      break;
    case "currencyName":
      sDisplay = "name";
      break;
  }

  let props = {
    style: "currency",
    currency: sCurrency,
    currencyDisplay: sDisplay,
    minimumFractionDigits: sDecimal
  }

  let formatter = new Intl.NumberFormat(locale, props);

  return formatter.format(sVal);
}

// Number formatting helper
const generateNumber = (sVal, mode) => {
  switch (mode.numberSymbol) {
    case "currency" :
      return generateCurrency(sVal, mode);
    case "none" :
      let locale = navigator.language;
      let sDecimal = mode.decimalPlaces;
      return new Intl.NumberFormat(locale, { minimumFractionDigits: sDecimal }).format(sVal);
  }
  return sVal;
}

// TrueFalse formatting helper
const generateTrueFalse = (sVal, mode) => {
  if( sVal === "true") {
    return mode.trueLabel;
  } else {
    return mode.falseLabel;
  }
}

// Main routine to be exported
export const getDispTextValue = (fldVal, mode) => {

  // fldVal will contain the current field value
  // mode will contain the current field's mode object to be inspected for formatting details
  let sVal = fldVal;
  
  if( mode.formatType ) {
    switch( mode.formatType ) {
      case "date":
        sVal = generateDate(sVal, mode.dateFormat)
        break
      case "datetime":
        sVal = generateDateTime(sVal, mode.dateTimeFormat)
        break
      case "number":
        sVal = generateNumber(sVal, mode)
        break
      case "tel":
        sVal = generatePhoneNumber(sVal)
        break
      case "text":
        sVal = generateText(sVal, mode)
        break
      case "truefalse":
        sVal = generateTrueFalse(sVal, mode)
        break
      case "url":
        sVal = generateUrl(sVal)
        break
      case "advancedtext":
        //Not certain how to properly generate for this
      case "none":
      case "email":
        break

    }
  }
  return sVal
}