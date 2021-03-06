import React, { Component } from 'react';
import { 
    View, 
    Animated,
    PanResponder,
    Dimensions,
    LayoutAnimation,
    UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends React.Component {
    //when deck comp created, will look at props provided
    //and if not provided whats defined here,
    //will auto assign to default
    static defaultProps = {
        //if not passed in, will assign
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    }
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


        this.state = { panResponder, position, index: 0 };
    }

    componentWillReceiveProps(nextProps) {
        //looks at data array on incoming data, and existing set of data
        //not objects, exact same array
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 });
        }
    }

    componentWillUpdate() {
        //if exists, call with value of true
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        //tells React needs to animate changes to component
        LayoutAnimation.spring();
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start((() => this.onSwipeComplete(direction)));
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index]

        //detects when user has swiped a card
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
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
        //If no more cards
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }
        //map function called with index
        return this.props.data.map((item, i) => {
            if (i < this.state.index) {
                return  null;
            }
            if (i === this.state.index) {
                return (
                    <Animated.View 
                        //Passed object, take from there
                        key={item.id}
                        style={[this.getCardStyle(), styles.cardStyle]}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return (
                //Rendering other cards
                <Animated.View 
                    key={item.id}
                    //set card cascade effect
                    style= {[styles.cardStyle, {top: 10 * ( i - this.state.index)}]}
                >
                    {this.props.renderCard(item)}
                </Animated.View>
            );
        }).reverse();
    }
    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
};

export default Deck;