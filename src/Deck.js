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
        //map function called with index
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View 
                        //Passed object, take from there
                        key={item.id}
                        style={this.state.position.getLayout()}
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