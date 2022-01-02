import PropTypes from 'prop-types';

import ISMControl from './ISMControl.js';

/**
 *ISM
 *
 * @param {string} props.version - Optional: YYYYMM props.version of the ISM.
 * @return {*} Object containing ISMControl (react components) breakdown
 *  of the ISM. If props.version is NOT provided, returns the latest known.
 */
const ISM = (props) => {
  const handleTagControl = identifier => {
    const newTaggedControls = props.interrogate.controlsTagged.includes(identifier)
      ? props.interrogate.controlsTagged.filter(control => control !== identifier)
      : [...props.interrogate.controlsTagged, identifier]

    props.setInterrogate({ ...props.interrogate, controlsTagged: newTaggedControls })
  }

  return (
    <div className="ISM component container">
      {typeof props.version === 'string' && (props.version === '' || props.interrogate.versionsValid.includes(props.version))
        ? (
          <div className="list-group">
            {
              typeof props.interrogate.controlList !== 'undefined'
                ? props.interrogate.controlList.map((control) => <ISMControl control={control} key={control.Identifier} tag={() => { handleTagControl(control.Identifier) }} tagged={props.interrogate.controlsTagged.includes(control.Identifier)} />)
                : false
            }
          </div>
        )
        : false
      }
    </div>
  )
}
export default ISM;

ISM.propTypes = {
  interrogate: PropTypes.shape({

    controlList: PropTypes.arrayOf(
      PropTypes.shape({
        Description: PropTypes.string.isRequired,
        Guideline: PropTypes.string.isRequired,
        Identifier: PropTypes.string.isRequired,
        OFFICIAL: PropTypes.oneOfType([
          PropTypes.bool,
          PropTypes.string
        ]),
        PROTECTED: PropTypes.oneOfType([
          PropTypes.bool,
          PropTypes.string
        ]),
        Revision: PropTypes.string.isRequired,
        SECRET: PropTypes.oneOfType([
          PropTypes.bool,
          PropTypes.string
        ]),
        TOP_SECRET: PropTypes.oneOfType([
          PropTypes.bool,
          PropTypes.string
        ]),
        Topic: PropTypes.string.isRequired,
        Updated: PropTypes.string.isRequired
      })),
      controlsTagged: PropTypes.array.isRequired
  }).isRequired
}