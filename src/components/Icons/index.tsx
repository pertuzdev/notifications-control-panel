import EditIcon from "./EditIcon";
import ExitIcon from "./ExitIcon";
import SendIcon from "./SendIcon";
import TrashIcon from "./TrashIcon";
import { CustomIconProps, IconParams, IconType } from "./types";

const Icon = ({ name, width = 24, height = 24, ...iconParams }: IconParams) => {
  return iconSelector(name, { ...iconParams, width, height });
};

const iconSelector = (name: IconType, iconParams: CustomIconProps) => {
  switch (name) {
    case "edit":
      return <EditIcon {...iconParams} />;
    case "delete":
      return <TrashIcon {...iconParams} />;
    case "exit":
      return <ExitIcon {...iconParams} />;
    case "send":
      return <SendIcon {...iconParams} />;
    default:
      return <EditIcon {...iconParams} />;
  }
};

export default Icon;
