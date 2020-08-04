/* Within the pega-field template, the intent is to conditionally
 *  wrap the content within a el-tooltip element if a tooltip is present
 */
<template>
  <el-form-item 
    v-if="field.visible" 
    ref="pegaField"
    :label="label" 
    :prop="field.fieldID"
    :required="field.required" 
    :error="validationMessage" 
    class="pega-form-item" 
    >
    <el-tooltip v-if="hasTooltip" :content="tooltip">
      <pega-displaytext
          v-if="field.readOnly"
          :field="field" 
          :value="value">
      </pega-displaytext>
      <component 
          v-else
          :is="fieldType" 
          :field="field" 
          :value="value"
          :handleChange="handleChange">
      </component>
    </el-tooltip>
    <pega-displaytext
        v-if="!hasTooltip && field.readOnly"
        :field="field" 
        :value="value">
    </pega-displaytext>
    <component 
        v-else-if="!hasTooltip"
        :is="fieldType" 
        :field="field" 
        :value="value"
        :handleChange="handleChange">
    </component>
  </el-form-item>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import PegaAutoComplete from './controls/pega-autocomplete'
import PegaButton from './controls/pega-button'
import PegaCheckbox from './controls/pega-checkbox'
import PegaCurrency from './controls/pega-currency'
import PegaDateTime from './controls/pega-datetime'
import PegaDisplaytext from './controls/pega-displaytext'
import PegaDropdown from './controls/pega-dropdown'
import PegaEmail from './controls/pega-email'
import PegaHidden from './controls/pega-hidden'
import PegaIcon from './controls/pega-icon'
import PegaInteger from './controls/pega-integer'
import PegaLink from './controls/pega-link'
import PegaNumber from './controls/pega-number'
import PegaPhone from './controls/pega-phone'
import PegaRadioButtons from './controls/pega-radiobuttons'
import PegaTextArea from './controls/pega-textarea'
import PegaTextInput from './controls/pega-textinput'
import PegaUrl from './controls/pega-url'
import PegaSubscript from './controls/pega-subscript'
import PegaUnsupported from './controls/pega-unsupported'

import { ReferenceHelper, getPropertyValue } from '../../../utils'

export default {
  // TODO: add support Prettier library on commit
  name: 'pega-field',
  props: ['field', 'id'],
  computed: { 
    ...mapGetters({
      assignments: 'assignments',
    }),
    fieldType() {
      if (!this.field.control) {
        debugger
      }
      switch (this.field.control.type) {
        case 'pxAutoComplete': { return 'PegaAutoComplete' }
        case 'pxButton': { return 'PegaButton' }
        case 'pxCheckbox': { return 'PegaCheckbox' }
        case 'pxCurrency': { return 'PegaCurrency' }
        case 'pxDateTime': { return 'PegaDateTime' }
        case 'pxDisplayText': { return 'PegaDisplaytext' }
        case 'pxDropdown': { return 'PegaDropdown' }
        case 'pxEmail': { return 'PegaEmail' }
        case 'pxHidden': { return 'PegaHidden' }
        case 'pxIcon': { return 'PegaIcon' }
        case 'pxInteger': { return 'PegaInteger' }
        case 'pxLink': { return 'PegaLink' }
        case 'pxNumber': {return 'PegaNumber'}
        case 'pxPhone': { return 'PegaPhone'}
        case 'pxRadioButtons': { return 'PegaRadioButtons' }
        case 'pxTextArea': { return 'PegaTextArea' }
        case 'pxTextInput': { return 'PegaTextInput' }
        case 'pxURL': { return 'PegaUrl' }
        case '': { return 'PegaSubscript' }
        default: { return 'PegaUnsupported' }
      }
    },
    reference() {
      return this.field.reference
    },
    label() {
      const { label, showLabel, labelReserveSpace, readOnly } = this.field
      
      // if showLabel is not defined the label should be shown
      // TODO: Is the !readOnly check correc? (VRS)
     if (showLabel !== undefined && (!showLabel && !readOnly)) {
        return null
      }

      if (!label && labelReserveSpace) {
        return ' ';
      }

      // Even for PegaCheckbox should display label

      return label
    },
    value() {
      const values = this.$store.getters.assignments.values[this.id]

      if (values && values.hasOwnProperty(this.reference)) {
        return values[this.reference]
      }

      // this is to handle values that are not initialized, like when getting
      // the case view 'pyCaseDetails'. These are not meant to be display only.
      return this.field.value
    },
    validationMessage() {
      const { messages } = this.$store.getters.assignments
      const { reference } = this

      if (messages[this.id] && messages[this.id][reference]) {
        return messages[this.id][reference]
      }

      return null
    },
    hasValidationMessage() {
      return this.validationMessage ? true : false
    },
    actionHandler() {
      let actionHandler = () => {
        // e.preventDefault()
      }

      const actionData = this.getActionData(this.field, this.supportedActions)
      let hasRefresh = false

      for (let i = 0; i < actionData.length; i++) {
        // postValue and refresh both effectively trigger the same thing, so do not fire it twice
        if (actionData[i].action === "refresh" || actionData[i].action === "postValue") {
          if (!hasRefresh) {
            actionHandler = this.appendActionHandler(actionHandler, this[actionData[i].action], actionData[i].actionProcess)
            hasRefresh = true
          }
        } else {
          actionHandler = this.appendActionHandler(actionHandler, this[actionData[i].action], actionData[i].actionProcess)
        }
      }
        
      return actionHandler
    },
    mode() {
      var modeOffset = 0;
      switch (this.field.control.type) {
        case 'pxButton':
        case 'pxLink':
        case 'pxIcon':
          modeOffset = 1
          break
        default:
          modeOffset = 0
          break
      }
      return this.field.control.modes[modeOffset]
    },
    hasTooltip() {
      const fldMode = this.mode;
      return fldMode && fldMode.tooltip;
    },
    tooltip() {
      const fldMode = this.mode;
      return fldMode && fldMode.tooltip ? getPropertyValue(fldMode.tooltip) : "";
    }
  },
  methods: { 
    handleChange(value) {
      this.$store.dispatch('updateFormValue', { id: this.id, reference: this.reference, value })
        .then(() => { this.actionHandler() })
    },
    refresh() {
      const { id, assignments } = this
      const assignmentID = assignments.details[id].ID
      const actionID = assignments.actions[id].actionID
      let content = ReferenceHelper.getPostContent(assignments.values[id])
      
      this.$store.dispatch('performRefreshOnAssignment', { assignmentID, actionID, content })
    },
    postValue() {
      this.refresh()
    },
    runScript(actionProcess) {
      let evalString = actionProcess.functionName + "(";

      if (actionProcess.functionParameters) {
        let paramString = actionProcess.functionParameters
          .map(param => {
            // let val = this.state.values[this.expandRelativePath(param.value)];
            let val = getPropertyValue(param.value, this.assignments.values[this.id]);
            if (val === undefined || val === null) {
              val = "null";
            } else if (typeof val === "string") {
              val = `"${val}"`;
            }

            return val;
          }, this)
          .join(", ");

        evalString += paramString;
      }

      evalString += ");";
      eval(evalString);
    },
    takeAction(actionProcess) {
      this.$store.dispatch('getActionForAssignment', { assignment: this.assignments.details[this.id], actionID: actionProcess.actionName })
    },
    setValue(actionProcess) {
      let values = this.assignments.values[this.id]

      actionProcess.setValuePairs.forEach(pair => {
        this.$store.dispatch('updateFormValue', { id: this.id, reference: ReferenceHelper.expandRelativePath(pair.name), value: getPropertyValue(pair.value, values) })
      })
    },
    openUrlInWindow(actionProcess) {
			let url = getPropertyValue(actionProcess.urlBase, this.assignments.values[this.id]);

			if (url.indexOf("http") !== 0) {
				url = "http://" + url;
			}

			window.open(url, actionProcess.windowName, actionProcess.windowOptions);
    },
    /**
    * Generic way to check over actionSets.
    * Returns all actions/events that match one of the targetActions.
    * Returns empty array if none found.
    * @param { Object } field - field object from the API
    * @param { Array } targetActions - array of strings, actions to target
    * @return { Array } array of target actions if found, otherwise empty array.
    */
    getActionData(field, targetActions) {
      let result = [];

      if (field.control && field.control.actionSets) {
        let actionSets = field.control.actionSets;

        for (let i = 0; i < actionSets.length; i++) {
          // If we see one of the target actions, return that action
          let actions = actionSets[i].actions;
          let events = actionSets[i].events;

          for (let j = 0; j < actions.length; j++) {
            if (
              targetActions.some(
                targetAction => targetAction === actions[j].action
              )
            ) {
              result.push({ ...actions[j], events: events });
            }
          }
        }
      }

      return result;
    },
    /**
    * Function to compose multiple function calls together.
    * Used to support multiple actions on a single element (e.g. setValue + refresh)
    * Must use call() to ensure correct context at time of calling.
    * @param { func } curFunc - current composed function, to be added to
    * @param { func } newFunc - function to be appended onto curFunc
    * @param { Object } actionProcess - actionProcess data, returned from API for action.
    * @return { func } function of composed param functions
    */
    appendActionHandler(curFunc, newFunc, actionProcess = null) {
      return () => {
        curFunc.call(this)
        newFunc.call(this, actionProcess);
      };
    }
  },
  components: {
    PegaAutoComplete,
    PegaButton,
    PegaCheckbox,
    PegaCurrency,
    PegaDateTime,
    PegaDisplaytext,
    PegaDropdown,
    PegaEmail,
    PegaHidden,
    PegaIcon,
    PegaInteger,
    PegaLink,
    PegaNumber,
    PegaPhone,
    PegaRadioButtons,
    PegaTextArea,
    PegaTextInput,
    PegaUrl,
    PegaSubscript,
    PegaUnsupported
  },
  created () { 
  },
  data() {
    return { 
      supportedActions: [
        'setValue',
        'postValue',
        'refresh',
        'takeAction',
        'runScript',
        'openUrlInWindow'
      ]
    }
  },
}
</script>

<style>
  .pega-form-item > label {
    line-height: 10px;
  }
</style>
