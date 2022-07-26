import styled from "styled-components";

interface IFullContainerView{
    width?: string,
    height?: string,
    zIndex?: string,
}

export const FullContainerView = styled('div')<IFullContainerView>`
    width: ${p => p.width || '600px'};
    height: ${p => p.height || '400px' };
    position: relative;
`

export const FloatingContainerView = styled('div')<IFullContainerView>`
    width: ${p => p.width || '600px'};
    height: ${p => p.height || '400px' };
    z-index: ${p => p.zIndex || '1'};
    left: 0;
    right: 0;
    position: absolute;
    margin: auto;
`

export const EmptySeparator = styled('div')`

    margin-top: 10px

`