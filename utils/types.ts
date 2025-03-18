
declare module 'react-native-vector-icons/Feather' {
  import { FC } from 'react';
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: FC<IconProps>;
  export default Icon;
}
