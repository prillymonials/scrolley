import React, { Component, TouchEvent } from 'react';
import { getWidthAndHeight } from './utils';
import './Slider.css';

interface ISliderState {
  index: number;
}

class Slider extends Component<{}, ISliderState> {
  state = {
    index: 0,
  };

  screenWidth: number;
  cardWidth: number;
  cardMargin: number = 5;
  sliderRef?: HTMLDivElement;
  longTouch: boolean = false;
  startPosition: number = 0;
  movePosition: number = 0;
  movement: number = 0;

  constructor(props: {}) {
    super(props);

    let screenWidth = getWidthAndHeight().width;
    if (screenWidth > 768) {
      screenWidth = 768;
    }

    this.screenWidth = screenWidth;
    this.cardWidth = screenWidth * 0.9;
  }

  setSliderRef = (el: HTMLDivElement) => {
    this.sliderRef = el;
  }

  render() {
    return (
      <div
        className="Slider"
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        ref={this.setSliderRef}
      >
        <div className="Card-container">1</div>
        <div className="Card-container">2</div>
        <div className="Card-container">3</div>
        <div className="Card-container">4</div>
        <div className="Card-container">5</div>
      </div>
    )
  }

  handleTouchStart = (evt: TouchEvent<HTMLDivElement>) => {
    WebViewJavascriptBridge.callHandler('configurePage', { config: { disableReload: 1 } });

    // Test for flicking.
    this.longTouch = false;

    setTimeout(() => this.longTouch = true, 300);

    // Original touch position
    this.startPosition = evt.touches[0].clientX;
  }

  handleTouchMove = (evt: TouchEvent<HTMLDivElement>) => {
    // Continuously return touch position on moving.
    this.movePosition = evt.touches[0].clientX;
    // Calculate distance to translate holder.
    // const movement = this.state.index * this.cardWidth + (this.startPosition - this.movePosition);
    
    // this.sliderRef!.scroll({
    //   left: movement
    // });
  }

  handleTouchEnd = (_evt: TouchEvent<HTMLDivElement>) => {
    const { index } = this.state;

    const movement = this.startPosition - this.movePosition;
    const rangeMovement = this.screenWidth / 8;
    console.log('movement', movement, 'range', rangeMovement);

    const diffScroller = this.screenWidth / 2 - this.cardWidth / 2 - this.cardMargin;

    if (Math.abs(movement) > rangeMovement || !this.longTouch) {
      if (movement > 0 && index < 5) {
        const scroller = (this.cardWidth * (index + 1)) + (this.cardMargin * index) - diffScroller;
        this.sliderRef!.scroll({ left: scroller, behavior: 'smooth' });
        this.setState({ index: index + 1 });
      } else if (movement < 0 && index > 0) {
        const scroller = (this.cardWidth * (index - 1)) + (this.cardMargin * (index - 2)) - diffScroller;
        this.sliderRef!.scroll({ left: scroller, behavior: 'smooth' });
        this.setState({ index: index - 1 });
      } else {
        console.log('MY SCROLLER (IF ELSE): ', index);
        const scroller = (this.cardWidth * index) + (this.cardMargin * (index - 1)) - diffScroller;
        this.sliderRef!.scroll({ left: scroller, behavior: 'smooth' });
      }
      this.longTouch = false;
    } else {
      const scroller = (this.cardWidth * index) + (this.cardMargin * (index - 1)) - diffScroller;
      console.log('MY SCROLLER (ELSE):', index, scroller);
      this.sliderRef!.scroll({ left: scroller < 0 ? 0 : scroller, behavior: 'smooth' });
    }

    WebViewJavascriptBridge.callHandler('configurePage', { config: { disableReload: 0 } });
  }
}

export default Slider;
