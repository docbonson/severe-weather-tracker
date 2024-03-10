import React from 'react'
import { Icon } from '@iconify/react'
import tornadoIcon from '@iconify/icons-emojione/tornado'

const Header = () => {
  return (
    <div className="header-bar">
      <Icon icon={tornadoIcon} /> Severe Weather Events
    </div>
  )
}

export default Header
