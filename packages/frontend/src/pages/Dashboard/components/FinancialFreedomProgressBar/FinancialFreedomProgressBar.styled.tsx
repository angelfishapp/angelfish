import styled from '@emotion/styled'

export const Tooltip = styled.div<{
  $background: string
  $position: 'top' | 'bottom'
  $left: number
  $translateX?: number
}>`
  color: white;
  background: ${({ $background }) => $background};
  text-align: center;
  border-radius: 0.5rem;
  margin-${({ $position }) => $position}: 0.5rem;
  padding: 0.75rem 0.5rem;
  display: inline-block;
  transform: translateX(${({ $translateX = -50 }) => $translateX}%);
  position: absolute;
  ${({ $position }) => $position}: 100%;
  left: ${({ $left }) => $left}%;
  box-shadow: 3px 7px 11px 0px #00000054;
  transition: width 2s ease-in-out, left 2s ease-in-out;
  white-space: nowrap;
`

export const TooltipBar = styled.div<{ $size?: number; $position?: 'top' | 'bottom' }>`
  background: inherit;
  padding: 2rem ${({ $size = 0.15 }) => $size}rem;
  display: inline-block;
  transform: translateX(-50%);
  position: absolute;
  ${({ $position = 'bottom' }) => $position}: 100%;
`

export const ProgressBar = styled.div<{ $width?: number }>`
  border-radius: 0.7rem;
  transition:
    width 2s ease-in-out,
    left 2s ease-in-out;
  background: linear-gradient(90deg, #20a4d4 0.2%, #44ccb2 77.79%);
  width: ${({ $width }) => $width}%;
  height: 100%;
`

export const ProgressBarWrapper = styled.div<{ $width?: number }>`
  background-color: #fff;
  height: 3.5rem;
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  padding: 4px;
`

export const ProgressBarIcon = styled.div`
  position: absolute;
  right: 0;
  margin-right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
`
