import React from 'react';
import styled from 'styled-components';

const FoldableImage = ({ width, height, alt, percentage, src }) => {
  const backgroundImage = `url(${src})`;

  return (
    <Wrapper
      style={{
        transform: `translateY(${percentage / 4}%)`,
      }}
    >
      <TopHalf width={width} height={height}>
        <img
          src={src}
          alt={alt}
          style={{
            width,
            height,
          }}
        />
      </TopHalf>
      <BottomHalf
        width={width}
        height={height}
        style={{
          backgroundImage,
          backgroundPosition: '0 100%', // important
          transform: `rotateX(${convertPercentageToRotation(percentage)}deg)`, // important
        }}
      >
        <Shadow
          style={{
            opacity: percentage * 0.015,
          }}
        />
        <Backside />
      </BottomHalf>

      {/*
        Because the entire card is translating down during the fold, I'm
        seeing a flicker in the crook of the fold. Repeating our trick a third
        time, I can apply the image to a 2px-tall element positioned in the
        crook of the fold.

        If you aren't translating the card during folding, you shouldn't need
        this fix.
      */}
      <FlickerFixer
        height={height}
        style={{
          opacity: percentage > 50 ? 0 : 1,
          backgroundImage,
        }}
      />
    </Wrapper>
  );
};

const convertPercentageToRotation = percentage => percentage * 1.8;

const Wrapper = styled.div`
  display: inline-block;
  perspective: 1250px;
`;

const Half = styled.div`
  position: relative;
  z-index: 2;
  width: ${props => props.width}px;
  height: ${props => props.height / 2}px;
  background-size: cover;
`;

const TopHalf = styled(Half)`
  border-radius: 10px 10px 0 0;
  overflow: hidden;
`;

const BottomHalf = styled(Half)`
  transform-origin: top center;
  transform-style: preserve-3d;
  border-radius: 0 0 10px 10px;
`;

const Backside = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: rgba(255, 255, 255, 0.9);
  transform: rotateX(180deg) translateZ(2px);
  backface-visibility: hidden;
  border-radius: 10px 10px 0 0;
`;

const Shadow = styled.div`
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  backface-visibility: hidden;
  border-radius: 0 0 10px 10px;
  transform: translateZ(0.01px);
`;

const FlickerFixer = styled.div`
  position: absolute;
  z-index: 1;
  top: ${props => props.height * 0.5}px;
  left: 0;
  width: 100%;
  height: 2px;
  background-position: 0% 50%;
`;

export default FoldableImage;

export const Foldable = ({ width = 200, height =  300, src = 'https://www.joshwcomeau.com/images/folding-the-dom/francois-hoang-china-small.jpg' }) => {
  const [
    foldAngle,
    setFoldAngle,
  ] = React.useState(0);
  // Both our top half and bottom half share
  // a few common styles
  const sharedStyles = {
    width,
    height: height / 2,
  };
  return (
    <div style={{ perspective: 500 }}>
      {/* Top half */}
      <div
        style={{
          ...sharedStyles,
          overflow: 'hidden',
        }}
      >
        <img
          src={src}
          alt="a neon Chinese alley"
          style={{
            width,
            height,
          }}
        />
      </div>
      {/* Bottom half */}
      <div
        style={{
          ...sharedStyles,
          backgroundSize: `${width}px ${height}px`,
          backgroundImage: `url(${src})`,
          backgroundPosition: `0px -100%`,
          transform: `rotateX(${foldAngle}deg)`,
          transformOrigin: 'center top',
          willChange: 'transform',
          // This property is new ⤸
          transformStyle: 'preserve-3d',
        }}
      >
        {/* This child is new ⤸ */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background:
              'hsla(0, 100%, 100%, 0.9)',
            backfaceVisibility: 'hidden',
            transform:
              'rotateX(180deg) translateZ(.5px)',
          }}
        />
      </div>
      {/* Slider control */}
      <br />
      <label htmlFor="slider">Fold ratio:</label>
      <input
        id="slider"
        type="range"
        min={0}
        max={180}
        value={foldAngle}
        onChange={ev =>
          setFoldAngle(ev.target.value)
        }
        style={{ width }}
      />
    </div>
  );
};



// render(
//   <Foldable
//     width={200}
//     height={300}
//     src={src}
//   />
// );