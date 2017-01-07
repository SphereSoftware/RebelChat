'use babel';

/* eslint-disable */
import { default as React, PropTypes } from 'react'

/*
 *  As result of useing IconBase you will have something like this
 *  IconBase provides you a nice way to controll all your icons in future,
 *  you can set up defaults in your app and override it with inline props like so
 *  <Icon size={30} color='aliceblue' style={{ ... }} />
 *

  export default class HelpIcon extends React.Component {
    render() {
      return (
        <IconBase viewBox="0 0 30 30" {...this.props}>
          <title>GitHub icon</title>
          <path d="M14.9998758,1 C6.71675899,1 1.77635684e-15,7.65582629 1.77635684e-15,15.8670996 C1.77635684e-15,22.4360198 4.29792096,28.0085971 10.2578305,29.974694 C11.0072282,30.112562 11.2824462,29.6521812 11.2824462,29.2595035 C11.2824462,28.9049856 11.2685362,27.7338458 11.262078,26.4915562 C7.08909809,27.390899 6.20854964,24.7374315 6.20854964,24.7374315 C5.52621774,23.0190047 4.54308353,22.5620706 4.54308353,22.5620706 C3.18189722,21.6393394 4.64566929,21.6585425 4.64566929,21.6585425 C6.15166795,21.7631745 6.94503092,23.1906012 6.94503092,23.1906012 C8.28286843,25.4629621 10.45406,24.8061193 11.3100176,24.4264898 C11.4446459,23.4655987 11.8333789,22.8094945 12.2623513,22.4382355 C8.93067389,22.0627913 5.42810303,20.787758 5.42810303,15.0910994 C5.42810303,13.4679494 6.01430736,12.141708 6.97384436,11.1003118 C6.81785439,10.7260985 6.30442882,9.21398145 7.11890509,7.16614852 C7.11890509,7.16614852 8.37825083,6.76657737 11.2446906,8.69008286 C12.4414417,8.3604305 13.7248814,8.19474265 14.9998758,8.18908021 C16.274125,8.19474265 17.5583099,8.35993812 18.7572965,8.68959047 C21.6202588,6.76608498 22.8781142,7.16565614 22.8781142,7.16565614 C23.6945776,9.21324287 23.181152,10.7256061 23.0254105,11.0998194 C23.987183,12.1412156 24.5691647,13.467457 24.5691647,15.0906071 C24.5691647,20.8008062 21.0601356,22.0578674 17.7200129,22.4261721 C18.2582777,22.8875377 18.7376736,23.7925429 18.7376736,25.1793478 C18.7376736,27.1685868 18.7202861,28.7695795 18.7202861,29.2592573 C18.7202861,29.6548894 18.9905363,30.1184707 19.7506148,29.9724783 C25.7070469,28.0044118 30,22.4335579 30,15.8670996 C29.9997516,7.65631868 23.2837378,1.00024619 14.9998758,1.00024619 L14.9998758,1 Z" id="GitHub"></path>
        </IconBase>
      )
    }
  }

*/

const IconBase = ({ children, color, size, style, ...props }, { reactIconBase = {} }) => {
  const computedSize = size || reactIconBase.size || '30px'
  return (
    <svg
      children={children}
      fill='currentColor'
      preserveAspectRatio='xMidYMid meet'
      height={computedSize}
      width={computedSize}
      {...reactIconBase}
      {...props}
      style={{
        verticalAlign: 'middle',
        color: color || reactIconBase.color,
        ...(reactIconBase.style || {}),
        ...style
      }}
    />
  )
}

IconBase.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  style: PropTypes.object
}

IconBase.contextTypes = {
  reactIconBase: PropTypes.shape(IconBase.propTypes)
}

export default IconBase
