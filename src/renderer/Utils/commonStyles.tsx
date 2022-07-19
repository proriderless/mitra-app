import styled from "styled-components";

interface IFullContainerView{
    width?: string,
    height?: string,
}

export const FullContainerView = styled('div')<IFullContainerView>`
    width: ${p => p.width || '600px'};
    height: ${p => p.height || '400px' };
    background-color: rgba(0, 0, 0, 0.05);
    display: inline-block;
    position: relative;
    text-align: center;
`