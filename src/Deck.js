import React, { Component } from 'react';
import { 
    View, 
    Animated,
    PanResponder,
    Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends React.Component {
    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            //anytime user taps on screen
            //if return true, want this instance responsible
            onStartShouldSetPanResponder: () => true,
            //callback, anytime use drags on screen
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            //called, when presses, drags, removes finger
            //finalized callback
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        });


        this.state = { panResponder, position };
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start();
    }

    forceSwipeLeft() {
        Animated.timing(this.state.position, {
            toValue: { x: SCREEN_WIDTH, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start();
    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    getCardStyle() {
        const { position } = this.state;
        //contains info about XY from Animated.ValueXY
        const rotate = position.x.interpolate({
            //relates first scale to second scale
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        })
        return {
            //getLayotu resturns object, spread properties
            //on return object, add on additional custom property
            ...position.getLayout(),
            transform: [{ rotate: rotate }]
        }
    }

    renderCards() {
        //map function called with index
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View 
                        //Passed object, take from there
                        key={item.id}
                        style={this.getCardStyle()}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return this.props.renderCard(item)
        });
    }
    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;