export type IconType = "edit" | "delete";

export type CustomIconProps =
  | {
      width?: number;
      height?: number;
      color?: string;
      stroke?: string;
      strokeWidth?: string;
    }
  | undefined;

export type IconProps = {
  name: IconType;
};

export type IconParams = IconProps & CustomIconProps;
