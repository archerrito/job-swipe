import React, { Component } from 'react';
import { 
    View, 
    Animated,
    PanResponder 
} from 'react-native';

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
            onPanResponderRelease: () => {}

        });


        this.state = { panResponder, position };
    }
    renderCards() {
        return this.props.data.map(item => {
            return this.props.renderCard(item)
        });
    }
    render() {
        return (
            <Animated.View 
            //Passed object, take from there
            style={this.state.position.getLayout()}
            {...this.state.panResponder.panHandlers}
            >
                {this.renderCards()}
            </Animated.View>
        );
    }
}

export default Deck;