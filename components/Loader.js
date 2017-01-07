'use babel'

import React from 'react'
import styled, { keyframes } from 'styled-components'

// keyframes animations
const cubeGridScaleDelay = keyframes`
  0%, 70%, 100% {
    transform: scale3D(1, 1, 1);
  } 35% {
    transform: scale3D(0, 0, 1);
  }
`

// Loader with animations
const CubeLoader = styled.div`
  .sk-cube-grid {
    width: ${props => props.size || 90}px;
    height: ${props => props.size || 90}px;
  }

  .sk-cube-grid .sk-cube {
    width: 33%;
    height: 33%;
    background-color: white;
    float: left;
    animation: ${cubeGridScaleDelay} 1.3s infinite ease-in-out;
  }

  .sk-cube-grid .sk-cube1 { animation-delay: 0.2s; }
  .sk-cube-grid .sk-cube2 { animation-delay: 0.3s; }
  .sk-cube-grid .sk-cube3 { animation-delay: 0.4s; }
  .sk-cube-grid .sk-cube4 { animation-delay: 0.1s; }
  .sk-cube-grid .sk-cube5 { animation-delay: 0.2s; }
  .sk-cube-grid .sk-cube6 { animation-delay: 0.3s; }
  .sk-cube-grid .sk-cube7 { animation-delay: 0s; }
  .sk-cube-grid .sk-cube8 { animation-delay: 0.1s; }
  .sk-cube-grid .sk-cube9 { animation-delay: 0.2s; }
`

export default function Loader(props) {
  return (
    <CubeLoader {...props}>
      <div className="sk-cube-grid">
        <div className="sk-cube sk-cube1" />
        <div className="sk-cube sk-cube2" />
        <div className="sk-cube sk-cube3" />
        <div className="sk-cube sk-cube4" />
        <div className="sk-cube sk-cube5" />
        <div className="sk-cube sk-cube6" />
        <div className="sk-cube sk-cube7" />
        <div className="sk-cube sk-cube8" />
        <div className="sk-cube sk-cube9" />
      </div>
    </CubeLoader>
  )
}
