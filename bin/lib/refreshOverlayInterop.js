// https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/refreshOverlayInterop.js

const { dismissRuntimeErrors, reportRuntimeError } = require('react-error-overlay')

module.exports = {
  clearRuntimeErrors: dismissRuntimeErrors,
  handleRuntimeError: reportRuntimeError,
}
