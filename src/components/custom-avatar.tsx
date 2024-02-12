import { Avatar as AntdAvatar, AvatarProps} from "antd"
import { getNameInitials } from "../utilities/get-name-initials"

type Props = AvatarProps & {
    name?: string
}

const CustomAvatar = ({ name, style, ...rest }: Props) => {
  return (
    <AntdAvatar
      alt={name}
      size="small" 
      style={{ 
        backgroundColor: '#87d068',
        alignItems: 'center',
        border: 'none',
        ...style
       }}
       {...rest}
    >
        {getNameInitials(name || "")}
    </AntdAvatar>
  )
}

export default CustomAvatar