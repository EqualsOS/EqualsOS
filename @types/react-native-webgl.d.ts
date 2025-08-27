declare module 'react-native-webgl' {
    import React from 'react';
    import { ViewProps } from 'react-native';

    export interface WebGLViewProps extends ViewProps {
        onContextCreate: (gl: WebGLRenderingContext) => void;
    }

    export class WebGLView extends React.Component<WebGLViewProps> {}
}
