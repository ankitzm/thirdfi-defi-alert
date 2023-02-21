import {
  useState, useEffect
} from "react"
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

import { CountButton } from "./features/count-button"

import "~base.css"
import "~style.css"

function IndexPopup() {
  return (
    <div className="flex flex-row items-center justify-center h-16 w-40">
      <CountButton />
    </div>
  )
}

export default IndexPopup