import React, { useState, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useActiveProtocol, useActiveTokenIndex } from '../../state/governance/hooks'
import { RowBetween, RowFixed } from '../Row'
import { TYPE } from '../../theme'
import { ChevronDown, ChevronUp } from 'react-feather'
import useOnClickOutside from '../../hooks/useClickOutside'

const Wrapper = styled.div<{ backgroundColor?: string; open: boolean }>`
  z-index: 3;
  :hover {
    cursor: pointer;
  }
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  margin: 0 12px;
  color: #000;
  background-color: white;
  background: #ffffff;
  border-radius: 12px;
  flex-grow: 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-grow: 0;
  `};
`

const Flyout = styled.div<{ options: number }>`
  background-color: white;
  border-radius: 12px;
  bottom: -${({ options }) => options * 32}px;
  box-shadow: 0 10px 34px rgb(236 236 236 / 16%), 0 5px 6px rgb(140 140 140 / 23%);
  overflow: hidden;
  position: absolute;
  z-index: 2;
`

// dont pass style props to DOM link element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Option = styled(({ backgroundColor, ...props }) => <Link {...props} />)`
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'white'};
  display: block;
  padding: 1rem;
  text-decoration: none;
  :hover {
    font-weight: bold;
  }
`

export default function DropdownToken() {
  const [activeProtocol] = useActiveProtocol()
  const [activeTokenIndex, setActiveTokenIndex] = useActiveTokenIndex()

  const [open, setOpen] = useState(false)

  const ref = useRef(null)
  useOnClickOutside(ref, () => setOpen(false))

  const options = useMemo(() => {
    return activeProtocol
      ? activeProtocol.tokens
          // .filter((_, i) => activeProtocol.tokens[i] !== activeProtocol.tokens[activeTokenIndex])
          .map((k, i) => (
            <Option key={i} to={{ hash: '#' }} onClick={() => setActiveTokenIndex(i)}>
              <RowBetween>
                <RowFixed>
                  <TYPE.black>{k.symbol ?? ''}</TYPE.black>
                </RowFixed>
              </RowBetween>
            </Option>
          ))
      : []
  }, [activeProtocol, setActiveTokenIndex])

  return (
    <Wrapper onClick={() => setOpen(!open)} open={open} ref={ref}>
      <RowBetween>
        <RowFixed>
          <TYPE.black>{activeProtocol?.tokens[activeTokenIndex].symbol}</TYPE.black>
        </RowFixed>
        {open ? (
          <ChevronUp stroke={activeProtocol?.primaryColor} />
        ) : (
          <ChevronDown stroke={activeProtocol?.primaryColor} />
        )}
      </RowBetween>
      {open && activeProtocol && <Flyout options={options.length}>{options}</Flyout>}
    </Wrapper>
  )
}
