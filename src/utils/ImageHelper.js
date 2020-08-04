/* Helper function to return the proper class for "iconSource" property values of
 *  "styleClass" and "standardIcon"
 */

export const getImageClass = ( imageSource, imageStyle, imageStandard ) => {
  // imageSource will contain either "styleClass", "standardIcon", "image" or 
  // imageStyle is used when imageSource is "styleClass" and will contain the CSS class
  //   typically "pi pi-<name>"
  // imageStandard is used when imageSource is "standardIcon" and will contain the CSS class
  //    values with "icon-<name>"

  var retClass = ""
  var sIconName = ""
  switch( imageSource ) {
    case "styleclass":
      sIconName = imageStyle.replace(/^pi pi-/g, "")
      switch(sIconName) {
        case "":
          // remap to app specific icon or leverage pega image assets
          break
        default:
          retClass = imageStyle
          break
      }
      break;
    case "standardIcon":
      // linkStandard will contain the icon name (typically "pxIcon<name>")
      sIconName = imageStandard.replace(/^pxI/g, "i")
      switch(imageStandard) {
        // remap to app specific icon basd on this or leverage pega image assets
        case "pxIcon": //blank
          retClass = "pi iconBlank"
          break;
        case "pxIconAttachments":
          retClass = "pi iconAttachment"
          break
        default:
          retClass = "pi " + sIconName
          break
      }
      break
    case "image":
      // linkImage refers to the image relative path to <pega server>/prweb/<accessgrouphash>/
      // return best image for not supported
      retClass = "pi pi-cancel"
      break
    case "none":
      break
    default:
      // return best image for not supported
      retClass = "pi pi-cancel"
      break;
  }
  return retClass
}

