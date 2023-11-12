import React from 'react';
import './Buttons.scss';
import { join } from './js/script';
export default function () {
  return (
    <div className="main-content">
      <div className="item button-jittery" style={{backgroundColor:"red"}}>
        <button>Click Me!</button>
        <div className="name">Subtlety</div>
      </div>
      <div className="item button-pulse" style={{backgroundColor:"red"}}>
        <div className="button__wrapper">
          <div className="pulsing" />
          <button>Click Me!</button>
        </div>
        <div className="name">Dubstep</div>
      </div>
      <div className="item button-typewriter" style={{backgroundColor:"red"}}>
        <div className="button__wrapper">
          <button>
            <p>Click Me!</p>
          </button>
        </div>
        <div className="name">Typewriter</div>
      </div>
      <div className="item button-pressure" style={{backgroundColor:"red"}}>
        <button>
          Click Me!
          <marquee scrollamount="12">
            <span>Your friends would do it.</span>
            <span>Your mum would be proud.</span>
            <span>Your partner would be so happy.</span>
            <span>Your cat would love you for it.</span>
          </marquee>
        </button>
        <div className="name">Social Pressure</div>
      </div>
      <div className="item button-hand" style={{backgroundColor:"red"}}>
        <button>
          Click Me!
          <div className="hands" />
        </button>
        <div className="name">Handsy</div>
      </div>
      <div className="item button-100" style={{backgroundColor:"red"}}>
        <button>
          Click Me!
          <div className="emoji" />
          <div className="emoji" />
          <div className="emoji" />
        </button>
        <div className="name">You're 💯</div>
      </div>
      <div className="item button-parrot" style={{backgroundColor:"red"}}>
        <button>
          Click Me!
          <div className="parrot" />
          <div className="parrot" />
          <div className="parrot" />
          <div className="parrot" />
          <div className="parrot" />
          <div className="parrot" />
        </button>
        <div className="name" style={{backgroundColor:"red"}}>Encouragement</div>
      </div>
      <div className="item button-rainbow">
        <button>
          Click Me!
          <div className="rainbow" />
        </button>
        <div className="name" style={{backgroundColor:"red"}}>Rainbow</div>
      </div>
      <div className="item footer">
        <div className="explanation">
          Part of the
          <a href="https://codepen.io/collection/XJNKLz/" target="_blank">
            CSS Animations collection here
          </a>
          .
          <footer>
            <a href="https://twitter.com/meowlivia_" target="_blank">
              <i className="icon-social-twitter icons" />
            </a>
            <a href="https://github.com/oliviale" target="_blank">
              <i className="icon-social-github icons" />
            </a>
            <a href="https://dribbble.com/oliviale" target="_blank">
              <i className="icon-social-dribbble icons" />
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}

function Encouragement({text, onClick}) {
  return (
    <div className="item button-parrot button-hand button-rainbow signup">
        <button onClick={onClick}>
          {text}
          <div className="parrot" />
          <div className="parrot" />
          <div className="parrot" />
          <div className="parrot" />
          <div className="parrot" />
          <div className="parrot" />
          <div className="hands" />
          <div className="rainbow" />
          
        </button>
      </div>
  )
}

export {Encouragement};